=== Unrealshot Next.js Revalidation ===
Contributors: unrealshot
Tags: nextjs, revalidation, polylang, webhook
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later

Securely refreshes the Unrealshot Next.js blog when Polylang posts change.

== Installation ==

1. Add UNREALSHOT_REVALIDATION_SECRET to wp-config.php.
2. Zip this folder or upload the provided release ZIP in Plugins > Add Plugin > Upload Plugin.
3. Activate Unrealshot Next.js Revalidation.
4. Open Tools > Unrealshot Revalidation and send the signed test request.

The same secret must be configured as WORDPRESS_REVALIDATION_SECRET in the
Next.js production environment. The secret must contain at least 32 characters.

Optional wp-config.php constants:

define( 'UNREALSHOT_REVALIDATION_URL', 'https://www.unrealshot.com/api/revalidate-wordpress' );
define( 'UNREALSHOT_BLOG_LOCALES', 'en,fr,es,de,pt-BR' );

== Behavior ==

The plugin listens only to WordPress posts. It collects the changed post and
all linked Polylang translations after the save completes, signs the exact JSON
body with HMAC-SHA256, and sends it to Next.js. Failed deliveries are retried
after 1, 5 and 15 minutes through WP-Cron.

