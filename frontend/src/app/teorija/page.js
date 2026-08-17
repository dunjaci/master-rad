"use client";

import { useState } from "react";
import Image from "next/image";

const sections = [
  {
    id: "struktura",
    title: "Struktura DNK",
    image: "/images/dnk.png",
    imageAlt: "Ilustracija dvostruke spirale DNK",
    paragraphs: [
      "DNK je molekul koji se sastoji od dva međusobno povezana lanca koji formiraju dvostruku spiralu. Svaki lanac je građen od nukleotida, pri čemu svaki nukleotid sadrži jednu od četiri azotne baze: adenin (A), timin (T), guanin (G) ili citozin (C). Baze se međusobno uparuju po principu komplementarnosti, tako da se adenin vezuje za timin, a guanin za citozin. Ovakva struktura omogućava stabilnost molekula, kao i precizno kopiranje genetske informacije tokom procesa replikacije.",
      "DNK je u ćelijama organizovana u strukture koje se nazivaju hromozomi. Skup svih DNK molekula jednog organizma, odnosno kompletna informacija sadržana u njegovim hromozomima, naziva se genom. Različiti organizmi imaju različit broj hromozoma, kao i genom različite dužine, koji može varirati od nekoliko stotina hiljada do više miliona nukleotida.",
      "Sa stanovišta bioinformatike, DNK sekvenca se može predstaviti kao konačna niska karaktera nad alfabetom {A, C, G, T}. Podniske te niske, dužine k, nazivaju se k-grami i predstavljaju osnovne jedinice koje se analiziraju u bioinformatici. Analiza učestalosti i raspodele k-grama u genomu omogućava otkrivanje obrazaca koji mogu ukazivati na funkcionalno značajne regione DNK. Ovakav model omogućava primenu algoritamskih metoda za analizu sekvenci, prepoznavanje obrazaca i rešavanje različitih problema u obradi genetskih podataka.",
    ],
  },
  {
    id: "replikacija",
    title: "Replikacija DNK",
    image: "/images/replikacija.png",
    imageAlt: "Ilustracija razdvajanja DNK lanaca tokom replikacije",
    paragraphs: [
      "Replikacija DNK predstavlja proces umnožavanja genetskog materijala koji se odvija pre deobe ćelije. Tokom ovog procesa, dva lanca DNK se razdvajaju, a zatim se za svaki od njih sintetiše novi komplementarni lanac. Kao rezultat replikacije nastaju dve identične kopije originalnog DNK molekula, koje se raspodeljuju u ćerke ćelije.",
      "Ovaj proces je strogo regulisan, jer njegovo pokretanje i odvijanje kontrolišu različiti enzimi i drugi proteini kako bi replikacija započela na odgovarajućim lokacijama u genomu. Nakon toga, replikacija se odvija u oba smera duž DNK molekula, pri čemu dolazi do razdvajanja roditeljskih lanaca i sinteze novih komplementarnih nukleotidnih lanaca.",
    ],
  },
  {
    id: "oric",
    title: "Početni region replikacije (oriC)",
    image: "/images/oric.png",
    imageAlt: "Ilustracija kružnog bakterijskog genoma sa obeleženim oriC regionom",
    paragraphs: [
      "Početni region replikacije, označen kao oriC, predstavlja specifičan segment DNK u kojem započinje proces replikacije. Kod bakterija, genom je najčešće organizovan u obliku kružnog hromozoma i sadrži samo jedan takav region iz kojeg se replikacija odvija u oba smera.",
      "Ovaj region sadrži sekvence koje omogućavaju vezivanje proteina neophodnih za početak replikacije i time ima ključnu ulogu u pokretanju celokupnog procesa umnožavanja genetskog materijala. Iako je oriC relativno kratak u poređenju sa dužinom celog genoma, koji može sadržati milione nukleotida, on u DNK sekvenci nije eksplicitno označen, odnosno ne postoji jedinstvena sekvenca ili oznaka koja direktno ukazuje na njegovu lokaciju. Zbog toga, njegovo pronalaženje predstavlja složen i netrivijalan zadatak.",
    ],
  },
  {
    id: "dnaa",
    title: "DNK polimeraza, DnkA proteini i boksovi",
    paragraphs: [
      "Početak replikacije DNK započinje vezivanjem specifičnih proteina za određene delove genoma. Jedan od najvažnijih proteina u ovom procesu je DnkA, koji ima sposobnost da prepozna i veže se za kratke sekvence unutar početnog regiona replikacije. Ove kratke sekvence poznate su kao DnkA boksovi i karakteriše ih to što se pojavljuju više puta unutar oriC regiona. Njihova učestalost na ograničenom regionu unutar DNK omogućava proteinima da identifikuju mesto na kojem treba da započne replikacija.",
      "Nakon vezivanja DnkA proteina dolazi do lokalnog razdvajanja DNK lanca, čime se omogućava delovanje DNK polimeraze, enzima koji funkcioniše kao molekularna mašina za kopiranje genetskog materijala i vrši sintezu novih, komplementarnih DNK lanaca.",
      "Upravo zbog svoje ponavljajuće prirode, DnkA boksovi se mogu posmatrati kao karakteristični obrasci u DNK sekvenci, što omogućava njihovo pronalaženje primenom algoritamskih metoda.",
    ],
  },
  {
    id: "reverse",
    title: "Obrnuti komplement",
    image: "/images/reverse.png",
    imageAlt: "Ilustracija komplementarnih DNK lanaca suprotne orijentacije",
    paragraphs: [
      "Zbog komplementarne prirode DNK molekula, svaki lanac DNK povezan je sa drugim lancem prema pravilima uparivanja baza, pri čemu se adenin (A) uparuje sa timinom (T), dok se guanin (G) uparuje sa citozinom (C). Pored toga, dva lanca DNK molekula imaju suprotnu orijentaciju (antiparalelni su), odnosno jedan je orijentisan u smeru 5' → 3', a drugi u smeru 3' → 5'. Oznake 5' i 3' predstavljaju krajeve DNK lanca i određuju njegovu orijentaciju. Po konvenciji, DNK sekvence se zapisuju i čitaju u smeru 5' → 3', što omogućava jednoznačno predstavljanje i poređenje sekvenci.",
      "Na slici su prikazana dva komplementarna DNK lanca i način uparivanja nukleotida. Može se uočiti da svakoj bazi jednog lanca odgovara tačno određena komplementarna baza na drugom lancu.",
      "Na osnovu ovih osobina definiše se pojam obrnutog komplementa (reverse complement). Komplement jedne DNK sekvence dobija se zamenom svake baze njenom komplementarnom bazom. Zbog suprotne orijentacije DNK lanaca, komplementarna sekvenca čita se u smeru 5' → 3', čime se dobija obrnuti komplement.",
      "Na primer, za sekvencu AGTC, komplementarna sekvenca je TCAG, dok je njen obrnuti komplement GACT.",
      "S obzirom na dvostruku strukturu DNK molekula, biološki značajne sekvence mogu se pojaviti na bilo kom od njegova dva lanca. Zbog toga je pri analizi genoma neophodno uzeti u obzir oba lanca DNK molekula. Kako se DNK sekvence po konvenciji zapisuju u smeru 5' → 3', drugi lanac predstavlja se njegovim obrnutim komplementom. Ovo je od posebnog značaja u algoritmima za pronalaženje početnog regiona replikacije, jer omogućava prepoznavanje karakterističnih obrazaca bez obzira na lanac na kojem se nalaze.",
    ],
  },
];

export default function Teorija() {
  const [openSections, setOpenSections] = useState([]);

  function toggleSection(sectionId) {
    setOpenSections((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId],
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
        <header className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Teorijske osnove
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Biološka osnova problema
          </h1>
          <div className="mt-6 space-y-5 text-lg leading-8 text-slate-600">
            <p>
              Dezoksiribonukleinska kiselina (DNK) je osnovni nosilac genetske
              informacije kod živih organizama. Jedan od značajnih izazova u
              bioinformatici predstavlja identifikacija funkcionalno relevantnih
              regiona unutar DNK sekvenci, pri čemu se ova analiza često zasniva
              na primeni algoritamskih metoda.
            </p>
            <p>
              Posebno interesantan problem predstavlja određivanje početnog
              regiona replikacije (oriC), koji ima ključnu ulogu u procesu
              umnožavanja genetskog materijala. U okviru velikih genoma, koji
              mogu sadržati milione nukleotida, ovaj region je relativno kratak
              i nije eksplicitno označen. Stoga se njegovo identifikovanje
              zasniva na analizi obrazaca u DNK sekvenci i prepoznavanju
              karakterističnih signala koji ukazuju na početak replikacije.
            </p>
            <p>
              Jedan od ključnih uvida jeste da se u ovim regionima često
              pojavljuju ponavljajuće sekvence, kao i specifične statističke
              nepravilnosti u raspodeli nukleotida. Ove osobine omogućavaju
              primenu algoritamskih metoda za identifikaciju kandidata za oriC
              region.
            </p>
          </div>
        </header>

        <section className="mt-8 grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const isOpen = openSections.includes(section.id);

            return (
              <article
                className="rounded-lg border border-slate-200 bg-white shadow-sm"
                key={section.id}
              >
                <button
                  className="flex w-full items-center justify-between gap-4 rounded-lg p-5 text-left transition hover:bg-blue-50"
                  onClick={() => toggleSection(section.id)}
                  type="button"
                >
                  <span className="text-xl font-bold text-slate-950">
                    {section.title}
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                    {isOpen ? "×" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-200 p-5">
                    {section.image && (
                      <div className="relative">
                        <button
                          aria-label="Zatvori karticu"
                          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-xl font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
                          onClick={() => toggleSection(section.id)}
                          type="button"
                        >
                          ×
                        </button>
                        <Image
                          alt={section.imageAlt}
                          className="h-56 w-full rounded-lg border border-slate-200 bg-slate-50 object-contain p-4"
                          height={224}
                          src={section.image}
                          width={640}
                        />
                      </div>
                    )}

                    {!section.image && (
                      <div className="flex justify-end">
                        <button
                          aria-label="Zatvori karticu"
                          className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xl font-bold text-slate-700 transition hover:bg-slate-200"
                          onClick={() => toggleSection(section.id)}
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    <div className="mt-5 space-y-4 leading-7 text-slate-600">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
