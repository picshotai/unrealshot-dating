import type { PublishedPublicLocale } from "@/i18n/config"

type AuthorityLink = { href: string; title: string; text: string }

export type AuthorityLinksCopy = {
  eyebrow: string
  heading: string
  readGuide: string
  pages: AuthorityLink[]
}

export const authorityLinksCopy: Record<PublishedPublicLocale, AuthorityLinksCopy> = {
  en: {
    eyebrow: "Dating photo resources",
    heading: "Everything you need to build an honest, varied dating profile",
    readGuide: "Read the guide →",
    pages: [
      { href: "/dating-photos", title: "Dating profile photo guide", text: "Build a complete lineup with a clear opener, full-length, activity and candid roles." },
      { href: "/dating-photos/examples", title: "Complete shoot examples", text: "Inspect seven AI-generated four-frame shoots with individual captions." },
      { href: "/how-it-works", title: "How UnrealShot works", text: "From 4–6 reference selfies and three questions to 15 coherent shoots." },
      { href: "/realistic-ai-dating-photos", title: "How realistic photos are made", text: "See how reference-guided likeness, consistent scenes and retakes support a friend-taken look." },
    ],
  },
  fr: {
    eyebrow: "Ressources sur les photos de rencontre",
    heading: "Tout ce qu’il vous faut pour créer un profil de rencontre honnête et varié",
    readGuide: "Lire le guide →",
    pages: [
      { href: "/dating-photos", title: "Guide des photos de profil", text: "Construisez une sélection complète avec ouverture claire, photo en pied, activité et spontanéité." },
      { href: "/dating-photos/examples", title: "Exemples de séances complètes", text: "Découvrez sept séances de quatre images générées par IA, avec leurs légendes." },
      { href: "/how-it-works", title: "Comment fonctionne UnrealShot", text: "De 4 à 6 selfies de référence et trois questions à 15 séances cohérentes." },
      { href: "/realistic-ai-dating-photos", title: "Comment créer des photos réalistes", text: "Découvrez comment la ressemblance guidée, les scènes cohérentes et les reprises créent un rendu naturel." },
    ],
  },
  es: {
    eyebrow: "Recursos sobre fotos para citas",
    heading: "Todo lo que necesitas para crear un perfil de citas honesto y variado",
    readGuide: "Leer la guía →",
    pages: [
      { href: "/dating-photos", title: "Guía de fotos de perfil", text: "Crea una selección completa con una apertura clara, cuerpo entero, actividad y espontaneidad." },
      { href: "/dating-photos/examples", title: "Ejemplos de sesiones completas", text: "Explora siete sesiones de cuatro encuadres generadas con IA y sus leyendas." },
      { href: "/how-it-works", title: "Cómo funciona UnrealShot", text: "De 4–6 selfies de referencia y tres preguntas a 15 sesiones coherentes." },
      { href: "/realistic-ai-dating-photos", title: "Cómo se crean fotos realistas", text: "Descubre cómo el parecido guiado, las escenas coherentes y las repeticiones crean un resultado natural." },
    ],
  },
  de: {
    eyebrow: "Ressourcen für Dating-Fotos",
    heading: "Alles, was du für ein ehrliches und abwechslungsreiches Dating-Profil brauchst",
    readGuide: "Leitfaden lesen →",
    pages: [
      { href: "/dating-photos", title: "Leitfaden für Profilfotos", text: "Stelle eine vollständige Auswahl mit klarem Opener, Ganzkörper-, Aktivitäts- und Spontanaufnahmen zusammen." },
      { href: "/dating-photos/examples", title: "Beispiele vollständiger Shootings", text: "Sieh dir sieben KI-generierte Shootings mit vier Aufnahmen und eigenen Bildunterschriften an." },
      { href: "/how-it-works", title: "So funktioniert UnrealShot", text: "Von 4–6 Referenz-Selfies und drei Fragen zu 15 zusammenhängenden Shootings." },
      { href: "/realistic-ai-dating-photos", title: "So entstehen realistische Fotos", text: "Erfahre, wie referenzgesteuerte Ähnlichkeit, zusammenhängende Szenen und Neuerstellungen einen natürlichen Look unterstützen." },
    ],
  },
  "pt-BR": {
    eyebrow: "Recursos sobre fotos para namoro",
    heading: "Tudo o que você precisa para criar um perfil de namoro honesto e variado",
    readGuide: "Ler o guia →",
    pages: [
      { href: "/dating-photos", title: "Guia de fotos de perfil", text: "Monte um conjunto completo com abertura clara, corpo inteiro, atividade e momentos espontâneos." },
      { href: "/dating-photos/examples", title: "Exemplos de ensaios completos", text: "Veja sete ensaios de quatro imagens gerados por IA, com legendas individuais." },
      { href: "/how-it-works", title: "Como a UnrealShot funciona", text: "De 4–6 selfies de referência e três perguntas a 15 ensaios coerentes." },
      { href: "/realistic-ai-dating-photos", title: "Como fotos realistas são criadas", text: "Veja como semelhança guiada por referências, cenas consistentes e refações ajudam a criar um visual natural." },
    ],
  },
}
