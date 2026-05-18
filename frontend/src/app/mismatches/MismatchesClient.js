"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_TEXT =
  "CATAAATTTCGTATGTATCAAAATTTTGTTACTATCACATAAATTTCGTATGTATCAAAATTTTGTTACTATCA";
const DEFAULT_PATTERN = "AAAAA";
const DEFAULT_HAMMING_FIRST = "AACCT";
const DEFAULT_HAMMING_SECOND = "AATCT";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const sections = [
  {
    id: "hamming",
    title: "Hamingova distanca",
    badge: "mera razlike",
    text: "Poredi dve sekvence iste dužine i broji pozicije na kojima se simboli razlikuju.",
  },
  {
    id: "matching",
    title: "Približno poklapanje",
    badge: "klizni prozor",
    text: "Traži sve pozicije na kojima je Hamingova distanca od obrasca najviše d.",
  },
  {
    id: "neighbors",
    title: "d-susedstvo",
    badge: "kandidati",
    text: "Generiše sve sekvence koje se od obrasca razlikuju u najviše d pozicija.",
  },
  {
    id: "frequent",
    title: "Česte reči sa propustima",
    badge: "najčešći motivi",
    text: "Pronalazi k-mere koji imaju najveći broj približnih pojavljivanja u tekstu.",
  },
  {
    id: "reverse",
    title: "Obrnuti komplementi",
    badge: "obe orijentacije",
    text: "Sabira približna pojavljivanja obrasca i njegovog obrnutog komplementa.",
  },
];

const codeSamples = {
  hamming: `def hamming_distance(p, q):
    distance = 0

    for i in range(len(p)):
        if p[i] != q[i]:
            distance += 1

    return distance`,
  matching: `def approximate_pattern_matching(text, pattern, d):
    positions = []
    k = len(pattern)

    for i in range(0, len(text) - k + 1):
        current_pattern = text[i:i + k]

        if hamming_distance(pattern, current_pattern) <= d:
            positions.append(i)

    return positions

def approximate_pattern_count(text, pattern, d):
    return len(approximate_pattern_matching(text, pattern, d))`,
  neighbors: `def neighbors(pattern, d):
    if d == 0:
        return {pattern}

    if len(pattern) == 1:
        return {"A", "C", "G", "T"}

    neighborhood = set()
    suffix = pattern[1:]
    suffix_neighbors = neighbors(suffix, d)

    for text in suffix_neighbors:
        if hamming_distance(suffix, text) < d:
            for nucleotide in ["A", "C", "G", "T"]:
                neighborhood.add(nucleotide + text)
        else:
            neighborhood.add(pattern[0] + text)

    return neighborhood`,
  frequent: `def frequent_words_with_mismatches(text, k, d):
    frequency_map = {}

    for i in range(0, len(text) - k + 1):
        pattern = text[i:i + k]
        neighborhood = neighbors(pattern, d)

        for neighbor in neighborhood:
            if neighbor not in frequency_map:
                frequency_map[neighbor] = 0
            frequency_map[neighbor] += 1

    max_count = max(frequency_map.values())
    frequent_patterns = []

    for pattern, count in frequency_map.items():
        if count == max_count:
            frequent_patterns.append(pattern)

    return sorted(frequent_patterns)`,
  reverse: `def reverse_complement(pattern):
    complement = {"A": "T", "T": "A", "C": "G", "G": "C"}
    result = ""

    for nucleotide in reversed(pattern):
        result += complement[nucleotide]

    return result

def frequent_words_with_mismatches_and_reverse_complements(text, k, d):
    candidates = set()

    for i in range(0, len(text) - k + 1):
        candidates.update(neighbors(text[i:i + k], d))

    frequency_map = {}
    for pattern in candidates:
        reverse = reverse_complement(pattern)
        count = approximate_pattern_count(text, pattern, d)
        count += approximate_pattern_count(text, reverse, d)
        frequency_map[pattern] = count

    max_count = max(frequency_map.values())
    return sorted(pattern for pattern, count in frequency_map.items() if count == max_count)`,
};

function cleanDna(value) {
  return value.replace(/\s+/g, "").toUpperCase().replace(/[^ACGT]/g, "");
}

function PatternComparison({ firstLabel = "Pattern", pattern, secondLabel = "Text", window }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-slate-50 p-4">
      <div
        className="grid w-max gap-y-2 text-center font-mono text-sm"
        style={{ gridTemplateColumns: `82px repeat(${pattern.length}, 36px)` }}
      >
        <div className="pr-4 text-right font-sans text-slate-600">{firstLabel}</div>
        {pattern.split("").map((symbol, index) => (
          <div className="font-bold text-slate-800" key={`p-${index}`}>
            {symbol}
          </div>
        ))}
        <div className="pr-4 text-right font-sans text-slate-600">{secondLabel}</div>
        {window.split("").map((symbol, index) => {
          const mismatch = symbol !== pattern[index];
          return (
            <div
              className={`rounded-md px-2 py-1 ${
                mismatch ? "bg-rose-100 font-bold text-rose-800" : "bg-emerald-100 text-emerald-800"
              }`}
              key={`w-${index}`}
            >
              {symbol}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TextWindows({ activeIndex, d, windows }) {
  return (
    <div className="max-h-64 overflow-auto rounded-lg border border-slate-200 p-3">
      <div className="grid gap-2">
        {windows.map((window) => {
          const accepted = window.distance <= d;
          const active = window.index === activeIndex;
          return (
            <div
              className={`grid grid-cols-[48px_1fr_64px] items-center gap-2 rounded-lg px-3 py-2 font-mono text-sm ${
                active
                  ? "bg-blue-600 text-white"
                  : accepted
                    ? "bg-emerald-50 text-emerald-900"
                    : "bg-slate-50 text-slate-700"
              }`}
              key={window.index}
            >
              <span>i={window.index}</span>
              <span>{window.pattern}</span>
              <span>d={window.distance}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NeighborGrid({ items, pattern }) {
  return (
    <div className="max-h-72 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap gap-2">
        {items.map((neighbor) => (
          <span
            className={`rounded-lg px-3 py-2 font-mono text-sm font-bold ${
              neighbor === pattern ? "bg-blue-600 text-white" : "bg-white text-slate-800"
            }`}
            key={neighbor}
          >
            {neighbor}
          </span>
        ))}
      </div>
    </div>
  );
}

function RankingTable({ entries, limit = 14, reverse = false }) {
  const visible = entries.slice(0, limit);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Obrazac</th>
            {reverse && <th className="px-4 py-3 font-semibold">Obrnuti komplement</th>}
            <th className="px-4 py-3 font-semibold">Broj</th>
            {reverse && <th className="px-4 py-3 font-semibold">Razlaganje</th>}
          </tr>
        </thead>
        <tbody>
          {visible.map((entry) => (
            <tr className="border-t border-slate-200" key={entry.candidate}>
              <td className="px-4 py-3 font-mono font-bold">{entry.candidate}</td>
              {reverse && <td className="px-4 py-3 font-mono">{entry.reverse}</td>}
              <td className="px-4 py-3 font-mono font-bold">{entry.count}</td>
              {reverse && (
                <td className="px-4 py-3 font-mono text-slate-600">
                  {entry.direct} + {entry.reverseCount}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MismatchesClient() {
  const [hammingFirst, setHammingFirst] = useState(DEFAULT_HAMMING_FIRST);
  const [hammingSecond, setHammingSecond] = useState(DEFAULT_HAMMING_SECOND);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  const [k, setK] = useState(6);
  const [d, setD] = useState(1);
  const [activeSection, setActiveSection] = useState("hamming");
  const [step, setStep] = useState(0);
  const [apiAnalysis, setApiAnalysis] = useState(null);
  const [apiApproximate, setApiApproximate] = useState(null);
  const [apiHammingResult, setApiHammingResult] = useState(null);
  const [apiNeighborItems, setApiNeighborItems] = useState(null);
  const [apiError, setApiError] = useState(false);

  const cleanedHammingFirst = useMemo(() => cleanDna(hammingFirst), [hammingFirst]);
  const cleanedHammingSecond = useMemo(() => cleanDna(hammingSecond), [hammingSecond]);
  const cleanedText = useMemo(() => cleanDna(text), [text]);
  const cleanedPattern = useMemo(() => cleanDna(pattern), [pattern]);
  const safeK = Math.max(1, Number(k) || 1);
  const safeD = Math.max(0, Number(d) || 0);
  const invalidHamming =
    cleanedHammingFirst.length === 0 ||
    cleanedHammingSecond.length === 0 ||
    cleanedHammingFirst.length !== cleanedHammingSecond.length;
  const invalidMatching =
    cleanedText.length === 0 ||
    cleanedPattern.length === 0 ||
    cleanedPattern.length > cleanedText.length;
  const invalidNeighbors = cleanedPattern.length === 0 || safeD > cleanedPattern.length;
  const invalidFrequent =
    cleanedText.length === 0 || safeK > cleanedText.length || safeK > 8 || safeD > safeK;
  const invalid =
    activeSection === "hamming"
      ? invalidHamming
      : activeSection === "matching"
        ? invalidMatching
        : activeSection === "neighbors"
          ? invalidNeighbors
          : invalidFrequent;
  const analysis = apiAnalysis;
  const activeData = sections.find((section) => section.id === activeSection);
  const windows = analysis?.windows || [];
  const activeWindow = windows[Math.min(step, Math.max(0, windows.length - 1))];
  const neighborItems = apiNeighborItems || [];
  const approximate = apiApproximate || { count: 0, positions: [] };
  const hammingResult = apiHammingResult;
  const candidateCount = analysis?.candidateSet?.size ?? analysis?.candidateSetSize ?? 0;

  useEffect(() => {
    const controller = new AbortController();

    if (!invalidHamming) {
      Promise.resolve().then(() => setApiError(false));
      fetch(`${API_BASE}/api/mismatches/hamming`, {
        body: JSON.stringify({ first: cleanedHammingFirst, second: cleanedHammingSecond }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          setApiHammingResult(data?.distance ?? null);
          if (data) setApiError(false);
        })
        .catch((error) => {
          if (error.name === "AbortError") return;
          setApiHammingResult(null);
          setApiError(true);
        });
    } else {
      Promise.resolve().then(() => setApiHammingResult(null));
    }

    return () => controller.abort();
  }, [cleanedHammingFirst, cleanedHammingSecond, invalidHamming]);

  useEffect(() => {
    const controller = new AbortController();

    if (!invalidNeighbors) {
      Promise.resolve().then(() => setApiError(false));
      fetch(`${API_BASE}/api/mismatches/neighbors`, {
        body: JSON.stringify({ pattern: cleanedPattern, d: safeD }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          setApiNeighborItems(data?.neighbors ?? null);
          if (data) setApiError(false);
        })
        .catch((error) => {
          if (error.name === "AbortError") return;
          setApiNeighborItems(null);
          setApiError(true);
        });
    } else {
      Promise.resolve().then(() => setApiNeighborItems(null));
    }

    return () => controller.abort();
  }, [cleanedPattern, invalidNeighbors, safeD]);

  useEffect(() => {
    const controller = new AbortController();

    if (!invalidMatching) {
      Promise.resolve().then(() => setApiError(false));
      fetch(`${API_BASE}/api/mismatches/approximate-count`, {
        body: JSON.stringify({ text: cleanedText, pattern: cleanedPattern, d: safeD }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          setApiApproximate(data || null);
          if (data) setApiError(false);
        })
        .catch((error) => {
          if (error.name === "AbortError") return;
          setApiApproximate(null);
          setApiError(true);
        });
    } else {
      Promise.resolve().then(() => setApiApproximate(null));
    }

    return () => controller.abort();
  }, [cleanedText, cleanedPattern, invalidMatching, safeD]);

  useEffect(() => {
    const controller = new AbortController();
    const patternForWindows = cleanedPattern || cleanedText.slice(0, safeK);
    const analysisInvalid =
      activeSection === "frequent" || activeSection === "reverse"
        ? invalidFrequent
        : invalidMatching;

    if (!analysisInvalid && activeSection !== "hamming" && activeSection !== "neighbors") {
      Promise.resolve().then(() => setApiError(false));
      fetch(`${API_BASE}/api/mismatches/analyze`, {
        body: JSON.stringify({ text: cleanedText, pattern: patternForWindows, k: safeK, d: safeD }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          setApiAnalysis(data || null);
          if (data) setApiError(false);
        })
        .catch((error) => {
          if (error.name === "AbortError") return;
          setApiAnalysis(null);
          setApiError(true);
        });
    } else {
      Promise.resolve().then(() => setApiAnalysis(null));
    }

    return () => controller.abort();
  }, [
    activeSection,
    cleanedText,
    cleanedPattern,
    invalidFrequent,
    invalidMatching,
    safeD,
    safeK,
  ]);

  function resetStep() {
    setStep(0);
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function nextStep() {
    if (!windows.length) return;
    setStep((current) => Math.min(current + 1, windows.length - 1));
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Propusti
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            Približno poklapanje sekvenci i česte reči sa propustima
          </h1>
          <div className="mt-5 space-y-4 text-base leading-7 text-slate-600">
            <p>
              U realnim DNK sekvencama biološki značajni motivi ne moraju uvek da se
              pojave u potpuno istom obliku. Mutacije mogu promeniti pojedinačne
              nukleotide, dok motiv i dalje zadržava istu funkciju.
            </p>
            <p>
              Zbog toga se uvode Hamingova distanca, približno poklapanje,
              d-susedstvo i česte reči sa propustima. Ovi algoritmi omogućavaju da se
              pronađu obrasci koji su dovoljno slični, čak i kada nisu identični.
            </p>
            <p>
              Ideja se razvija postepeno: prvo se meri razlika između dve sekvence,
              zatim se obrazac traži uz dozvoljena odstupanja, a na kraju se rangiraju
              svi kandidati koji mogu predstavljati isti biološki motiv. Zato najbolji
              motiv ne mora nužno da se pojavi u tekstu u potpuno tačnom obliku.
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <button
              className={`rounded-lg border p-5 text-left shadow-sm transition ${
                activeSection === section.id
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setStep(0);
              }}
              type="button"
            >
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                {section.badge}
              </span>
              <h2 className="mt-3 text-lg font-bold">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{section.text}</p>
            </button>
          ))}
        </section>

        <section className="mt-6 grid gap-5">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Algoritam
                </p>
                <h2 className="mt-2 text-2xl font-bold">{activeData.title}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                Vremenska složenost:{" "}
                <span className="font-mono font-bold">
                  {activeSection === "hamming" ? "O(k)" : activeSection === "matching" ? "O(|Tekst| * k)" : "zavisno od |Susedstvo|"}
                </span>
              </span>
            </div>
            <pre className="mt-4 max-h-[300px] overflow-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              <code>{codeSamples[activeSection]}</code>
            </pre>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Interaktivni prikaz
                </p>
                <h2 className="mt-2 text-2xl font-bold">{activeData.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{activeData.text}</p>
              </div>
              {activeSection !== "hamming" && (
                <button
                  className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                  onClick={resetStep}
                  type="button"
                >
                  Pokreni od početka
                </button>
              )}
            </div>

            <div className="mt-5 grid gap-4 rounded-lg bg-slate-50 p-4">
              {activeSection === "hamming" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Prva sekvenca
                    <input
                      className="rounded-lg border border-slate-200 p-3 font-mono outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      onChange={(event) => setHammingFirst(event.target.value)}
                      value={hammingFirst}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Druga sekvenca
                    <input
                      className="rounded-lg border border-slate-200 p-3 font-mono outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      onChange={(event) => setHammingSecond(event.target.value)}
                      value={hammingSecond}
                    />
                  </label>
                </div>
              )}

              {activeSection === "matching" && (
                <>
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Tekst
                    <textarea
                      className="min-h-20 rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm font-medium outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      onChange={(event) => {
                        setText(event.target.value);
                        setStep(0);
                      }}
                      value={text}
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                      Obrazac
                      <input
                        className="rounded-lg border border-slate-200 p-3 font-mono outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        onChange={(event) => {
                          setPattern(event.target.value);
                          setStep(0);
                        }}
                        value={pattern}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                      d
                      <input
                        className="rounded-lg border border-slate-200 p-3 font-mono outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        min="0"
                        onChange={(event) => {
                          setD(event.target.value);
                          setStep(0);
                        }}
                        type="number"
                        value={d}
                      />
                    </label>
                  </div>
                </>
              )}

              {activeSection === "neighbors" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Obrazac
                    <input
                      className="rounded-lg border border-slate-200 p-3 font-mono outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      onChange={(event) => {
                        setPattern(event.target.value);
                        setStep(0);
                      }}
                      value={pattern}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    d
                    <input
                      className="rounded-lg border border-slate-200 p-3 font-mono outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      min="0"
                      onChange={(event) => {
                        setD(event.target.value);
                        setStep(0);
                      }}
                      type="number"
                      value={d}
                    />
                  </label>
                </div>
              )}

              {(activeSection === "frequent" || activeSection === "reverse") && (
                <>
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Tekst
                    <textarea
                      className="min-h-20 rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm font-medium outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      onChange={(event) => {
                        setText(event.target.value);
                        setStep(0);
                      }}
                      value={text}
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                      k
                      <input
                        className="rounded-lg border border-slate-200 p-3 font-mono outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        min="1"
                        onChange={(event) => {
                          setK(event.target.value);
                          setStep(0);
                        }}
                        type="number"
                        value={k}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-slate-700">
                      d
                      <input
                        className="rounded-lg border border-slate-200 p-3 font-mono outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        min="0"
                        onChange={(event) => {
                          setD(event.target.value);
                          setStep(0);
                        }}
                        type="number"
                        value={d}
                      />
                    </label>
                  </div>
                </>
              )}
            </div>

            {invalid && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {activeSection === "hamming"
                  ? "Unesi dve DNK sekvence iste dužine."
                  : activeSection === "matching"
                    ? "Unesi tekst i obrazac koji nije duži od teksta, uz dozvoljeni broj odstupanja d."
                    : activeSection === "neighbors"
                      ? "Unesi obrazac i vrednost d koja nije veća od dužine obrasca."
                      : "Unesi tekst, k do 8 i vrednost d koja nije veća od k."}
              </div>
            )}

            {apiError && (
              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                Backend nije dostupan. Pokreni FastAPI server da bi se rezultati izračunali.
              </div>
            )}

            {!invalid && activeSection === "hamming" && hammingResult !== null && (
              <div className="mt-5 space-y-4">
                <PatternComparison
                  firstLabel="Prva"
                  pattern={cleanedHammingFirst}
                  secondLabel="Druga"
                  window={cleanedHammingSecond}
                />

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-slate-500">Dužina</p>
                    <p className="mt-1 text-2xl font-bold">{cleanedHammingFirst.length}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-sm text-blue-700">Različitih pozicija</p>
                    <p className="mt-1 text-2xl font-bold">{hammingResult}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-sm text-emerald-700">Sličnost</p>
                    <p className="mt-1 text-2xl font-bold">
                      {cleanedHammingFirst.length - hammingResult}/{cleanedHammingFirst.length}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="font-semibold">Kako se računa?</p>
                  <p className="mt-2 leading-7 text-slate-600">
                    Algoritam poredi simbole na istim pozicijama. Svaka kolona u kojoj se
                    baze razlikuju povećava distancu za 1. Ovde je Hamingova distanca{" "}
                    <span className="font-mono font-bold">{hammingResult}</span>.
                  </p>
                </div>
              </div>
            )}

            {!invalid && activeSection === "neighbors" && (
              <div className="mt-5 space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-slate-500">Obrazac</p>
                    <p className="mt-1 font-mono text-2xl font-bold">{cleanedPattern}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-sm text-blue-700">Dozvoljena odstupanja</p>
                    <p className="mt-1 text-2xl font-bold">{safeD}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-sm text-emerald-700">Broj suseda</p>
                    <p className="mt-1 text-2xl font-bold">{neighborItems.length}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="font-semibold">Susedstvo(obrazac, d)</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Susedstvo sadrži sve sekvence iste dužine koje su udaljene najviše d
                    pozicija od početnog obrasca.
                  </p>
                  <div className="mt-4">
                    <NeighborGrid items={neighborItems} pattern={cleanedPattern} />
                  </div>
                </div>
              </div>
            )}

            {analysis && activeWindow && activeSection !== "hamming" && (
              <div className="mt-5 space-y-4">
                {activeSection === "matching" && (
                  <>
                    <PatternComparison pattern={cleanedPattern} window={activeWindow.pattern} />
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-sm text-slate-500">Pozicija</p>
                        <p className="mt-1 text-2xl font-bold">{activeWindow.index}</p>
                      </div>
                      <div className="rounded-lg bg-blue-50 p-3">
                        <p className="text-sm text-blue-700">Hamingova distanca</p>
                        <p className="mt-1 text-2xl font-bold">{activeWindow.distance}</p>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-3">
                        <p className="text-sm text-emerald-700">Prihvaćeno</p>
                        <p className="mt-1 text-2xl font-bold">
                          {activeWindow.distance <= safeD ? "da" : "ne"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
                      <button
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        onClick={previousStep}
                        type="button"
                      >
                        Prethodni prozor
                      </button>
                      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                        Prozor {activeWindow.index + 1} od {windows.length}
                      </span>
                      <button
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                        onClick={nextStep}
                        type="button"
                      >
                        Sledeći prozor
                      </button>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="font-semibold">Sva približna poklapanja</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Broj približnih pojavljivanja obrasca je{" "}
                        <span className="font-mono font-bold">{approximate.count}</span>, na
                        pozicijama{" "}
                        <span className="font-mono font-bold">
                          {approximate.positions.length ? approximate.positions.join(", ") : "nema"}
                        </span>
                        .
                      </p>
                      <div className="mt-4">
                        <TextWindows
                          activeIndex={activeWindow.index}
                          d={safeD}
                          windows={windows}
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeSection === "frequent" && (
                  <>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-sm text-slate-500">Kandidata</p>
                        <p className="mt-1 text-2xl font-bold">{candidateCount}</p>
                      </div>
                      <div className="rounded-lg bg-blue-50 p-3">
                        <p className="text-sm text-blue-700">Maksimalna frekvencija</p>
                        <p className="mt-1 text-2xl font-bold">{analysis.maxCount}</p>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-3">
                        <p className="text-sm text-emerald-700">Najčešćih obrazaca</p>
                        <p className="mt-1 text-2xl font-bold">{analysis.frequentPatterns.length}</p>
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="font-semibold">Najbolji kandidati</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Brojanje se dobija tako što svaki k-mer iz teksta glasa za sve
                        svoje susede. Zato najčešći motiv ne mora nužno da postoji u tekstu
                        u tačnom obliku.
                      </p>
                      <div className="mt-4">
                        <RankingTable entries={analysis.candidateEntries} />
                      </div>
                    </div>
                  </>
                )}

                {activeSection === "reverse" && (
                  <>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-sm text-slate-500">Kandidata</p>
                        <p className="mt-1 text-2xl font-bold">{candidateCount}</p>
                      </div>
                      <div className="rounded-lg bg-blue-50 p-3">
                        <p className="text-sm text-blue-700">Maksimalan zbir</p>
                        <p className="mt-1 text-2xl font-bold">{analysis.maxReverseCount}</p>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-3">
                        <p className="text-sm text-emerald-700">Najboljih obrazaca</p>
                        <p className="mt-1 text-2xl font-bold">
                          {analysis.reverseFrequentPatterns.length}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="font-semibold">Sabiranje obe orijentacije</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Za svaki obrazac računa se broj približnih pojavljivanja samog
                        obrasca i njegovog obrnutog komplementa, pa se ta dva broja sabiraju.
                      </p>
                      <div className="mt-4">
                        <RankingTable entries={analysis.reverseEntries} reverse />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </article>
        </section>

        {analysis && (
          <section className="mt-8">
            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Rezultat</h2>
              {activeSection === "reverse" ? (
                <>
                  <p className="mt-3 leading-7 text-slate-600">
                    Najveći zbir približnih pojavljivanja obrasca i obrnutog komplementa je{" "}
                    <span className="font-mono font-bold">{analysis.maxReverseCount}</span>.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.reverseFrequentPatterns.map((item) => (
                      <span
                        className="rounded-lg bg-emerald-100 px-3 py-2 font-mono font-bold text-emerald-800"
                        key={item}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </>
              ) : activeSection === "frequent" ? (
                <>
                  <p className="mt-3 leading-7 text-slate-600">
                    Maksimalna približna frekvencija je{" "}
                    <span className="font-mono font-bold">{analysis.maxCount}</span>, pa su
                    najčešći obrasci:
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.frequentPatterns.map((item) => (
                      <span
                        className="rounded-lg bg-emerald-100 px-3 py-2 font-mono font-bold text-emerald-800"
                        key={item}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-3 leading-7 text-slate-600">
                  Ova celina prikazuje osnovni gradivni blok za algoritam čestih reči sa
                  propustima: poređenje sa odstupanjima, susedstvo i približno brojanje.
                </p>
              )}
            </article>
          </section>
        )}
      </section>
    </main>
  );
}
