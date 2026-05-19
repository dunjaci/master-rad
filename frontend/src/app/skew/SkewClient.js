"use client";

import { useEffect, useMemo, useState } from "react";

const EXAMPLE_GENOME = "CCATGTAGCGAGTGATC";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const codeSample = `def compute_gc_skew(genome):
    skew = [0]
    current = 0

    for nucleotide in genome:
        if nucleotide == "G":
            current += 1
        elif nucleotide == "C":
            current -= 1

        skew.append(current)

    return skew

def minimum_skew(genome):
    skew = compute_gc_skew(genome)
    minimum = min(skew)

    positions = []
    for i in range(len(skew)):
        if skew[i] == minimum:
            positions.append(i)

    return positions`;

function cleanDna(value) {
  return value.replace(/\s+/g, "").toUpperCase();
}

function isDna(value) {
  return /^[ACGT]+$/.test(value);
}

function SkewChart({ activeIndex, analysis }) {
  const width = 560;
  const height = 210;
  const padding = 30;
  const spanX = Math.max(1, analysis.values.length - 1);
  const spanY = Math.max(1, analysis.maximum - analysis.minimum);
  const yZero = padding + ((analysis.maximum - 0) / spanY) * (height - padding * 2);
  const visibleValues = analysis.values.slice(0, activeIndex + 1);
  const visibleMinimum = Math.min(...visibleValues);
  const visibleMinimumPositions = visibleValues
    .map((value, index) => ({ index, value }))
    .filter((item) => item.value === visibleMinimum)
    .map((item) => item.index);

  function point(index, value) {
    const x = padding + (index / spanX) * (width - padding * 2);
    const y = padding + ((analysis.maximum - value) / spanY) * (height - padding * 2);
    return { x, y };
  }

  const points = visibleValues
    .map((value, index) => {
      const { x, y } = point(index, value);
      return `${x},${y}`;
    })
    .join(" ");
  const activePoint = point(activeIndex, analysis.values[activeIndex]);

  return (
    <div className="mx-auto w-full max-w-4xl overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
      <svg
        className="mx-auto h-auto w-full max-w-[560px] min-w-[420px]"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
      >
        <line
          stroke="#cbd5e1"
          strokeDasharray="5 5"
          strokeWidth="2"
          x1={padding}
          x2={width - padding}
          y1={yZero}
          y2={yZero}
        />
        <line
          stroke="#94a3b8"
          strokeWidth="2"
          x1={padding}
          x2={padding}
          y1={padding}
          y2={height - padding}
        />
        <line
          stroke="#94a3b8"
          strokeWidth="2"
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={height - padding}
        />
        <polyline
          fill="none"
          points={points}
          stroke="#2563eb"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        {visibleMinimumPositions.map((position) => {
          const marker = point(position, visibleMinimum);
          return (
            <circle
              cx={marker.x}
              cy={marker.y}
              fill="#059669"
              key={position}
              r="6"
            />
          );
        })}
        <circle cx={activePoint.x} cy={activePoint.y} fill="#0f172a" r="7" />
        <text fill="#475569" fontSize="13" x={padding} y={22}>
          Skew(i)
        </text>
        <text fill="#475569" fontSize="13" x={width - 105} y={height - 8}>
          pozicija i
        </text>
        <text fill="#64748b" fontSize="12" x={padding + 8} y={yZero - 8}>
          0
        </text>
      </svg>
    </div>
  );
}

function GenomeStrip({ activeIndex, genome }) {
  return (
    <div className="mx-auto w-full max-w-4xl overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex w-max gap-1 font-mono text-sm">
        {genome.split("").map((symbol, index) => {
          const active = index === activeIndex - 1;
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
        {genome.split("").map((_, index) => (
          <span className="grid w-8 place-items-center" key={index}>
            {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
}

function StepExplanation({ step }) {
  const action =
    step.symbol === "G"
      ? "vrednost se povećava za 1"
      : step.symbol === "C"
        ? "vrednost se smanjuje za 1"
        : "vrednost ostaje nepromenjena";

  return (
    <div className="mx-auto w-full max-w-4xl rounded-lg border border-slate-200 p-4">
      <p className="font-semibold">Šta radi ovaj korak?</p>
      <p className="mt-2 leading-7 text-slate-600">
        Na poziciji <span className="font-mono font-bold">{step.index}</span> nalazi se
        baza <span className="font-mono font-bold">{step.symbol}</span>, pa se{" "}
        {action}. Prethodna vrednost je{" "}
        <span className="font-mono font-bold">{step.previous}</span>, a nova vrednost je{" "}
        <span className="font-mono font-bold">{step.value}</span>.
      </p>
    </div>
  );
}

function SkewTable({ activeIndex, analysis }) {
  const visible = analysis.values.map((value, index) => ({ index, value }));

  return (
    <div className="overflow-x-auto rounded-lg bg-slate-50 p-4">
      <div
        className="grid w-max gap-y-2 text-center font-mono text-sm"
        style={{
          gridTemplateColumns: `72px repeat(${visible.length}, 46px)`,
        }}
      >
        <div className="pr-4 text-right font-sans text-slate-600">i</div>
        {visible.map((item) => (
          <div
            className={item.index === activeIndex ? "font-bold text-blue-700" : ""}
            key={`index-${item.index}`}
          >
            {item.index}
          </div>
        ))}
        <div className="pr-4 text-right font-sans text-slate-600">Skew</div>
        {visible.map((item) => (
          <div
            className={`rounded-md px-2 py-1 ${
              item.value === analysis.minimum
                ? "bg-emerald-600 font-bold text-white"
                : item.index === activeIndex
                  ? "bg-blue-600 font-bold text-white"
                  : "bg-white text-slate-700"
            }`}
            key={`value-${item.index}`}
          >
            {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkewClient() {
  const [genome, setGenome] = useState(EXAMPLE_GENOME);
  const [step, setStep] = useState(1);
  const [apiAnalysis, setApiAnalysis] = useState(null);
  const [apiError, setApiError] = useState(false);

  const cleanedGenome = useMemo(() => cleanDna(genome), [genome]);
  const invalidAlphabet = cleanedGenome.length > 0 && !isDna(cleanedGenome);
  const invalid = cleanedGenome.length === 0 || invalidAlphabet;
  const analysis = invalid ? null : apiAnalysis;
  const activeIndex = analysis ? Math.min(step, analysis.values.length - 1) : 0;
  const activeStep = analysis?.steps[activeIndex - 1];

  useEffect(() => {
    if (invalid) {
      Promise.resolve().then(() => setApiAnalysis(null));
      Promise.resolve().then(() => setApiError(false));
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      Promise.resolve().then(() => setApiError(false));
      fetch(`${API_BASE}/api/skew`, {
        body: JSON.stringify({ genome: cleanedGenome }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (data) {
            setApiAnalysis(data);
            setApiError(false);
          }
        })
        .catch((error) => {
          if (error.name === "AbortError") return;
          setApiError(true);
        });
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [cleanedGenome, invalid]);

  function resetStep() {
    setStep(1);
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 1));
  }

  function nextStep() {
    if (!analysis) return;
    setStep((current) => Math.min(current + 1, analysis.values.length - 1));
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
            GC-skew Diagram
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            Asimetrija replikacije DNK i Skew dijagram
          </h1>
          <div className="mt-5 space-y-4 text-base leading-7 text-slate-600">
            <p>
              Tokom replikacije DNK dva lanca se ne ponašaju simetrično. Zbog
              različitog vremena provedenog u jednolančanom stanju, raspodela baza G i C
              može postati neravnomerna duž genoma.
            </p>
            <p>
              GC-skew prati razliku između broja baza G i C u prefiksu sekvence. Pozicije
              na kojima funkcija dostiže minimum često predstavljaju kandidate za
              početni region replikacije, odnosno oriC.
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-5">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Algoritam
                </p>
                <h2 className="mt-2 text-2xl font-bold">Izračunavanje GC-skew vrednosti</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                Vremenska složenost: <span className="font-mono font-bold">O(|Genom|)</span>
              </span>
            </div>
            <pre className="mt-4 max-h-[300px] overflow-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              <code>{codeSample}</code>
            </pre>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Vizuelni prikaz
                </p>
                <h2 className="mt-2 text-2xl font-bold">Konstrukcija Skew dijagrama</h2>
                <p className="mt-1 text-sm text-slate-500">
                  G povećava vrednost, C je smanjuje, A i T je ne menjaju.
                </p>
              </div>
            </div>

            <div className="mx-auto mt-5 grid w-full max-w-4xl gap-4 rounded-lg bg-slate-50 p-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                DNK sekvenca
                <textarea
                  className="min-h-16 resize-y rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm font-medium outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  onChange={(event) => {
                    setGenome(event.target.value.toUpperCase());
                    setStep(1);
                  }}
                  value={genome}
                />
              </label>
              <p className="text-sm text-slate-500">
                Dužina genoma:{" "}
                <span className="font-mono font-bold">{cleanedGenome.length}</span>
              </p>
            </div>

            {invalid && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                Unos sme da sadrži samo slova A, C, T i G.
              </div>
            )}

            {apiError && (
              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                Backend nije dostupan. Pokreni FastAPI server da bi se rezultati izračunali.
              </div>
            )}

            {analysis && activeStep && (
              <div className="mt-5 space-y-4">
                <GenomeStrip activeIndex={activeIndex} genome={cleanedGenome} />
                <SkewChart activeIndex={activeIndex} analysis={analysis} />

                <div className="mx-auto grid w-full max-w-4xl gap-3 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-slate-500">Pozicija</p>
                    <p className="mt-1 text-2xl font-bold">
                      {activeIndex}/{cleanedGenome.length}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-sm text-blue-700">Trenutna baza</p>
                    <p className="mt-1 font-mono text-2xl font-bold">{activeStep.symbol}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3">
                    <p className="text-sm text-emerald-700">Skew(i)</p>
                    <p className="mt-1 text-2xl font-bold">{activeStep.value}</p>
                  </div>
                </div>

                <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
                  <button
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    onClick={previousStep}
                    type="button"
                  >
                    Prethodna pozicija
                  </button>
                  <button
                    className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                    onClick={resetStep}
                    type="button"
                  >
                    Pokreni od početka
                  </button>
                  <button
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                    onClick={nextStep}
                    type="button"
                  >
                    Sledeća pozicija
                  </button>
                </div>

                <StepExplanation step={activeStep} />

                <div className="mx-auto w-full max-w-4xl rounded-lg border border-slate-200 p-4">
                  <p className="font-semibold">Niz vrednosti</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Zelenom bojom su označene pozicije na kojima funkcija dostiže minimum.
                  </p>
                  <div className="mt-4">
                    <SkewTable activeIndex={activeIndex} analysis={analysis} />
                  </div>
                </div>
              </div>
            )}
          </article>
        </section>

        {analysis && (
          <section className="mt-8">
            <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Rezultat</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Minimalna vrednost funkcije je{" "}
                <span className="font-mono font-bold">{analysis.minimum}</span>. Pozicije
                minimalnog skew-a, odnosno kandidati za oriC, jesu:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {analysis.minimumPositions.map((position) => (
                  <span
                    className="rounded-lg bg-emerald-100 px-3 py-2 font-mono font-bold text-emerald-800"
                    key={position}
                  >
                    {position}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-500">
                Maksimum funkcije je {analysis.maximum}, na pozicijama{" "}
                {analysis.maximumPositions.join(", ")}. Kod kružnih bakterijskih genoma
                ovaj region je često približno nasuprot oriC regionu.
              </p>
            </article>
          </section>
        )}
      </section>
    </main>
  );
}

