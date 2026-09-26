import type { AppLocale } from "@/i18n/config"
import type { LocalizedPlatformApp } from "./localized-types"
import type { PlatformHeroPhoto } from "./types"

const platformPhotos: Record<
  LocalizedPlatformApp,
  Record<AppLocale, PlatformHeroPhoto[]>
> = {
  Tinder: {
    en: [
      {
        src: "/pages/tinder_closeup.webp",
        role: "Close opener",
        alt: "Tinder close opener dating photo with clear facial features and direct eye contact",
      },
      {
        src: "/pages/tinder_half_body.webp",
        role: "Half body",
        alt: "Tinder half-body dating photo showing casual everyday style and natural posture",
      },
      {
        src: "/pages/tinder_full_body.webp",
        role: "Full length",
        alt: "Tinder full-length photo showing proportions, style and believable environment",
      },
      {
        src: "/pages/tinder_expression_shoot.webp",
        role: "Candid expression",
        alt: "Tinder candid expression photo with a natural, approachable smile",
      },
    ],
    fr: [
      {
        src: "/pages/tinder_closeup.webp",
        role: "Portrait d'ouverture",
        alt: "Photo d'ouverture Tinder en gros plan avec contact visuel direct et traits nets",
      },
      {
        src: "/pages/tinder_half_body.webp",
        role: "Mi-corps",
        alt: "Photo Tinder à mi-corps montrant un style décontracté et une posture naturelle",
      },
      {
        src: "/pages/tinder_full_body.webp",
        role: "Vue en pied",
        alt: "Photo Tinder en pied montrant la silhouette, le style et un décor crédible",
      },
      {
        src: "/pages/tinder_expression_shoot.webp",
        role: "Moment spontané",
        alt: "Photo Tinder spontanée avec un sourire naturel et chaleureux",
      },
    ],
    es: [
      {
        src: "/pages/tinder_closeup.webp",
        role: "Foto de portada",
        alt: "Primer plano de portada para Tinder con rasgos claros y mirada directa",
      },
      {
        src: "/pages/tinder_half_body.webp",
        role: "Medio cuerpo",
        alt: "Foto para Tinder de medio cuerpo mostrando estilo informal y postura natural",
      },
      {
        src: "/pages/tinder_full_body.webp",
        role: "Cuerpo entero",
        alt: "Foto para Tinder de cuerpo entero mostrando silueta, estilo y entorno natural",
      },
      {
        src: "/pages/tinder_expression_shoot.webp",
        role: "Expresión espontánea",
        alt: "Foto para Tinder espontánea con una sonrisa natural y cercana",
      },
    ],
    de: [
      {
        src: "/pages/tinder_closeup.webp",
        role: "Einstiegsbild",
        alt: "Klares Tinder-Nahaufnahme-Profilbild mit direktem Blickkontakt",
      },
      {
        src: "/pages/tinder_half_body.webp",
        role: "Halbkörper",
        alt: "Tinder-Halbkörperfoto mit alltagstauglichem Stil und natürlicher Haltung",
      },
      {
        src: "/pages/tinder_full_body.webp",
        role: "Ganzkörper",
        alt: "Tinder-Ganzkörperfoto mit Statur, Silhouette und glaubwürdiger Umgebung",
      },
      {
        src: "/pages/tinder_expression_shoot.webp",
        role: "Spontaner Moment",
        alt: "Spontanes Tinder-Foto mit natürlichem, sympathischem Lächeln",
      },
    ],
    "pt-BR": [
      {
        src: "/pages/tinder_closeup.webp",
        role: "Foto de abertura",
        alt: "Close de abertura para o Tinder com traços nítidos e olhar direto",
      },
      {
        src: "/pages/tinder_half_body.webp",
        role: "Meio corpo",
        alt: "Foto para Tinder de meio corpo mostrando estilo casual e postura natural",
      },
      {
        src: "/pages/tinder_full_body.webp",
        role: "Corpo inteiro",
        alt: "Foto para Tinder de corpo inteiro mostrando proporções, estilo e cenário real",
      },
      {
        src: "/pages/tinder_expression_shoot.webp",
        role: "Momento espontâneo",
        alt: "Foto para Tinder espontânea com sorriso natural e acolhedor",
      },
    ],
  },
  Hinge: {
    en: [
      {
        src: "/pages/hinge_closeup.webp",
        role: "Close opener",
        alt: "Hinge close opener dating photo with natural daylight and friendly expression",
      },
      {
        src: "/pages/hinge_half_body.webp",
        role: "Half body",
        alt: "Hinge half-body dating photo providing honest visual context for written prompts",
      },
      {
        src: "/pages/hinge_full_body.webp",
        role: "Full length",
        alt: "Hinge full-length photo showing everyday posture and authentic environment",
      },
      {
        src: "/pages/hinge_expression.webp",
        role: "Candid expression",
        alt: "Hinge candid expression photo with an approachable, unposed reaction",
      },
    ],
    fr: [
      {
        src: "/pages/hinge_closeup.webp",
        role: "Portrait d'ouverture",
        alt: "Photo d'ouverture Hinge en gros plan avec lumière naturelle et expression chaleureuse",
      },
      {
        src: "/pages/hinge_half_body.webp",
        role: "Mi-corps",
        alt: "Photo Hinge à mi-corps donnant du contexte visuel pour répondre aux prompts",
      },
      {
        src: "/pages/hinge_full_body.webp",
        role: "Vue en pied",
        alt: "Photo Hinge en pied montrant la posture du quotidien et un environnement réel",
      },
      {
        src: "/pages/hinge_expression.webp",
        role: "Moment spontané",
        alt: "Photo Hinge spontanée avec une réaction naturelle et accessible",
      },
    ],
    es: [
      {
        src: "/pages/hinge_closeup.webp",
        role: "Foto de portada",
        alt: "Primer plano de portada para Hinge con luz natural y expresión cercana",
      },
      {
        src: "/pages/hinge_half_body.webp",
        role: "Medio cuerpo",
        alt: "Foto para Hinge de medio cuerpo dando contexto visual para responder a las preguntas",
      },
      {
        src: "/pages/hinge_full_body.webp",
        role: "Cuerpo entero",
        alt: "Foto para Hinge de cuerpo entero mostrando postura cotidiana y entorno real",
      },
      {
        src: "/pages/hinge_expression.webp",
        role: "Expresión espontánea",
        alt: "Foto para Hinge espontánea con una reacción natural y accesible",
      },
    ],
    de: [
      {
        src: "/pages/hinge_closeup.webp",
        role: "Einstiegsbild",
        alt: "Klares Hinge-Nahaufnahme-Profilbild in natürlichem Tageslicht",
      },
      {
        src: "/pages/hinge_half_body.webp",
        role: "Halbkörper",
        alt: "Hinge-Halbkörperfoto als ehrlicher visueller Kontext für Profil-Prompts",
      },
      {
        src: "/pages/hinge_full_body.webp",
        role: "Ganzkörper",
        alt: "Hinge-Ganzkörperfoto mit natürlicher Haltung und authentischer Umgebung",
      },
      {
        src: "/pages/hinge_expression.webp",
        role: "Spontaner Moment",
        alt: "Spontanes Hinge-Foto mit ungekünsteltem, sympathischem Ausdruck",
      },
    ],
    "pt-BR": [
      {
        src: "/pages/hinge_closeup.webp",
        role: "Foto de abertura",
        alt: "Close de abertura para o Hinge com luz natural e expressão simpática",
      },
      {
        src: "/pages/hinge_half_body.webp",
        role: "Meio corpo",
        alt: "Foto para o Hinge de meio corpo dando contexto visual para as respostas do perfil",
      },
      {
        src: "/pages/hinge_full_body.webp",
        role: "Corpo inteiro",
        alt: "Foto para o Hinge de corpo inteiro com postura natural e ambiente autêntico",
      },
      {
        src: "/pages/hinge_expression.webp",
        role: "Momento espontâneo",
        alt: "Foto para o Hinge espontânea com reação natural e acolhedora",
      },
    ],
  },
  Bumble: {
    en: [],
    fr: [],
    es: [],
    de: [],
    "pt-BR": [],
  },
}

export function getLocalizedPlatformHeroPhotos(
  app: LocalizedPlatformApp,
  locale: AppLocale,
): PlatformHeroPhoto[] | undefined {
  const photos = platformPhotos[app]?.[locale]
  return photos && photos.length > 0 ? photos : undefined
}
