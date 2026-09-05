import type { PublishedPublicLocale } from "@/i18n/config"

export type ExampleProfileGap = {
  problem: string
  solution: string
  label: string
  href: string
}

export type ExampleShootDetails = {
  name: string
  answer: string
  profileFit: string
  pairing: string
}

export type ExamplesPageCopy = {
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  seeStructure: string
  openerCaption: string
  profileEyebrow: string
  profileHeading: string
  profileDescription: string
  profileGaps: ExampleProfileGap[]
  outputsEyebrow: string
  outputsHeading: string
  outputsDescription: string
  directionLabel: string
  exampleSuffix: string
  whereFits: string
  besideIt: string
  seeStructureFor: string
  beforeEyebrow: string
  beforeHeading: string
  beforeDescription: string
  howGenerationWorks: string
  createPhotos: string
  shoots: Record<string, ExampleShootDetails>
}

const en: ExamplesPageCopy = {
  eyebrow: "Dating photo examples",
  title: "See the kind of dating-photo results UnrealShot can create",
  description: "These examples demonstrate possible creative directions and the four-frame structure used inside a delivery. They are not a catalog of presets, and you cannot select or guarantee these exact scenes. UnrealShot generates varied shoot ideas from your references and intake.",
  bullets: ["Every image is labeled AI-generated", "Each example shows four related framing options", "The concepts illustrate possible results—not scenes to order"],
  seeStructure: "See how the results are structured",
  openerCaption: "AI-generated outdoor coffee example · one setting, outfit and lighting setup",
  profileEyebrow: "Start with your current profile",
  profileHeading: "See how different outputs can fill different profile gaps",
  profileDescription: "The examples below help you understand the roles a generated delivery can cover. They do not represent an order form or promise that the named concepts will appear in your results.",
  profileGaps: [
    { problem: "I need a clear, approachable first photo", solution: "Start with an everyday setting where your face remains the focus.", label: "See an approachable-output example", href: "#outdoor-coffee" },
    { problem: "My profile has no useful full-length photo", solution: "Use movement and an ordinary outfit instead of a stiff standing pose.", label: "See a full-length-output example", href: "#city-walk" },
    { problem: "My photos do not show what I actually enjoy", solution: "Choose an activity you genuinely do, then use one frame as a conversation starter.", label: "See an activity-output example", href: "#home-cooking" },
    { problem: "Everything in my camera roll looks too casual", solution: "Add one polished evening photo without turning the whole profile into a formal shoot.", label: "See a dressed-up-output example", href: "#dinner" },
  ],
  outputsEyebrow: "Illustrative outputs",
  outputsHeading: "See how one generated idea becomes four related options",
  outputsDescription: "Each row demonstrates one possible idea and four framing alternatives from it. The named concepts are examples only. Your order receives newly generated ideas shaped by your intake, not these exact presets.",
  directionLabel: "Illustrative creative direction",
  exampleSuffix: "example",
  whereFits: "Where it fits",
  besideIt: "What to use beside it",
  seeStructureFor: "See how this illustrative example is structured",
  beforeEyebrow: "Before you use a generated photo",
  beforeHeading: "Use the frame that still looks and feels like you",
  beforeDescription: "Your results depend on your reference selfies and intake. Review the ideas UnrealShot generates and remove any frame that changes your appearance or suggests an interest you do not have. A Photo Retake can correct an individual miss, but UnrealShot does not promise perfect likeness, app verification, matches or dates.",
  howGenerationWorks: "See how generation works",
  createPhotos: "Create photos for my profile",
  shoots: {
    "gym-training": { name: "Gym training", answer: "A gym shoot contributes energy, routine and a clear real-life interest without relying on a mirror selfie. These four frames keep the same training environment and clothing while changing crop and expression. It suits men who actually exercise and works best as one activity image inside a more varied dating profile.", profileFit: "Use the close frame after a simpler opener or the half-body frame as the main activity image.", pairing: "Pair it with an outdoor coffee or dressed-up dinner photo so fitness does not become the whole profile." },
    "outdoor-coffee": { name: "Outdoor coffee", answer: "An outdoor coffee shoot adds an easy, low-pressure picture of everyday life. The four frames share one café setting and outfit, moving from a clear portrait to wider context and a natural reaction. It is useful for men who genuinely enjoy cafés and want an approachable image rather than another posed portrait.", profileFit: "The close or candid frame can work early in a lineup because the setting is familiar and the face stays clear.", pairing: "Pair it with a full-length city walk or a more intentional dinner photo for contrast." },
    dinner: { name: "Dinner", answer: "A dinner shoot shows evening style and how you might look in a social date setting. Its warm light and smart-casual clothing add polish, while the four related crops keep the result grounded in one believable meal. It belongs beside more casual daylight photos, not as an entire profile of restaurant portraits.", profileFit: "Use one dinner frame in the middle of the lineup to show how you present in an evening setting.", pairing: "Pair it with daylight activity and outdoor images so the profile does not feel staged or overly formal." },
    "city-walk": { name: "City walk", answer: "A city-walk shoot adds movement, full-length context and everyday clothing to a profile. Instead of four poses against unrelated backgrounds, it follows one short walk through the same street and light. It works well for men who want to show style and an active urban routine without making the photo feel like a fashion campaign.", profileFit: "The full-length frame is especially useful in slot two or three when your opener is a closer portrait.", pairing: "Pair it with a home-cooking or gym photo that reveals a more specific interest." },
    "coastal-travel": { name: "Coastal travel", answer: "A coastal-travel shoot adds open space and a sense of movement while keeping your face visible. The related frames use one shoreline, outfit and light so the landscape supports the portrait instead of replacing it. Use it only when travel or time outdoors is a genuine part of your life.", profileFit: "A wider coastal frame can add visual variety after a clear opener and a more everyday activity photo.", pairing: "Pair it with an ordinary city, coffee or home image to keep the profile grounded." },
    "home-cooking": { name: "Home cooking", answer: "A home-cooking shoot gives an everyday interest a visual form without turning it into a staged food advertisement. Across four frames, the kitchen, clothing and light stay connected while the action and distance change. It works best for men who really cook and want an easy conversation detail.", profileFit: "Use a close or half-body frame after your opener to add warmth and a specific personal interest.", pairing: "Pair it with a city walk or coastal frame so the lineup has movement and outdoor range." },
    rooftop: { name: "Rooftop", answer: "A rooftop shoot offers a polished urban setting while keeping the visual story relaxed and believable. The four frames vary the crop and expression without turning the setting into a generic luxury signal. It can add an evening or city view when that kind of place fits your real routine.", profileFit: "A rooftop frame can fill a dressed-up or social-context slot later in the lineup.", pairing: "Pair it with a daylight portrait and a genuine activity photo for a more balanced profile." },
  },
}

const fr: ExamplesPageCopy = {
  eyebrow: "Exemples de photos de rencontre",
  title: "Découvrez le type de résultats de rencontre qu’UnrealShot peut créer",
  description: "Ces exemples présentent des directions créatives possibles et la structure de quatre images utilisée dans une livraison. Ils ne constituent pas un catalogue de préréglages : vous ne pouvez pas choisir ni garantir ces scènes exactes. UnrealShot génère des idées variées à partir de vos références et de votre questionnaire.",
  bullets: ["Chaque image est signalée comme générée par IA", "Chaque exemple montre quatre cadrages liés", "Les concepts illustrent des résultats possibles, pas des scènes à commander"],
  seeStructure: "Voir comment les résultats sont structurés",
  openerCaption: "Exemple de café en extérieur généré par IA · un lieu, une tenue et une lumière",
  profileEyebrow: "Partez de votre profil actuel",
  profileHeading: "Découvrez comment différents résultats peuvent combler différents manques",
  profileDescription: "Les exemples ci-dessous vous aident à comprendre les rôles qu’une livraison générée peut remplir. Ils ne constituent pas un formulaire de commande et ne promettent pas que ces concepts apparaîtront dans vos résultats.",
  profileGaps: [
    { problem: "Il me faut une première photo claire et accessible", solution: "Commencez dans un cadre du quotidien où votre visage reste le point central.", label: "Voir un exemple accessible", href: "#outdoor-coffee" },
    { problem: "Mon profil n’a pas de photo utile en pied", solution: "Utilisez le mouvement et une tenue ordinaire plutôt qu’une pose raide debout.", label: "Voir un exemple en pied", href: "#city-walk" },
    { problem: "Mes photos ne montrent pas ce que j’aime vraiment", solution: "Choisissez une activité que vous pratiquez réellement et faites-en un sujet de conversation.", label: "Voir un exemple d’activité", href: "#home-cooking" },
    { problem: "Toutes les photos de ma galerie sont trop décontractées", solution: "Ajoutez une photo du soir plus soignée sans transformer le profil en séance formelle.", label: "Voir un exemple habillé", href: "#dinner" },
  ],
  outputsEyebrow: "Résultats illustratifs",
  outputsHeading: "Voyez comment une idée générée devient quatre options liées",
  outputsDescription: "Chaque ligne présente une idée possible et quatre variantes de cadrage. Les concepts nommés sont uniquement des exemples. Votre commande reçoit de nouvelles idées guidées par votre questionnaire, pas ces préréglages exacts.",
  directionLabel: "Direction créative illustrative",
  exampleSuffix: "exemple",
  whereFits: "Où l’utiliser",
  besideIt: "Quelle photo lui associer",
  seeStructureFor: "Voir la structure de cet exemple illustratif",
  beforeEyebrow: "Avant d’utiliser une photo générée",
  beforeHeading: "Choisissez l’image qui vous ressemble encore",
  beforeDescription: "Vos résultats dépendent de vos selfies de référence et de vos réponses. Examinez les idées générées par UnrealShot et retirez toute image qui modifie votre apparence ou suggère un intérêt que vous n’avez pas. Une reprise photo peut corriger une erreur individuelle, mais UnrealShot ne promet ni ressemblance parfaite, ni vérification, ni rencontres, ni rendez-vous.",
  howGenerationWorks: "Voir comment fonctionne la génération",
  createPhotos: "Créer des photos pour mon profil",
  shoots: {
    "gym-training": { name: "Entraînement en salle", answer: "Une séance en salle apporte énergie, routine et intérêt réel sans s’appuyer sur un selfie dans un miroir. Les quatre images gardent le même espace et la même tenue tout en variant le cadrage et l’expression. Elle convient aux hommes qui s’entraînent réellement et s’utilise comme une photo d’activité parmi d’autres.", profileFit: "Utilisez le cadrage rapproché après une ouverture plus simple, ou le cadrage buste comme image d’activité principale.", pairing: "Associez-le à un café en extérieur ou à un dîner plus habillé pour que le sport ne prenne pas toute la place." },
    "outdoor-coffee": { name: "Café en extérieur", answer: "Une séance autour d’un café en extérieur ajoute une image simple et accessible du quotidien. Les quatre images partagent le même café et la même tenue, du portrait clair au contexte plus large et à la réaction naturelle. Elle convient aux hommes qui aiment vraiment les cafés et veulent une image abordable plutôt qu’un portrait posé.", profileFit: "Le cadrage rapproché ou spontané peut apparaître tôt dans la sélection : le lieu est familier et le visage reste lisible.", pairing: "Associez-le à une promenade en ville en pied ou à une photo de dîner plus intentionnelle pour créer du contraste." },
    dinner: { name: "Dîner", answer: "Une séance au dîner montre votre style du soir et votre allure dans un contexte social. La lumière chaude et la tenue chic-décontractée apportent du relief, tandis que les quatre cadrages liés restent ancrés dans un repas plausible. Elle accompagne des photos de jour plus décontractées, plutôt que de remplir tout le profil de portraits au restaurant.", profileFit: "Utilisez une image du dîner au milieu de la sélection pour montrer votre allure dans un contexte du soir.", pairing: "Associez-la à des photos d’activité et d’extérieur prises de jour pour éviter un profil trop mis en scène." },
    "city-walk": { name: "Promenade en ville", answer: "Une promenade en ville apporte mouvement, contexte en pied et tenue quotidienne. Au lieu de quatre poses sur des décors sans rapport, elle suit une courte marche dans la même rue et la même lumière. Elle convient aux hommes qui veulent montrer leur style et une routine urbaine active sans donner l’impression d’une campagne de mode.", profileFit: "Le cadrage en pied est particulièrement utile en deuxième ou troisième position si l’ouverture est un portrait rapproché.", pairing: "Associez-le à une photo de cuisine maison ou de salle de sport pour révéler un intérêt plus précis." },
    "coastal-travel": { name: "Voyage sur la côte", answer: "Une séance au bord de la mer apporte de l’espace et du mouvement tout en gardant le visage visible. Les images liées utilisent le même rivage, la même tenue et la même lumière pour que le paysage accompagne le portrait au lieu de le remplacer. Utilisez-la seulement si les voyages ou le plein air font réellement partie de votre vie.", profileFit: "Une image plus large du littoral peut varier la sélection après une ouverture claire et une activité quotidienne.", pairing: "Associez-la à une photo ordinaire de ville, de café ou de cuisine pour garder un profil ancré." },
    "home-cooking": { name: "Cuisine maison", answer: "Une séance de cuisine maison donne une forme visuelle à un intérêt quotidien sans devenir une publicité culinaire posée. Sur quatre images, la cuisine, la tenue et la lumière restent liées tandis que l’action et la distance changent. Elle convient aux hommes qui cuisinent vraiment et veulent offrir un détail facile à commenter.", profileFit: "Utilisez un cadrage rapproché ou buste après l’ouverture pour ajouter de la chaleur et un intérêt personnel concret.", pairing: "Associez-la à une promenade en ville ou à une image côtière pour apporter mouvement et extérieur." },
    rooftop: { name: "Toit-terrasse", answer: "Une séance sur un toit-terrasse offre un décor urbain soigné tout en gardant une histoire visuelle détendue et crédible. Les quatre images varient le cadrage et l’expression sans transformer le lieu en simple signal de luxe. Elle peut apporter une vue de ville ou une ambiance du soir lorsque ce type d’endroit correspond réellement à votre quotidien.", profileFit: "Une image sur un toit-terrasse peut remplir une place habillée ou sociale plus loin dans la sélection.", pairing: "Associez-la à un portrait de jour et à une activité réelle pour équilibrer le profil." },
  },
}

const es: ExamplesPageCopy = {
  eyebrow: "Ejemplos de fotos para citas",
  title: "Mira el tipo de resultados de citas que puede crear UnrealShot",
  description: "Estos ejemplos muestran posibles direcciones creativas y la estructura de cuatro encuadres que se usa en una entrega. No son un catálogo de ajustes: no puedes seleccionar ni garantizar estas escenas exactas. UnrealShot genera ideas variadas a partir de tus referencias y respuestas.",
  bullets: ["Cada imagen está marcada como generada por IA", "Cada ejemplo muestra cuatro encuadres relacionados", "Los conceptos ilustran resultados posibles, no escenas que se puedan pedir"],
  seeStructure: "Mira cómo se estructuran los resultados",
  openerCaption: "Ejemplo de café al aire libre generado por IA · un lugar, un conjunto y una luz",
  profileEyebrow: "Empieza con tu perfil actual",
  profileHeading: "Mira cómo distintos resultados pueden cubrir distintos huecos del perfil",
  profileDescription: "Los ejemplos te ayudan a entender qué funciones puede cubrir una entrega generada. No son un formulario de pedido ni prometen que esos conceptos aparezcan en tus resultados.",
  profileGaps: [
    { problem: "Necesito una primera foto clara y cercana", solution: "Empieza en un entorno cotidiano donde tu cara siga siendo el centro.", label: "Ver un ejemplo cercano", href: "#outdoor-coffee" },
    { problem: "Mi perfil no tiene una foto útil de cuerpo entero", solution: "Usa movimiento y ropa normal en lugar de una pose rígida de pie.", label: "Ver un ejemplo de cuerpo entero", href: "#city-walk" },
    { problem: "Mis fotos no muestran lo que realmente me gusta", solution: "Elige una actividad que hagas de verdad y úsala como tema de conversación.", label: "Ver un ejemplo de actividad", href: "#home-cooking" },
    { problem: "Todas las fotos de mi carrete son demasiado informales", solution: "Añade una foto de noche más cuidada sin convertir todo el perfil en una sesión formal.", label: "Ver un ejemplo arreglado", href: "#dinner" },
  ],
  outputsEyebrow: "Resultados ilustrativos",
  outputsHeading: "Mira cómo una idea generada se convierte en cuatro opciones relacionadas",
  outputsDescription: "Cada fila muestra una idea posible y cuatro variaciones de encuadre. Los conceptos son solo ejemplos. Tu pedido recibe ideas nuevas creadas a partir de tus respuestas, no estos ajustes exactos.",
  directionLabel: "Dirección creativa ilustrativa",
  exampleSuffix: "ejemplo",
  whereFits: "Dónde encaja",
  besideIt: "Qué usar junto a ella",
  seeStructureFor: "Ver cómo se estructura este ejemplo ilustrativo",
  beforeEyebrow: "Antes de usar una foto generada",
  beforeHeading: "Usa el encuadre que todavía se parece y se siente como tú",
  beforeDescription: "Tus resultados dependen de tus selfies de referencia y tus respuestas. Revisa las ideas que genera UnrealShot y elimina cualquier imagen que cambie tu aspecto o sugiera un interés que no tienes. Una repetición puede corregir un fallo individual, pero UnrealShot no promete parecido perfecto, verificación, matches ni citas.",
  howGenerationWorks: "Ver cómo funciona la generación",
  createPhotos: "Crear fotos para mi perfil",
  shoots: {
    "gym-training": { name: "Entrenamiento en gimnasio", answer: "Una sesión de gimnasio aporta energía, rutina y un interés real sin depender de un selfie frente al espejo. Los cuatro encuadres mantienen el mismo espacio y ropa mientras cambian el recorte y la expresión. Es adecuada para hombres que entrenan de verdad y funciona como una foto de actividad dentro de un perfil variado.", profileFit: "Usa el encuadre cercano después de una apertura sencilla o el de medio cuerpo como imagen principal de actividad.", pairing: "Combínala con una foto de café al aire libre o de una cena arreglada para que el deporte no sea todo el perfil." },
    "outdoor-coffee": { name: "Café al aire libre", answer: "Una sesión tomando café al aire libre añade una imagen cotidiana, sencilla y cercana. Los cuatro encuadres comparten el mismo café y la misma ropa, desde un retrato claro hasta un contexto más amplio y una reacción natural. Es útil para hombres que realmente disfrutan de los cafés y quieren una imagen accesible, no otro retrato posado.", profileFit: "El encuadre cercano o espontáneo puede aparecer al principio porque el entorno es familiar y la cara se ve bien.", pairing: "Combínala con una caminata urbana de cuerpo entero o una foto de cena más intencional para crear contraste." },
    dinner: { name: "Cena", answer: "Una sesión de cena muestra tu estilo nocturno y cómo podrías verte en un contexto social. La luz cálida y la ropa informal arreglada aportan variedad, mientras los cuatro encuadres relacionados mantienen una comida creíble. Debe acompañar fotos diurnas más casuales, no llenar el perfil de retratos de restaurante.", profileFit: "Usa una foto de cena en la parte central de la selección para mostrar cómo te presentas por la noche.", pairing: "Combínala con fotos de actividad y exteriores durante el día para que el perfil no parezca demasiado preparado." },
    "city-walk": { name: "Paseo por la ciudad", answer: "Una sesión caminando por la ciudad aporta movimiento, contexto de cuerpo entero y ropa cotidiana. En lugar de cuatro poses con fondos sin relación, sigue un paseo corto por la misma calle y luz. Funciona para hombres que quieren mostrar estilo y una rutina urbana activa sin parecer una campaña de moda.", profileFit: "El encuadre de cuerpo entero es especialmente útil en la segunda o tercera posición cuando la apertura es un retrato cercano.", pairing: "Combínala con una foto cocinando en casa o de gimnasio que revele un interés más concreto." },
    "coastal-travel": { name: "Viaje por la costa", answer: "Una sesión costera aporta espacio abierto y movimiento mientras mantiene la cara visible. Los encuadres relacionados usan la misma costa, ropa y luz para que el paisaje acompañe al retrato en lugar de sustituirlo. Úsala solo si viajar o pasar tiempo al aire libre forma parte de tu vida real.", profileFit: "Una imagen costera más amplia puede añadir variedad después de una apertura clara y una actividad cotidiana.", pairing: "Combínala con una imagen normal de ciudad, café o cocina para mantener el perfil conectado con el día a día." },
    "home-cooking": { name: "Cocina en casa", answer: "Una sesión cocinando en casa da forma visual a un interés cotidiano sin convertirlo en un anuncio de comida. En las cuatro imágenes, la cocina, la ropa y la luz siguen conectadas mientras cambian la acción y la distancia. Es ideal para hombres que cocinan de verdad y quieren ofrecer un detalle fácil de comentar.", profileFit: "Usa un encuadre cercano o de medio cuerpo después de la apertura para añadir calidez y un interés personal concreto.", pairing: "Combínala con una imagen de ciudad o de costa para aportar movimiento y variedad exterior." },
    rooftop: { name: "Azotea", answer: "Una sesión en una azotea ofrece un entorno urbano cuidado sin perder una historia visual relajada y creíble. Los cuatro encuadres cambian la distancia y la expresión sin convertir el lugar en una señal de lujo genérica. Puede aportar una escena nocturna o urbana cuando ese tipo de lugar encaja con tu vida real.", profileFit: "Una imagen en la azotea puede ocupar un espacio arreglado o social más adelante en la selección.", pairing: "Combínala con un retrato diurno y una actividad auténtica para equilibrar el perfil." },
  },
}

const de: ExamplesPageCopy = {
  eyebrow: "Beispiele für Dating-Fotos",
  title: "Sieh, welche Dating-Fotoergebnisse UnrealShot erstellen kann",
  description: "Diese Beispiele zeigen mögliche kreative Richtungen und die Struktur aus vier Aufnahmen, die in einer Lieferung verwendet wird. Sie sind kein Preset-Katalog: Diese exakten Szenen können weder ausgewählt noch garantiert werden. UnrealShot erzeugt abwechslungsreiche Ideen aus deinen Referenzen und Angaben.",
  bullets: ["Jedes Bild ist als KI-generiert gekennzeichnet", "Jedes Beispiel zeigt vier zusammenhängende Bildausschnitte", "Die Konzepte zeigen mögliche Ergebnisse, keine bestellbaren Szenen"],
  seeStructure: "So sind die Ergebnisse aufgebaut",
  openerCaption: "KI-generiertes Beispiel mit Café im Freien · ein Ort, ein Outfit und eine Lichtstimmung",
  profileEyebrow: "Starte mit deinem aktuellen Profil",
  profileHeading: "Sieh, wie unterschiedliche Ergebnisse verschiedene Lücken im Profil füllen können",
  profileDescription: "Die folgenden Beispiele zeigen, welche Aufgaben eine generierte Lieferung abdecken kann. Sie sind kein Bestellformular und versprechen nicht, dass die genannten Konzepte in deinen Ergebnissen erscheinen.",
  profileGaps: [
    { problem: "Ich brauche ein klares, sympathisches erstes Foto", solution: "Beginne in einer Alltagssituation, in der dein Gesicht im Mittelpunkt bleibt.", label: "Sympathisches Beispiel ansehen", href: "#outdoor-coffee" },
    { problem: "Mein Profil hat kein brauchbares Ganzkörperfoto", solution: "Nutze Bewegung und normale Kleidung statt einer steifen stehenden Pose.", label: "Ganzkörperbeispiel ansehen", href: "#city-walk" },
    { problem: "Meine Fotos zeigen nicht, was ich wirklich gern mache", solution: "Wähle eine Aktivität, die du tatsächlich machst, und nutze ein Bild als Gesprächseinstieg.", label: "Aktivitätsbeispiel ansehen", href: "#home-cooking" },
    { problem: "Alle Fotos aus meiner Galerie wirken zu lässig", solution: "Ergänze ein gepflegtes Abendfoto, ohne das ganze Profil zur formellen Session zu machen.", label: "Gepflegtes Beispiel ansehen", href: "#dinner" },
  ],
  outputsEyebrow: "Illustrative Ergebnisse",
  outputsHeading: "So wird aus einer generierten Idee eine Auswahl aus vier verbundenen Bildern",
  outputsDescription: "Jede Reihe zeigt eine mögliche Idee und vier Varianten des Bildausschnitts. Die genannten Konzepte sind nur Beispiele. Deine Bestellung erhält neue, von deinen Angaben geprägte Ideen und nicht diese exakten Presets.",
  directionLabel: "Illustrative kreative Richtung",
  exampleSuffix: "Beispiel",
  whereFits: "Wofür es passt",
  besideIt: "Was daneben passt",
  seeStructureFor: "Die Struktur dieses illustrativen Beispiels ansehen",
  beforeEyebrow: "Bevor du ein generiertes Foto verwendest",
  beforeHeading: "Verwende die Aufnahme, die noch nach dir aussieht und sich nach dir anfühlt",
  beforeDescription: "Deine Ergebnisse hängen von deinen Referenz-Selfies und Angaben ab. Prüfe die von UnrealShot erzeugten Ideen und entferne jedes Bild, das dein Aussehen verändert oder ein Interesse andeutet, das du nicht hast. Eine Foto-Neuerstellung kann einen einzelnen Fehler korrigieren, aber UnrealShot verspricht keine perfekte Ähnlichkeit, Verifizierung, Matches oder Dates.",
  howGenerationWorks: "So funktioniert die Generierung",
  createPhotos: "Fotos für mein Profil erstellen",
  shoots: {
    "gym-training": { name: "Training im Fitnessstudio", answer: "Ein Fitnessstudio-Shooting bringt Energie, Routine und ein echtes Interesse ins Profil, ohne auf ein Spiegel-Selfie angewiesen zu sein. Die vier Aufnahmen behalten Trainingsumgebung und Kleidung bei und ändern Ausschnitt und Ausdruck. Es passt zu Männern, die wirklich trainieren, und funktioniert als eine Aktivitätsaufnahme in einem abwechslungsreicheren Profil.", profileFit: "Nutze die Nahaufnahme nach einem schlichteren Opener oder die Halbfigur als zentrales Aktivitätsbild.", pairing: "Kombiniere sie mit einem Caféfoto im Freien oder einem gepflegten Abendbild, damit Fitness nicht das ganze Profil bestimmt." },
    "outdoor-coffee": { name: "Café im Freien", answer: "Ein Café-Shooting im Freien zeigt eine einfache, entspannte Alltagssituation. Die vier Aufnahmen teilen Café und Outfit und reichen vom klaren Portrait bis zum weiteren Kontext und einer natürlichen Reaktion. Es eignet sich für Männer, die Cafés wirklich mögen und ein zugängliches Bild statt eines weiteren gestellten Portraits wollen.", profileFit: "Die Nahaufnahme oder das spontane Bild kann früh in der Auswahl stehen, weil der Ort vertraut und das Gesicht klar sichtbar ist.", pairing: "Kombiniere es mit einem Ganzkörperbild beim Stadtspaziergang oder einem bewussteren Dinnerfoto für Kontrast." },
    dinner: { name: "Dinner", answer: "Ein Dinner-Shooting zeigt deinen Abendstil und wie du in einer sozialen Situation aussehen könntest. Warmes Licht und smart-casual Kleidung bringen Abwechslung, während die vier verbundenen Ausschnitte in einer plausiblen Mahlzeit verankert bleiben. Es gehört neben lässige Tagesbilder und sollte nicht das ganze Profil aus Restaurantportraits machen.", profileFit: "Nutze ein Dinnerbild in der Mitte der Auswahl, um deinen Auftritt am Abend zu zeigen.", pairing: "Kombiniere es mit Tageslicht-, Aktivitäts- und Außenaufnahmen, damit das Profil nicht zu inszeniert wirkt." },
    "city-walk": { name: "Stadtspaziergang", answer: "Ein Stadtspaziergang-Shooting bringt Bewegung, Ganzkörperkontext und Alltagskleidung ins Profil. Statt vier Posen vor unverbundenen Hintergründen folgt es einem kurzen Weg durch dieselbe Straße und dasselbe Licht. Es passt zu Männern, die Stil und einen aktiven urbanen Alltag zeigen möchten, ohne wie eine Modekampagne zu wirken.", profileFit: "Die Ganzkörperaufnahme ist besonders in Position zwei oder drei hilfreich, wenn der Opener ein nahes Portrait ist.", pairing: "Kombiniere sie mit einem Koch- oder Fitnessbild, das ein konkreteres Interesse zeigt." },
    "coastal-travel": { name: "Küstenreise", answer: "Ein Küsten-Shooting bringt Weite und Bewegung ins Profil und hält dein Gesicht trotzdem sichtbar. Die verbundenen Bilder nutzen dieselbe Küste, Kleidung und Lichtstimmung, damit die Landschaft das Portrait unterstützt und nicht ersetzt. Verwende es nur, wenn Reisen oder Zeit im Freien wirklich zu deinem Leben gehören.", profileFit: "Ein weiteres Küstenbild kann nach einem klaren Opener und einer alltäglicheren Aktivität für Abwechslung sorgen.", pairing: "Kombiniere es mit einem normalen Stadt-, Café- oder Küchenbild, damit das Profil geerdet bleibt." },
    "home-cooking": { name: "Kochen zu Hause", answer: "Ein Koch-Shooting zu Hause macht ein alltägliches Interesse sichtbar, ohne wie eine gestellte Lebensmittelwerbung zu wirken. Küche, Kleidung und Licht bleiben über vier Bilder hinweg verbunden, während sich Handlung und Abstand ändern. Es passt zu Männern, die wirklich kochen und ein leichtes Gesprächsthema anbieten möchten.", profileFit: "Nutze eine Nahaufnahme oder Halbfigur nach dem Opener, um Wärme und ein konkretes persönliches Interesse zu ergänzen.", pairing: "Kombiniere sie mit einem Stadt- oder Küstenbild, um Bewegung und Außenbereich einzubringen." },
    rooftop: { name: "Dachterrasse", answer: "Ein Dachterrassen-Shooting bietet eine gepflegte urbane Umgebung und bleibt trotzdem entspannt und glaubwürdig. Die vier Aufnahmen variieren Ausschnitt und Ausdruck, ohne den Ort zu einem beliebigen Luxus-Signal zu machen. Es kann einen Abend- oder Stadtmoment ergänzen, wenn ein solcher Ort zu deinem echten Alltag passt.", profileFit: "Ein Dachterrassenbild kann später in der Auswahl den gepflegten oder sozialen Kontext abdecken.", pairing: "Kombiniere es mit einem Tageslichtportrait und einer echten Aktivitätsaufnahme für ein ausgewogenes Profil." },
  },
}

const ptBR: ExamplesPageCopy = {
  eyebrow: "Exemplos de fotos para namoro",
  title: "Veja o tipo de resultado de namoro que a UnrealShot pode criar",
  description: "Estes exemplos mostram direções criativas possíveis e a estrutura de quatro imagens usada em uma entrega. Eles não são um catálogo de predefinições: você não pode selecionar nem garantir estas cenas exatas. A UnrealShot gera ideias variadas a partir das suas referências e respostas.",
  bullets: ["Toda imagem é identificada como gerada por IA", "Cada exemplo mostra quatro enquadramentos relacionados", "Os conceitos ilustram resultados possíveis, não cenas para encomendar"],
  seeStructure: "Veja como os resultados são estruturados",
  openerCaption: "Exemplo de café ao ar livre gerado por IA · um lugar, uma roupa e uma iluminação",
  profileEyebrow: "Comece pelo seu perfil atual",
  profileHeading: "Veja como resultados diferentes podem preencher lacunas diferentes do perfil",
  profileDescription: "Os exemplos ajudam a entender quais funções uma entrega gerada pode cumprir. Eles não são um formulário de pedido nem prometem que esses conceitos aparecerão nos seus resultados.",
  profileGaps: [
    { problem: "Preciso de uma primeira foto clara e acessível", solution: "Comece em um cenário cotidiano em que seu rosto continue sendo o foco.", label: "Ver um exemplo acessível", href: "#outdoor-coffee" },
    { problem: "Meu perfil não tem uma foto útil de corpo inteiro", solution: "Use movimento e roupa comum em vez de uma pose rígida em pé.", label: "Ver um exemplo de corpo inteiro", href: "#city-walk" },
    { problem: "Minhas fotos não mostram o que eu realmente gosto", solution: "Escolha uma atividade que você realmente pratique e use uma imagem como assunto para conversa.", label: "Ver um exemplo de atividade", href: "#home-cooking" },
    { problem: "Todas as fotos da minha galeria parecem casuais demais", solution: "Adicione uma foto noturna mais arrumada sem transformar o perfil inteiro em um ensaio formal.", label: "Ver um exemplo arrumado", href: "#dinner" },
  ],
  outputsEyebrow: "Resultados ilustrativos",
  outputsHeading: "Veja como uma ideia gerada se transforma em quatro opções relacionadas",
  outputsDescription: "Cada linha demonstra uma ideia possível e quatro variações de enquadramento. Os conceitos são apenas exemplos. O seu pedido recebe ideias novas moldadas pelas suas respostas, não estas predefinições exatas.",
  directionLabel: "Direção criativa ilustrativa",
  exampleSuffix: "exemplo",
  whereFits: "Onde usar",
  besideIt: "O que usar ao lado",
  seeStructureFor: "Veja como este exemplo ilustrativo é estruturado",
  beforeEyebrow: "Antes de usar uma foto gerada",
  beforeHeading: "Use o enquadramento que ainda parece e se sente como você",
  beforeDescription: "Seus resultados dependem das selfies de referência e das suas respostas. Revise as ideias geradas pela UnrealShot e remova qualquer imagem que mude sua aparência ou sugira um interesse que você não tem. Uma refação pode corrigir um erro individual, mas a UnrealShot não promete semelhança perfeita, verificação, matches ou encontros.",
  howGenerationWorks: "Veja como a geração funciona",
  createPhotos: "Criar fotos para o meu perfil",
  shoots: {
    "gym-training": { name: "Treino na academia", answer: "Um ensaio na academia acrescenta energia, rotina e um interesse real sem depender de uma selfie no espelho. As quatro imagens mantêm o mesmo ambiente e roupa enquanto mudam o enquadramento e a expressão. Serve para homens que realmente treinam e funciona como uma foto de atividade dentro de um perfil variado.", profileFit: "Use o enquadramento próximo depois de uma abertura simples ou o meio corpo como imagem principal de atividade.", pairing: "Combine com uma foto de café ao ar livre ou de jantar arrumado para que fitness não domine o perfil." },
    "outdoor-coffee": { name: "Café ao ar livre", answer: "Um ensaio com café ao ar livre acrescenta uma imagem simples e acessível do cotidiano. As quatro imagens compartilham o mesmo café e a mesma roupa, passando do retrato claro a um contexto mais amplo e uma reação natural. É útil para homens que realmente gostam de cafés e querem uma imagem acolhedora em vez de outro retrato posado.", profileFit: "O enquadramento próximo ou espontâneo pode aparecer no início porque o cenário é familiar e o rosto fica claro.", pairing: "Combine com uma caminhada urbana de corpo inteiro ou uma foto de jantar mais intencional para criar contraste." },
    dinner: { name: "Jantar", answer: "Um ensaio de jantar mostra seu estilo noturno e como você pode aparecer em um contexto social. A luz quente e a roupa casual arrumada acrescentam variedade, enquanto os quatro enquadramentos relacionados mantêm a cena de uma refeição plausível. Use ao lado de fotos diurnas mais casuais, não para preencher o perfil inteiro com retratos de restaurante.", profileFit: "Use uma foto de jantar no meio da seleção para mostrar como você se apresenta à noite.", pairing: "Combine com imagens diurnas de atividade e ambientes externos para o perfil não parecer encenado demais." },
    "city-walk": { name: "Caminhada pela cidade", answer: "Um ensaio caminhando pela cidade acrescenta movimento, contexto de corpo inteiro e roupa cotidiana ao perfil. Em vez de quatro poses em fundos desconectados, ele acompanha uma curta caminhada pela mesma rua e luz. Funciona para homens que querem mostrar estilo e uma rotina urbana ativa sem parecer uma campanha de moda.", profileFit: "O enquadramento de corpo inteiro é especialmente útil na segunda ou terceira posição quando a abertura é um retrato próximo.", pairing: "Combine com uma foto cozinhando em casa ou de academia que revele um interesse mais específico." },
    "coastal-travel": { name: "Viagem pela costa", answer: "Um ensaio na costa acrescenta espaço aberto e movimento enquanto mantém o rosto visível. As imagens relacionadas usam a mesma costa, roupa e luz para que a paisagem acompanhe o retrato em vez de substituí-lo. Use somente se viajar ou passar tempo ao ar livre fizer parte da sua vida real.", profileFit: "Uma imagem costeira mais ampla pode trazer variedade depois de uma abertura clara e uma atividade cotidiana.", pairing: "Combine com uma imagem comum de cidade, café ou cozinha para manter o perfil conectado ao dia a dia." },
    "home-cooking": { name: "Cozinha em casa", answer: "Um ensaio cozinhando em casa dá forma visual a um interesse cotidiano sem virar um anúncio de comida posado. Nas quatro imagens, a cozinha, a roupa e a luz continuam conectadas enquanto a ação e a distância mudam. É ideal para homens que realmente cozinham e querem oferecer um detalhe fácil de comentar.", profileFit: "Use um enquadramento próximo ou de meio corpo depois da abertura para acrescentar calor e um interesse pessoal concreto.", pairing: "Combine com uma imagem urbana ou costeira para trazer movimento e variedade ao ar livre." },
    rooftop: { name: "Rooftop", answer: "Um ensaio em um rooftop oferece um cenário urbano cuidado sem perder uma história visual descontraída e plausível. Os quatro enquadramentos variam a distância e a expressão sem transformar o local em um sinal genérico de luxo. Pode acrescentar um momento noturno ou urbano quando esse tipo de lugar combina com a sua rotina real.", profileFit: "Uma imagem no rooftop pode ocupar mais adiante um espaço arrumado ou de contexto social.", pairing: "Combine com um retrato diurno e uma atividade autêntica para equilibrar o perfil." },
  },
}

export const examplesPageCopy: Record<PublishedPublicLocale, ExamplesPageCopy> = { en, fr, es, de, "pt-BR": ptBR }
