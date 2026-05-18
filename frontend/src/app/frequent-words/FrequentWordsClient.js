"use client";

import { useEffect, useMemo, useState } from "react";

const EXAMPLE_TEXT =
  "ACTGACTCCCACCCC";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const codeSamples = {
  naive: `def pattern_count(text, pattern):
    count = 0
    n = len(text)
    k = len(pattern)

    for i in range(0, n - k + 1):
        curr_pattern = text[i: i + k]
        if curr_pattern == pattern:
            count += 1

    return count

def frequent_words(text, k):
    frequent_words = set([])
    n = len(text)
    counts = [0 for i in range(n - k + 1)]

    for i in range(n - k + 1):
        pattern = text[i : i + k]
        counts[i] = pattern_count(text, pattern)

    max_count = max(counts)

    for i in range(0, n - k + 1):
        if counts[i] == max_count:
            pattern = text[i : i + k]
            frequent_words.add(pattern)

    return list(frequent_words)`,
  array: `def symbol_to_number(symbol):
    mapping = {"A": 0, "T": 1, "C": 2, "G": 3}
    return mapping[symbol]

def pattern_to_number(pattern):
    if len(pattern) == 1:
        return symbol_to_number(pattern)

    prefix = pattern[:-1]
    last_symbol = pattern[-1]

    return pattern_to_number(prefix) * 4 + symbol_to_number(last_symbol)

def computing_frequencies(text, k):
    frequency_array = [0 for _ in range(4 ** k)]

    for i in range(0, len(text) - k + 1):
        pattern = text[i : i + k]
        j = pattern_to_number(pattern)
        frequency_array[j] += 1

    return frequency_array`,
  dict: `def computing_frequencies_dict(text, k):
    frequency_array = dict([])

    for i in range(0, len(text) - k + 1):
        pattern = text[i : i + k]
        if pattern not in frequency_array:
            frequency_array[pattern] = 1
        else:
            frequency_array[pattern] += 1

    return frequency_array

def faster_frequent_words_dict(text, k):
    frequent_patterns = set([])
    frequency_array = computing_frequencies_dict(text, k)
    max_count = max(frequency_array.values())

    for pattern, count in frequency_array.items():
        if count == max_count:
            frequent_patterns.add(pattern)

    return list(frequent_patterns)`,
  sorting: `def finding_frequent_words_by_sorting(text, k):
    frequent_patterns = set([])
    index = []
    count = []

    for i in range(0, len(text) - k + 1):
        pattern = text[i : i + k]
        index.append(pattern_to_number(pattern))
        count.append(1)

    sorted_index = sorted(index)

    for i in range(1, len(sorted_index)):
        if sorted_index[i] == sorted_index[i - 1]:
            count[i] = count[i - 1] + 1

    max_count = max(count)

    for i in range(0, len(sorted_index)):
        if count[i] == max_count:
            pattern = number_to_pattern(sorted_index[i], k)
            frequent_patterns.add(pattern)

    return list(frequent_patterns)`,
};

const approaches = [
  {
    id: "naive",
    title: "Naivni algoritam",
    badge: "osnovni pristup",
    complexity: "O(|Text|² · k)",
    text: "Za svaki k-mer ponovo prolazi kroz celu sekvencu i računa koliko se puta pojavljuje. Dobar je za razumevanje problema, ali je spor za duge genome.",
  },
  {
    id: "array",
    title: "Optimizacija nizom frekvencija",
    badge: "mapiranje u brojeve",
    complexity: "O(|Text| · k + 4^k)",
    text: "Svaki k-mer se prevodi u broj, a broj pojavljivanja se čuva u nizu frekvencija. Brzo radi za manje vrednosti k, ali niz raste kao 4^k.",
  },
  {
    id: "dict",
    title: "Optimizacija heš mapom",
    badge: "čuva samo viđene k-mere",
    complexity: "O(|Text| · k)",
    text: "Umesto celog niza dužine 4^k, koristi se rečnik koji pamti samo k-mere koji se zaista pojavljuju u sekvenci.",
  },
  {
    id: "sorting",
    title: "Pristup sortiranjem",
    badge: "grupisanje jednakih indeksa",
    complexity: "O(|Text| log |Text| + |Text| · k)",
    text: "Svi k-meri se pretvaraju u brojeve, zatim se ti brojevi sortiraju. Jednaki k-meri tada stoje jedan do drugog, pa se frekvencije dobijaju brojanjem dužina grupa.",
  },
];

function cleanDna(value) {
  return value.replace(/\s+/g, "").toUpperCase().replace(/[^ACGT]/g, "");
}

function symbolToNumber(symbol) {
  return { A: 0, T: 1, C: 2, G: 3 }[symbol];
}

function numberToSymbol(number) {
  return ["A", "T", "C", "G"][number];
}

function patternToNumber(pattern) {
  return pattern.split("").reduce((value, symbol) => value * 4 + symbolToNumber(symbol), 0);
}

function numberToPattern(number, k) {
  let pattern = "";
  let current = number;

  for (let i = 0; i < k; i += 1) {
    pattern = numberToSymbol(current % 4) + pattern;
    current = Math.floor(current / 4);
  }

  return pattern;
}

function countOccurrences(text, pattern) {
  let count = 0;
  const positions = [];

  for (let i = 0; i <= text.length - pattern.length; i += 1) {
    if (text.slice(i, i + pattern.length) === pattern) {
      count += 1;
      positions.push(i);
    }
  }

  return { count, positions };
}

function analyzeFrequentWords(text, k) {
  const windows = [];
  const countsByPattern = {};
  const runningDict = {};
  const maxLength = Math.max(0, text.length - k + 1);

  for (let i = 0; i < maxLength; i += 1) {
    const pattern = text.slice(i, i + k);
    const { count, positions } = countOccurrences(text, pattern);
    runningDict[pattern] = (runningDict[pattern] || 0) + 1;
    windows.push({
      index: i,
      pattern,
      count,
      positions,
      numericIndex: patternToNumber(pattern),
      runningCount: runningDict[pattern],
    });
    countsByPattern[pattern] = Math.max(countsByPattern[pattern] || 0, count);
  }

  const maxCount = Math.max(0, ...Object.values(countsByPattern));
  const frequentPatterns = Object.entries(countsByPattern)
    .filter(([, count]) => count === maxCount)
    .map(([pattern]) => pattern)
    .sort();

  const dictEntries = Object.entries(
    windows.reduce((acc, item) => {
      acc[item.pattern] = (acc[item.pattern] || 0) + 1;
      return acc;
    }, {}),
  ).sort(([a], [b]) => a.localeCompare(b));

  const sortedIndex = windows
    .map((item) => ({
      index: item.numericIndex,
      pattern: item.pattern,
      originalPosition: item.index,
    }))
    .sort((a, b) => a.index - b.index || a.originalPosition - b.originalPosition);

  const sortedGroups = [];
  sortedIndex.forEach((item) => {
    const previous = sortedGroups[sortedGroups.length - 1];
    if (previous && previous.index === item.index) {
      previous.count += 1;
      previous.positions.push(item.originalPosition);
    } else {
      sortedGroups.push({
        index: item.index,
        pattern: item.pattern,
        count: 1,
        positions: [item.originalPosition],
      });
    }
  });

  const frequencyArraySize = 4 ** k;
  const canShowArray = frequencyArraySize <= 256;
  const frequencyArray = canShowArray
    ? Array.from({ length: frequencyArraySize }, (_, index) => ({
        index,
        pattern: numberToPattern(index, k),
        count: 0,
      }))
    : [];

  if (canShowArray) {
    windows.forEach((item) => {
      frequencyArray[item.numericIndex].count += 1;
    });
  }

  return {
    canShowArray,
    countsByPattern,
    dictEntries,
    frequentPatterns,
    frequencyArray,
    frequencyArraySize,
    maxCount,
    sortedGroups,
    sortedIndex,
    windows,
  };
}

function TextWindow({ text, activeStart, k }) {
  return (
    <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex w-max gap-1 font-mono text-sm">
        {text.split("").map((symbol, index) => {
          const active = index >= activeStart && index < activeStart + k;
          return (
            <span
              className={`grid h-8 w-8 place-items-center rounded-md border ${
                active
                  ? "border-blue-500 bg-blue-600 font-bold text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
              key={`${symbol}-${index}`}
            >
              {symbol}
            </span>
          );
        })}
      </div>
      <div className="mt-2 flex w-max gap-1 font-mono text-[11px] text-slate-500">
        {text.split("").map((_, index) => (
          <span className="grid w-8 place-items-center" key={index}>
            {index}
          </span>
        ))}
      </div>
    </div>
  );
}

function ApproachStepExplanation({ activeApproach, activeStep }) {
  if (activeApproach === "array") {
    return (
      <div className="rounded-lg border border-slate-200 p-4">
        <p className="font-semibold">Šta radi optimizacija nizom frekvencija?</p>
        <p className="mt-2 leading-7 text-slate-600">
          Trenutni k-mer{" "}
          <span className="font-mono font-bold">{activeStep.pattern}</span> prevodi se u
          numerički indeks{" "}
          <span className="font-mono font-bold">{activeStep.numericIndex}</span>. Zatim se
          uvećava vrednost na toj poziciji u nizu{" "}
          <span className="font-mono font-bold">FrequencyArray</span>.
        </p>
      </div>
    );
  }

  if (activeApproach === "dict") {
    return (
      <div className="rounded-lg border border-slate-200 p-4">
        <p className="font-semibold">Šta radi optimizacija heš mapom?</p>
        <p className="mt-2 leading-7 text-slate-600">
          Trenutni k-mer{" "}
          <span className="font-mono font-bold">{activeStep.pattern}</span> upisuje se u
          rečnik. Posle obrade ovog prozora njegova trenutna vrednost je{" "}
          <span className="font-mono font-bold">{activeStep.runningCount}</span>. Rečnik
          čuva samo obrasce koji su se stvarno pojavili.
        </p>
      </div>
    );
  }

  if (activeApproach === "sorting") {
    return (
      <div className="rounded-lg border border-slate-200 p-4">
        <p className="font-semibold">Šta radi pristup sortiranjem?</p>
        <p className="mt-2 leading-7 text-slate-600">
          Trenutni k-mer{" "}
          <span className="font-mono font-bold">{activeStep.pattern}</span> prvo se
          prevodi u indeks{" "}
          <span className="font-mono font-bold">{activeStep.numericIndex}</span>. Kada se
          svi indeksi sortiraju, jednaki indeksi stoje jedan do drugog, pa se najčešći
          k-meri prepoznaju kao najduže grupe.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="font-semibold">Šta radi naivni algoritam?</p>
      <p className="mt-2 leading-7 text-slate-600">
        Algoritam posmatra podnisku{" "}
        <span className="font-mono font-bold">{activeStep.pattern}</span> na poziciji{" "}
        <span className="font-mono font-bold">{activeStep.index}</span>. Zatim ponovo
        prolazi kroz ceo tekst i broji sva njena pojavljivanja. Pojavljuje se na
        pozicijama{" "}
        <span className="font-mono font-bold">{activeStep.positions.join(", ")}</span>.
      </p>
    </div>
  );
}

function ApproachVisualDetails({ activeApproach, analysis, activeStep }) {
  if (activeApproach === "array") {
    const visibleItems = analysis.canShowArray
      ? analysis.windows.reduce((items, window) => {
          if (items.some((item) => item.index === window.numericIndex)) {
            return items;
          }

          items.push(analysis.frequencyArray[window.numericIndex]);
          return items;
        }, [])
      : [];
    const cellWidth = Math.max(48, activeStep.pattern.length * 12 + 24);

    return (
      <div className="rounded-lg border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold">Niz frekvencija</p>
          <span className="font-mono text-sm text-slate-500">
            veličina: 4^{activeStep.pattern.length} = {analysis.frequencyArraySize}
          </span>
        </div>
        {!analysis.canShowArray && (
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Niz je prevelik za prikaz na stranici, ali algoritam i dalje računa indeks
            trenutnog k-mera i uvećava odgovarajući brojač.
          </p>
        )}
        {analysis.canShowArray && (
          <div className="mt-4 overflow-x-auto rounded-lg bg-slate-50 p-4">
            <div
              className="grid w-max gap-y-2 text-center font-mono text-sm"
              style={{
                gridTemplateColumns: `88px repeat(${visibleItems.length}, ${cellWidth}px)`,
              }}
            >
              <div className="pr-4 text-right font-sans italic text-slate-600">k-mer</div>
              {visibleItems.map((item) => (
                <div
                  className={`font-bold ${
                    item.index === activeStep.numericIndex ? "text-blue-700" : "text-slate-700"
                  }`}
                  key={`pattern-${item.index}`}
                >
                  {item.pattern}
                </div>
              ))}
              <div className="pr-4 text-right font-sans text-slate-600">index</div>
              {visibleItems.map((item) => (
                <div
                  className={item.index === activeStep.numericIndex ? "font-bold text-blue-700" : ""}
                  key={`index-${item.index}`}
                >
                  {item.index}
                </div>
              ))}
              <div className="pr-4 text-right font-sans text-slate-600">frequency</div>
              {visibleItems.map((item) => (
                <div
                  className={`rounded-md px-2 py-1 ${
                    item.index === activeStep.numericIndex
                      ? "bg-blue-600 font-bold text-white"
                      : "bg-white text-slate-700"
                  }`}
                  key={`count-${item.index}`}
                >
                  {item.count}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeApproach === "dict") {
    const entriesUntilStep = analysis.windows
      .slice(0, activeStep.index + 1)
      .reduce((acc, item) => {
        acc[item.pattern] = (acc[item.pattern] || 0) + 1;
        return acc;
      }, {});

    return (
      <div className="rounded-lg border border-slate-200 p-4">
        <p className="font-semibold">Stanje rečnika posle ovog koraka</p>
        <div className="mt-4 flex max-h-56 flex-wrap gap-2 overflow-auto">
          {Object.entries(entriesUntilStep)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([pattern, count]) => (
              <span
                className={`rounded-lg px-3 py-2 font-mono text-sm font-bold ${
                  pattern === activeStep.pattern
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
                key={pattern}
              >
                {pattern}: {count}
              </span>
            ))}
        </div>
      </div>
    );
  }

  if (activeApproach === "sorting") {
    const activeGroup = analysis.sortedGroups.find(
      (group) => group.index === activeStep.numericIndex,
    );
    const originalItems = analysis.windows.map((item) => ({
      count: 1,
      index: item.numericIndex,
      pattern: item.pattern,
      position: item.index,
    }));
    const cellWidth = Math.max(48, activeStep.pattern.length * 12 + 24);

    return (
      <div className="rounded-lg border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold">Izdvajanje, transformacija i sortiranje</p>
          <span className="font-mono text-sm text-slate-500">
            {analysis.sortedIndex.length} elemenata
          </span>
        </div>

        <div className="mt-4 space-y-4">
          <div className="overflow-x-auto rounded-lg bg-slate-50 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Pre sortiranja
            </p>
            <div
              className="grid w-max gap-y-2 text-center font-mono text-sm"
              style={{
                gridTemplateColumns: `88px repeat(${originalItems.length}, ${cellWidth}px)`,
              }}
            >
              <div className="pr-4 text-right font-sans text-slate-600">k-mer</div>
              {originalItems.map((item) => (
                <div
                  className={item.position === activeStep.index ? "font-bold text-blue-700" : ""}
                  key={`original-pattern-${item.position}`}
                >
                  {item.pattern}
                </div>
              ))}
              <div className="pr-4 text-right font-sans text-slate-600">INDEX</div>
              {originalItems.map((item) => (
                <div
                  className={item.position === activeStep.index ? "font-bold text-blue-700" : ""}
                  key={`original-index-${item.position}`}
                >
                  {item.index}
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg bg-slate-50 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Nakon sortiranja
            </p>
            <div
              className="grid w-max gap-y-2 text-center font-mono text-sm"
              style={{
                gridTemplateColumns: `88px repeat(${analysis.sortedGroups.length}, ${cellWidth}px)`,
              }}
            >
              <div className="pr-4 text-right font-sans text-slate-600">k-mer</div>
              {analysis.sortedGroups.map((group) => (
                <div
                  className={group.index === activeStep.numericIndex ? "font-bold text-blue-700" : ""}
                  key={`sorted-pattern-${group.index}`}
                >
                  {group.pattern}
                </div>
              ))}
              <div className="pr-4 text-right font-sans text-slate-600">SORTED INDEX</div>
              {analysis.sortedGroups.map((group) => (
                <div
                  className={group.index === activeStep.numericIndex ? "font-bold text-blue-700" : ""}
                  key={`sorted-index-${group.index}`}
                >
                  {group.index}
                </div>
              ))}
              <div className="pr-4 text-right font-sans text-slate-600">COUNT</div>
              {analysis.sortedGroups.map((group) => (
                <div
                  className={`rounded-md px-2 py-1 ${
                    group.index === activeStep.numericIndex
                      ? "bg-blue-600 font-bold text-white"
                      : "bg-white text-slate-700"
                  }`}
                  key={`sorted-count-${group.index}`}
                >
                  {group.count}
                </div>
              ))}
            </div>
          </div>
        </div>

        {activeGroup && (
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Grupa za trenutni k-mer ima dužinu{" "}
            <span className="font-mono font-bold">{activeGroup.count}</span>, a originalne
            pozicije su{" "}
            <span className="font-mono font-bold">{activeGroup.positions.join(", ")}</span>.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="font-semibold">Pojavljivanja trenutnog k-mera</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {activeStep.positions.map((position) => (
          <span
            className="rounded-lg bg-blue-100 px-3 py-2 font-mono text-sm font-bold text-blue-800"
            key={position}
          >
            pozicija {position}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FrequentWordsClient() {
  const [text, setText] = useState(EXAMPLE_TEXT);
  const [k, setK] = useState(3);
  const [activeApproach, setActiveApproach] = useState("naive");
  const [step, setStep] = useState(0);
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState(false);

  const cleanedText = useMemo(() => cleanDna(text), [text]);
  const safeK = Math.max(1, Number(k) || 1);
  const invalid = cleanedText.length === 0 || safeK > cleanedText.length;
  const analysis = useMemo(
    () => (invalid ? null : analyzeFrequentWords(cleanedText, safeK)),
    [cleanedText, safeK, invalid],
  );
  const activeStep = analysis?.windows[Math.min(step, analysis.windows.length - 1)];
  const activeApproachData = approaches.find((item) => item.id === activeApproach);
  const resultPatterns = apiResult?.patterns || [];
  const resultMaxCount = apiResult?.max_count ?? 0;
  const stepMetric =
    activeApproach === "array"
      ? activeStep?.numericIndex
      : activeApproach === "dict"
        ? activeStep?.runningCount
        : activeApproach === "sorting"
          ? activeStep?.numericIndex
          : activeStep?.count;

  useEffect(() => {
    if (invalid) {
      Promise.resolve().then(() => setApiResult(null));
      Promise.resolve().then(() => setApiError(false));
      return;
    }

    const controller = new AbortController();
    Promise.resolve().then(() => setApiError(false));
    fetch(`${API_BASE}/api/frequent-words`, {
      body: JSON.stringify({ genome: cleanedText, k: safeK }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) {
          setApiResult(data);
          setApiError(false);
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setApiResult(null);
        setApiError(true);
      });

    return () => controller.abort();
  }, [cleanedText, invalid, safeK]);

  function runVisualization() {
    setStep(0);
  }

  function nextStep() {
    if (!analysis) return;
    setStep((current) => Math.min(current + 1, analysis.windows.length - 1));
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            Frequent Words Problem
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            Problem čestih reči
          </h1>
          <div className="mt-5 space-y-4 text-base leading-7 text-slate-600">
            <p>
              Kako određeni obrasci u DNK sekvenci mogu ukazivati na funkcionalno
              važne regione, prirodan pristup jeste analiza učestalosti pojavljivanja
              podniski. Sekvence koje se pojavljuju značajno češće od ostalih mogu
              imati posebnu biološku ulogu.
            </p>
            <p>
              U bioinformatici se podniske dužine k nazivaju k-meri. Cilj problema
              čestih reči je da se za datu DNK sekvencu i vrednost k pronađu svi
              k-meri koji se pojavljuju najveći broj puta, uz računanje i
              preklapajućih pojavljivanja.
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-3 md:grid-cols-2">
          {approaches.map((approach) => (
            <button
              className={`rounded-lg border p-5 text-left shadow-sm transition ${
                activeApproach === approach.id
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
              key={approach.id}
              onClick={() => {
                setActiveApproach(approach.id);
                setStep(0);
              }}
              type="button"
            >
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                {approach.badge}
              </span>
              <h2 className="mt-3 text-xl font-bold">{approach.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{approach.text}</p>
              <p className="mt-4 font-mono text-sm font-bold text-slate-800">
                {approach.complexity}
              </p>
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
                <h2 className="mt-2 text-2xl font-bold">{activeApproachData.title}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-sm font-bold text-slate-700">
                {activeApproachData.complexity}
              </span>
            </div>
            <pre className="mt-4 max-h-[300px] overflow-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              <code>{codeSamples[activeApproach]}</code>
            </pre>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Vizuelni prikaz
                </p>
                <h2 className="mt-2 text-2xl font-bold">Pokretanje algoritma</h2>
                <p className="mt-1 text-sm text-slate-500">{activeApproachData.title}</p>
              </div>
              <button
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                onClick={runVisualization}
                type="button"
              >
                Pokreni od početka
              </button>
            </div>

            <div className="mt-5 grid gap-4 rounded-lg bg-slate-50 p-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                DNK sekvenca
                <textarea
                  className="min-h-20 rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm font-medium outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  onChange={(event) => {
                    setText(event.target.value);
                    setStep(0);
                  }}
                  value={text}
                />
              </label>

              <div className="flex flex-wrap items-end gap-4">
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  k
                  <input
                    className="w-24 rounded-lg border border-slate-200 p-3 font-mono outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    min="1"
                    onChange={(event) => {
                      setK(event.target.value);
                      setStep(0);
                    }}
                    type="number"
                    value={k}
                  />
                </label>
                <p className="pb-3 text-sm text-slate-500">
                  |Text| = <span className="font-mono font-bold">{cleanedText.length}</span>
                </p>
              </div>
            </div>

            {invalid && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                Unesi DNK sekvencu sa slovima A, C, G i T i vrednost k koja nije veća od dužine sekvence.
              </div>
            )}

            {apiError && (
              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                Backend nije dostupan. Pokreni FastAPI server da bi se rezultati izračunali.
              </div>
            )}

            {analysis && activeStep && (
              <div className="mt-5 space-y-4">
                <TextWindow text={cleanedText} activeStart={activeStep.index} k={safeK} />

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-slate-500">Korak</p>
                    <p className="mt-1 text-2xl font-bold">
                      {activeStep.index + 1}/{analysis.windows.length}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-sm text-blue-700">Trenutni k-mer</p>
                    <p className="mt-1 font-mono text-2xl font-bold">{activeStep.pattern}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-sm text-emerald-700">
                      {activeApproach === "naive"
                        ? "Broj pojavljivanja"
                        : activeApproach === "array"
                          ? "Indeks u nizu"
                          : activeApproach === "dict"
                            ? "Vrednost u rečniku"
                            : "Indeks pre sortiranja"}
                    </p>
                    <p className="mt-1 text-2xl font-bold">{stepMetric}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
                  <button
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    onClick={previousStep}
                    type="button"
                  >
                    Prethodni korak
                  </button>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                    Korak {activeStep.index + 1} od {analysis.windows.length}
                  </span>
                  <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                    onClick={nextStep}
                    type="button"
                  >
                    Sledeći korak
                  </button>
                </div>

                <ApproachStepExplanation
                  activeApproach={activeApproach}
                  activeStep={activeStep}
                />

                <ApproachVisualDetails
                  activeApproach={activeApproach}
                  activeStep={activeStep}
                  analysis={analysis}
                />
              </div>
            )}
          </article>
        </section>

        {analysis && !apiError && (
          <section className="mt-8">
            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Rezultat</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Najveća frekvencija je{" "}
                <span className="font-mono font-bold">{resultMaxCount}</span>, pa su najčešći
                k-meri:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {resultPatterns.map((pattern) => (
                  <span
                    className="rounded-lg bg-emerald-100 px-3 py-2 font-mono font-bold text-emerald-800"
                    key={pattern}
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            </article>
          </section>
        )}
      </section>
    </main>
  );
}
