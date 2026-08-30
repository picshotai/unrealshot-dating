# WordPress publish-time revalidation

The WordPress side is implemented by the standalone companion plugin in
`wordpress/unrealshot-next-revalidation`. A ready-to-upload ZIP is generated at
`wordpress/releases/unrealshot-next-revalidation-1.0.0.zip`.

## What it does

When a WordPress post is published, updated, unpublished, trashed, restored or
force-deleted, the plugin:

1. waits until the WordPress save has completed;
2. gets the post and all linked Polylang translations;
3. includes remembered old slugs and removed translation relationships;
4. serializes the JSON body once;
5. signs those exact bytes with HMAC-SHA256;
6. sends them to the Next.js endpoint; and
7. retries failed deliveries after 1, 5 and 15 minutes through WP-Cron.

The secret is never sent, stored in the plugin database options, rendered in
the admin UI or exposed to the browser.

## 1. Generate one shared secret

On Windows PowerShell:

```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToHexString($bytes).ToLower()
```

This produces a 64-character value. Use the same exact value in Next.js and
WordPress. Do not commit the real value to Git.

## 2. Configure the Next.js deployment

Add this production environment variable in the hosting provider:

```env
WORDPRESS_REVALIDATION_SECRET=PASTE_THE_64_CHARACTER_SECRET_HERE
```

Redeploy the Next.js application so `/api/revalidate-wordpress` can read it.
The endpoint deliberately returns HTTP 503 until a secret of at least 32
characters is configured.

## 3. Configure WordPress

Open `wp-config.php` and add the following above the line that says
`/* That's all, stop editing! */`:

```php
define( 'UNREALSHOT_REVALIDATION_SECRET', 'PASTE_THE_SAME_64_CHARACTER_SECRET_HERE' );
define( 'UNREALSHOT_REVALIDATION_URL', 'https://www.unrealshot.com/api/revalidate-wordpress' );
define( 'UNREALSHOT_BLOG_LOCALES', 'en,fr,es,de,pt-BR' );
```

`UNREALSHOT_REVALIDATION_URL` and `UNREALSHOT_BLOG_LOCALES` are optional because
those are already the plugin defaults. Keeping them explicit makes the live
configuration easier to audit.

`UNREALSHOT_BLOG_LOCALES` must match `publishedBlogLocales` in
`i18n/config.ts` (`en,fr,es,de,pt-BR`).

If the WordPress host supports secret environment variables, the secret can be
kept out of `wp-config.php` itself:

```php
$unrealshot_revalidation_secret = getenv( 'WORDPRESS_REVALIDATION_SECRET' );
if ( $unrealshot_revalidation_secret ) {
    define( 'UNREALSHOT_REVALIDATION_SECRET', $unrealshot_revalidation_secret );
}
```

## 4. Install the plugin

In WordPress:

1. open **Plugins > Add Plugin > Upload Plugin**;
2. select `unrealshot-next-revalidation-1.0.0.zip`;
3. click **Install Now**; and
4. click **Activate Plugin**.

This is a normal installable plugin ZIP. Composer, Docker and the development
repository are not needed on the WordPress server.

## 5. Verify the complete connection

After activation, open **Tools > Unrealshot Revalidation**.

The page must show:

- **Shared secret: Configured**
- **Polylang API: Available**
- **Published blog locales: en, fr, es, de, pt-BR**

Click **Send signed test request**. Refresh the page if necessary. The final
row must say **Last delivery: Successful** and **Signed test delivered
successfully**.

If it fails, the page shows the sanitized error returned by WordPress or
Next.js. The plugin also writes a line prefixed with `[Unrealshot Revalidation]`
to the WordPress PHP error log.

## Request contract

The plugin posts to:

```text
https://www.unrealshot.com/api/revalidate-wordpress
```

Headers:

- `Content-Type: application/json`
- `x-wordpress-timestamp`: current Unix timestamp in seconds
- `x-wordpress-signature`: `sha256=` followed by
  `HMAC_SHA256(secret, timestamp + "." + rawBody)`

Example payload:

```json
{
  "event": "post.updated",
  "locales": ["en", "fr", "es", "de", "pt-BR"],
  "posts": [
    {"locale": "en", "slug": "english-slug"},
    {"locale": "fr", "slug": "french-slug"}
  ]
}
```

The Next.js endpoint accepts only the five supported event names, published
blog locales, bounded arrays and valid slugs. Signatures older than five
minutes are rejected.

## WP-Cron requirement

The first delivery happens immediately. Only retries depend on WP-Cron. If the
site has `DISABLE_WP_CRON` enabled, the hosting provider must invoke
`wp-cron.php` through a real scheduled task; otherwise automatic retries cannot
run. The admin diagnostics page still records the failed first attempt.
