"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { saveEvaluation, getEvaluation } from "@/app/actions/evaluations";

type ScoreValue = 1 | 2 | 3 | 4 | 5;

const SCORE_LABELS: Record<ScoreValue, string> = {
  1: "1 — Poor",
  2: "2 — Below average",
  3: "3 — Adequate",
  4: "4 — Good",
  5: "5 — Excellent",
};

function ScoreSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-on-surface-muted w-32 shrink-0">
        {label}
      </span>
      <div className="flex gap-2">
        {([1, 2, 3, 4, 5] as ScoreValue[]).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            title={SCORE_LABELS[n]}
            className={`h-9 w-9 rounded-xl text-sm font-semibold border transition-colors
              ${
                value === n
                  ? "bg-(--color-navy) text-white border-(--color-navy)"
                  : "bg-surface border-divider text-on-surface hover:border-(--color-navy)"
              }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

const DIMENSIONS = [
  {
    key: "legal",
    label: "Legal Feasibility",
    scoreKey: "legalScore",
    notesKey: "legalNotes",
  },
  {
    key: "financial",
    label: "Financial Viability",
    scoreKey: "financialScore",
    notesKey: "financialNotes",
  },
  {
    key: "market",
    label: "Market Suitability",
    scoreKey: "marketScore",
    notesKey: "marketNotes",
  },
  {
    key: "risk",
    label: "Risk Profile",
    scoreKey: "riskScore",
    notesKey: "riskNotes",
  },
] as const;

type FormState = {
  legalScore: number | null;
  legalNotes: string;
  financialScore: number | null;
  financialNotes: string;
  marketScore: number | null;
  marketNotes: string;
  taxNotes: string;
  riskScore: number | null;
  riskNotes: string;
  crossBorderNotes: string;
  overallRecommendation: string;
};

const EMPTY: FormState = {
  legalScore: null,
  legalNotes: "",
  financialScore: null,
  financialNotes: "",
  marketScore: null,
  marketNotes: "",
  taxNotes: "",
  riskScore: null,
  riskNotes: "",
  crossBorderNotes: "",
  overallRecommendation: "",
};

export default function EvaluationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getEvaluation(params.id).then((ev) => {
      if (ev) {
        setForm({
          legalScore: ev.legalScore,
          legalNotes: ev.legalNotes ?? "",
          financialScore: ev.financialScore,
          financialNotes: ev.financialNotes ?? "",
          marketScore: ev.marketScore,
          marketNotes: ev.marketNotes ?? "",
          taxNotes: ev.taxNotes ?? "",
          riskScore: ev.riskScore,
          riskNotes: ev.riskNotes ?? "",
          crossBorderNotes: ev.crossBorderNotes ?? "",
          overallRecommendation: ev.overallRecommendation ?? "",
        });
        setSaved(true);
      }
    });
  }, [params.id]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await saveEvaluation(params.id, {
          legalScore: form.legalScore,
          legalNotes: form.legalNotes || null,
          financialScore: form.financialScore,
          financialNotes: form.financialNotes || null,
          marketScore: form.marketScore,
          marketNotes: form.marketNotes || null,
          taxNotes: form.taxNotes || null,
          riskScore: form.riskScore,
          riskNotes: form.riskNotes || null,
          crossBorderNotes: form.crossBorderNotes || null,
          overallRecommendation: form.overallRecommendation || null,
          completedAt: new Date(),
        });
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save.");
      }
    });
  }

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/admin-portal/intake/${params.id}`}
          className="flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-on-surface transition-colors"
        >
          <ArrowLeft size={16} />
          Back to intake
        </Link>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Phase 4
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Internal Evaluation
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          Score each dimension 1–5 and add notes. Saving moves the intake to
          Reviewing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Scored dimensions */}
        {DIMENSIONS.map((dim) => (
          <Card key={dim.key}>
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-on-surface">{dim.label}</h2>
                <ScoreSelector
                  label="Score"
                  value={form[dim.scoreKey as keyof FormState] as number | null}
                  onChange={(v) =>
                    set(dim.scoreKey as keyof FormState, v as never)
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={dim.notesKey}>Notes</Label>
                <Textarea
                  id={dim.notesKey}
                  rows={3}
                  value={form[dim.notesKey as keyof FormState] as string}
                  onChange={(e) =>
                    set(
                      dim.notesKey as keyof FormState,
                      e.target.value as never,
                    )
                  }
                  placeholder={`${dim.label} observations…`}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Tax implications */}
        <Card>
          <CardContent className="pt-5 space-y-1.5">
            <Label htmlFor="taxNotes">Tax Implications</Label>
            <Textarea
              id="taxNotes"
              rows={3}
              value={form.taxNotes}
              onChange={(e) => set("taxNotes", e.target.value)}
              placeholder="VAT, capital gains, stamp duty, diaspora tax considerations…"
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Cross-border restrictions */}
        <Card>
          <CardContent className="pt-5 space-y-1.5">
            <Label htmlFor="crossBorderNotes">Cross-Border Restrictions</Label>
            <Textarea
              id="crossBorderNotes"
              rows={3}
              value={form.crossBorderNotes}
              onChange={(e) => set("crossBorderNotes", e.target.value)}
              placeholder="FX restrictions, repatriation, foreign ownership limits…"
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Preliminary strategy */}
        <Card>
          <CardContent className="pt-5 space-y-1.5">
            <Label htmlFor="overallRecommendation">
              Preliminary Strategy / Overall Recommendation
            </Label>
            <Textarea
              id="overallRecommendation"
              rows={5}
              value={form.overallRecommendation}
              onChange={(e) => set("overallRecommendation", e.target.value)}
              placeholder="Summarise the recommended approach, proposed structure, and any key conditions…"
              className="resize-none"
            />
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            <Save size={16} className="mr-2" />
            {isPending ? "Saving…" : "Save evaluation"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle2 size={15} />
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
