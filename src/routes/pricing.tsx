import { useState } from "react";
import { Link } from "react-router-dom";
import { ChannelCTA } from "@/components/asmi/ChannelCTA";
import { SiteFooter } from "@/components/asmi/SiteFooter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { type BillingInterval, COMMON_FEATURES, formatUsd, PLANS } from "@/lib/pricing";
import asmiLogoUrl from "/assets/asmi-logo-black.png";

const PRICING_DESCRIPTION =
  "your first task is free. asmi pro: $10/month for 20 tasks. asmi ultra: $49/month for 100 tasks. save with annual billing.";

// Biggest yearly saving across plans, in whole months (e.g. $10/mo vs $99/yr → 2) - same rule as
// the dashboard's interval toggle badge, so both surfaces advertise the same number.
const MONTHS_FREE = Math.max(...PLANS.map((p) => Math.round(12 - p.price.year / p.price.month)));

function IntervalToggle({
  value,
  onChange,
}: {
  value: BillingInterval;
  onChange: (v: BillingInterval) => void;
}) {
  const options: { key: BillingInterval; label: string }[] = [
    { key: "month", label: "monthly" },
    { key: "year", label: "yearly" },
  ];
  return (
    // Radix ToggleGroup → roving focus + arrow keys; single mode allows deselect, so ignore ""
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as BillingInterval)}
      aria-label="billing interval"
      className="inline-flex gap-0 rounded-full p-1"
      style={{ border: "2px solid var(--ink)", background: "var(--cream)" }}
    >
      {options.map((opt) => {
        const active = value === opt.key;
        return (
          <ToggleGroupItem
            key={opt.key}
            value={opt.key}
            className="h-auto rounded-full px-4 py-2 font-mono"
            style={{
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: active ? "var(--ink)" : "transparent",
              color: active ? "var(--cream)" : "var(--ink)",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
          >
            {opt.label}
            {opt.key === "year" && MONTHS_FREE > 0 && (
              <span
                className="rounded-full px-2 py-0.5"
                style={{ background: "var(--citrus)", color: "var(--ink)", fontSize: 10 }}
              >
                {MONTHS_FREE} mo free
              </span>
            )}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}

export default function Pricing() {
  useDocumentMeta("Pricing | asmi", [
    { name: "description", content: PRICING_DESCRIPTION },
    { property: "og:title", content: "asmi pricing" },
    { property: "og:description", content: PRICING_DESCRIPTION },
  ]);

  const [interval, setBillingInterval] = useState<BillingInterval>("month");

  return (
    <div className="landing-theme flex min-h-screen flex-col">
      <nav className="px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" aria-label="asmi home" className="shrink-0">
            <img src={asmiLogoUrl} alt="asmi" width={168} height={60} className="h-14 w-auto" />
          </Link>
          <Link
            to="/"
            className="font-serif italic"
            style={{ color: "var(--ink-dim)", fontSize: 14 }}
          >
            ← back to asmi
          </Link>
        </div>
      </nav>

      <main className="flex-1 px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mt-6 flex flex-col items-center text-center sm:mt-10">
            <h1 style={{ fontSize: "clamp(2.75rem, 8vw, 5rem)" }}>pricing.</h1>
            <p className="t-lead mt-5 max-w-md" style={{ color: "var(--ink-soft)" }}>
              she calls, texts, emails and chases until it's done. pick how much you want off your
              plate.
            </p>
            <p
              className="mt-5 rounded-full px-4 py-1.5 font-mono"
              style={{
                background: "var(--citrus)",
                border: "2px solid var(--ink)",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              your first task is free
            </p>
            <div className="mt-8">
              <IntervalToggle value={interval} onChange={setBillingInterval} />
            </div>
          </header>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
            {PLANS.map((plan) => {
              const price = plan.price[interval];
              const perMonth = interval === "year" ? plan.price.year / 12 : null;
              return (
                <article
                  key={plan.key}
                  className="edge-card relative flex flex-col p-7"
                  style={plan.featured ? { background: "var(--ink)", color: "var(--cream)" } : {}}
                >
                  {plan.featured && (
                    <span
                      className="absolute -top-3.5 left-7 rounded-full px-3 py-1 font-mono"
                      style={{
                        background: "var(--coral)",
                        color: "var(--cream)",
                        border: "2px solid var(--ink)",
                        fontSize: 11,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      most popular
                    </span>
                  )}

                  <h2
                    style={{
                      fontSize: "2rem",
                      color: plan.featured ? "var(--cream)" : "var(--ink)",
                    }}
                  >
                    {plan.name.toLowerCase()}
                  </h2>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        fontSize: "3.25rem",
                        letterSpacing: "-0.04em",
                        lineHeight: 1,
                      }}
                    >
                      {formatUsd(price)}
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 12,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: plan.featured ? "var(--cream-strong)" : "var(--ink-dim)",
                      }}
                    >
                      / {interval}
                    </span>
                  </div>
                  <p
                    className="t-body mt-2"
                    style={{
                      minHeight: "1.5em",
                      color: plan.featured ? "var(--cream-body)" : "var(--ink-dim)",
                    }}
                  >
                    {perMonth !== null ? `${formatUsd(perMonth)}/month, billed yearly` : ""}
                  </p>

                  <ul
                    className="t-body mt-6 space-y-3 pt-6"
                    style={{
                      borderTop: `1px solid ${plan.featured ? "var(--cream-line)" : "var(--ink-line)"}`,
                    }}
                  >
                    <li>
                      <span style={{ fontWeight: 700 }}>{plan.tasksPerMonth} tasks</span> per month
                    </li>
                    {COMMON_FEATURES.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <section className="mt-16 flex flex-col items-center text-center">
            <ChannelCTA align="center" size="lg" caption="first task free - text her on" />
            <p className="t-body mt-6 max-w-md" style={{ color: "var(--ink-dim)" }}>
              Cancel anytime. Prices in USD; taxes may apply. See our{" "}
              <Link to="/terms-and-conditions" style={{ textDecoration: "underline" }}>
                Terms
              </Link>{" "}
              for billing, renewal, and refund details.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
