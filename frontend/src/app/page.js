"use client";
import { useState } from "react";

export default function Home() {
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState("");

  async function ping() {
    setErr(""); setResp(null);
    try {
      const r = await fetch("http://localhost:8000/api/home");
      const data = await r.json();
      setResp(data);
    } catch (e) {
      setErr(String(e));
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Replikacija genoma - Elektronska lekcija</h1>
      <button onClick={ping}>Ping backend</button>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {resp && <pre>{JSON.stringify(resp, null, 2)}</pre>}
    </main>
  );
}
