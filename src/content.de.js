// German. Only words live here: localize() in content.js lays these over the English
// projects by id, so tints, links, shapes and every number in a chart stay in one place
// (content.js) unless a section below repeats them. A project's `sections` replace the
// English ones whole, so they repeat the chart data — keep it in step when it changes.
// Reviews that were translated from German into English are given back in German
// "sinngemäß" (in substance), since the original wording isn't on file.

import { LOQQA_FROM, LOQQA_COMMITS } from './commits.js';

export const DE = {
  ui: {
    locale: 'de-DE',
    language: 'Sprache',
    keyScroll: 'Scrollen',
    keyDrag: 'Ziehen',
    touchHint: 'Ziehen zum Drehen · Tippen zum Öffnen',
    scroll: 'zum Reisen',
    drag: 'zum Drehen',
    enter: 'zum Öffnen',
    controls: 'Steuerung',
    open: 'Öffne',
    aboutShort: 'Über mich',
    sound: 'Ton',
    back: 'Zurück ins All',
    email: 'E-Mail an Timo',
    downloadCv: 'Lebenslauf herunterladen',
    toolkit: 'Werkzeuge',
    warp: 'Weiter zu',
    fullscreenNudge: 'Am besten im Vollbild.',
    enterFullscreen: 'Vollbild',
    dismiss: 'Schließen',
    factType: 'Art',
    factWhen: 'Wann',
    factRole: 'Rolle',
    justMe: 'allein',
    lowerTeam: false,
    reached: 'Diesen Schritt erreicht',
    dropped: 'Abgesprungen',
    ratingLabel: 'App-Store-Bewertung',
    outOf: 'von',
    prevScreen: 'Vorheriger Screen',
    nextScreen: 'Nächster Screen',
    appStoreTop: 'Laden im',
    playTop: 'Jetzt bei',
    soon: 'Demnächst',
  },

  about: {
    location: 'München',
    intro: 'Frontend-Entwickler in München — drei Jahre React, Next.js und Expo bei Horizon Alpha, vom Trainee zum Senior, zuletzt an Phase6 und seiner Million Nutzer. Ich komme aus dem Marketing, also lese ich lieber einen Funnel, als über einen Screen zu streiten.',
    detail: 'Drei eigene iOS-Apps, eine davon mit 12.000 Anmeldungen.',
  },

  projects: {
    loqqa: {
      meta: ['Eigenes Projekt', '2026', 'Gründer', 'Team of 1', '1 Monat'],
      kind: 'Eigenes Projekt · 03',
      tagline: 'Ein Trainingslog, das dir sagt, wo du stehst und was als Nächstes kommt — gebaut in einem Monat, mit Claude Code.',
      screenAlts: [
        'Ein Plan, der zu dir passt: die Trainingswoche mit dem aktuellen Push-Pull-Legs-Block',
        'Du wechselst die App? Bring dein Training mit: Import aus einer CSV-, TSV- oder Excel-Datei',
        'Smarte Vorschläge für jeden Satz: Gewicht und Wiederholungen während des Workouts',
        'Sieh, wie du dich veränderst: zwei Fortschrittsfotos nebeneinander, 147 Tage auseinander',
        'Kein Muskel bleibt zurück: 163 Brust-Sätze in 90 Tagen, nach Übung',
        'Deine Bestleistungen immer im Blick: Höchstgewicht pro Einheit für eine Übung',
        'Dein KI-Coach ist immer dabei: Kai erklärt, wie sich das Bankdrücken verbessert hat',
      ],
      sections: [
        { text: true, body: 'Loqqa hat mit einer Tabelle angefangen. Ich habe mein Krafttraining darin festgehalten — Sätze, Wiederholungen und Gewichte, Woche für Woche — und als ich nach einem Läuferknie zurückkam, hatte ich Monate an Daten und [[keine Ahnung, wo ich eigentlich stand]]: welche Übungen noch Fortschritte machten, welche Muskeln ich still und leise nicht mehr trainierte, ob sich das alles überhaupt gelohnt hatte. Die Daten waren alle da. Beantwortet haben sie nichts.' },
        { text: true, body: 'Loqqa ist also die App, die ich damals wollte: [[ein Trainingslog, das alles kennt, was du gemacht hast, und etwas damit anfängt]]. Es sagt dir, was als Nächstes dran ist — die Sätze, die Wiederholungen, das Gewicht für heute. Und es zeigt dir, wo du stehst: jeder Satz pro Muskel gezählt, über die letzten Wochen und Monate, damit du siehst, wo du vorankommst und wo du zurückfällst. Deine Historie kommt mit einem einzigen Import mit, aus einer Tabelle oder aus Hevy oder Strong; Kai, der Coach, beantwortet Fragen dazu; und deinen Plan kannst du einfach sagen, statt ihn einzutippen.' },
        { numbers: true, body: 'Vom ersten Commit am 8. Oktober an hat es [[einen Monat]], [[700+]] Commits und [[50.000+]] Zeilen TypeScript in der App selbst gebraucht — und bis auf eine Handvoll sind alle diese Commits zusammen mit Claude entstanden.' },
        { bars: true, title: 'Ein Monat, Commit für Commit', note: 'Jeder Commit an der App, pro Tag — vom ersten am 8. Oktober bis zur Launch-Woche.', from: LOQQA_FROM, counts: LOQQA_COMMITS, hot: 60, unit: ['Commit', 'Commits'], marks: [{ at: 13, label: '3 Tage Pause' }, { at: 28, label: '87 an einem Tag' }] },
        { text: true, body: 'Mit Claude Code hat sich [[meine Arbeit dahin verschoben, zu entscheiden, was gebaut wird, und zu prüfen, ob es stimmt]]: Designs Screen für Screen abgleichen, Review-Runden vor jedem Merge und die Antworten des Coaches von einer Eval-Suite bewertet statt nach Bauchgefühl. Den Rewrite von Blaulichtschule haben wir zu viert in zwei bis drei Monaten von Hand gebaut; das hier war eine Person und ein Monat.' },
        { list: true, lead: 'Es ist meine dritte eigene App und die erste, die [[auf dem aufbaut, was mir die anderen beiden beigebracht haben]].', items: [
          'Unload hat mir beigebracht, dass ich nicht reparieren kann, was ich nicht sehe. Loqqa hatte [[Analytics-Events und Fehler-Tracking schon vor dem Launch]], und jeder Kauf hängt an derselben PostHog-Person — so zeigen mir die ersten echten Nutzer, wo die Abläufe brechen, und nicht nur die, die sich die Mühe machen, mir zu schreiben.',
          'Traqa hat mir beigebracht, einem Modell keine Zahlen anzuvertrauen. Kai, der Coach, [[erfindet nie eine Zahl]]: Jeder geloggte Wert kommt aus einem Tool, das in Code geschrieben ist und das er zitieren statt schätzen soll, und er rechnet nur obendrauf — eine Differenz, einen Prozentsatz, ein Zieldatum. Jeder Plan, den das Modell schreibt, wird auf sinnvolle Sätze, Wiederholungen und Intensität begrenzt, bevor die App ihn übernimmt, die Pausen legt die App fest und nicht das Modell, und der Coach wird gegen eine Eval-Suite getestet, die Zahlen markiert, die nicht von den Tools kamen.',
        ], after: 'Beides ist nicht clever. Beides sind Lektionen aus Unload und Traqa, [[diesmal von Anfang an umgesetzt]].' },
        { text: true, body: 'Loqqa ist [[offline-first]]. Jeder Satz wird in dem Moment auf dem Handy gespeichert, in dem du ihn loggst, und synchronisiert, sobald es eine Verbindung gibt, und die Übungsbilder sind schon heruntergeladen — ein Gym ohne Empfang ändert also nichts. Technisch heißt das: SQLite auf dem Gerät und PowerSync zu Supabase.' },
      ],
    },

    phase6: {
      meta: ['Kundenprojekt · Horizon Alpha', '2025', 'Frontend-Entwickler', 'im Dreierteam', '5 Wochen'],
      kind: 'Kundenprojekt · 01',
      tagline: 'Die Analytics aufbauen, die Phase6 nicht hatte, den einen Screen finden, an dem Lehrkräfte aufgegeben haben, und den Fix ausliefern, der die Registrierungen von 10 % auf 18 % gebracht hat.',
      sections: [
        { text: true, body: 'Phase6 ist eine Vokabel-Lernplattform, die in Deutschland von über einer Million Schülerinnen und Schülern genutzt wird. Lehrkräfte können über einen anonymen Ablauf ohne Konto einen Test erstellen — aber [[niemand konnte sagen, wie viele, die anfingen, auch fertig wurden]]. Für diesen Ablauf gab es überhaupt keine Analytics.' },
        { text: true, body: 'Niemand hat mich gebeten, das zu ändern — ich habe vorgeschlagen, Amplitude einzuführen, nachdem mir aufgefallen war, dass wir den anonymen Ablauf immer wieder auf Basis von Annahmen statt Belegen änderten. In etwa zwei Wochen habe ich jeden Schritt vom Start eines Tests bis zum Speichern in eine [[saubere Event-Taxonomie]] übersetzt, sie implementiert und die Funnels gebaut, um zu sehen, wo der Ablauf wirklich abbrach.' },
        { funnel: true, title: 'Test erstellen: vorher und nachher', note: 'Der Anteil anonymer Nutzer, die bei jedem Schritt noch dabei sind. Der Schritt, auf den es ankam — sich zu registrieren, um den gerade gebauten Test zu behalten —, ging von einem von zehn auf fast einen von fünf.', tabs: [
          { label: 'Vor dem Redesign', steps: [
            { label: 'Test erstellen gestartet', pct: 100 },
            { label: 'Speichern-Hinweis angezeigt', pct: 47.66 },
            { label: 'Zum Speichern registriert', pct: 10.29 },
          ] },
          { label: 'Nach dem Redesign', steps: [
            { label: 'Test erstellen gestartet', pct: 100 },
            { label: 'Speichern-Hinweis angezeigt', pct: 47.66 },
            { label: 'Zum Speichern registriert', pct: 18 },
          ] },
        ] },
        { text: true, body: 'Die Daten zeigten auf einen Screen — die Stelle, an der ein anonymer Nutzer gebeten wird, [[ein Konto anzulegen, nur um den Test zu behalten, den er schon gebaut hat]]. Vorher schickte dieser Hinweis die Leute auf eine eigene Seite zum Anmelden oder Registrieren, und ein neues Konto musste dann ein Onboarding mit mehreren Fragen durchlaufen, bevor es die App überhaupt wiedersah. Zwei Wochen Hin und Her mit unserem UI/UX-Design, jede Runde am Funnel gemessen statt an Meinungen, endeten in etwas viel Kleinerem: [[ein Popup, das nach einer E-Mail fragt, ein Klick auf Registrieren, und du bist mit gespeichertem Test in der App]] — kein Umweg, kein Onboarding. Das Redesign selbst war an einem einzigen Nachmittag umgesetzt, und der Anteil der Leute, die sich registrierten, um ihren Test zu behalten, stieg von [[10 % auf 18 %]].' },
        { rating: true, title: 'Bewertungen', note: 'Das Produkt, zu dem dieser Ablauf gehört, so wie es im deutschen App Store bewertet wird.', value: 4.5, caption: 'Über 82.000 Bewertungen im deutschen App Store.', distribution: [72, 16, 6, 2, 5] },
        { text: true, body: 'Dieses Verhältnis — Wochen des Instrumentierens und Diskutierens, ein Nachmittag Bauen — ist der Teil dieses Projekts, auf den ich zeigen würde. Der Fix war klein. [[Zu wissen, welcher kleine Fix der richtige ist, war die eigentliche Arbeit.]]' },
        { quote: true, stars: 5, line: 'Man wählt einfach sein Schulbuch aus, und die App erstellt die Übungen — das ist einfach so viel besser als alle anderen Apps.', source: 'App-Store-Bewertung, April 2026. Sinngemäß wiedergegeben.' },
      ],
    },

    unload: {
      meta: ['Eigenes Projekt', '2023 — 2024', 'Gründer', 'Team of 1', '20 Monate'],
      kind: 'Eigenes Projekt · 01',
      tagline: 'Eine App für 14- bis 20-Jährige, die eine zwanghafte Gewohnheit ablegen wollen, gebaut auf Gruppen statt Streaks — 12.000 Anmeldungen, ein viraler Launch und die nüchterne Entscheidung, sie abzuschalten.',
      sections: [
        { text: true, body: 'Die Erkenntnis dahinter: Der Moment, in dem jemand kurz vor einem Rückfall steht, ist kein Moment für einen Vortrag oder ein Diagramm — [[es ist ein Moment, in dem man einen anderen Menschen braucht]]. Statt eines Streak-Zählers für sich allein hat Unload die Leute deshalb in kleine Gruppen gebracht, die sich gegenseitig in die Pflicht nehmen. Da sonst niemand dabei war, hieß das für mich Marketing und Support genauso wie Code.' },
        { numbers: true, body: 'In zwanzig Monaten haben sich [[12.000+]] Leute angemeldet, [[etwa 800]] haben die App jeden Monat geöffnet und sie mit [[4,6 Sternen]] bei über 50 Bewertungen bewertet. Abos brachten in der Spitze bis zu [[280 €]] im Monat.' },
        { text: true, body: 'Eine Warteschlange hat jeden neuen Nutzer in eine feste Gruppe von zwei bis vier Leuten mit Echtzeit-Chat eingeteilt, und die Gruppe teilte sich einen Streak: [[Wurde einer rückfällig, ging der Zähler für alle auf null]]. Das klingt hart, und genau darum ging es — aus einem privaten Scheitern wurde etwas, das man der Gruppe schuldete, und genau dieser Druck hilft um zwei Uhr nachts. Neben den Gruppen gab es einen 365-Tage-Audiokurs in fünf Sprachen (Deutsch, Englisch, Spanisch, Französisch, Portugiesisch), aufgebaut auf Prinzipien der kognitiven Verhaltenstherapie, der die Leute von Tag null an dahin führte zu verstehen, was ihren Drang eigentlich auslöst.' },
        { rating: true, title: 'Bewertungen', note: 'Die App-Store-Bewertung über die zwanzig Monate der App — sie ist nicht mehr gelistet, das ist also der Endstand.', value: 4.6, caption: 'Über 50 Bewertungen im App Store.', distribution: [71, 18, 6, 2, 3] },
        { text: true, body: 'Der Launch war ein Zufall des Timings. Ein paar TikToks über die Idee gingen viral — jeweils 50.000 bis 200.000 Aufrufe — und eins davon hob ab, bevor es die App überhaupt gab. Ich hatte eine Warteliste und ein Zeitfenster, also habe ich den Build in ein paar Tagen fertiggestellt, um den Schwung mitzunehmen: [[fast 500 Anmeldungen am Launch-Tag]], danach konstant 40–50 am Tag. Es war die deutlichste Lektion, die ich je hatte, dass [[Reichweite, nicht Code, der schwierige Teil eines Produkts ist]].' },
        { text: true, body: 'Ich habe sie bewusst abgeschaltet. Ohne laufendes Marketing ließ das Wachstum nach; der Umsatz rutschte von einer Spitze bei etwa 280 € im Monat auf rund 120 €, gegenüber etwa 50 € Fixkosten für Hosting und den App Store, plus dem Kundensupport, den ein laufendes Produkt braucht. Eine Android-Version war der meistgewünschte Punkt — ein paar hundert Leute standen dafür auf einer Warteliste — und hätte die Zahlen vermutlich spürbar bewegt, aber sie allein neben einem Vollzeitjob zu bauen und zu betreiben, war nicht realistisch. [[Ein funktionierendes Produkt wegen der Zahlen abzuschalten, war die richtige Entscheidung]], und eine schwerere als der Launch.' },
        { waffle: true, title: 'Woher die 280 € kommen', note: 'Ein Waffeldiagramm aus 100 Quadraten, jedes 1 % des Monatsumsatzes in der Spitze, eingefärbt nach Tarif. Anteile ohne Tortendiagramm.', items: [
          { label: 'Jahresabo', value: '174 €', pct: 62 },
          { label: 'Monatsabo', value: '78 €', pct: 28 },
          { label: 'Einmalkäufe', value: '28 €', pct: 10 },
        ] },
        { list: true, lead: 'Was ich anders machen würde, dreht sich vor allem um [[das, was ich nicht sehen konnte]].', items: [
          'PostHog war früh eingebaut, aber [[die eigentlichen Abläufe habe ich nie abgebildet]] — bei all den Daten konnte ich also nicht sagen, wo Leute abgesprungen sind, wer die App wirklich genutzt hat oder welche Features ihren Platz verdient hatten.',
          'Ohne Crash-Reporting [[habe ich nur die Bugs behoben, von denen mir jemand erzählt hat]].',
        ], after: 'Beide Lücken sind der Grund, warum ich später, bei einem Produkt mit einer Million Nutzern, als Erstes auf [[saubere Funnels und Fehler-Tracking vor allem anderen]] gedrängt habe.' },
      ],
    },

    blaulichtschule: {
      meta: ['Kundenprojekt · Horizon Alpha', '2023', 'React-Native-Entwickler', 'im Viererteam', '6 Monate'],
      kind: 'Kundenprojekt · 02',
      tagline: 'Eine Codebasis übernehmen, die niemand gefahrlos anfassen konnte, und sie von Grund auf neu schreiben — ohne KI, nur vier Leute und React Native.',
      sections: [
        { text: true, body: 'Blaulichtschule ist eine App zur Prüfungsvorbereitung im Strafrecht für den Polizeinachwuchs — echte Fallstudien, Quiz-Duelle und Inhalte, die mit praktizierenden Juristen entstanden sind. Wir haben sie vom vorherigen Entwicklungsteam übernommen, und die Codebasis war kaum noch zu bearbeiten: [[keine wiederverwendbaren Komponenten, Layout durchgehend mit absoluter Positionierung]], und niemand konnte sicher sagen, wovon ein bestimmter Screen eigentlich abhing.' },
        { text: true, body: 'Etwas Neues hinzuzufügen hieß, mehr gegen den bestehenden Code zu kämpfen als neuen zu schreiben, also haben wir zu viert [[die ganze App von Grund auf in React Native mit TypeScript neu geschrieben]] — das war Anfang 2023, bevor KI-Assistenten zum Arbeitsalltag gehörten, also waren es vier Leute und viele Stunden. Wir sind [[Screen für Screen]] vorgegangen: einen Screen komplett neu bauen, ihn auf den Stand des alten bringen und erst dann seine Bugliste aufmachen — keine halb migrierten Screens und keine Zeit für Fixes an Code, der ohnehin gleich gelöscht wurde. Der Rewrite selbst dauerte etwa zwei bis drei Monate innerhalb von sechs Monaten im Projekt, und wir haben die ganze Zeit direkt mit dem Kunden gearbeitet, wirklich agil: Es war normal, freitags spät noch einen Hotfix auszuliefern, weil der Kunde den Bug genau dann gefunden hatte.' },
        { text: true, body: 'Der Rewrite zeigte sich auch in Bugsnag: [[Die Stabilität stieg von 82 % auf 91 %]] — der Anteil der Sitzungen, die ohne Absturz endeten.' },
        { funnel: true, independent: true, title: 'Weniger Abstürze', note: 'Der Stabilitätswert von Bugsnag: Der volle Teil sind Sitzungen, die ohne Absturz endeten, der schraffierte die, bei denen es anders kam. Neun Punkte klingen nach wenig — es ist der Unterschied zwischen einem Absturz in etwa jeder sechsten Sitzung und in jeder elften.', reachedLabel: 'Sitzungen ohne Absturz', droppedLabel: 'Abgestürzt', steps: [
          { label: 'Vor dem Rewrite', pct: 82 },
          { label: 'Nach dem Rewrite', pct: 91 },
        ] },
        { list: true, lead: 'Nachdem der Rewrite live war, wurde die Arbeit nach Bereichen aufgeteilt, und [[drei davon lagen bei mir]] für den Rest meiner Zeit im Projekt:', items: [
          'Die [[Paywall]] — der Premium-Abo-Ablauf, von dem das ganze Geschäft lebt: die Tarife, Kauf und Wiederherstellen über Apple und die Grenze zwischen den kostenlosen Inhalten und allem anderen. Der eine Screen, an dem ein Bug direkt Geld kostet.',
          'Das [[Karteikarten-System]] — der Kern dessen, wie Leute tatsächlich lernen. Frage, Antwort, Aufdecken und der Teil, den Nutzer in ihren Bewertungen am häufigsten erwähnen: [[Falsche Antworten werden automatisch gespeichert]], damit du genau das üben kannst, was du falsch hattest.',
          'Die [[Live-Matches]] — Juramatch, bei dem zwei Nutzer in Echtzeit gegeneinander dieselben Rechtsfragen beantworten, mit einer bundesweiten Rangliste dahinter. Echtzeit-State in einer mobilen App, während das Netz kommt und geht.',
        ], after: 'Nichts davon war Greenfield: Alles musste für die Leute, die es schon nutzten, weiter funktionieren, während wir den Code darunter austauschten.' },
        { rating: true, title: 'Bewertungen', note: 'Drei Jahre später ist die App, die wir neu geschrieben haben, die im App Store — und die, die bewertet wird.', value: 4.7, caption: '116 Bewertungen im deutschen App Store.', distribution: [87, 4, 3, 0, 5] },
        { text: true, body: 'Klarer als an die Zahlen erinnere ich mich an die Disziplin, die es gebraucht hat: Bei einem so eng eingebundenen Kunden und einer so fragilen Codebasis [[mussten „sauber neu schreiben“ und „freitags Fixes ausliefern“ gleichzeitig passieren]], nicht nacheinander.' },
        { quote: true, stars: 5, line: 'Besonders die Navigation, die Ladezeiten und die Lernbereiche sind gut durchdacht — sie machen die App zu einem echten Erlebnis.', source: 'App-Store-Bewertung, August 2023 — der Monat, in dem der Rewrite live ging. Sinngemäß wiedergegeben.' },
      ],
    },

    planetpop: {
      meta: ['Kundenprojekt · Horizon Alpha', '2023 — 2025', 'Frontend-Entwickler', 'im Dreierteam', 'Mit Pausen über 2 Jahre'],
      kind: 'Kundenprojekt · 03',
      tagline: 'Eine Web-App, mit der Kinder Englisch über Songs lernen, gebaut vom leeren Repo bis zu bezahlten Abos — Infrastruktur inklusive.',
      sections: [
        { text: true, body: 'PlanetPop bringt Kindern Englisch mit eigenen Songs und Videos bei und hatte auf YouTube schon ein Publikum von über 100.000 Abonnenten aufgebaut. Die Web-App gab es noch nicht: [[Wir haben sie von Grund auf in React Native Web gebaut]] und auch alles dahinter aufgesetzt — das Hosting bei Scaleway und die MongoDB-Datenbank, auf der sie lief.' },
        { list: true, lead: 'Eine feste Rolle gab es hier nicht; die Arbeit war das, was als Nächstes ausgeliefert werden musste, mit Pausen über zwei Jahre. Was wir [[aus einem leeren Repository]] geliefert haben:', items: [
          'Die [[Web-App selbst]], von Grund auf in React Native Web gebaut.',
          '[[Abos über Stripe]] — Tarife, Checkout und die Kontoseite des Bezahlens.',
          'Eine Reihe von [[Landingpages]], während sich das Marketing veränderte.',
          'Die [[Infrastruktur]] darunter: Hosting bei Scaleway und die MongoDB-Datenbank.',
          'Eine [[mobile App]] aus derselben Codebasis — mehr dazu unten.',
        ], after: 'Anforderungen kamen so, wie sie bei einem kleinen, vielbeschäftigten Kunden oft kommen: stückweise, manchmal als neuer Wunsch in der Antwort auf eine Frage — umso wichtiger war es, [[Dinge aufzuschreiben und bestätigen zu lassen, bevor wir bauten]].' },
        { text: true, body: 'Der Stack war eine Entscheidung, kein Standard. Wir haben React Native Web gewählt, weil eine mobile App von Anfang an Teil des Plans war, und [[eine Codebasis für Web und Native]] schien der günstigere Weg zu beidem. Das war sie — anfangs. Die mobile App wurde veröffentlicht und später eingestellt: Der Kunde sah nicht den Ertrag, den er sich davon erhofft hatte, und sie mit dem Web-Build gleichzuhalten, war zu echten Kosten geworden. Im Rückblick hat uns die gemeinsame Codebasis die zweite Plattform schnell verschafft und sie uns danach jeden Monat in Rechnung gestellt. Würde ich noch einmal entscheiden, würde ich härter nachfragen, ob die zweite Plattform wirklich gewollt ist, bevor ich die erste um sie herum entwerfe.' },
        { text: true, body: 'Das ehrliche Ende: Das Produkt wurde später eingestellt. Ein sechsstelliges YouTube-Publikum wurde nicht zu genug zahlenden Abonnenten, und das Unternehmen hat sich neu ausgerichtet. Das ist kein Scheitern des Builds — er wurde ausgeliefert, er hat funktioniert, Leute haben dafür bezahlt —, aber eine nützliche Erinnerung daran, dass [[ein funktionierendes Produkt und ein funktionierendes Geschäft zwei verschiedene Probleme sind]] und Engineering nur das erste löst.' },
      ],
    },

    traqa: {
      meta: ['Eigenes Projekt', '2025', 'Gründer', 'Team of 1', '9 Monate'],
      kind: 'Eigenes Projekt · 02',
      tagline: 'Eine Lauf-App, die deinen Trainingsplan jede Woche anpasst, damit er dich nicht verletzt — gebaut nach einem Plan, der genau das getan hat.',
      sections: [
        { text: true, body: 'Traqa hat mit einem Knie angefangen. Ich habe 2024 mit dem Laufen begonnen — ein erster 5er beim B2Run in München, dann 10er mit Kollegen, dann die Entscheidung, den Halbmarathon zu überspringen und direkt auf einen Marathon zu gehen. Eine bekannte Trainings-App hat mir einen 20-Wochen-Plan erstellt, und der war zu viel für meinen Stand: Nach etwa sechs Wochen hatte ich Knieschmerzen, und sechs Wochen vor dem Rennen ein ausgewachsenes Läuferknie. Der Plan hatte sich angepasst, um mich im Marathon-Zeitplan zu halten; [[er hat sich nie angepasst, um mich gesund zu halten]].' },
        { text: true, body: 'Traqa erstellt den Plan deshalb aus dem, wer du wirklich bist — Erfahrung, Wochenkilometer, Lauftage, Gelände, Verletzungshistorie, Ziel — und fragt dann jede Woche einen kurzen Check-in ab. Der Plan ändert sich auf Basis dieses Check-ins, mit [[Verletzungsfreiheit als Priorität statt dem Renndatum]]. Unter der Haube: eine Expo-App mit einem LLM, das mehrwöchige Pläne erstellt, Offline-first-Lauftracking mit GPS im Hintergrund, nachträglicher Import und Karten.' },
        { list: true, lead: 'Zwei Probleme haben die meiste Zeit gekostet.', items: [
          'Das Modell. Beim Laufen wirken so viele Variablen aufeinander, dass ein LLM, dem man ein Profil gibt und um einen Plan bittet, [[selbstbewussten Unsinn]] produzierte — ein 4-km-Long-Run neben einer 18-km-Intervalleinheit, Pläne, die kein Mensch schaffen könnte. Brauchbare Ergebnisse gab es erst, als ich das Modell als unzuverlässige Komponente behandelt habe, die man einschränken und prüfen muss, nicht als Orakel — und selbst zum Launch war das nicht ganz gelöst.',
          'Offline-first-Tracking auf iOS. Die App muss [[einen Lauf weiter aufzeichnen, während das Betriebssystem aktiv versucht, sie zu beenden]], um Akku zu sparen, ganz ohne Verbindung weiterlaufen und den fertigen Lauf dann sicher auf dem Gerät halten, bis er nachweislich synchronisiert ist.',
        ] },
        { text: true, body: 'Im Oktober habe ich sie eingestellt. Fitness ist eine der vollsten App-Kategorien überhaupt, und ohne Finanzierung — oder die Zeit, sie richtig zu vermarkten — kommt ein Solo-Produkt dort nicht weit: [[Weniger als hundert Leute haben sie je genutzt]], und die TikToks und Instagram-Posts drumherum haben nie gezündet.' },
        { text: true, body: 'Den Marathon bin ich nie gelaufen. Einen Halbmarathon schon — [[1:58]] — mit einem Plan, der genau das getan hat, wofür Traqa gebaut war: dort anfangen, wo das Knie wirklich stand, bei etwa fünf Kilometern pro Woche, und Woche für Woche auf rund fünfunddreißig aufbauen, angepasst daran, wie es sich anfühlte. Der ehrliche Teil ist, woher dieser Plan kam. Die ersten Wochen der Reha habe ich Traqa genutzt, für den Rest eine Unterhaltung mit Claude. [[Die Idee war richtig; die App drumherum hat sich ihren Platz nie verdient]] gegenüber einem Modell in einem Chatfenster — und das, zusammen mit einem hart erarbeiteten Respekt vor Offline-first-Arbeit auf dem Handy, ist das, was ich daraus mitnehme.' },
      ],
      stack: [{ title: 'React Native' }, { title: 'Expo' }, { title: 'TypeScript' }, { title: 'Supabase' }, { title: 'PostgreSQL' }, { title: 'Mapbox' }, { title: 'PostHog' }, { title: 'RevenueCat' }, { title: 'LLM-Plangenerierung' }, { title: 'GPS im Hintergrund' }, { title: 'Offline-first' }],
    },
  },
};
