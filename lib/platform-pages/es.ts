import { buildLocalizedPlatformPages } from "./localized-build"
import type { PlatformLocalePack, LocalizedPlatformApp } from "./localized-types"

const es: PlatformLocalePack = {
  locale: "es",
  reviewed: "31 de agosto de 2026",
  sourceLabels: {
    Tinder: ["Tinder: verificación de fotos", "Tinder: requisitos del rostro y perfiles ocultos", "Normas de la comunidad de Tinder"],
    Hinge: ["Hinge: editar el perfil", "Hinge: añadir y editar fotos", "Hinge: contenido y comportamiento prohibidos"],
    Bumble: ["Bumble: normas para las fotos del perfil", "Bumble: función Best Photo", "Normas de la comunidad de Bumble"],
  },
  variants: {
    Tinder: {
      focus: "claridad y variedad en un perfil que se recorre rápidamente",
      requirement: "Tinder suele exigir que el rostro se vea con claridad y puede ocultar un perfil que no tenga una foto facial detectable.",
      firstPhoto: "una foto individual reciente, nítida y con el rostro reconocible al instante",
      specialFeature: "la verificación mediante un selfie en vídeo",
      trustNote: "Tinder compara un breve selfie en vídeo con las fotos del perfil. Por eso una imagen generada nunca debe presentar una apariencia que no sea realmente la tuya hoy.",
    },
    Hinge: {
      focus: "la conexión entre las fotos y las respuestas escritas del perfil",
      requirement: "Hinge pide entre cuatro y seis fotos según la región, además de tres respuestas a sus prompts.",
      firstPhoto: "un retrato individual reciente que permita reconocerte sin dudas",
      specialFeature: "los prompts, pies de foto y respuestas que dan contexto a las imágenes",
      trustNote: "Hinge prohíbe el contenido generado por IA cuando se usa para engañar o inducir a error. Las actividades y aficiones que muestres deben ser realmente tuyas.",
    },
    Bumble: {
      focus: "primeras señales claras y temas fáciles para iniciar una conversación",
      requirement: "Bumble permite hasta seis fotos o vídeos y suele recomendar utilizar entre cuatro y seis.",
      firstPhoto: "una foto individual reciente, luminosa, con los ojos y el rostro bien visibles",
      specialFeature: "la función Best Photo, que puede colocar primero la foto que recibe mejores reacciones dentro de la aplicación",
      trustNote: "Bumble prohíbe las fotos artificiales o retocadas cuando se usan para engañar. Conserva imágenes recientes y una apariencia fiel a la realidad.",
    },
  },
  landing: (app: LocalizedPlatformApp, v) => ({
    eyebrow: "Fotos para citas con IA para hombres en " + app,
    title: "Fotos de " + app + " que dan a tu perfil una historia visual creíble",
    description: "Crea 60 fotos realistas para " + app + " en 15 sesiones coherentes a partir de 4–6 selfies. Incluye 15 repeticiones individuales y entrega en menos de 30 minutos por 39 $ una sola vez.",
    answer: "UnrealShot convierte 4–6 selfies actuales en 15 ideas de sesiones pensadas para tu perfil de " + app + ". Cada idea se convierte en cuatro fotos relacionadas: el escenario, la ropa y la luz mantienen la coherencia, mientras cambian el encuadre y la expresión. Recibes 60 fotos, 15 repeticiones individuales y la entrega en menos de 30 minutos por 39 $ una sola vez.",
    heroBullets: ["15 sesiones completas: 60 fotos", "Cuatro imágenes relacionadas por sesión", "15 repeticiones individuales incluidas", "Entrega en menos de 30 minutos · 39 $ una sola vez"],
    problemIntro: "La mayoría de los hombres ya tiene muchas fotos. El problema es que suelen mostrar el mismo ángulo, la misma habitación o etapas muy distintas de la vida. Así resulta difícil crear un perfil de " + app + " actual, natural y completo, sobre todo cuando la primera impresión se decide en pocos segundos.",
    problems: [
      { title: "Tu mejor foto reciente sigue siendo un selfie", body: "Un selfie nítido puede mostrar tu rostro, pero casi nunca aporta el escenario, la postura y la distancia de cámara de un momento real. El perfil termina sin suficiente personalidad visual." },
      { title: "El resto de tu galería se parece demasiado", body: "Cambiar un poco el ángulo no aporta información nueva. Una selección más útil alterna ambientes, ropa, energía y composición sin dejar de parecer la misma persona actual." },
      { title: "Las imágenes de IA sueltas no parecen parte de una vida", body: "Cuando el rostro, el cuerpo o el acabado cambian sin lógica, la galería parece montada. UnrealShot conecta cuatro imágenes dentro de cada sesión para que la escena resulte creíble." },
    ],
    solutionIntro: "UnrealShot convierte unas pocas referencias actuales en un conjunto real de fotos listas para " + app + ". Las 15 ideas exploran ambientes, actividades, ropa y estados de ánimo diferentes; las cuatro imágenes de cada sesión permanecen conectadas para que puedas elegir el mejor encuadre sin perder continuidad.",
    differentiators: [
      { title: "Cada sesión cuenta una historia visual", body: "El entorno, la ropa y la luz se mantienen dentro de una misma idea. Los cambios de encuadre, postura y expresión parecen momentos de la misma sesión, no generaciones independientes." },
      { title: "Quince ideas crean variedad de verdad", body: "Tu entrega puede pasar de una escena cotidiana a una actividad o a un estilo más arreglado. Los ejemplos del sitio muestran posibilidades; tus selfies y respuestas orientan tu propio pedido." },
      { title: "Tus intereses reales marcan la dirección", body: "Tus respuestas ofrecen contexto para imaginar lugares y acciones que encajen contigo. Un interés auténtico puede inspirar varias escenas en vez de quedar reducido a una imagen predeterminada." },
      { title: "Tus selfies actuales mantienen el parecido", body: "Entre cuatro y seis referencias recientes guían los rasgos reconocibles durante toda la entrega. Las 15 repeticiones permiten rehacer una imagen sólida cuando algún detalle necesita otra versión." },
    ],
    deliveryPoints: [
      { title: "15 ideas de sesiones creadas para tu entrega", body: "Cada entrega combina de forma distinta el escenario, el estilo, la actividad, la luz y el ambiente. Las posibilidades no se limitan a los ejemplos que aparecen en el sitio." },
      { title: "Cuatro fotos conectadas por cada idea", body: "Cada sesión produce cuatro variaciones naturales del mismo momento. La historia visual se mantiene mientras cambian el encuadre, la postura y la expresión." },
      { title: "Un parecido guiado en las 60 fotos", body: "Tus selfies recientes siguen siendo la referencia visual de toda la generación, para que el conjunto parezca una sola persona actual: tú." },
    ],
    sections: [
      { heading: "Un perfil de " + app + " funciona mejor cuando las fotos se apoyan entre sí", paragraphs: ["Las personas ven tu perfil como el de una sola persona, no como una colección de archivos separados. Diferencias grandes en rostro, edad, cuerpo o acabado generan dudas aunque cada imagen sea bonita por separado.", "UnrealShot mantiene también la coherencia dentro de cada sesión. Las cuatro fotos comparten escenario, ropa y luz: tienes opciones para elegir sin que parezca que juntaste generaciones sin relación."] },
      { heading: "Parecido actual y variedad que aporta información", paragraphs: ["Tus selfies recientes guían el parecido; las 15 ideas aportan variedad de lugares, actividades, encuadres y expresiones. Esa combinación enseña distintas facetas sin inventar una nueva identidad.", "El criterio es sencillo: el resultado debe seguir pareciéndose a ti hoy. Una repetición sirve cuando la idea es buena pero hace falta mejorar el rostro, la expresión o la composición."] },
      { heading: "De tus selfies de referencia a 60 fotos terminadas", paragraphs: ["Sube 4–6 selfies individuales recientes, con el rostro visible desde más de un ángulo y con luz normal. Después responde tres preguntas breves sobre el estilo y los intereses que realmente forman parte de tu vida.", "UnrealShot crea 15 ideas y cuatro fotos relacionadas para cada una. La entrega llega en menos de 30 minutos; las 15 repeticiones individuales permiten retocar una foto sin reiniciar todo el proyecto."], bullets: ["Pago único: 39 $", "Sin suscripción", "15 sesiones coherentes", "60 fotos en total", "15 repeticiones individuales"] },
    ],
    exampleSlugs: app === "Tinder" ? ["outdoor-coffee", "city-walk", "gym-training", "dinner"] : app === "Hinge" ? ["home-cooking", "outdoor-coffee", "coastal-travel", "dinner"] : ["gym-training", "city-walk", "outdoor-coffee", "rooftop"],
    policy: [v.requirement, v.trustNote, "Utiliza solo imágenes que representen honestamente tu aspecto actual y tus intereses reales, y revisa las normas oficiales de " + app + " antes de publicar."],
    faqs: [
      { question: "¿Qué son las fotos de " + app + " generadas por IA?", answer: "Son opciones de fotos de perfil creadas a partir de selfies de referencia actuales. UnrealShot imagina varias sesiones y produce cuatro imágenes relacionadas por idea para comparar encuadres y expresiones." },
      { question: "¿Cómo se crean mis ideas de sesiones para " + app + "?", answer: "Tus selfies actuales y tres respuestas breves aportan el contexto. UnrealShot genera 15 ideas distintas; los ejemplos del sitio muestran posibilidades, no un catálogo cerrado." },
      { question: "¿Cuántas fotos crea UnrealShot para " + app + "?", answer: "Un pedido de 39 $ incluye 15 sesiones de cuatro fotos, es decir, 60 imágenes, además de 15 repeticiones individuales." },
      { question: "¿Cómo se mantiene el parecido conmigo?", answer: "Tus 4–6 selfies actuales guían el parecido de toda la entrega. Compara las imágenes con tu aspecto de hoy y pide una repetición si un detalle importante no encaja." },
      { question: "¿Se pueden usar fotos de IA en " + app + "?", answer: v.trustNote + " Consulta siempre las normas vigentes en tu región y conserva fotos recientes que anclen tu perfil en la vida real." },
      { question: "¿Puedo mejorar una sola foto?", answer: "Sí. Las 15 repeticiones individuales sirven para volver a generar una imagen cuya idea funciona, pero cuyo rostro, expresión o encuadre necesita otro intento." },
    ],
  }),
  guide: (app: LocalizedPlatformApp, v) => ({
    eyebrow: "Guía de fotos de " + app + " para hombres",
    title: "Fotos de " + app + ": cómo crear una selección clara, variada y creíble",
    description: "Una guía práctica de fotos de " + app + " sobre la primera imagen, el orden del perfil, los encuadres, las escenas de actividad, los errores comunes, el uso responsable de la IA y las normas actuales.",
    answer: "Una buena selección para " + app + " empieza con " + v.firstPhoto + " y después añade información distinta: cuerpo, actividad, ropa y momentos de vida. Cada imagen debe responder una pregunta nueva. Comprueba los encuadres en el móvil, mantén tu aspecto actual y usa las imágenes de IA para cubrir una carencia real, no para inventar una vida más llamativa.",
    quickFacts: [["Función de la primera foto", "Que te reconozcan al instante"], ["Variedad útil", "Rostro, cuerpo, actividad, contexto"], ["Qué comprobar", v.requirement], ["Función particular", v.specialFeature]],
    sections: [
      { heading: "La primera foto debe hacer fácil reconocerte", paragraphs: ["Empieza con " + v.firstPhoto + ". Los ojos deben verse, la luz debe ser clara y el rostro debe ocupar suficiente espacio para soportar el recorte de la aplicación. La sencillez suele ayudar más que un escenario espectacular.", "No le pidas a esta imagen que muestre toda tu personalidad. Su trabajo principal es la claridad; las actividades, la variedad de ropa y los momentos espontáneos vienen después."] },
      { heading: "Asigna un papel diferente a cada espacio", paragraphs: ["Crea una base con un retrato individual, una foto de cuerpo entero, una actividad auténtica, una ropa diferente y un momento relajado. Si tienes menos fotos buenas, usa menos espacios en vez de llenarlos con duplicados.", "Una foto adicional debería aportar información nueva. Dos retratos con la misma ropa y en la misma habitación no cumplen dos funciones distintas."], bullets: ["Retrato individual claro", "Foto de cuerpo entero cotidiana", "Actividad que realmente practicas", "Contraste de ropa o de ocasión", "Momento relajado y actual"] },
      { heading: "Elige una foto de cuerpo entero que siga pareciendo natural", paragraphs: ["Una foto de cuerpo entero muestra la silueta, la postura y tu estilo diario. No te conviertas en una figura diminuta dentro de un paisaje y evita cortar tobillos, rodillas o la parte superior de la cabeza.", "Caminar, apoyarte de forma natural o detenerte en un lugar conocido suele funcionar mejor que una postura rígida. El sitio debe acompañar la foto, no convertirse en su protagonista."] },
      { heading: "Las fotos de actividad deben ser verdaderas antes que impresionantes", paragraphs: ["Una escena cocinando, entrenando, tomando café, leyendo o caminando solo ayuda si podrías hablar de ella con naturalidad. Un detalle concreto abre más conversación que un escenario lujoso elegido para impresionar.", "Los accesorios no deben fabricar una identidad. Un interés sencillo y sincero vale más que un viaje, una mascota o una afición inventada que el resto del perfil no pueda sostener."] },
      { heading: "Prueba los recortes en un móvil real", paragraphs: ["Mira cada candidata al tamaño en que se verá. El rostro y la acción deben seguir siendo legibles después del recorte de la interfaz. Deja algo de espacio alrededor del sujeto sin elegir una foto tan amplia que desaparezcas.", "Busca detalles que distraen: una mano cortada, un zapato fuera del encuadre, otra persona entrando por el borde o un cartel demasiado luminoso. Una foto nítida puede funcionar mal después del recorte."], bullets: ["Previsualizar formatos cuadrado y vertical", "Mantener los ojos lejos del borde superior", "Colocar la acción principal en el centro", "Revisar textos y reflejos del fondo", "Comprobar la nitidez después de subirla"] },
      { heading: "Usa las fotos de IA como complemento, no como disfraz", paragraphs: ["Una imagen generada puede cubrir una carencia real: una foto de cuerpo entero nítida, una ropa diferente o una actividad que cuesta fotografiar. No debería reemplazar todas las pruebas reales de tu vida.", "Compara cada candidata con tus fotos actuales. Descártala si cambian la forma del rostro, la edad, el pelo, el cuerpo o un detalle de la piel. Conserva también fotos recientes tomadas en la vida real."] },
      { heading: "Entiende las reglas propias de " + app, paragraphs: [v.requirement, v.trustNote, "Estas reglas pueden cambiar y una imagen generada no garantiza aprobación ni verificación. Publica únicamente fotos fieles a tu realidad y revisa las fuentes oficiales antes de terminar tu perfil."] },
      { heading: "Los errores que más debilitan un perfil", paragraphs: ["Los duplicados son el problema más evidente: varios selfies, varios espejos del gimnasio o varias fotos con la misma ropa. También perjudican un rostro difícil de ver, las imágenes antiguas y las actividades que parecen preparadas.", "Haz la revisión a nivel de la selección. Escribe en una frase qué función cumple cada imagen. Si dos frases son iguales, conserva la más clara y usa el espacio restante para mostrar algo verdadero."], bullets: ["Primera imagen poco clara", "Varias fotos casi idénticas", "Ninguna foto de cuerpo entero", "Aspecto antiguo o incoherente", "Filtros o retoques demasiado visibles", "Afición inventada"] },
    ],
    checklist: ["Mi rostro está despejado en la primera foto", "La primera imagen coincide con mi aspecto actual", "Una foto muestra mi cuerpo entero", "Al menos una actividad es realmente mía", "Cambian la ropa y los lugares", "Ninguna imagen repite exactamente la misma función", "Las imágenes de IA encajan con mis fotos reales", "He revisado cada recorte en el móvil", "Ninguna imagen sugiere un viaje o afición falsa", "He leído las normas actuales de " + app],
    faqs: [
      { question: "¿Cuál debería ser la primera foto en " + app + "?", answer: "Elige " + v.firstPhoto + ". Que puedan reconocerte importa más que un escenario llamativo o una pose complicada." },
      { question: "¿Hace falta una foto de cuerpo entero?", answer: "Sí, aporta información sobre la silueta, la postura y el estilo cotidiano. Mantén el rostro reconocible y evita aparecer como una figura diminuta en un paisaje." },
      { question: "¿Se pueden usar fotos generadas por IA?", answer: v.trustNote + " Usa solo imágenes fieles, conserva fotos recientes de tu vida real y comprueba las normas de la plataforma." },
      { question: "¿Cómo elijo el orden de las fotos?", answer: "Empieza con la imagen más clara de tu rostro y deja que cada foto siguiente aporte algo nuevo: cuerpo entero, actividad, ropa, expresión o un momento real." },
      { question: "¿Cuántas fotos debo publicar?", answer: v.requirement + " Usa los espacios disponibles para papeles distintos, no para llenar la galería con duplicados." },
    ],
  }),
  guideLabel: (app) => "Leer la guía completa de fotos de " + app,
  productLabel: (app) => "Crear una selección completa de fotos de " + app,
}

export const esPlatformPages = buildLocalizedPlatformPages(es)
