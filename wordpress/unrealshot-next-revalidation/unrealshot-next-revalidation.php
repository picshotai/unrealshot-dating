<?php
/**
 * Plugin Name: Unrealshot Next.js Revalidation
 * Description: Securely refreshes the Unrealshot Next.js blog when Polylang posts change.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Unrealshot
 * License: GPL-2.0-or-later
 * Text Domain: unrealshot-next-revalidation
 */

defined( 'ABSPATH' ) || exit;

const UNREALSHOT_REVALIDATION_VERSION = '1.0.0';
const UNREALSHOT_REVALIDATION_DEFAULT_ENDPOINT = 'https://www.unrealshot.com/api/revalidate-wordpress';
const UNREALSHOT_REVALIDATION_RETRY_HOOK = 'unrealshot_revalidation_retry';
const UNREALSHOT_REVALIDATION_LAST_DELIVERY_OPTION = 'unrealshot_revalidation_last_delivery';
const UNREALSHOT_REVALIDATION_PATHS_META_KEY = '_unrealshot_revalidation_paths';

/**
 * Return the private shared secret from wp-config.php.
 */
function unrealshot_revalidation_secret() {
	return defined( 'UNREALSHOT_REVALIDATION_SECRET' )
		? trim( (string) UNREALSHOT_REVALIDATION_SECRET )
		: '';
}

/**
 * Return the public Next.js webhook URL.
 */
function unrealshot_revalidation_endpoint() {
	$endpoint = defined( 'UNREALSHOT_REVALIDATION_URL' )
		? (string) UNREALSHOT_REVALIDATION_URL
		: UNREALSHOT_REVALIDATION_DEFAULT_ENDPOINT;

	return esc_url_raw( apply_filters( 'unrealshot_revalidation_endpoint', $endpoint ) );
}

/**
 * Convert a Polylang language slug into the locale used by Next.js.
 */
function unrealshot_revalidation_normalize_locale( $locale ) {
	$normalized = strtolower( str_replace( '_', '-', trim( (string) $locale ) ) );
	$map        = array(
		'en'    => 'en',
		'fr'    => 'fr',
		'es'    => 'es',
		'de'    => 'de',
		'pt'    => 'pt-BR',
		'pt-br' => 'pt-BR',
	);

	return isset( $map[ $normalized ] ) ? $map[ $normalized ] : '';
}

/**
 * Locales whose blogs are published in Next.js. Keep this synchronized with
 * publishedBlogLocales in i18n/config.ts. Defaults to all configured locales.
 */
function unrealshot_revalidation_enabled_locales() {
	$configured = defined( 'UNREALSHOT_BLOG_LOCALES' ) ? UNREALSHOT_BLOG_LOCALES : 'en,fr,es,de,pt-BR';
	$values     = is_array( $configured ) ? $configured : explode( ',', (string) $configured );
	$locales    = array();

	foreach ( $values as $value ) {
		$locale = unrealshot_revalidation_normalize_locale( $value );
		if ( '' !== $locale ) {
			$locales[ $locale ] = true;
		}
	}

	return array_keys( apply_filters( 'unrealshot_revalidation_enabled_locales', $locales ) );
}

/**
 * Read one post's locale and slug without assuming Polylang is active.
 */
function unrealshot_revalidation_post_path( $post_id, $post = null ) {
	$post = $post instanceof WP_Post ? $post : get_post( $post_id );
	if ( ! $post instanceof WP_Post || 'post' !== $post->post_type || '' === $post->post_name ) {
		return null;
	}

	if ( ! function_exists( 'pll_get_post_language' ) ) {
		return null;
	}

	$locale = unrealshot_revalidation_normalize_locale( pll_get_post_language( $post_id, 'slug' ) );
	if ( '' === $locale || ! in_array( $locale, unrealshot_revalidation_enabled_locales(), true ) ) {
		return null;
	}

	return array(
		'locale' => $locale,
		'slug'   => (string) $post->post_name,
	);
}

/**
 * Deduplicate locale/slug pairs and discard anything the Next.js endpoint will reject.
 */
function unrealshot_revalidation_normalize_paths( $paths ) {
	$normalized = array();
	$enabled    = unrealshot_revalidation_enabled_locales();

	foreach ( (array) $paths as $path ) {
		if ( ! is_array( $path ) || empty( $path['locale'] ) || empty( $path['slug'] ) ) {
			continue;
		}

		$locale = unrealshot_revalidation_normalize_locale( $path['locale'] );
		$slug   = (string) $path['slug'];
		if ( ! in_array( $locale, $enabled, true ) || strlen( $slug ) > 200 ) {
			continue;
		}

		// The frontend route accepts WordPress-style ASCII slugs only.
		if ( 1 !== preg_match( '/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug ) ) {
			continue;
		}

		$normalized[ $locale . '|' . $slug ] = array(
			'locale' => $locale,
			'slug'   => $slug,
		);
	}

	return array_values( $normalized );
}

/**
 * Return this post ID and every Polylang translation currently linked to it.
 */
function unrealshot_revalidation_translation_ids( $post_id ) {
	$ids = array( (int) $post_id );

	if ( function_exists( 'pll_get_post_translations' ) ) {
		$translations = pll_get_post_translations( $post_id );
		if ( is_array( $translations ) ) {
			$ids = array_merge( $ids, array_map( 'intval', array_values( $translations ) ) );
		}
	}

	return array_unique( array_filter( $ids ) );
}

/**
 * Return this post and every Polylang translation currently linked to it.
 */
function unrealshot_revalidation_translation_paths( $post_id ) {
	$ids = unrealshot_revalidation_translation_ids( $post_id );

	$paths = array();
	foreach ( $ids as $translation_id ) {
		$path = unrealshot_revalidation_post_path( $translation_id );
		if ( null !== $path ) {
			$paths[] = $path;
		}
	}

	return unrealshot_revalidation_normalize_paths( $paths );
}

/**
 * Persist the last known translation set so removed relationships and old
 * slugs are also invalidated on the next change.
 */
function unrealshot_revalidation_remembered_paths( $post_id ) {
	$paths = get_post_meta( $post_id, UNREALSHOT_REVALIDATION_PATHS_META_KEY, true );
	return unrealshot_revalidation_normalize_paths( is_array( $paths ) ? $paths : array() );
}

function unrealshot_revalidation_store_paths( $post_ids, $paths ) {
	$paths = unrealshot_revalidation_normalize_paths( $paths );
	foreach ( array_unique( array_map( 'intval', (array) $post_ids ) ) as $post_id ) {
		if ( $post_id > 0 && get_post( $post_id ) ) {
			update_post_meta( $post_id, UNREALSHOT_REVALIDATION_PATHS_META_KEY, $paths );
		}
	}
}

/**
 * In-request queue. It is flushed on shutdown, after Polylang has finished
 * saving language and translation relationships.
 */
function &unrealshot_revalidation_jobs() {
	static $jobs = array();
	return $jobs;
}

function unrealshot_revalidation_queue( $event, $post_id, $snapshot_paths = array() ) {
	$allowed_events = array(
		'post.published',
		'post.updated',
		'post.unpublished',
		'post.trashed',
		'post.restored',
	);

	if ( ! in_array( $event, $allowed_events, true ) || $post_id <= 0 ) {
		return;
	}

	$jobs = &unrealshot_revalidation_jobs();
	if ( ! isset( $jobs[ $event ] ) ) {
		$jobs[ $event ] = array(
			'post_ids' => array(),
			'paths'    => array(),
		);
	}

	$jobs[ $event ]['post_ids'][ (int) $post_id ] = true;
	$jobs[ $event ]['paths']                      = array_merge(
		$jobs[ $event ]['paths'],
		unrealshot_revalidation_normalize_paths( $snapshot_paths )
	);
}

/**
 * Map core status changes to the narrow event vocabulary accepted by Next.js.
 */
function unrealshot_revalidation_on_status_change( $new_status, $old_status, $post ) {
	if ( ! $post instanceof WP_Post || 'post' !== $post->post_type ) {
		return;
	}

	if ( wp_is_post_revision( $post->ID ) || wp_is_post_autosave( $post->ID ) ) {
		return;
	}

	$event = '';
	if ( 'publish' === $new_status && 'trash' === $old_status ) {
		$event = 'post.restored';
	} elseif ( 'publish' === $new_status && 'publish' !== $old_status ) {
		$event = 'post.published';
	} elseif ( 'publish' === $new_status && 'publish' === $old_status ) {
		$event = 'post.updated';
	} elseif ( 'publish' === $old_status && 'trash' === $new_status ) {
		$event = 'post.trashed';
	} elseif ( 'publish' === $old_status && 'publish' !== $new_status ) {
		$event = 'post.unpublished';
	}

	if ( '' !== $event ) {
		unrealshot_revalidation_queue( $event, $post->ID );
	}
}
add_action( 'transition_post_status', 'unrealshot_revalidation_on_status_change', 999, 3 );

/**
 * Preserve the previous route when an editor changes a published slug.
 */
function unrealshot_revalidation_on_post_updated( $post_id, $post_after, $post_before ) {
	if (
		! $post_after instanceof WP_Post ||
		! $post_before instanceof WP_Post ||
		'post' !== $post_after->post_type ||
		$post_after->post_name === $post_before->post_name ||
		( 'publish' !== $post_after->post_status && 'publish' !== $post_before->post_status )
	) {
		return;
	}

	$old_path = unrealshot_revalidation_post_path( $post_id, $post_before );
	$event    = 'publish' === $post_after->post_status ? 'post.updated' : 'post.unpublished';
	unrealshot_revalidation_queue( $event, $post_id, null === $old_path ? array() : array( $old_path ) );
}
add_action( 'post_updated', 'unrealshot_revalidation_on_post_updated', 999, 3 );

/**
 * A force-delete has no post left at shutdown, so snapshot its routes first.
 */
function unrealshot_revalidation_before_delete( $post_id, $post ) {
	if ( ! $post instanceof WP_Post || 'post' !== $post->post_type ) {
		return;
	}

	$paths = array_merge(
		unrealshot_revalidation_translation_paths( $post_id ),
		unrealshot_revalidation_remembered_paths( $post_id )
	);
	unrealshot_revalidation_queue( 'post.trashed', $post_id, $paths );
}
add_action( 'before_delete_post', 'unrealshot_revalidation_before_delete', 999, 2 );

/**
 * Send one payload. The exact JSON bytes signed here are the bytes transmitted.
 */
function unrealshot_revalidation_send( $payload ) {
	$secret   = unrealshot_revalidation_secret();
	$endpoint = unrealshot_revalidation_endpoint();

	if ( strlen( $secret ) < 32 ) {
		return new WP_Error( 'unrealshot_missing_secret', 'UNREALSHOT_REVALIDATION_SECRET must contain at least 32 characters.' );
	}

	if ( ! wp_http_validate_url( $endpoint ) || 'https' !== wp_parse_url( $endpoint, PHP_URL_SCHEME ) ) {
		return new WP_Error( 'unrealshot_invalid_endpoint', 'The revalidation endpoint must be a valid HTTPS URL.' );
	}

	$body = wp_json_encode( $payload, JSON_UNESCAPED_SLASHES );
	if ( false === $body ) {
		return new WP_Error( 'unrealshot_json_error', 'The revalidation payload could not be encoded.' );
	}

	$timestamp = (string) time();
	$signature = hash_hmac( 'sha256', $timestamp . '.' . $body, $secret );
	$response  = wp_remote_post(
		$endpoint,
		array(
			'timeout'             => 10,
			'redirection'         => 0,
			'reject_unsafe_urls'  => true,
			'sslverify'           => true,
			'body'                => $body,
			'data_format'         => 'body',
			'headers'             => array(
				'Content-Type'          => 'application/json',
				'User-Agent'            => 'Unrealshot-WordPress-Revalidation/' . UNREALSHOT_REVALIDATION_VERSION,
				'x-wordpress-timestamp' => $timestamp,
				'x-wordpress-signature' => 'sha256=' . $signature,
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		return $response;
	}

	$status = (int) wp_remote_retrieve_response_code( $response );
	if ( $status < 200 || $status >= 300 ) {
		$response_body = substr( wp_strip_all_tags( wp_remote_retrieve_body( $response ) ), 0, 300 );
		return new WP_Error(
			'unrealshot_http_error',
			sprintf( 'Next.js returned HTTP %1$d. %2$s', $status, $response_body )
		);
	}

	return true;
}

function unrealshot_revalidation_record_delivery( $success, $event, $message = '' ) {
	update_option(
		UNREALSHOT_REVALIDATION_LAST_DELIVERY_OPTION,
		array(
			'time'    => time(),
			'success' => (bool) $success,
			'event'   => sanitize_text_field( $event ),
			'message' => sanitize_text_field( $message ),
		),
		false
	);
}

/**
 * Retry transient network/HTTP failures through WP-Cron without storing the secret.
 */
function unrealshot_revalidation_dispatch( $payload, $attempt = 0 ) {
	$result = unrealshot_revalidation_send( $payload );
	$event  = isset( $payload['event'] ) ? $payload['event'] : 'unknown';

	if ( true === $result ) {
		unrealshot_revalidation_record_delivery( true, $event, 'Delivered successfully.' );
		return true;
	}

	$message = is_wp_error( $result ) ? $result->get_error_message() : 'Unknown delivery error.';
	unrealshot_revalidation_record_delivery( false, $event, $message );
	error_log( '[Unrealshot Revalidation] ' . $message ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log

	$retry_delays = array( 60, 300, 900 );
	if ( isset( $retry_delays[ $attempt ] ) && 'unrealshot_missing_secret' !== $result->get_error_code() ) {
		wp_schedule_single_event(
			time() + $retry_delays[ $attempt ],
			UNREALSHOT_REVALIDATION_RETRY_HOOK,
			array( $payload, $attempt + 1 ),
			true
		);
	}

	return $result;
}

function unrealshot_revalidation_retry( $payload, $attempt ) {
	unrealshot_revalidation_dispatch( $payload, (int) $attempt );
}
add_action( UNREALSHOT_REVALIDATION_RETRY_HOOK, 'unrealshot_revalidation_retry', 10, 2 );

/**
 * Build final translation sets and dispatch in endpoint-sized batches.
 */
function unrealshot_revalidation_flush() {
	$jobs = &unrealshot_revalidation_jobs();
	if ( empty( $jobs ) ) {
		return;
	}

	foreach ( $jobs as $event => $job ) {
		$paths    = unrealshot_revalidation_normalize_paths( $job['paths'] );
		$post_ids = array_keys( $job['post_ids'] );
		$related_post_ids = $post_ids;

		foreach ( $post_ids as $post_id ) {
			$related_post_ids = array_merge( $related_post_ids, unrealshot_revalidation_translation_ids( $post_id ) );
			$paths = array_merge(
				$paths,
				unrealshot_revalidation_remembered_paths( $post_id ),
				unrealshot_revalidation_translation_paths( $post_id )
			);
		}

		$paths = unrealshot_revalidation_normalize_paths( $paths );
		unrealshot_revalidation_store_paths( $related_post_ids, $paths );

		$batches = empty( $paths ) ? array( array() ) : array_chunk( $paths, 20 );
		foreach ( $batches as $batch ) {
			$locales = array();
			foreach ( $batch as $path ) {
				$locales[ $path['locale'] ] = true;
			}

			unrealshot_revalidation_dispatch(
				array(
					'event'   => $event,
					'locales' => empty( $locales ) ? unrealshot_revalidation_enabled_locales() : array_keys( $locales ),
					'posts'   => $batch,
				)
			);
		}
	}

	$jobs = array();
}
add_action( 'shutdown', 'unrealshot_revalidation_flush', 999 );

/**
 * Admin diagnostics and a signed end-to-end test button.
 */
function unrealshot_revalidation_admin_menu() {
	add_management_page(
		'Unrealshot Revalidation',
		'Unrealshot Revalidation',
		'manage_options',
		'unrealshot-revalidation',
		'unrealshot_revalidation_admin_page'
	);
}
add_action( 'admin_menu', 'unrealshot_revalidation_admin_menu' );

function unrealshot_revalidation_admin_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$secret_ready   = strlen( unrealshot_revalidation_secret() ) >= 32;
	$polylang_ready = function_exists( 'pll_get_post_language' ) && function_exists( 'pll_get_post_translations' );
	$last_delivery  = get_option( UNREALSHOT_REVALIDATION_LAST_DELIVERY_OPTION, array() );
	$button_attributes = $secret_ready && $polylang_ready ? array() : array( 'disabled' => 'disabled' );
	?>
	<div class="wrap">
		<h1>Unrealshot Next.js Revalidation</h1>
		<p>This plugin signs WordPress post changes and tells Next.js to refresh its blog cache, article routes and sitemap.</p>
		<table class="widefat striped" style="max-width: 900px">
			<tbody>
				<tr><th scope="row">Endpoint</th><td><code><?php echo esc_html( unrealshot_revalidation_endpoint() ); ?></code></td></tr>
				<tr><th scope="row">Shared secret</th><td><?php echo $secret_ready ? '<strong style="color:#008a20">Configured</strong>' : '<strong style="color:#b32d2e">Missing or shorter than 32 characters</strong>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></td></tr>
				<tr><th scope="row">Polylang API</th><td><?php echo $polylang_ready ? '<strong style="color:#008a20">Available</strong>' : '<strong style="color:#b32d2e">Unavailable</strong>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></td></tr>
				<tr><th scope="row">Published blog locales</th><td><code><?php echo esc_html( implode( ', ', unrealshot_revalidation_enabled_locales() ) ); ?></code></td></tr>
				<?php if ( is_array( $last_delivery ) && ! empty( $last_delivery['time'] ) ) : ?>
					<tr>
						<th scope="row">Last delivery</th>
						<td>
							<?php echo ! empty( $last_delivery['success'] ) ? '<strong style="color:#008a20">Successful</strong>' : '<strong style="color:#b32d2e">Failed</strong>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							&mdash; <?php echo esc_html( wp_date( 'Y-m-d H:i:s T', (int) $last_delivery['time'] ) ); ?>
							<?php if ( ! empty( $last_delivery['message'] ) ) : ?>
								<br><?php echo esc_html( $last_delivery['message'] ); ?>
							<?php endif; ?>
						</td>
					</tr>
				<?php endif; ?>
			</tbody>
		</table>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin-top: 20px">
			<input type="hidden" name="action" value="unrealshot_revalidation_test">
			<?php wp_nonce_field( 'unrealshot_revalidation_test' ); ?>
			<?php submit_button( 'Send signed test request', 'primary', 'submit', false, $button_attributes ); ?>
		</form>
	</div>
	<?php
}

function unrealshot_revalidation_admin_test() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You are not allowed to perform this action.', 'unrealshot-next-revalidation' ) );
	}
	check_admin_referer( 'unrealshot_revalidation_test' );

	$result = unrealshot_revalidation_send(
		array(
			'event'   => 'post.updated',
			'locales' => unrealshot_revalidation_enabled_locales(),
			'posts'   => array(),
		)
	);

	if ( true === $result ) {
		unrealshot_revalidation_record_delivery( true, 'test', 'Signed test delivered successfully.' );
	} else {
		$message = is_wp_error( $result ) ? $result->get_error_message() : 'Unknown test error.';
		unrealshot_revalidation_record_delivery( false, 'test', $message );
	}

	wp_safe_redirect( admin_url( 'tools.php?page=unrealshot-revalidation' ) );
	exit;
}
add_action( 'admin_post_unrealshot_revalidation_test', 'unrealshot_revalidation_admin_test' );

function unrealshot_revalidation_admin_notice() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$issues = array();
	if ( strlen( unrealshot_revalidation_secret() ) < 32 ) {
		$issues[] = 'UNREALSHOT_REVALIDATION_SECRET is missing from wp-config.php or is shorter than 32 characters.';
	}
	if ( ! function_exists( 'pll_get_post_language' ) || ! function_exists( 'pll_get_post_translations' ) ) {
		$issues[] = 'Polylang is inactive or its public functions are unavailable.';
	}

	if ( empty( $issues ) ) {
		return;
	}
	?>
	<div class="notice notice-error">
		<p><strong>Unrealshot Next.js Revalidation needs attention:</strong></p>
		<ul style="list-style:disc;padding-left:20px">
			<?php foreach ( $issues as $issue ) : ?>
				<li><?php echo esc_html( $issue ); ?></li>
			<?php endforeach; ?>
		</ul>
		<p><a href="<?php echo esc_url( admin_url( 'tools.php?page=unrealshot-revalidation' ) ); ?>">Open diagnostics</a></p>
	</div>
	<?php
}
add_action( 'admin_notices', 'unrealshot_revalidation_admin_notice' );

function unrealshot_revalidation_deactivate() {
	wp_clear_scheduled_hook( UNREALSHOT_REVALIDATION_RETRY_HOOK );
}
register_deactivation_hook( __FILE__, 'unrealshot_revalidation_deactivate' );
