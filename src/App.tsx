import { useCallback, useEffect, useMemo, useState } from "react";
import { COUNTRIES, type Country } from "./countries";
import { FLAGS } from "./flags";

type Phase = "start" | "play" | "done";

interface Result {
  country: Country;
  chosen: string;
  correct: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 1 correct + 3 wrong. Up to 2 wrong answers come from the same region so the choice isn't trivial. */
function buildOptions(country: Country): string[] {
  const others = COUNTRIES.filter((c) => c.code !== country.code);
  const sameRegion = shuffle(others.filter((c) => c.region === country.region)).slice(0, 2);
  const rest = shuffle(others.filter((c) => !sameRegion.includes(c))).slice(0, 3 - sameRegion.length);
  return shuffle([country.capital, ...[...sameRegion, ...rest].map((c) => c.capital)]);
}

function Flag({ code, className }: { code: string; className?: string }) {
  const F = FLAGS[code];
  return F ? <F className={className} /> : null;
}

const ROUND_SIZES = [10, 20, COUNTRIES.length] as const;

export default function App() {
  const [phase, setPhase] = useState<Phase>("start");
  const [roundSize, setRoundSize] = useState<number>(10);
  const [showName, setShowName] = useState(false);
  const [deck, setDeck] = useState<Country[]>([]);
  const [idx, setIdx] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  const current = deck[idx];
  const score = results.filter((r) => r.correct).length;
  const streak = useMemo(() => {
    let s = 0;
    for (let i = results.length - 1; i >= 0 && results[i].correct; i--) s++;
    return s;
  }, [results]);

  const startRound = useCallback((cards: Country[]) => {
    setDeck(cards);
    setIdx(0);
    setOptions(buildOptions(cards[0]));
    setChosen(null);
    setResults([]);
    setPhase("play");
  }, []);

  const answer = useCallback(
    (opt: string) => {
      if (!current || chosen) return;
      setChosen(opt);
      setResults((r) => [...r, { country: current, chosen: opt, correct: opt === current.capital }]);
    },
    [current, chosen],
  );

  const next = useCallback(() => {
    if (!chosen) return;
    if (idx + 1 >= deck.length) {
      setPhase("done");
      return;
    }
    setIdx(idx + 1);
    setOptions(buildOptions(deck[idx + 1]));
    setChosen(null);
  }, [chosen, idx, deck]);

  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= 4 && options[n - 1]) answer(options[n - 1]);
      if ((e.key === "Enter" || e.key === " ") && chosen) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, options, answer, next, chosen]);

  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">Flashcards · Europe</p>
            <h1 className="font-display text-4xl leading-none md:text-5xl">Capitals of Europe</h1>
          </div>
          {phase === "play" && (
            <div className="flex items-center gap-6 text-sm">
              <Stat label="Card" value={`${idx + 1} / ${deck.length}`} />
              <Stat label="Correct" value={String(score)} />
              <Stat label="Streak" value={String(streak)} />
            </div>
          )}
        </header>

        {phase === "start" && (
          <StartScreen
            roundSize={roundSize}
            setRoundSize={setRoundSize}
            showName={showName}
            setShowName={setShowName}
            onStart={() => startRound(shuffle(COUNTRIES).slice(0, roundSize))}
          />
        )}

        {phase === "play" && current && (
          <main className="mt-8 grid gap-8 md:grid-cols-[1.15fr_1fr] md:gap-12">
            {/* Card */}
            <section>
              <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full bg-moss transition-all duration-500"
                  style={{ width: `${((idx + (chosen ? 1 : 0)) / deck.length) * 100}%` }}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-lg border border-line bg-sheet/60" />
                <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-lg border border-line bg-sheet/80" />
                <div
                  key={current.code}
                  className="card-in relative rounded-lg border border-line bg-sheet p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)] md:p-7"
                >
                  <div className="overflow-hidden rounded-sm ring-1 ring-black/10">
                    <Flag code={current.code} className="block aspect-[3/2] w-full" />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-3">
                    <span className="font-display text-2xl">
                      {showName || chosen ? current.name : <span className="text-dim">Which country?</span>}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-dim">{current.region}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Question */}
            <section className="flex flex-col">
              <h2 className="font-display text-3xl leading-tight">
                What is the capital{showName || chosen ? <> of {current.name}</> : " of this country"}?
              </h2>
              <p className="mt-1 text-sm text-dim">Tap an answer or press 1–4.</p>

              <div className="mt-6 grid gap-3">
                {options.map((opt, i) => {
                  const isCorrect = opt === current.capital;
                  const isChosen = opt === chosen;
                  let state = "border-line bg-sheet hover:border-ink hover:-translate-y-px";
                  if (chosen) {
                    if (isCorrect) state = "border-moss bg-moss text-white";
                    else if (isChosen) state = "border-brick bg-brick text-white shake";
                    else state = "border-line bg-sheet opacity-45";
                  }
                  return (
                    <button
                      key={opt}
                      onClick={() => answer(opt)}
                      disabled={!!chosen}
                      className={`group flex items-center gap-4 rounded-md border-2 px-4 py-3.5 text-left text-lg font-medium transition-all duration-150 ${state}`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-xs font-semibold ${
                          chosen && (isCorrect || isChosen) ? "bg-white/20" : "bg-paper text-dim"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {chosen && isCorrect && <span aria-hidden>✓</span>}
                      {chosen && isChosen && !isCorrect && <span aria-hidden>✕</span>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 min-h-[3.5rem]">
                {chosen && (
                  <div className="fade-in flex flex-wrap items-center justify-between gap-4">
                    <p className="text-base">
                      {chosen === current.capital ? (
                        <>
                          <strong className="text-moss">Correct.</strong> {current.capital} is the capital of {current.name}.
                        </>
                      ) : (
                        <>
                          <strong className="text-brick">Not quite.</strong> The capital of {current.name} is{" "}
                          <strong>{current.capital}</strong>.
                        </>
                      )}
                    </p>
                    <button
                      onClick={next}
                      autoFocus
                      className="rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-black"
                    >
                      {idx + 1 >= deck.length ? "See results" : "Next card"} →
                    </button>
                  </div>
                )}
              </div>
            </section>
          </main>
        )}

        {phase === "done" && (
          <ResultsScreen
            results={results}
            onRetryMissed={(missed) => startRound(shuffle(missed))}
            onNew={() => setPhase("start")}
          />
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-dim">{label}</div>
      <div className="font-display text-xl tabular-nums">{value}</div>
    </div>
  );
}

function StartScreen(props: {
  roundSize: number;
  setRoundSize: (n: number) => void;
  showName: boolean;
  setShowName: (b: boolean) => void;
  onStart: () => void;
}) {
  const preview = useMemo(() => shuffle(COUNTRIES).slice(0, 12), []);
  return (
    <main className="mt-10 grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-start">
      <section>
        <p className="max-w-md text-lg leading-relaxed">
          Each card shows a flag. Pick the right capital from four options — one correct, three wrong.
          Wrong answers are partly drawn from the same part of Europe, so it stays a real test.
        </p>

        <div className="mt-8">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-dim">Cards per round</div>
          <div className="inline-flex overflow-hidden rounded-md border-2 border-ink">
            {ROUND_SIZES.map((n) => (
              <button
                key={n}
                onClick={() => props.setRoundSize(n)}
                className={`px-5 py-2 text-sm font-semibold transition ${
                  props.roundSize === n ? "bg-ink text-paper" : "bg-sheet hover:bg-paper"
                }`}
              >
                {n === COUNTRIES.length ? `All ${n}` : n}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-center gap-3">
          <button
            role="switch"
            aria-checked={props.showName}
            onClick={() => props.setShowName(!props.showName)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${props.showName ? "bg-moss" : "bg-line"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                props.showName ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
          <span className="text-sm">
            Show country name on the card <span className="text-dim">(easier)</span>
          </span>
        </label>

        <button
          onClick={props.onStart}
          className="mt-8 rounded-md bg-moss px-7 py-3.5 text-base font-semibold text-white transition hover:brightness-110"
        >
          Start round →
        </button>
      </section>

      <section className="grid grid-cols-4 gap-3" aria-hidden>
        {preview.map((c, i) => (
          <div
            key={c.code}
            className="overflow-hidden rounded-sm ring-1 ring-black/10"
            style={{ transform: `rotate(${((i * 7) % 5) - 2}deg)` }}
          >
            <Flag code={c.code} className="block aspect-[3/2] w-full" />
          </div>
        ))}
      </section>
    </main>
  );
}

function ResultsScreen({
  results,
  onRetryMissed,
  onNew,
}: {
  results: Result[];
  onRetryMissed: (missed: Country[]) => void;
  onNew: () => void;
}) {
  const score = results.filter((r) => r.correct).length;
  const missed = results.filter((r) => !r.correct);
  const pct = Math.round((score / results.length) * 100);
  const verdict =
    pct === 100 ? "Flawless." : pct >= 80 ? "Excellent work." : pct >= 50 ? "Good progress." : "Keep practising.";

  return (
    <main className="mt-10 fade-in">
      <div className="flex flex-wrap items-end gap-x-8 gap-y-2">
        <div className="font-display text-7xl leading-none tabular-nums md:text-8xl">
          {score}
          <span className="text-dim">/{results.length}</span>
        </div>
        <div className="pb-2">
          <div className="font-display text-2xl">{verdict}</div>
          <div className="text-sm text-dim">{pct}% correct</div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {missed.length > 0 && (
          <button
            onClick={() => onRetryMissed(missed.map((m) => m.country))}
            className="rounded-md bg-brick px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Practise the {missed.length} missed
          </button>
        )}
        <button
          onClick={onNew}
          className="rounded-md border-2 border-ink px-5 py-3 text-sm font-semibold transition hover:bg-ink hover:text-paper"
        >
          New round
        </button>
      </div>

      <h3 className="mt-12 border-b border-line pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-dim">
        This round
      </h3>
      <ul className="mt-2 divide-y divide-line">
        {results.map((r) => (
          <li key={r.country.code} className="flex items-center gap-4 py-3">
            <div className="w-12 shrink-0 overflow-hidden rounded-sm ring-1 ring-black/10">
              <Flag code={r.country.code} className="block aspect-[3/2] w-full" />
            </div>
            <div className="flex-1">
              <span className="font-medium">{r.country.name}</span>
              <span className="text-dim"> — {r.country.capital}</span>
            </div>
            {r.correct ? (
              <span className="text-sm font-semibold text-moss">✓</span>
            ) : (
              <span className="text-sm text-brick">
                you said <s>{r.chosen}</s>
              </span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
