import type { PublishedPublicLocale } from "@/i18n/config"

export type PublicNavigationCopy = {
  contact: string
  realisticDatingPhotos: string
  aiTinderPhotos: string
  aiHingePhotos: string
  aiBumblePhotos: string
  tinderGuide: string
  hingeGuide: string
  bumbleGuide: string
  activityPhotos: string
}

export const publicNavigationCopy: Record<PublishedPublicLocale, PublicNavigationCopy> = {
  en: {
    contact: "Contact",
    realisticDatingPhotos: "Realistic AI Dating Photos",
    aiTinderPhotos: "AI Tinder Photos",
    aiHingePhotos: "AI Hinge Photos",
    aiBumblePhotos: "AI Bumble Photos",
    tinderGuide: "Tinder Photo Guide",
    hingeGuide: "Hinge Photo Guide",
    bumbleGuide: "Bumble Photo Guide",
    activityPhotos: "Activity photos",
  },
  fr: {
    contact: "Contact",
    realisticDatingPhotos: "Photos de rencontre IA réalistes",
    aiTinderPhotos: "Photos Tinder par IA",
    aiHingePhotos: "Photos Hinge par IA",
    aiBumblePhotos: "Photos Bumble par IA",
    tinderGuide: "Guide des photos Tinder",
    hingeGuide: "Guide des photos Hinge",
    bumbleGuide: "Guide des photos Bumble",
    activityPhotos: "Photos d’activité",
  },
  es: {
    contact: "Contacto",
    realisticDatingPhotos: "Fotos de citas realistas con IA",
    aiTinderPhotos: "Fotos de Tinder con IA",
    aiHingePhotos: "Fotos de Hinge con IA",
    aiBumblePhotos: "Fotos de Bumble con IA",
    tinderGuide: "Guía de fotos para Tinder",
    hingeGuide: "Guía de fotos para Hinge",
    bumbleGuide: "Guía de fotos para Bumble",
    activityPhotos: "Fotos de actividades",
  },
  de: {
    contact: "Kontakt",
    realisticDatingPhotos: "Realistische KI-Dating-Fotos",
    aiTinderPhotos: "KI-Tinder-Fotos",
    aiHingePhotos: "KI-Hinge-Fotos",
    aiBumblePhotos: "KI-Bumble-Fotos",
    tinderGuide: "Tinder-Fotoleitfaden",
    hingeGuide: "Hinge-Fotoleitfaden",
    bumbleGuide: "Bumble-Fotoleitfaden",
    activityPhotos: "Aktivitätsfotos",
  },
  "pt-BR": {
    contact: "Contato",
    realisticDatingPhotos: "Fotos de namoro realistas com IA",
    aiTinderPhotos: "Fotos do Tinder com IA",
    aiHingePhotos: "Fotos do Hinge com IA",
    aiBumblePhotos: "Fotos do Bumble com IA",
    tinderGuide: "Guia de fotos do Tinder",
    hingeGuide: "Guia de fotos do Hinge",
    bumbleGuide: "Guia de fotos do Bumble",
    activityPhotos: "Fotos de atividade",
  },
}
