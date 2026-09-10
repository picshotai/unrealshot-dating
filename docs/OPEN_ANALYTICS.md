# OpenAnalytics event and funnel map

The browser tracker is loaded globally from the configured collector. Product
events are emitted through `lib/analytics/open-analytics.ts` so names,
properties, conversion semantics, and reload deduplication stay consistent.

## Events

| Event | Fires when | Important properties |
| --- | --- | --- |
| `signup_cta_clicked` | A public-page link to `/login` is clicked | `source_path` |
| `auth_started` | Google or magic-link authentication is submitted | `method` |
| `auth_link_sent` | Supabase accepts a magic-link request | `method` |
| `auth_completed` | The authentication callback establishes a session | `method` |
| `model_creation_started` | A valid model upload is submitted | `photo_count` |
| `model_created` | All model samples upload successfully | `photo_count` |
| `model_creation_failed` | Model creation or upload fails | `failure_stage` |
| `checkout_started` | Dodo returns a usable checkout session | `plan`, `amount`, `credits`, `checkout_type` |
| `checkout_failed` | A checkout session cannot be created | `plan`, `checkout_type` |
| `purchase_completed` | A recorded payment is completed | `order_id`, `amount`, `credits`, `plan` |
| `purchase_failed` | A recorded payment fails | `credits`, `plan` |
| `shoot_started` | A shoot order is accepted | configuration counts only |
| `shoot_completed` | A shoot reaches ready status | `photo_count`, `shoot_count` |
| `shoot_failed` | A shoot reaches failed status | `failure_phase` |
| `shoot_retry_requested` | A failed shoot retry is accepted | none |
| `photo_retake_requested` | A photo retake is accepted | `feedback_provided` boolean only |
| `photos_downloaded` | A single image or ZIP is successfully prepared | `download_type`, `photo_count` |

`model_created`, `purchase_completed`, and `shoot_completed` are conversions.
No event sends email addresses, Supabase user IDs, image IDs, filenames,
feedback text, or raw errors.

## Recommended funnels

These funnels are configured in the Unrealshot OpenAnalytics project with a
24-hour window and visitor-based counting. They are split at natural return
points so each report answers one product question cleanly.

1. **Visitor to auth intent**
   - Event: `signup_cta_clicked`
   - Page: `/login`
   - Event: `auth_started`

2. **Model activation**
   - Page: `/models/create`
   - Event: `model_creation_started`
   - Event: `model_created`
   - Page: `/dating-shoot`

3. **Studio to paid shoot**
   - Page: `/dating-shoot`
   - Event: `checkout_started`
   - Event: `purchase_completed`
   - Event: `shoot_started`

4. **Delivery to value**
   - Event: `shoot_started`
   - Event: `shoot_completed`
   - Event: `photos_downloaded`

The dashboard accepts these event names before their first production hit; the
reports begin populating as soon as the deployed app sends them.
