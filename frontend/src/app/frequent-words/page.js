"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

const API = "http://127.0.0.1:8000";

const EXAMPLES = [
  { name: "Primer iz knjige", genome: "ACGTTGCATGTCGCATGATGCATGAGAGCT", k: 4 },
  { name: "Mali primer", genome: "ATATATAT", k: 2 },
];

export default function FrequentWordsClient({ md }) {
  const [genome, setGenome] = useState(EXAMPLES[0].genome);
  const [k, setK] = useState(EXAMPLES[0].k);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");

  const cleanedGenome = useMemo(
    () => genome.replace(/\s+/g, "").toUpperCase(),
    [genome]
  );

  async function run() {
    setErr("");
    setRes(null);
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/frequent-words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genome: cleanedGenome, k: Number(k) }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.detail || "Request failed");
      setRes(data);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  function applyExample(ex) {
    setGenome(ex.genome);
    setK(ex.k);
    setRes(null);
    setErr("");
  }

  return (
    <div className="space-y-8">
      {/* THEORY */}
      <article className="rounded-2xl border bg-white p-7 shadow-sm">
        <div className="prose max-w-none">
          <ReactMarkdown>{md}</ReactMarkdown>
        </div>
      </article>

      {/* TRY IT */}
      <section className="rounded-2xl border bg-white p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Try it</h2>

          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.name}
                onClick={() => applyExample(ex)}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                type="button"
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Genome (DNA string)
            </label>
            <textarea
              className="mt-2 w-full rounded-xl border p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              rows={5}
              value={genome}
              onChange={(e) => setGenome(e.target.value)}
            />
            <p className="mt-2 text-xs text-gray-500">
              Razmaci se uklanjaju, slova se pretvaraju u velika.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">k</label>
              <input
                className="mt-2 w-28 rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                type="number"
                min={1}
                max={50}
                value={k}
                onChange={(e) => setK(e.target.value)}
              />
            </div>

            <button
              onClick={run}
              disabled={loading}
              className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              type="button"
            >
              {loading ? "Running..." : "Run"}
            </button>

            <div className="text-xs text-gray-500">
              |Text|: <span className="font-mono">{cleanedGenome.length}</span>
            </div>
          </div>

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {err}
            </div>
          )}

          {res && (
            <div className="rounded-2xl border bg-gray-50 p-5">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-sm text-gray-600">Max count</div>
                  <div className="text-2xl font-semibold">{res.max_count}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Most frequent k-mers</div>
                  <div className="mt-1 font-mono text-sm break-words">
                    {res.patterns?.length ? res.patterns.join(", ") : "(nema rezultata)"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MINI TASK */}
      <section className="rounded-2xl border bg-white p-7 shadow-sm">
        <h2 className="text-xl font-semibold">Mini zadatak</h2>
        <p className="mt-2 text-gray-700">
          Povećaj <span className="font-mono">k</span> i posmatraj kako se menja rezultat.
          Šta se dešava kada je <span className="font-mono">k</span> blizu dužine genoma?
        </p>
      </section>
    </div>
  );
}
