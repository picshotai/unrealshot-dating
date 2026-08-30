import { routing } from "./routing"
import { formats } from "./formats"
import messages from "../messages/en.json"

declare module "next-intl" {
  interface AppConfig {
    Formats: typeof formats
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
