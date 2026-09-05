import type { PublishedPublicLocale } from "@/i18n/config"
import { authorityPages, type AuthorityPageContent } from "@/lib/dating-authority-content"

type NonEnglishLocale = Exclude<PublishedPublicLocale, "en">

const page = (path: string, copy: Omit<AuthorityPageContent, "path">): AuthorityPageContent => ({ path, ...copy })

const fr: Record<string, AuthorityPageContent> = {
  "/how-it-works": page("/how-it-works", {
    eyebrow: "Le processus UnrealShot",
    title: "Comment UnrealShot crée des photos de rencontre avec l’IA",
    description: "Découvrez comment 4 à 6 selfies et trois choix honnêtes deviennent 15 séances photo cohérentes de quatre images en environ 30 minutes.",
    answer: "Envoyez 4 à 6 selfies de référence nets, répondez à trois questions sur votre style et vos vrais centres d’intérêt, puis recevez 15 séances cohérentes de quatre images liées. UnrealShot utilise vos références pour guider la génération, sans entraîner de modèle personnalisé. La livraison est prévue sous 30 minutes.",
    facts: [["Entrée", "4 à 6 selfies de référence"], ["Questionnaire", "3 questions"], ["Résultat", "15 séances / 60 photos"], ["Reprises", "15 photos individuelles"], ["Livraison", "Sous 30 minutes"], ["Prix", "39 $ en une fois"]],
    sections: [
      { heading: "1. Commencez avec des selfies de référence utiles", paragraphs: ["Utilisez des photos récentes et non filtrées où votre visage est visible sous plusieurs angles. Des expressions différentes et une lumière ordinaire fournissent plus d’informations utiles que six selfies presque identiques."], bullets: ["Vous seul devez apparaître sur les photos de référence.", "Évitez les lunettes de soleil, les filtres marqués, les cadrages extrêmes et les photos très anciennes.", "Une référence peut être décontractée : elle n’a pas besoin d’un éclairage de studio."] },
      { heading: "2. Répondez à trois questions concrètes", paragraphs: ["Le questionnaire porte sur votre style, le type de profil que vous construisez et les centres d’intérêt que vous avez réellement. Ces réponses orientent la création ; elles ne servent pas à choisir des préréglages nommés dans une galerie fixe. UnrealShot génère les idées finales de votre livraison et ne prétend pas adapter les photos à un algorithme d’application."], bullets: ["Partagez uniquement des centres d’intérêt dont vous pourriez parler lors d’un rendez-vous.", "Les idées finales sont générées, pas choisies par leur nom.", "L’alcool, les chiens, les vélos et les sports d’équipe sont actuellement évités."] },
      { heading: "3. Recevez des séances complètes, pas des images déconnectées", paragraphs: ["Chaque séance comprend un cadrage rapproché ou d’ouverture, un cadrage buste, un cadrage en pied et une image spontanée ou expressive. La tenue, le lieu, la lumière et l’histoire visuelle restent liés à travers ces quatre photos : vous pouvez donc choisir une image forte ou en utiliser plusieurs sans donner l’impression d’un assemblage aléatoire."] },
      { heading: "Reprises, confidentialité et limites honnêtes", paragraphs: ["Le forfait comprend 15 reprises photo individuelles. Utilisez-les lorsqu’une image ne respecte pas assez votre ressemblance, votre expression ou la composition souhaitée. Une génération guidée par références peut tout de même produire une image faible ; aucun service ne peut promettre une ressemblance parfaite à chaque fois. UnrealShot ne garantit ni rencontres, ni rendez-vous, ni vérification par une application, ni acceptation sur toutes les plateformes."], bullets: ["Les exemples générés sont signalés comme générés par IA.", "Utilisez des photos qui vous représentent fidèlement.", "Consultez la Politique de confidentialité pour connaître le stockage et la suppression actuels."] },
    ],
    related: [{ label: "Voir des exemples complets", href: "/dating-photos/examples" }, { label: "Comprendre le réalisme", href: "/realistic-ai-dating-photos" }, { label: "Voir les tarifs", href: "/pricing" }],
  }),
  "/realistic-ai-dating-photos": page("/realistic-ai-dating-photos", {
    eyebrow: "Méthode du réalisme",
    title: "Qu’est-ce qui rend une photo de rencontre IA réaliste ?",
    description: "Découvrez comment des séances cohérentes de quatre images, une ressemblance guidée par références et des choix photo ordinaires créent un rendu naturel, comme pris par un proche.",
    answer: "Une photo de rencontre IA réaliste doit ressembler à un moment plausible de votre vie : visage reconnaissable, distance de prise de vue ordinaire, posture naturelle, lumière crédible et décor cohérent avec vos vrais centres d’intérêt. UnrealShot construit quatre images liées autour d’une scène ancrée afin d’évoquer une petite séance photo, pas quatre générations sans rapport.",
    facts: [["Méthode", "Génération guidée par références"], ["Unité", "4 images liées"], ["Cohérence", "Lieu, tenue et lumière"], ["Rendu", "Spontané, pris par un proche"], ["Personnes", "Scènes avec une seule personne"], ["Correction", "15 reprises photo"]],
    sections: [
      { heading: "La première image ancre l’histoire visuelle", paragraphs: ["Une séance commence par une direction claire pour la scène et l’apparence. Les images suivantes font varier le cadrage, la posture et l’expression tout en conservant la logique du lieu, de la tenue et de la lumière. Cela réduit le contraste brutal produit par des prompts isolés."] },
      { heading: "L’effet “pris par un proche” est un langage photo", paragraphs: ["Cette expression signifie que l’image ressemble à une photo détendue prise par quelqu’un à proximité. Elle ne signifie pas qu’un ami réel a pris la photo. Un point de vue à hauteur des yeux, un flou d’arrière-plan modéré, un cadrage légèrement imparfait et une action adaptée au lieu paraissent généralement plus authentiques qu’une pose de studio brillante."] },
      { heading: "La ressemblance dépend de vos références", paragraphs: ["Des références claires et récentes sous plusieurs angles aident à préserver vos traits reconnaissables. Les cheveux, la pilosité, l’âge, la texture de peau et la forme du visage doivent rester plausibles, mais une image peut tout de même comporter une erreur. UnrealShot n’entraîne pas de modèle personnalisé et ne promet pas une ressemblance parfaite sur chaque image."], bullets: ["Comparez l’ensemble du visage, pas un seul détail.", "Refusez les images qui changent l’âge, la carrure ou les proportions du visage.", "Demandez une reprise lorsque la scène est bonne mais que la ressemblance ne l’est pas."] },
      { heading: "Le réalisme ne consiste pas à cacher l’IA", paragraphs: ["Les exemples UnrealShot sont signalés comme générés par IA. L’objectif est une présentation naturelle et fidèle, pas de contourner les règles des applications ni de rendre les images “indétectables”. Mélangez les photos générées avec des photos récentes de votre galerie et supprimez toute image qui suggère un hobby, un voyage ou un mode de vie qui n’est pas le vôtre."] },
    ],
    related: [{ label: "Comment ça marche", href: "/how-it-works" }, { label: "Parcourir les exemples en quatre images", href: "/dating-photos/examples" }, { label: "Construire une sélection complète", href: "/dating-photos" }],
  }),
  "/contact": page("/contact", {
    eyebrow: "Assistance",
    title: "Contacter UnrealShot",
    description: "Contactez UnrealShot au sujet d’une commande, d’une reprise photo, d’une demande de confidentialité ou d’une question produit.",
    answer: "Écrivez à support@unrealshot.com pour obtenir de l’aide sur une commande, des reprises photo, la confidentialité ou le produit. Indiquez l’adresse e-mail utilisée pour la commande et décrivez brièvement le problème ; n’envoyez pas de document d’identité sensible ni de données de carte bancaire.",
    facts: [["E-mail d’assistance", "support@unrealshot.com"], ["Réponse habituelle", "Sous 24 heures"], ["Produit", "Photographie de rencontre IA pour hommes"], ["Opérateur", "UnrealShot"], ["Fondateur", "Harvansh Chaudhary"]],
    sections: [
      { heading: "Ce qu’il faut inclure", paragraphs: ["Indiquez la commande ou l’image concernée et le résultat attendu. Pour une reprise photo, précisez l’image exacte et si le problème concerne la ressemblance, l’expression, la composition ou l’exactitude de la scène."] },
      { heading: "Demandes de confidentialité et de facturation", paragraphs: ["Pour une demande de confidentialité, utilisez la même adresse e-mail que celle associée à votre compte afin de vérifier la propriété du compte en toute sécurité. Les conditions de remboursement sont expliquées dans la Politique de remboursement. N’envoyez jamais de mot de passe, de numéro de carte complet ou de document d’identité par e-mail."] },
      { heading: "À propos de l’opérateur", paragraphs: ["UnrealShot est un produit indépendant de photographie de rencontre par IA, fondé par Harvansh Chaudhary. Il n’est affilié ni à Tinder, ni à Hinge, ni à Bumble."] },
    ],
    related: [{ label: "Politique de confidentialité", href: "/privacy-policy" }, { label: "Politique de remboursement", href: "/refund-policy" }, { label: "Comment ça marche", href: "/how-it-works" }],
  }),
}

const es: Record<string, AuthorityPageContent> = {
  "/how-it-works": page("/how-it-works", {
    eyebrow: "El proceso de UnrealShot",
    title: "Cómo crea UnrealShot fotos de citas con IA",
    description: "Descubre cómo 4–6 selfies y tres decisiones honestas se convierten en 15 sesiones coherentes de cuatro fotos en unos 30 minutos.",
    answer: "Sube 4–6 selfies de referencia nítidos, responde tres preguntas sobre tu estilo y tus intereses reales, y recibe 15 sesiones coherentes con cuatro encuadres relacionados cada una. UnrealShot usa tus referencias para guiar la generación; no entrena un modelo personalizado. La entrega está prevista en menos de 30 minutos.",
    facts: [["Entrada", "4–6 selfies de referencia"], ["Cuestionario", "3 preguntas"], ["Resultado", "15 sesiones / 60 fotos"], ["Repeticiones", "15 fotos individuales"], ["Entrega", "En menos de 30 minutos"], ["Precio", "39 $ una sola vez"]],
    sections: [
      { heading: "1. Empieza con selfies de referencia útiles", paragraphs: ["Usa fotos recientes y sin filtros en las que tu cara se vea desde más de un ángulo. Distintas expresiones y una iluminación normal aportan más información útil que seis selfies casi iguales."], bullets: ["Solo tú debes aparecer en las fotos de referencia.", "Evita gafas de sol, filtros intensos, recortes extremos y fotos muy antiguas.", "Una referencia puede ser informal; no necesita iluminación de estudio."] },
      { heading: "2. Responde tres preguntas prácticas", paragraphs: ["El cuestionario pregunta por tu estilo, el tipo de perfil que estás creando y los intereses que realmente tienes. Las respuestas orientan la dirección creativa; no seleccionan ajustes con nombre de una galería fija. UnrealShot genera las ideas finales de tu entrega y no afirma adaptar las fotos al algoritmo de una aplicación."], bullets: ["Comparte solo intereses de los que hablarías cómodamente en una cita.", "Las ideas finales se generan, no se eligen por nombre.", "Actualmente se evitan el alcohol, los perros, las bicicletas y los deportes de equipo."] },
      { heading: "3. Recibe sesiones completas, no imágenes desconectadas", paragraphs: ["Cada sesión contiene un encuadre cercano o de apertura, uno de medio cuerpo, uno de cuerpo entero y uno espontáneo o expresivo. El vestuario, el lugar, la luz y la historia visual siguen relacionados en las cuatro fotos, para que puedas elegir una imagen fuerte o usar varias sin que parezcan ensambladas al azar."] },
      { heading: "Repeticiones, privacidad y límites claros", paragraphs: ["El paquete incluye 15 repeticiones individuales. Úsalas cuando una imagen falle en parecido, expresión o composición. La generación guiada por referencias todavía puede producir una imagen débil, y ningún servicio puede prometer un parecido perfecto en cada resultado. UnrealShot no garantiza matches, citas, verificación en aplicaciones ni aceptación en todas las plataformas."], bullets: ["Los ejemplos generados están marcados como generados por IA.", "Usa fotos que te representen con precisión.", "Consulta la Política de privacidad para conocer el almacenamiento y la eliminación actuales."] },
    ],
    related: [{ label: "Ver ejemplos completos", href: "/dating-photos/examples" }, { label: "Cómo funciona el realismo", href: "/realistic-ai-dating-photos" }, { label: "Ver precios", href: "/pricing" }],
  }),
  "/realistic-ai-dating-photos": page("/realistic-ai-dating-photos", {
    eyebrow: "Método de realismo",
    title: "¿Qué hace que una foto de citas con IA parezca realista?",
    description: "Descubre cómo las sesiones coherentes de cuatro fotos, el parecido guiado por referencias y las decisiones fotográficas normales crean un resultado natural, como tomado por un amigo.",
    answer: "Una foto de citas realista debería parecer un momento posible de tu vida: un rostro reconocible, una distancia de cámara normal, una postura natural, una luz creíble y un lugar que encaje con tus intereses reales. UnrealShot construye cuatro encuadres relacionados alrededor de una escena anclada para que el resultado parezca una pequeña sesión, no cuatro generaciones sin relación.",
    facts: [["Método", "Generación guiada por referencias"], ["Unidad", "4 encuadres relacionados"], ["Coherencia", "Lugar, ropa y luz"], ["Aspecto", "Espontáneo, tomado por un amigo"], ["Personas", "Escenas con una sola persona"], ["Corrección", "15 repeticiones"]],
    sections: [
      { heading: "La primera imagen ancla la historia visual", paragraphs: ["Una sesión comienza con una dirección clara para la escena y tu aspecto. Los siguientes encuadres cambian el recorte, la postura y la expresión, pero mantienen la lógica del lugar, la ropa y la luz. Así se reduce el salto visual que producen los prompts aislados."] },
      { heading: "El aspecto de una foto tomada por un amigo es un lenguaje de cámara", paragraphs: ["Significa que la imagen parece una foto relajada que alguien cercano podría haber tomado. No significa que la haya tomado un amigo real. Los puntos de vista a la altura de los ojos, el desenfoque moderado, un encuadre ligeramente imperfecto y acciones propias del lugar suelen resultar más naturales que una pose de estudio brillante."] },
      { heading: "El parecido depende de tus referencias", paragraphs: ["Las referencias claras y recientes desde varios ángulos ayudan a conservar tus rasgos reconocibles. El pelo, la barba, la edad, la textura de la piel y la forma de la cara deben seguir siendo plausibles, aunque una imagen puede fallar. UnrealShot no entrena un modelo personalizado ni promete un parecido perfecto en cada foto."], bullets: ["Compara la cara completa, no solo un rasgo.", "Descarta imágenes que cambien tu edad, complexión o proporciones faciales.", "Pide una repetición cuando la escena sea buena pero el parecido no."] },
      { heading: "El realismo no consiste en ocultar la IA", paragraphs: ["Los ejemplos de UnrealShot están marcados como generados por IA. El objetivo es presentarte de forma natural y fiel, no saltarse las reglas de las aplicaciones ni hacer imágenes “indetectables”. Combina fotos generadas con fotos recientes de tu carrete y elimina cualquier imagen que sugiera un hobby, viaje o estilo de vida que no sea tuyo."] },
    ],
    related: [{ label: "Cómo funciona", href: "/how-it-works" }, { label: "Explorar ejemplos de cuatro fotos", href: "/dating-photos/examples" }, { label: "Crear una selección completa", href: "/dating-photos" }],
  }),
  "/contact": page("/contact", {
    eyebrow: "Soporte",
    title: "Contacta con UnrealShot",
    description: "Contacta con UnrealShot sobre un pedido, una repetición, una solicitud de privacidad o una pregunta sobre el producto.",
    answer: "Escribe a support@unrealshot.com para recibir ayuda con pedidos, repeticiones, privacidad o soporte del producto. Incluye el correo usado en tu pedido y una breve descripción del problema; no envíes documentos de identidad sensibles ni datos de tarjetas.",
    facts: [["Correo de soporte", "support@unrealshot.com"], ["Respuesta habitual", "En 24 horas"], ["Producto", "Fotografía de citas con IA para hombres"], ["Operador", "UnrealShot"], ["Fundador", "Harvansh Chaudhary"]],
    sections: [
      { heading: "Qué debes incluir", paragraphs: ["Indica qué pedido o imagen necesita atención y qué resultado esperabas. Para una repetición, identifica el encuadre exacto y si el problema es el parecido, la expresión, la composición o la exactitud de la escena."] },
      { heading: "Solicitudes de privacidad y facturación", paragraphs: ["Para una solicitud de privacidad, usa el mismo correo asociado a tu cuenta para poder comprobar la titularidad de forma segura. La elegibilidad para reembolsos se explica en la Política de reembolsos. Nunca envíes contraseñas, números completos de tarjeta ni documentos de identidad por correo."] },
      { heading: "Sobre el operador", paragraphs: ["UnrealShot es un producto independiente de fotografía de citas con IA fundado por Harvansh Chaudhary. No está afiliado a Tinder, Hinge ni Bumble."] },
    ],
    related: [{ label: "Política de privacidad", href: "/privacy-policy" }, { label: "Política de reembolsos", href: "/refund-policy" }, { label: "Cómo funciona", href: "/how-it-works" }],
  }),
}

const de: Record<string, AuthorityPageContent> = {
  "/how-it-works": page("/how-it-works", {
    eyebrow: "Der UnrealShot-Prozess",
    title: "Wie UnrealShot KI-Dating-Fotos erstellt",
    description: "Erfahre, wie aus 4–6 Selfies und drei ehrlichen Angaben in etwa 30 Minuten 15 zusammenhängende Dating-Shootings mit je vier Fotos entstehen.",
    answer: "Lade 4–6 klare Referenz-Selfies hoch, beantworte drei Fragen zu deinem Stil und deinen echten Interessen und erhalte anschließend 15 zusammenhängende Shootings mit jeweils vier verwandten Aufnahmen. UnrealShot nutzt deine Referenzen zur Steuerung der Generierung, trainiert aber kein eigenes Modell. Die Lieferung erfolgt innerhalb von 30 Minuten.",
    facts: [["Eingabe", "4–6 Referenz-Selfies"], ["Fragen", "3 Fragen"], ["Ergebnis", "15 Shootings / 60 Fotos"], ["Neuerstellungen", "15 einzelne Fotos"], ["Lieferung", "Innerhalb von 30 Minuten"], ["Preis", "39 $ einmalig"]],
    sections: [
      { heading: "1. Starte mit hilfreichen Referenz-Selfies", paragraphs: ["Verwende aktuelle, ungefilterte Fotos, auf denen dein Gesicht aus mehr als einem Winkel zu sehen ist. Unterschiedliche Ausdrücke und normales Licht liefern dem System mehr brauchbare Informationen als sechs fast identische Selfies."], bullets: ["Auf den Referenzfotos solltest nur du zu sehen sein.", "Vermeide Sonnenbrillen, starke Filter, extreme Ausschnitte und sehr alte Fotos.", "Eine Referenz darf ganz alltäglich sein; Studiolicht ist nicht erforderlich."] },
      { heading: "2. Beantworte drei praktische Fragen", paragraphs: ["Im kurzen Fragebogen geht es um deine Stilrichtung, die Art deines Dating-Profils und Interessen, die du wirklich hast. Die Antworten geben die kreative Richtung vor; sie wählen keine benannten Presets aus einer festen Shooting-Galerie. UnrealShot erzeugt die Ideen für deine Lieferung und behauptet nicht, Fotos auf einen Dating-App-Algorithmus zu optimieren."], bullets: ["Nenne nur Interessen, über die du bei einem Date gern sprechen würdest.", "Die finalen Shooting-Ideen werden erzeugt und nicht nach Namen ausgewählt.", "Alkohol, Hunde, Fahrräder und Teamsport werden derzeit vermieden."] },
      { heading: "3. Erhalte vollständige Shootings statt unverbundener Bilder", paragraphs: ["Jedes Shooting enthält eine Nah- oder Eröffnungsaufnahme, eine Halbfigur, eine Ganzkörperaufnahme und ein spontanes oder ausdrucksstarkes Bild. Kleidung, Ort, Licht und visuelle Geschichte bleiben über die vier Fotos hinweg verbunden. So kannst du ein starkes Bild auswählen oder mehrere verwenden, ohne dass sie zufällig zusammengestellt wirken."] },
      { heading: "Neuerstellungen, Datenschutz und ehrliche Grenzen", paragraphs: ["Das Paket enthält 15 einzelne Foto-Neuerstellungen. Nutze sie, wenn ein Bild bei Ähnlichkeit, Ausdruck oder Komposition nicht passt. Referenzgesteuerte Generierung kann trotzdem ein schwaches Bild liefern, und kein Dienst kann perfekte Ähnlichkeit in jedem Ergebnis versprechen. UnrealShot garantiert weder Matches, Dates, App-Verifizierung noch die Annahme durch jede Plattform."], bullets: ["Generierte Beispiele sind als KI-generiert gekennzeichnet.", "Verwende Fotos, die dich wahrheitsgetreu darstellen.", "In der Datenschutzrichtlinie findest du die aktuellen Angaben zu Speicherung und Löschung."] },
    ],
    related: [{ label: "Vollständige Beispiele ansehen", href: "/dating-photos/examples" }, { label: "Realismus verstehen", href: "/realistic-ai-dating-photos" }, { label: "Preise ansehen", href: "/pricing" }],
  }),
  "/realistic-ai-dating-photos": page("/realistic-ai-dating-photos", {
    eyebrow: "Realismus-Methode",
    title: "Was lässt ein KI-Dating-Foto realistisch wirken?",
    description: "Erfahre, wie zusammenhängende Vierer-Shootings, referenzgesteuerte Ähnlichkeit und alltägliche Kameraentscheidungen einen natürlichen Look wie von einem Freund erzeugen.",
    answer: "Ein realistisches KI-Dating-Foto sollte wie ein plausibler Moment aus deinem Leben wirken: erkennbares Gesicht, normale Kameradistanz, natürliche Haltung, glaubwürdiges Licht und eine Umgebung, die zu deinen echten Interessen passt. UnrealShot baut vier verbundene Aufnahmen um eine verankerte Szene auf, damit das Ergebnis wie eine kleine Fotosession und nicht wie vier voneinander getrennte Generierungen wirkt.",
    facts: [["Methode", "Referenzgesteuerte Generierung"], ["Einheit", "4 verbundene Aufnahmen"], ["Konsistenz", "Ort, Kleidung und Licht"], ["Look", "Spontan und freundschaftlich aufgenommen"], ["Personen", "Ein-Personen-Szenen"], ["Korrektur", "15 Foto-Neuerstellungen"]],
    sections: [
      { heading: "Das erste Bild verankert die visuelle Geschichte", paragraphs: ["Ein Shooting beginnt mit einer klaren Richtung für Szene und Erscheinungsbild. Die folgenden Aufnahmen variieren Ausschnitt, Haltung und Ausdruck, behalten aber die Logik von Ort, Kleidung und Licht bei. Das verringert den visuellen Bruch, den isolierte Prompts erzeugen."] },
      { heading: "Der Look wie von einem Freund ist eine Bildsprache", paragraphs: ["Damit ist gemeint, dass das Bild wie eine entspannte Aufnahme wirkt, die jemand in der Nähe gemacht haben könnte. Es bedeutet nicht, dass ein echter Freund die Aufnahme gemacht hat. Augenhöhe, mäßige Hintergrundunschärfe, ein leicht unperfekter Bildausschnitt und passende Handlungen wirken meist authentischer als glänzende Studioposen."] },
      { heading: "Ähnlichkeit hängt von deinen Referenzen ab", paragraphs: ["Klare, aktuelle Referenzen aus mehreren Blickwinkeln helfen, erkennbare Merkmale zu bewahren. Haare, Bart, Alter, Hautstruktur und Gesichtsform sollten plausibel bleiben, trotzdem kann ein einzelnes Bild danebenliegen. UnrealShot trainiert kein eigenes Modell und verspricht keine perfekte Ähnlichkeit in jedem Bild."], bullets: ["Vergleiche das ganze Gesicht, nicht nur ein Merkmal.", "Verwirf Bilder, die Alter, Körperbau oder Gesichtsproportionen verändern.", "Nutze eine Foto-Neuerstellung, wenn die Szene stimmt, die Ähnlichkeit aber nicht."] },
      { heading: "Realismus bedeutet nicht, KI zu verstecken", paragraphs: ["UnrealShot-Beispiele sind als KI-generiert gekennzeichnet. Ziel ist eine genaue, natürliche Selbstdarstellung – nicht das Umgehen von App-Regeln oder das Erzeugen „nicht erkennbarer“ Bilder. Kombiniere generierte Fotos mit aktuellen Bildern aus deiner Kamera und entferne alles, was ein Hobby, eine Reise oder einen Lebensstil behauptet, der nicht zu dir gehört."] },
    ],
    related: [{ label: "So funktioniert es", href: "/how-it-works" }, { label: "Vierer-Beispiele ansehen", href: "/dating-photos/examples" }, { label: "Eine vollständige Auswahl erstellen", href: "/dating-photos" }],
  }),
  "/contact": page("/contact", {
    eyebrow: "Support",
    title: "UnrealShot kontaktieren",
    description: "Kontaktiere UnrealShot zu einer Bestellung, Foto-Neuerstellung, Datenschutzanfrage oder Produktfrage.",
    answer: "Schreibe an support@unrealshot.com, wenn du Hilfe zu einer Bestellung, Foto-Neuerstellungen, Datenschutz oder dem Produkt brauchst. Nenne die E-Mail-Adresse deiner Bestellung und beschreibe das Problem kurz. Sende keine sensiblen Ausweisdokumente oder Kartendaten.",
    facts: [["Support-E-Mail", "support@unrealshot.com"], ["Übliche Antwort", "Innerhalb von 24 Stunden"], ["Produkt", "KI-Dating-Fotografie für Männer"], ["Betreiber", "UnrealShot"], ["Gründer", "Harvansh Chaudhary"]],
    sections: [
      { heading: "Was du angeben solltest", paragraphs: ["Nenne die Bestellung oder das Bild, um das es geht, und welches Ergebnis du erwartet hast. Bei einer Foto-Neuerstellung gib das genaue Bild an und ob es um Ähnlichkeit, Ausdruck, Komposition oder die Genauigkeit der Szene geht."] },
      { heading: "Datenschutz- und Zahlungsanfragen", paragraphs: ["Verwende für eine Datenschutzanfrage dieselbe E-Mail-Adresse wie für dein Konto, damit die Inhaberschaft sicher geprüft werden kann. Die Voraussetzungen für Rückerstattungen stehen in der Rückerstattungsrichtlinie. Sende niemals Passwörter, vollständige Kartennummern oder Ausweisdokumente per E-Mail."] },
      { heading: "Über den Betreiber", paragraphs: ["UnrealShot ist ein unabhängiges KI-Dating-Fotografieprodukt, das von Harvansh Chaudhary gegründet wurde. Es ist nicht mit Tinder, Hinge oder Bumble verbunden."] },
    ],
    related: [{ label: "Datenschutzrichtlinie", href: "/privacy-policy" }, { label: "Rückerstattungsrichtlinie", href: "/refund-policy" }, { label: "So funktioniert es", href: "/how-it-works" }],
  }),
}

const ptBR: Record<string, AuthorityPageContent> = {
  "/how-it-works": page("/how-it-works", {
    eyebrow: "O processo da UnrealShot",
    title: "Como a UnrealShot cria fotos de namoro com IA",
    description: "Veja como 4–6 selfies e três escolhas honestas se transformam em 15 ensaios coerentes de quatro fotos em cerca de 30 minutos.",
    answer: "Envie 4–6 selfies de referência nítidas, responda a três perguntas sobre seu estilo e seus interesses reais e receba 15 ensaios coerentes com quatro imagens relacionadas cada. A UnrealShot usa suas referências para orientar a geração, mas não treina um modelo personalizado. A entrega acontece em até 30 minutos.",
    facts: [["Entrada", "4–6 selfies de referência"], ["Questionário", "3 perguntas"], ["Resultado", "15 ensaios / 60 fotos"], ["Refações", "15 fotos individuais"], ["Entrega", "Em até 30 minutos"], ["Preço", "US$ 39 uma vez"]],
    sections: [
      { heading: "1. Comece com selfies de referência úteis", paragraphs: ["Use fotos recentes e sem filtros em que seu rosto apareça de mais de um ângulo. Expressões diferentes e iluminação comum oferecem informações mais úteis ao sistema do que seis selfies quase idênticas."], bullets: ["Somente você deve aparecer nas fotos de referência.", "Evite óculos escuros, filtros fortes, cortes extremos e fotos muito antigas.", "Uma referência pode ser casual; não precisa de iluminação de estúdio."] },
      { heading: "2. Responda a três perguntas práticas", paragraphs: ["O questionário pergunta sobre sua direção de estilo, o tipo de perfil de namoro que você está criando e os interesses que realmente fazem parte da sua vida. Essas respostas orientam a criação; elas não selecionam predefinições nomeadas de uma galeria fixa. A UnrealShot gera as ideias finais da sua entrega e não afirma otimizar fotos para o algoritmo de um aplicativo."], bullets: ["Compartilhe apenas interesses sobre os quais você falaria em um encontro.", "As ideias finais são geradas, não escolhidas pelo nome.", "Atualmente evitamos álcool, cães, bicicletas e esportes coletivos."] },
      { heading: "3. Receba ensaios completos, não imagens desconectadas", paragraphs: ["Cada ensaio inclui um enquadramento próximo ou de abertura, um enquadramento de meio corpo, um corpo inteiro e uma imagem espontânea ou expressiva. A roupa, o lugar, a luz e a história visual continuam relacionados nas quatro fotos, para que você possa escolher uma imagem forte ou usar mais de uma sem parecer uma montagem aleatória."] },
      { heading: "Refações, privacidade e limites honestos", paragraphs: ["O pacote inclui 15 refações individuais. Use-as quando uma imagem não ficar parecida o suficiente, tiver uma expressão ruim ou uma composição inadequada. A geração guiada por referências ainda pode produzir uma imagem fraca, e nenhum serviço pode prometer semelhança perfeita em todos os resultados. A UnrealShot não garante matches, encontros, verificação em aplicativos ou aceitação em todas as plataformas."], bullets: ["Os exemplos gerados são identificados como gerados por IA.", "Use fotos que representem você com precisão.", "Consulte a Política de privacidade para ver as condições atuais de armazenamento e exclusão."] },
    ],
    related: [{ label: "Ver exemplos completos", href: "/dating-photos/examples" }, { label: "Entender o realismo", href: "/realistic-ai-dating-photos" }, { label: "Ver preços", href: "/pricing" }],
  }),
  "/realistic-ai-dating-photos": page("/realistic-ai-dating-photos", {
    eyebrow: "Método de realismo",
    title: "O que faz uma foto de namoro com IA parecer realista?",
    description: "Entenda como ensaios coerentes de quatro imagens, semelhança guiada por referências e escolhas fotográficas comuns criam um visual natural, como feito por um amigo.",
    answer: "Uma foto de namoro realista deve parecer um momento possível da sua vida: rosto reconhecível, distância de câmera comum, postura natural, luz convincente e um cenário compatível com seus interesses reais. A UnrealShot cria quatro imagens relacionadas ao redor de uma cena ancorada para que o resultado pareça uma pequena sessão de fotos, não quatro gerações sem conexão.",
    facts: [["Método", "Geração guiada por referências"], ["Unidade", "4 imagens relacionadas"], ["Coerência", "Lugar, roupa e luz"], ["Visual", "Espontâneo, feito por um amigo"], ["Pessoas", "Cenas com uma pessoa"], ["Correção", "15 refações"]],
    sections: [
      { heading: "A primeira imagem ancora a história visual", paragraphs: ["Um ensaio começa com uma direção clara para a cena e a aparência. As imagens seguintes variam o corte, a postura e a expressão, mas preservam a lógica do local, da roupa e da iluminação. Isso reduz a mudança brusca causada por prompts isolados."] },
      { heading: "O visual feito por um amigo é uma linguagem de câmera", paragraphs: ["A expressão significa que a imagem parece uma foto descontraída que alguém próximo poderia ter feito. Não significa que um amigo de verdade tirou a foto. Ângulos na altura dos olhos, desfoque moderado, enquadramento levemente imperfeito e ações adequadas ao local costumam parecer mais autênticos do que poses de estúdio muito produzidas."] },
      { heading: "A semelhança depende das suas referências", paragraphs: ["Referências claras e recentes de vários ângulos ajudam a preservar características reconhecíveis. Cabelo, barba, idade, textura da pele e formato do rosto devem continuar plausíveis, mas uma imagem individual ainda pode falhar. A UnrealShot não treina um modelo personalizado nem promete semelhança perfeita em todas as fotos."], bullets: ["Compare o rosto inteiro, não apenas um detalhe.", "Descarte imagens que mudem sua idade, porte ou proporções faciais.", "Use uma refação quando a cena estiver boa, mas a semelhança não."] },
      { heading: "Realismo não significa esconder a IA", paragraphs: ["Os exemplos da UnrealShot são identificados como gerados por IA. O objetivo é uma apresentação natural e fiel, não contornar regras de aplicativos ou tornar imagens “indetectáveis”. Misture fotos geradas com fotos recentes da sua galeria e remova qualquer imagem que sugira um hobby, viagem ou estilo de vida que não seja seu."] },
    ],
    related: [{ label: "Como funciona", href: "/how-it-works" }, { label: "Explorar exemplos de quatro fotos", href: "/dating-photos/examples" }, { label: "Montar uma seleção completa", href: "/dating-photos" }],
  }),
  "/contact": page("/contact", {
    eyebrow: "Suporte",
    title: "Entre em contato com a UnrealShot",
    description: "Fale com a UnrealShot sobre um pedido, uma refação, uma solicitação de privacidade ou uma dúvida sobre o produto.",
    answer: "Envie um e-mail para support@unrealshot.com para pedir ajuda com pedidos, refações, privacidade ou suporte do produto. Inclua o e-mail usado no pedido e uma breve descrição do problema; não envie documentos de identidade sensíveis nem dados de cartão.",
    facts: [["E-mail de suporte", "support@unrealshot.com"], ["Resposta típica", "Em até 24 horas"], ["Produto", "Fotografia de namoro com IA para homens"], ["Operadora", "UnrealShot"], ["Fundador", "Harvansh Chaudhary"]],
    sections: [
      { heading: "O que incluir", paragraphs: ["Diga qual pedido ou imagem precisa de atenção e qual resultado você esperava. Para uma refação, identifique a imagem exata e informe se o problema é semelhança, expressão, composição ou precisão da cena."] },
      { heading: "Solicitações de privacidade e cobrança", paragraphs: ["Para uma solicitação de privacidade, use o mesmo e-mail associado à sua conta para que a titularidade possa ser verificada com segurança. Os critérios de reembolso estão na Política de reembolso. Nunca envie senhas, números completos de cartão ou documentos de identidade por e-mail."] },
      { heading: "Sobre a operadora", paragraphs: ["A UnrealShot é um produto independente de fotografia de namoro com IA, fundado por Harvansh Chaudhary. Não tem afiliação com Tinder, Hinge ou Bumble."] },
    ],
    related: [{ label: "Política de privacidade", href: "/privacy-policy" }, { label: "Política de reembolso", href: "/refund-policy" }, { label: "Como funciona", href: "/how-it-works" }],
  }),
}

export const localizedAuthorityPages: Record<NonEnglishLocale, Record<string, AuthorityPageContent>> = { fr, es, de, "pt-BR": ptBR }

export function getLocalizedAuthorityPage(path: string, locale: PublishedPublicLocale): AuthorityPageContent | undefined {
  return locale === "en" ? authorityPages[path] : localizedAuthorityPages[locale][path]
}
