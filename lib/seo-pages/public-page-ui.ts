import type { PublishedPublicLocale } from "@/i18n/config"

export type AuthorityPageUi = {
  home: string
  datingPhotos: string
  atAGlance: string
  reviewedAgainstGuidance: string
  officialSources: string
  sourceNote: string
  relatedPages: string
  continueExploring: string
  createCta: string
}

export const authorityPageUi: Record<PublishedPublicLocale, AuthorityPageUi> = {
  en: {
    home: "Home",
    datingPhotos: "Dating Photos",
    atAGlance: "UnrealShot at a glance",
    reviewedAgainstGuidance: "Reviewed against official app guidance:",
    officialSources: "Official sources",
    sourceNote: "App rules can change. These primary sources were checked on the reviewed date above.",
    relatedPages: "Related pages",
    continueExploring: "Continue exploring",
    createCta: "Create your 15 dating shoots — $39",
  },
  fr: {
    home: "Accueil",
    datingPhotos: "Photos de rencontre",
    atAGlance: "UnrealShot en un coup d’œil",
    reviewedAgainstGuidance: "Vérifié selon les recommandations officielles des applications :",
    officialSources: "Sources officielles",
    sourceNote: "Les règles des applications peuvent changer. Ces sources principales ont été vérifiées à la date indiquée ci-dessus.",
    relatedPages: "Pages associées",
    continueExploring: "Poursuivre la découverte",
    createCta: "Créer mes 15 séances photo — 39 $",
  },
  es: {
    home: "Inicio",
    datingPhotos: "Fotos para citas",
    atAGlance: "UnrealShot de un vistazo",
    reviewedAgainstGuidance: "Revisado según las indicaciones oficiales de la aplicación:",
    officialSources: "Fuentes oficiales",
    sourceNote: "Las reglas de las aplicaciones pueden cambiar. Estas fuentes principales se comprobaron en la fecha indicada arriba.",
    relatedPages: "Páginas relacionadas",
    continueExploring: "Seguir explorando",
    createCta: "Crea tus 15 sesiones de fotos — 39 $",
  },
  de: {
    home: "Startseite",
    datingPhotos: "Dating-Fotos",
    atAGlance: "UnrealShot auf einen Blick",
    reviewedAgainstGuidance: "Anhand der offiziellen App-Richtlinien geprüft:",
    officialSources: "Offizielle Quellen",
    sourceNote: "App-Regeln können sich ändern. Diese Primärquellen wurden am oben genannten Prüfdatum kontrolliert.",
    relatedPages: "Verwandte Seiten",
    continueExploring: "Mehr entdecken",
    createCta: "Deine 15 Dating-Shootings erstellen — 39 $",
  },
  "pt-BR": {
    home: "Início",
    datingPhotos: "Fotos para namoro",
    atAGlance: "A UnrealShot em um relance",
    reviewedAgainstGuidance: "Revisado com base nas orientações oficiais do aplicativo:",
    officialSources: "Fontes oficiais",
    sourceNote: "As regras dos aplicativos podem mudar. Estas fontes primárias foram verificadas na data indicada acima.",
    relatedPages: "Páginas relacionadas",
    continueExploring: "Continue explorando",
    createCta: "Crie seus 15 ensaios de namoro — US$ 39",
  },
}
