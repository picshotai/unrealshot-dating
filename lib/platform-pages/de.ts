import { buildLocalizedPlatformPages } from "./localized-build"
import type { PlatformLocalePack, LocalizedPlatformApp } from "./localized-types"

const de: PlatformLocalePack = {
  locale: "de",
  reviewed: "31. August 2026",
  sourceLabels: {
    Tinder: ["Tinder: Fotobestätigung", "Tinder: Gesichtsanforderungen und ausgeblendete Profile", "Tinder-Community-Richtlinien"],
    Hinge: ["Hinge: Profil bearbeiten", "Hinge: Fotos hinzufügen und bearbeiten", "Hinge: Verbotene Inhalte und Verhaltensweisen bei Hinge"],
    Bumble: ["Bumble: Regeln für Profilfotos", "Bumble: Best Photo-Funktion", "Bumble-Community-Richtlinien"],
  },
  variants: {
    Tinder: {
      focus: "Klarheit und Abwechslung in einem Profil, das schnell durchgesehen wird",
      requirement: "Tinder verlangt in vielen Regionen ein klar erkennbares Gesicht und kann Profile ohne erkennbares Gesichtsbild ausblenden.",
      firstPhoto: "ein aktuelles, scharfes Einzelbild, auf dem du sofort erkennbar bist",
      specialFeature: "die Fotobestätigung mit einem Video-Selfie",
      trustNote: "Tinder vergleicht ein kurzes Video-Selfie mit den Profilfotos. Ein generiertes Bild darf deshalb niemals einen Look darstellen, der nicht deinem heutigen Aussehen entspricht.",
    },
    Hinge: {
      focus: "die Verbindung zwischen Fotos und den schriftlichen Antworten im Profil",
      requirement: "Hinge verlangt je nach Region vier bis sechs Fotos sowie drei Antworten auf Prompts.",
      firstPhoto: "ein aktuelles Einzelporträt, auf dem man dich ohne Rätselraten erkennt",
      specialFeature: "Prompts, Bildunterschriften und Antworten, die den Fotos einen persönlichen Zusammenhang geben",
      trustNote: "Hinge verbietet KI-generierte Inhalte, wenn sie zum Täuschen oder Irreführen eingesetzt werden. Gezeigte Aktivitäten und Interessen müssen deshalb wirklich zu dir passen.",
    },
    Bumble: {
      focus: "klare erste Signale und einfache Gesprächseinstiege",
      requirement: "Bumble erlaubt bis zu sechs Fotos oder Videos und empfiehlt meist vier bis sechs davon.",
      firstPhoto: "ein aktuelles, helles Einzelbild mit gut sichtbaren Augen und Gesicht",
      specialFeature: "die Best-Photo-Funktion, die das Bild mit den besten Reaktionen in der App nach vorne stellen kann",
      trustNote: "Bumble verbietet künstliche oder bearbeitete Fotos, wenn sie zur Täuschung dienen. Halte aktuelle Bilder und ein realistisches Aussehen im Profil.",
    },
  },
  landing: (app: LocalizedPlatformApp, v) => ({
    eyebrow: "KI-Datingfotos für Männer auf " + app,
    title: app + "-Fotos, die deinem Profil eine glaubwürdige visuelle Geschichte geben",
    description: "Erstelle aus 4–6 Selfies 60 realistische " + app + "-Fotos in 15 stimmigen Shootings. Inklusive 15 einzelner Neuanfertigungen und Lieferung innerhalb von 30 Minuten für einmalig 39 $.",
    answer: "UnrealShot macht aus 4–6 aktuellen Selfies 15 Shooting-Ideen für dein " + app + "-Profil. Jede Idee wird zu vier verbundenen Fotos: Umgebung, Outfit und Licht bleiben stimmig, während Bildausschnitt und Ausdruck variieren. Du erhältst 60 Fotos, 15 einzelne Neuanfertigungen und die Lieferung innerhalb von 30 Minuten – einmalig für 39 $.",
    heroBullets: ["15 vollständige Shootings, 60 Fotos", "Vier verbundene Bilder pro Shooting", "15 einzelne Neuanfertigungen inklusive", "Lieferung innerhalb von 30 Minuten · einmalig 39 $"],
    problemIntro: "Die meisten Männer haben bereits viele Bilder. Das Problem: Oft zeigen sie denselben Winkel, dasselbe Zimmer oder völlig unterschiedliche Lebensphasen. So lässt sich nur schwer ein aktuelles, natürliches und vollständiges " + app + "-Profil aufbauen – besonders wenn der erste Eindruck in wenigen Sekunden entsteht.",
    problems: [
      { title: "Dein bestes aktuelles Bild ist trotzdem ein Selfie", body: "Ein klares Selfie zeigt dein Gesicht, aber selten den Ort, die Körperhaltung und den Abstand einer echten Situation. Dem Profil fehlt dadurch schnell die visuelle Tiefe." },
      { title: "Der Rest deiner Galerie wirkt wiederholt sich", body: "Ein leicht veränderter Winkel liefert noch keine neue Information. Eine bessere Auswahl wechselt Umgebung, Kleidung, Energie und Bildaufbau, ohne wie eine andere Person zu wirken." },
      { title: "Einzelne KI-Bilder gehören nicht sichtbar zusammen", body: "Wenn Gesicht, Körper oder Bildstil ohne erkennbaren Grund wechseln, wirkt die Galerie zusammengestellt. UnrealShot verbindet vier Bilder innerhalb eines Shootings zu einem glaubwürdigen Moment." },
    ],
    solutionIntro: "UnrealShot macht aus wenigen aktuellen Referenzen einen ganzen Vorrat an " + app + "-Fotos. Die 15 Ideen wechseln zwischen Umgebungen, Aktivitäten, Outfits und Stimmungen; die vier Bilder eines Shootings bleiben verbunden, damit du den besten Ausschnitt auswählen kannst, ohne die Kontinuität zu verlieren.",
    differentiators: [
      { title: "Jedes Shooting erzählt eine zusammenhängende Szene", body: "Umgebung, Kleidung und Licht bleiben innerhalb einer Idee konsistent. Unterschiede bei Ausschnitt, Haltung und Gesichtsausdruck wirken wie Momente aus demselben Shooting." },
      { title: "Fünfzehn Ideen schaffen echte Bandbreite", body: "Deine Lieferung kann alltägliche, aktive, entspannte und etwas schickere Richtungen abdecken. Die Beispiele auf der Website zeigen Möglichkeiten; deine Selfies und Antworten geben die Richtung vor." },
      { title: "Deine echten Interessen geben den Ideen Persönlichkeit", body: "Deine Antworten liefern Kontext für passende Orte und Handlungen. Ein echtes Interesse kann mehrere Szenen inspirieren, statt an ein einziges vorgefertigtes Bild gebunden zu sein." },
      { title: "Aktuelle Selfies halten die Ähnlichkeit zusammen", body: "Vier bis sechs aktuelle Referenzen steuern die erkennbaren Merkmale in der gesamten Lieferung. Mit 15 Neuanfertigungen kannst du ein gutes Bild weiter verbessern, wenn ein Detail noch nicht passt." },
    ],
    deliveryPoints: [
      { title: "15 Shooting-Ideen für deine Lieferung", body: "Jede Lieferung verbindet Umgebung, Styling, Aktivität, Licht und Stimmung auf unterschiedliche Weise. Die Möglichkeiten gehen über die wenigen Beispiele auf der Website hinaus." },
      { title: "Vier verbundene Fotos aus jeder Idee", body: "Jedes Shooting erzeugt vier natürliche Varianten desselben Moments. Die visuelle Geschichte bleibt stimmig, während Ausschnitt, Haltung und Ausdruck wechseln." },
      { title: "Eine erkennbare Person in allen 60 Fotos", body: "Deine aktuellen Selfies bleiben die visuelle Referenz der gesamten Generierung, damit die Lieferung wie eine einzige heutige Person aussieht: du." },
    ],
    sections: [
      { heading: "Ein " + app + "-Profil wirkt stärker, wenn die Fotos zusammenpassen", paragraphs: ["Menschen sehen dein Profil als das einer Person, nicht als Sammlung unabhängiger Dateien. Große Unterschiede bei Gesicht, Alter, Körper oder Bildstil erzeugen Zweifel, selbst wenn jedes einzelne Bild gut aussieht.", "UnrealShot hält auch jedes einzelne Shooting zusammen. Vier Fotos teilen sich Umgebung, Outfit und Licht. So hast du Auswahl, ohne Bilder aus unverbundenen Generationen nebeneinanderzustellen."] },
      { heading: "Aktuelle Ähnlichkeit und Abwechslung mit echtem Nutzen", paragraphs: ["Deine Selfies steuern die Ähnlichkeit; die 15 Ideen bringen verschiedene Orte, Aktivitäten, Ausschnitte und Ausdrücke. So zeigst du mehrere Seiten, ohne eine neue Identität zu erfinden.", "Der Maßstab ist einfach: Das Ergebnis muss noch so aussehen wie du heute. Eine Neuanfertigung ist sinnvoll, wenn die Idee stimmt, aber Gesicht, Ausdruck oder Bildaufbau noch einmal verbessert werden sollten."] },
      { heading: "Von Referenz-Selfies zu 60 fertigen Datingfotos", paragraphs: ["Lade 4–6 aktuelle Einzel-Selfies hoch, auf denen dein Gesicht aus mehreren Winkeln und bei normalem Licht sichtbar ist. Beantworte danach drei kurze Fragen zu Stil und echten Interessen, die zu deinem Alltag passen.", "UnrealShot erstellt 15 Ideen und jeweils vier verbundene Fotos. Die Lieferung kommt innerhalb von 30 Minuten; mit 15 einzelnen Neuanfertigungen kannst du ein Bild überarbeiten, ohne das ganze Projekt neu zu starten."], bullets: ["Einmaliger Preis: 39 $", "Kein Abonnement", "15 stimmige Shootings", "60 Fotos insgesamt", "15 einzelne Neuanfertigungen"] },
    ],
    exampleSlugs: app === "Tinder" ? ["outdoor-coffee", "city-walk", "gym-training", "dinner"] : app === "Hinge" ? ["home-cooking", "outdoor-coffee", "coastal-travel", "dinner"] : ["gym-training", "city-walk", "outdoor-coffee", "rooftop"],
    policy: [v.requirement, v.trustNote, "Verwende nur Bilder, die dein heutiges Aussehen und deine echten Interessen ehrlich darstellen, und prüfe die offiziellen " + app + "-Regeln vor dem Veröffentlichen."],
    faqs: [
      { question: "Was sind KI-generierte " + app + "-Fotos?", answer: "Es sind Profilfotos, die aus aktuellen Referenz-Selfies erstellt werden. UnrealShot entwickelt mehrere Shooting-Ideen und erzeugt pro Idee vier verbundene Bilder zum Vergleichen von Ausschnitt und Ausdruck." },
      { question: "Wie entstehen meine " + app + "-Shooting-Ideen?", answer: "Deine aktuellen Selfies und drei kurze Antworten geben den Kontext. UnrealShot erstellt 15 unterschiedliche Ideen; die Beispiele auf der Website zeigen daher Möglichkeiten und keine feste Auswahl." },
      { question: "Wie viele Fotos erstellt UnrealShot für " + app + "?", answer: "Ein Auftrag für 39 $ umfasst 15 Shootings mit je vier Fotos, also 60 Bilder, sowie 15 einzelne Neuanfertigungen." },
      { question: "Wie bleibt die Ähnlichkeit erhalten?", answer: "Deine 4–6 aktuellen Selfies steuern die Ähnlichkeit der gesamten Lieferung. Vergleiche die Ergebnisse mit deinem heutigen Aussehen und fordere eine Neuanfertigung an, wenn ein wichtiges Detail nicht stimmt." },
      { question: "Sind KI-Fotos auf " + app + " erlaubt?", answer: v.trustNote + " Prüfe die Regeln für deine Region und behalte aktuelle echte Fotos, die dein Profil im wirklichen Leben verankern." },
      { question: "Kann ich ein einzelnes Foto verbessern?", answer: "Ja. Die 15 einzelnen Neuanfertigungen sind dafür gedacht, ein Bild mit guter Idee noch einmal zu erstellen, wenn Gesicht, Ausdruck oder Ausschnitt nicht ganz passen." },
    ],
  }),
  guide: (app: LocalizedPlatformApp, v) => ({
    eyebrow: app + "-Foto-Guide für Männer",
    title: app + "-Fotos: So stellst du eine klare, abwechslungsreiche und glaubwürdige Auswahl zusammen",
    description: "Ein praktischer Guide für " + app + "-Fotos: erstes Bild, Reihenfolge, Ausschnitte, echte Aktivitäten, häufige Fehler, verantwortungsvoller KI-Einsatz und aktuelle Regeln.",
    answer: "Eine gute " + app + "-Auswahl beginnt mit " + v.firstPhoto + " und ergänzt danach verschiedene Informationen: Körper, Aktivität, Kleidung und Alltag. Jedes weitere Bild sollte eine neue Frage beantworten. Prüfe Ausschnitte auf dem Smartphone, bleibe bei deinem aktuellen Aussehen und nutze KI-Bilder nur, um eine echte Lücke zu schließen – nicht, um ein beeindruckenderes Leben zu erfinden.",
    quickFacts: [["Aufgabe des ersten Bildes", "Sofort erkannt werden"], ["Sinnvolle Vielfalt", "Gesicht, Körper, Aktivität, Kontext"], ["Wichtig zu prüfen", v.requirement], ["Besonderes Feature", v.specialFeature]],
    sections: [
      { heading: "Das erste Bild muss dich sofort erkennbar machen", paragraphs: ["Beginne mit " + v.firstPhoto + ". Die Augen sollten sichtbar sein, das Licht klar und das Gesicht groß genug, um den Zuschnitt der App zu überstehen. Ein ruhiges Bild hilft meist mehr als ein spektakulärer Hintergrund.", "Das erste Bild muss nicht deine ganze Persönlichkeit beweisen. Seine wichtigste Aufgabe ist Klarheit; Aktivitäten, verschiedene Outfits und spontane Momente kommen in den folgenden Plätzen."] },
      { heading: "Jeder Platz braucht eine eigene Aufgabe", paragraphs: ["Baue zuerst eine Grundlage aus Einzelporträt, Ganzkörperbild, echter Aktivität, anderem Outfit und entspanntem Moment. Wenn du weniger gute Bilder hast, nutze lieber weniger Plätze, statt die Galerie mit Wiederholungen zu füllen.", "Ein zusätzliches Bild sollte neue Informationen liefern. Zwei Porträts im selben Outfit und im selben Raum erfüllen nicht wirklich zwei verschiedene Aufgaben."], bullets: ["Klares Einzelporträt", "Alltägliches Ganzkörperbild", "Echte Aktivität", "Anderes Outfit oder anderer Anlass", "Entspannter, aktueller Moment"] },
      { heading: "Ein Ganzkörperbild darf nicht künstlich wirken", paragraphs: ["Ein Ganzkörperbild zeigt Körper, Haltung und Alltagsstil. Werde dabei nicht zu einer winzigen Figur in einer dramatischen Landschaft und vermeide Zuschnitte an Knöcheln, Knien oder am Kopf.", "Gehen, eine natürliche Anlehnung oder ein vertrauter Ort funktionieren oft besser als eine steife Frontpose. Der Ort soll das Bild unterstützen, nicht selbst zum Hauptmotiv werden."] },
      { heading: "Aktivitätsbilder müssen echt sein, bevor sie beeindruckend sind", paragraphs: ["Kochen, Training, Kaffee, Lesen oder ein Spaziergang sind nur dann gute Motive, wenn du entspannt darüber sprechen könntest. Ein konkretes Detail öffnet eher ein Gespräch als eine Luxus-Szene, die nur beeindrucken soll.", "Requisiten dürfen keine Identität erfinden. Ein einfaches, echtes Interesse ist stärker als eine erfundene Reise, ein geliehenes Haustier oder ein Hobby, das der Rest des Profils nicht stützt."] },
      { heading: "Prüfe jeden Zuschnitt auf einem echten Smartphone", paragraphs: ["Sieh dir jedes Bild in der Größe an, in der es tatsächlich gesehen wird. Gesicht und Handlung müssen auch nach dem Zuschnitt der Oberfläche lesbar bleiben. Lass etwas Platz um die Person, ohne dich in einer zu weiten Aufnahme verschwinden zu lassen.", "Achte auf störende Randdetails: abgeschnittene Hände, halbierte Schuhe, eine weitere Person am Rand oder ein helles Schild. Ein scharfes Foto kann nach dem Zuschnitt trotzdem schlecht funktionieren."], bullets: ["Quadratische und Hochformat-Zuschnitte prüfen", "Augen nicht direkt an den oberen Rand setzen", "Die wichtigste Handlung zentral halten", "Text und Spiegelungen im Hintergrund prüfen", "Schärfe nach dem Upload kontrollieren"] },
      { heading: "KI-Fotos als Ergänzung, nicht als Verkleidung verwenden", paragraphs: ["Ein generiertes Bild kann eine echte Lücke schließen: ein scharfes Ganzkörperfoto, ein anderes Outfit oder eine Alltagsszene, die schwer zu fotografieren ist. Es sollte nicht alle echten Hinweise auf dein Leben ersetzen.", "Vergleiche jedes Bild mit deinen aktuellen Handyfotos. Lehne es ab, wenn Gesichtsform, Alter, Haare, Körper oder Hautdetails nicht mehr nach dir aussehen. Behalte auch aktuelle echte Bilder im Profil."] },
      { heading: "Die besonderen Regeln von " + app + " verstehen", paragraphs: [v.requirement, v.trustNote, "Regeln können sich ändern, und ein generiertes Bild garantiert weder Freischaltung noch Bestätigung. Veröffentliche nur Bilder, die deine Realität korrekt zeigen, und lies vor dem Abschluss die offiziellen Quellen."] },
      { heading: "Die Fehler, die ein Profil am stärksten schwächen", paragraphs: ["Am auffälligsten sind Wiederholungen: mehrere Selfies, mehrere Spiegelbilder aus dem Fitnessstudio oder mehrere Bilder im selben Outfit. Dazu kommen ein schwer erkennbares Gesicht, alte Aufnahmen und Aktivitäten, die gestellt wirken.", "Prüfe die Auswahl als Ganzes. Beschreibe in einem Satz die Aufgabe jedes Bildes. Wenn zwei Sätze gleich lauten, behalte das klarere Bild und nutze den Platz für etwas Echtes."], bullets: ["Unklares erstes Bild", "Mehrere fast gleiche Fotos", "Kein Ganzkörperbild", "Altes oder widersprüchliches Aussehen", "Zu starke Filter oder Retusche", "Erfundenes Interesse"] },
    ],
    checklist: ["Mein Gesicht ist auf dem ersten Bild frei sichtbar", "Das erste Bild zeigt mein aktuelles Aussehen", "Ein Bild zeigt mich vollständig", "Mindestens eine Aktivität gehört wirklich zu mir", "Outfits und Orte unterscheiden sich", "Kein Bild erfüllt exakt dieselbe Aufgabe wie ein anderes", "KI-Bilder passen zu meinen echten aktuellen Fotos", "Ich habe jeden Zuschnitt auf dem Smartphone geprüft", "Kein Bild erfindet Reise, Hobby oder Lebensstil", "Ich habe die aktuellen Regeln von " + app + " gelesen"],
    faqs: [
      { question: "Was sollte das erste " + app + "-Foto zeigen?", answer: "Wähle " + v.firstPhoto + ". Erkennbarkeit ist wichtiger als ein spektakulärer Ort oder eine komplizierte Pose." },
      { question: "Braucht man ein Ganzkörperfoto?", answer: "Ja, es zeigt Körper, Haltung und Alltagsstil. Dein Gesicht sollte trotzdem erkennbar bleiben; vermeide eine winzige Figur in einer Landschaft." },
      { question: "Darf man KI-generierte Fotos verwenden?", answer: v.trustNote + " Verwende nur zutreffende Bilder, behalte aktuelle echte Fotos und prüfe die Regeln der Plattform." },
      { question: "Wie ordnet man die Fotos an?", answer: "Beginne mit dem klarsten aktuellen Gesichtsfoto und füge danach jeweils neue Informationen hinzu: Körper, Aktivität, Outfit, Ausdruck oder ein echter Moment." },
      { question: "Wie viele Fotos sollte man veröffentlichen?", answer: v.requirement + " Nutze die verfügbaren Plätze für unterschiedliche Aufgaben, nicht für eine Galerie voller Wiederholungen." },
    ],
  }),
  guideLabel: (app) => "Den vollständigen " + app + "-Foto-Guide lesen",
  productLabel: (app) => "Eine vollständige " + app + "-Fotoauswahl erstellen",
}

export const dePlatformPages = buildLocalizedPlatformPages(de)
