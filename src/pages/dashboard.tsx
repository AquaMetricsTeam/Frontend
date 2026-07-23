import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PageWrapper from "@/components/layouts/PageWrapper";
import WithPagination from "@/components/HOCs/WithPagination";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import { InputField } from "@/components/fields/InputField";
import { SelectField } from "@/components/fields/SelectField";
import { TextareaField } from "@/components/fields/TextareaField";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";


// ── Mock data ────────────────────────────────────────────────────────────────

interface Athlete {
  id: number;
  name: string;
  level: string;
  coach: string;
  sessions: number;
  score: number;
  status: "Active" | "Inactive" | "Suspended";
}

const MOCK_ATHLETES: Athlete[] = [
  { id: 1, name: "Layla Hassan",    level: "Advanced",     coach: "Ahmed Nour",  sessions: 48, score: 94, status: "Active" },
  { id: 2, name: "Omar Farouk",     level: "Intermediate", coach: "Sara Kamel",  sessions: 31, score: 78, status: "Active" },
  { id: 3, name: "Nour El-Din",     level: "Beginner",     coach: "Ahmed Nour",  sessions: 12, score: 61, status: "Active" },
  { id: 4, name: "Rania Mostafa",   level: "Advanced",     coach: "Khaled Adel", sessions: 55, score: 97, status: "Active" },
  { id: 5, name: "Youssef Tarek",   level: "Intermediate", coach: "Sara Kamel",  sessions: 27, score: 72, status: "Inactive" },
  { id: 6, name: "Dina Ashraf",     level: "Advanced",     coach: "Khaled Adel", sessions: 41, score: 89, status: "Active" },
  { id: 7, name: "Karim Ibrahim",   level: "Beginner",     coach: "Ahmed Nour",  sessions: 8,  score: 55, status: "Suspended" },
  { id: 8, name: "Mona Samir",      level: "Intermediate", coach: "Sara Kamel",  sessions: 22, score: 68, status: "Active" },
];

const LEVEL_OPTIONS = [
  { value: "beginner",     label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced",     label: "Advanced" },
  { value: "elite",        label: "Elite" },
];

const COACH_OPTIONS = [
  { value: "ahmed",  label: "Ahmed Nour" },
  { value: "sara",   label: "Sara Kamel" },
  { value: "khaled", label: "Khaled Adel" },
];

// ── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Athlete["status"] }) {
  const styles = {
    Active:    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Inactive:  "bg-neutral-500/10 text-neutral-500",
    Suspended: "bg-red-500/10 text-red-600 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

// ── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">{value}</span>
    </div>
  );
}

// ── Form defaults ─────────────────────────────────────────────────────────────

interface DemoForm {
  athleteName: string;
  level: string;
  coach: string;
  notes: string;
}

// ── Dashboard page ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isError,   setIsError]   = useState(false);

  const methods = useForm<DemoForm>({
    defaultValues: { athleteName: "", level: "", coach: "", notes: "" },
  });

  function onSubmit(data: DemoForm) {
    console.log("Form submitted:", data);
    methods.reset();
  }

  return (
    <PageWrapper>
      {/* ── Page header ── */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Component showcase — table, fields, pagination
        </p>
      </div>

      {/* ── Stats row ── */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Athletes", value: "248",  color: "text-primary" },
          { label: "Active Sessions", value: "31",  color: "text-emerald-500" },
          { label: "Coaches",         value: "12",  color: "text-secondary-500" },
          { label: "Avg Score",       value: "82%", color: "text-amber-500" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className={`mt-2 text-3xl font-bold ${s.color}`}
               style={{ fontFamily: "var(--font-display)" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* ── Table section ── */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-base font-semibold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Athletes
            </h2>
            {/* Loading / error toggles for demo */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setIsLoading(v => !v); setIsError(false); }}
                className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors"
              >
                {isLoading ? "Stop loading" : "Simulate loading"}
              </button>
              <button
                type="button"
                onClick={() => { setIsError(v => !v); setIsLoading(false); }}
                className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors"
              >
                {isError ? "Clear error" : "Simulate error"}
              </button>
            </div>
          </div>

          <WithPagination pageCount={6}>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    {["#", "Athlete", "Level", "Coach", "Sessions", "Score", "Status"].map((h) => (
                      <TableHead
                        key={h}
                        className="h-10 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableLoadingAndError
                    isLoading={isLoading}
                    isError={isError}
                    hasNoData={!isLoading && !isError && MOCK_ATHLETES.length === 0}
                    skeletonProps={{ rows: 8, columns: 7 }}
                    errorMessageProps={{ onRetry: () => setIsError(false) }}
                  >
                    {MOCK_ATHLETES.map((a) => (
                      <TableRow
                        key={a.id}
                        className="border-border transition-colors hover:bg-muted/40"
                      >
                        <TableCell className="text-xs text-muted-foreground tabular-nums">
                          {a.id}
                        </TableCell>
                        <TableCell className="font-medium text-sm text-foreground">
                          {a.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {a.level}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {a.coach}
                        </TableCell>
                        <TableCell className="text-sm tabular-nums text-muted-foreground">
                          {a.sessions}
                        </TableCell>
                        <TableCell>
                          <ScoreBar value={a.score} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={a.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableLoadingAndError>
                </TableBody>
              </Table>
            </div>
          </WithPagination>
        </section>

        {/* ── Form section ── */}
        <section>
          <h2
            className="mb-4 text-base font-semibold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Add Athlete
          </h2>

          <div className="rounded-xl border border-border bg-card p-5">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                <InputField<DemoForm>
                  name="athleteName"
                  label={t("common:nav.items.athletes") + " Name"}
                  placeholder="e.g. Layla Hassan"
                  required
                  rules={{ required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } }}
                />

                <SelectField<DemoForm>
                  name="level"
                  label="Level"
                  options={LEVEL_OPTIONS}
                  placeholder="Select level"
                  required
                  rules={{ required: "Level is required" }}
                />

                <SelectField<DemoForm>
                  name="coach"
                  label="Coach"
                  options={COACH_OPTIONS}
                  placeholder="Select coach"
                  hint="Assign a certified coach to this athlete"
                />

                <TextareaField<DemoForm>
                  name="notes"
                  label="Notes"
                  placeholder="Training notes, injuries, goals..."
                  rows={4}
                />

                <Button type="submit" size="lg" className="mt-1 w-full">
                  Add Athlete
                </Button>
              </form>

            </FormProvider>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
