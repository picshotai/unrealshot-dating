import { buildLocalizedPlatformPages } from "./localized-build"
import type { PlatformLocalePack, LocalizedPlatformApp } from "./localized-types"

const fr: PlatformLocalePack = {
  locale: "fr",
  reviewed: "31 août 2026",
  sourceLabels: {
    Tinder: ["Tinder : vérification photo", "Tinder : visage et profil masqué", "Règles de la communauté Tinder"],
    Hinge: ["Hinge : modifier son profil", "Hinge : ajouter et modifier ses photos", "Hinge : contenus et comportements interdits"],
    Bumble: ["Bumble : règles des photos de profil", "Bumble : fonctionnalité Best Photo", "Bumble : règles de la communauté"],
  },
  variants: {
    Tinder: {
      focus: "la clarté et la variété dans un profil qui se parcourt rapidement",
      requirement: "Tinder demande souvent un visage clairement visible et peut masquer un profil sans photo de visage.",
      firstPhoto: "une photo solo récente, nette, avec le visage immédiatement identifiable",
      specialFeature: "la vérification photo par selfie vidéo",
      trustNote: "Tinder compare un court selfie vidéo avec les photos du profil. Une image générée ne doit donc jamais prétendre documenter une apparence qui n'est pas la tienne aujourd'hui.",
    },
    Hinge: {
      focus: "le lien entre les photos et les réponses écrites du profil",
      requirement: "Hinge demande quatre à six photos selon la région, ainsi que trois réponses aux prompts.",
      firstPhoto: "un portrait solo récent qui permet de te reconnaître sans hésitation",
      specialFeature: "les prompts, légendes et réponses qui donnent du contexte aux images",
      trustNote: "Hinge interdit les contenus générés par IA utilisés pour tromper ou induire en erreur. Les activités et centres d'intérêt montrés doivent donc vraiment te correspondre.",
    },
    Bumble: {
      focus: "des premiers repères clairs et des accroches faciles pour engager la conversation",
      requirement: "Bumble permet jusqu'à six photos ou vidéos et recommande généralement d'en utiliser quatre à six.",
      firstPhoto: "une photo solo récente, lumineuse, avec les yeux et le visage bien visibles",
      specialFeature: "la fonction Best Photo, qui peut réordonner les photos selon les réactions reçues dans l'application",
      trustNote: "Bumble interdit les photos artificielles ou retouchées lorsqu'elles servent à tromper. Garde des photos récentes et une apparence fidèle à la réalité.",
    },
  },
  landing: (app: LocalizedPlatformApp, v) => ({
    eyebrow: "Photos de rencontre IA pour hommes sur " + app,
    title: "Des photos " + app + " qui donnent à ton profil une histoire visuelle crédible",
    description: "Crée 60 photos " + app + " réalistes réparties en 15 séances cohérentes à partir de 4 à 6 selfies. 15 reprises photo individuelles et une livraison sous 30 minutes pour 39 $.",
    answer: "UnrealShot transforme 4 à 6 selfies récents en 15 idées de séances conçues pour ton profil " + app + ". Chaque idée devient quatre photos liées : le décor, la tenue et la lumière restent cohérents, tandis que le cadrage et l'expression offrent de vraies alternatives. Tu reçois 60 photos, 15 reprises individuelles et une livraison sous 30 minutes, pour 39 $ une seule fois.",
    heroBullets: ["15 séances complètes, soit 60 photos", "Quatre images liées par séance", "15 reprises photo individuelles incluses", "Livraison sous 30 minutes · 39 $ une seule fois"],
    problemIntro: "La plupart des hommes ont déjà beaucoup de photos. Le problème est qu'elles montrent souvent le même angle, la même pièce ou des périodes très différentes de leur vie. Il devient alors difficile de construire un profil " + app + " actuel, naturel et visuellement complet, surtout quand l'attention se décide en quelques secondes.",
    problems: [
      { title: "Ton meilleur portrait récent reste un selfie", body: "Un selfie net peut montrer ton visage, mais il ne donne presque jamais le décor, la posture et la distance d'un vrai moment photographié. Le profil finit par manquer de relief." },
      { title: "Le reste de ta galerie se répète", body: "Changer légèrement l'angle ne crée pas une nouvelle information. Une sélection plus utile alterne les environnements, les tenues, l'énergie et les compositions tout en restant cohérente." },
      { title: "Les images IA isolées ne racontent pas la même vie", body: "Quand le visage, le corps ou le style changent sans logique, la galerie paraît assemblée. UnrealShot relie quatre images à l'intérieur de chaque séance pour garder une scène crédible." },
    ],
    solutionIntro: "UnrealShot transforme un petit ensemble de références récentes en un véritable stock de photos prêtes pour " + app + ". Les 15 idées explorent des décors, activités, tenues et ambiances différentes ; les quatre images d'une même séance restent liées pour que tu puisses choisir le meilleur cadrage sans perdre la continuité.",
    differentiators: [
      { title: "Chaque séance suit une même histoire visuelle", body: "Le décor, la tenue et la lumière restent stables à l'intérieur d'une idée. Les changements de cadrage, de posture et d'expression ressemblent à des instants capturés pendant la même séance." },
      { title: "Quinze idées apportent une vraie amplitude", body: "Ta livraison peut passer d'un moment quotidien à une scène plus active ou plus habillée. Les exemples du site montrent des directions possibles ; tes propres selfies et réponses orientent la livraison." },
      { title: "Tes centres d'intérêt donnent une direction personnelle", body: "Les réponses que tu donnes servent de contexte pour imaginer des décors et des actions qui te ressemblent. Un intérêt réel peut nourrir plusieurs scènes au lieu d'être réduit à une image prédéfinie." },
      { title: "Tes selfies récents gardent la ressemblance au centre", body: "Quatre à six références récentes guident les traits reconnaissables sur toute la livraison. Les 15 reprises photo permettent de refaire une image forte quand un détail mérite une nouvelle version." },
    ],
    deliveryPoints: [
      { title: "15 idées de séances créées pour ta livraison", body: "Chaque livraison combine décor, style, activité, lumière et ambiance de façon différente. Les possibilités ne se limitent pas aux quelques exemples affichés sur le site." },
      { title: "Quatre photos liées pour chaque idée", body: "Chaque séance produit quatre variations naturelles d'un même moment. L'histoire visuelle reste cohérente tandis que le cadrage, la posture et l'expression changent." },
      { title: "Une ressemblance suivie sur les 60 photos", body: "Tes selfies récents restent la référence visuelle de toute la génération, afin que l'ensemble ressemble à une seule personne actuelle : toi." },
    ],
    sections: [
      { heading: "Un profil " + app + " est plus convaincant quand les photos se répondent", paragraphs: ["On découvre ton profil comme celui d'une seule personne, pas comme une suite de fichiers indépendants. De gros écarts de visage, d'âge, de silhouette ou de finition créent un doute, même si chaque image est jolie seule.", "UnrealShot conserve aussi la cohérence à l'intérieur de chaque séance. Quatre photos partagent le même décor, la même tenue et la même lumière : tu obtiens des choix, sans donner l'impression de juxtaposer des générations sans rapport."] },
      { heading: "De la ressemblance actuelle à une variété vraiment utile", paragraphs: ["La ressemblance est guidée par tes selfies récents ; la variété vient des 15 idées de séances, des activités, des cadrages et des expressions. Cette combinaison permet de montrer plusieurs facettes sans fabriquer une nouvelle identité.", "La règle est simple : le résultat doit encore te ressembler aujourd'hui. Une reprise photo est utile lorsqu'une image a la bonne idée mais qu'un détail du visage, de l'expression ou de la composition doit être amélioré."] },
      { heading: "Préparer les références et recevoir 60 photos terminées", paragraphs: ["Envoie 4 à 6 selfies solo récents, avec un visage visible sous plusieurs angles et une lumière ordinaire. Réponds ensuite à trois courtes questions sur le style et les intérêts qui te correspondent vraiment.", "UnrealShot crée 15 idées, puis quatre photos liées pour chacune. La livraison arrive sous 30 minutes ; les 15 reprises individuelles permettent de retravailler une photo sans recommencer tout le projet."], bullets: ["Paiement unique : 39 $", "Aucun abonnement", "15 séances cohérentes", "60 photos au total", "15 reprises photo individuelles"] },
    ],
    exampleSlugs: app === "Tinder" ? ["outdoor-coffee", "city-walk", "gym-training", "dinner"] : app === "Hinge" ? ["home-cooking", "outdoor-coffee", "coastal-travel", "dinner"] : ["gym-training", "city-walk", "outdoor-coffee", "rooftop"],
    policy: [v.requirement, v.trustNote, "Utilise uniquement des images qui représentent honnêtement ton apparence actuelle et tes intérêts réels, puis vérifie les règles officielles de " + app + " avant de publier."],
    faqs: [
      { question: "Que sont les photos " + app + " générées par IA ?", answer: "Ce sont des photos de profil créées à partir de selfies de référence récents. UnrealShot imagine plusieurs séances, puis produit quatre images liées par idée pour comparer cadrages et expressions." },
      { question: "Comment mes idées de séances " + app + " sont-elles créées ?", answer: "Tes selfies actuels et trois réponses courtes donnent le contexte. UnrealShot génère 15 idées différentes ; les exemples du site montrent donc des directions possibles, pas un catalogue fermé." },
      { question: "Combien de photos UnrealShot crée-t-il pour " + app + " ?", answer: "Une commande à 39 $ comprend 15 séances de quatre photos, soit 60 images, ainsi que 15 reprises photo individuelles." },
      { question: "Comment garder une apparence qui me ressemble ?", answer: "Tes 4 à 6 selfies récents guident la ressemblance de toute la livraison. Compare les images à ton apparence actuelle et demande une reprise lorsqu'un détail important n'est pas juste." },
      { question: "Les photos IA sont-elles autorisées sur " + app + " ?", answer: v.trustNote + " Consulte toujours les règles en vigueur dans ton pays et garde des photos récentes qui ancrent ton profil dans la réalité." },
      { question: "Puis-je améliorer une seule photo ?", answer: "Oui. Les 15 reprises photo individuelles sont prévues pour refaire une image dont l'idée fonctionne mais dont le visage, l'expression ou le cadrage mérite un autre essai." },
    ],
  }),
  guide: (app: LocalizedPlatformApp, v) => ({
    eyebrow: "Guide des photos " + app + " pour hommes",
    title: "Photos " + app + " : construire une sélection claire, variée et crédible",
    description: "Un guide pratique des photos " + app + " : première image, ordre du profil, cadrages, scènes d'activité, erreurs fréquentes, usage responsable de l'IA et règles actuelles.",
    answer: "Une bonne sélection " + app + " commence par " + v.firstPhoto + ", puis ajoute des informations différentes : silhouette, activité, tenue et moment de vie. Chaque image suivante doit répondre à une nouvelle question. Vérifie les cadrages sur téléphone, reste fidèle à ton apparence actuelle et utilise les images IA pour combler un manque réel, pas pour inventer une vie plus impressionnante.",
    quickFacts: [["Rôle de la première photo", "Être reconnu immédiatement"], ["Variété utile", "Visage, silhouette, activité, contexte"], ["Point à vérifier", v.requirement], ["Fonction particulière", v.specialFeature]],
    sections: [
      { heading: "La première photo doit rendre l'identification évidente", paragraphs: ["Commence par " + v.firstPhoto + ". Les yeux doivent être visibles, la lumière lisible et le visage assez grand pour résister au recadrage de l'application. La simplicité aide davantage qu'un décor spectaculaire.", "Ne demande pas à cette image de montrer toute ta personnalité. Sa première mission est la clarté ; les activités, les tenues et les moments plus spontanés viennent ensuite."] },
      { heading: "Donner un rôle différent à chaque emplacement", paragraphs: ["Construis d'abord une base avec un portrait solo, une photo en pied, une activité authentique, une tenue différente et un moment plus détendu. Si tu as moins de bonnes images, garde moins d'emplacements plutôt que plusieurs doublons.", "Une photo supplémentaire doit apporter une information nouvelle. Deux portraits pris dans la même pièce et avec la même tenue n'occupent pas vraiment deux rôles."] , bullets: ["Portrait solo lisible", "Photo en pied du quotidien", "Activité réellement pratiquée", "Contraste de tenue ou de moment", "Cliché détendu et actuel"] },
      { heading: "Choisir une photo en pied qui reste humaine", paragraphs: ["Une photo en pied montre la silhouette, la posture et le style de tous les jours. Évite de devenir minuscule dans un paysage ou de couper les chevilles, les genoux ou le haut de la tête.", "Marcher, s'appuyer naturellement ou s'arrêter dans un lieu familier fonctionne souvent mieux qu'une pose raide. Le lieu doit soutenir la photo, pas voler toute l'attention."] },
      { heading: "Montrer une activité vraie avant de chercher l'effet", paragraphs: ["Une scène de cuisine, de sport, de café, de lecture ou de balade n'est utile que si tu pourrais en parler simplement. Le détail concret crée une accroche plus solide qu'un décor luxueux choisi uniquement parce qu'il semble impressionnant.", "Les accessoires ne doivent pas fabriquer une identité. Un intérêt ordinaire mais sincère vaut mieux qu'une aventure, un animal ou un passe-temps que le reste du profil ne peut pas confirmer."] },
      { heading: "Tester les recadrages sur un vrai téléphone", paragraphs: ["Regarde chaque candidate à la taille où elle sera réellement vue. Le visage et l'action doivent rester lisibles après la coupe de l'interface. Garde un peu d'espace autour du sujet sans choisir une image tellement large que tu deviens insignifiant.", "Repère les détails qui attirent l'œil au mauvais endroit : main coupée, chaussure tronquée, autre personne dans le bord de l'image ou panneau très lumineux. Une photo nette peut tout de même être mauvaise après recadrage."] , bullets: ["Prévisualiser les formats carré et portrait", "Garder les yeux loin du bord supérieur", "Placer l'action principale dans la zone centrale", "Vérifier les textes et reflets en arrière-plan", "Contrôler la netteté après mise en ligne"] },
      { heading: "Utiliser les photos IA comme complément, pas comme déguisement", paragraphs: ["Une image générée peut combler un vrai manque : une photo en pied nette, une tenue différente ou une scène quotidienne difficile à photographier. Elle ne doit pas remplacer toutes les preuves réelles de ta vie.", "Compare chaque candidate à tes photos actuelles. Écarte-la si la forme du visage, l'âge, les cheveux, la silhouette ou un détail de peau cessent de te ressembler. Garde aussi des photos réelles récentes."] },
      { heading: "Comprendre les règles propres à " + app, paragraphs: [v.requirement, v.trustNote, "Ces règles peuvent évoluer et une image générée ne garantit ni validation ni vérification. Publie uniquement des photos fidèles à ta réalité et relis les sources officielles avant de finaliser ton profil."] },
      { heading: "Les erreurs qui affaiblissent le plus un profil", paragraphs: ["Les doublons sont le problème le plus visible : plusieurs selfies, plusieurs miroirs de salle de sport ou plusieurs photos avec la même tenue. S'y ajoutent un visage difficile à voir, des images anciennes et des activités qui semblent mises en scène.", "Fais l'audit au niveau de la sélection. Écris en une phrase le rôle de chaque image. Si deux phrases sont identiques, garde la version la plus claire et utilise l'espace restant pour montrer quelque chose de vrai."] , bullets: ["Première image peu lisible", "Plusieurs photos presque identiques", "Aucune photo en pied", "Apparence datée ou incohérente", "Filtres et retouches trop visibles", "Centre d'intérêt inventé"] },
    ],
    checklist: ["Mon visage est dégagé sur la première photo", "La première image correspond à mon apparence actuelle", "Une photo montre ma silhouette en entier", "Au moins une activité est réellement la mienne", "Les tenues et les lieux varient", "Aucune image ne répète exactement le même rôle", "Les images IA ressemblent aux photos de mon téléphone", "J'ai vérifié chaque recadrage sur un téléphone", "Aucune image ne suggère un faux voyage ou loisir", "J'ai relu les règles actuelles de " + app],
    faqs: [
      { question: "Quelle doit être la première photo sur " + app + " ?", answer: "Choisis " + v.firstPhoto + ". La reconnaissance compte davantage qu'un décor impressionnant ou qu'une pose compliquée." },
      { question: "Faut-il une photo en pied ?", answer: "Oui, elle apporte des informations sur la silhouette, la posture et le style quotidien. Garde toutefois le visage identifiable et évite le personnage minuscule au milieu d'un paysage." },
      { question: "Peut-on utiliser des photos générées par IA ?", answer: v.trustNote + " Utilise uniquement des images fidèles, conserve des photos récentes prises dans la vraie vie et vérifie les règles de la plateforme." },
      { question: "Comment choisir l'ordre des photos ?", answer: "Commence par l'image la plus claire de ton visage, puis ajoute à chaque étape une information nouvelle : silhouette, activité, tenue, expression ou moment réel." },
      { question: "Combien de photos faut-il publier ?", answer: v.requirement + " Utilise les emplacements disponibles pour des rôles différents plutôt que pour remplir une galerie avec des doublons." },
    ],
  }),
  guideLabel: (app) => "Lire le guide complet des photos " + app,
  productLabel: (app) => "Créer une sélection complète de photos " + app,
}

export const frPlatformPages = buildLocalizedPlatformPages(fr)
