import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SiteFooter } from "@/components/asmi/SiteFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import {
  CANNOT_DO,
  CLIENT_GUIDES,
  type ClientGuide,
  type ClientSlug,
  endpointFor,
  PROTOCOL_VERSIONS,
  SCOPES,
  TASK_FLOW,
  TOOL_EFFECT_LABEL,
  TOOL_GROUPS,
  type ToolDoc,
  TROUBLESHOOTING,
} from "@/lib/mcp-docs";
import { formatUsd, PLANS } from "@/lib/pricing";
import asmiLogoUrl from "/assets/asmi-logo-black.png";

const DEFAULT_CLIENT: ClientSlug = "claude";

const SECTIONS = [
  { id: "connect", label: "Connect" },
  { id: "permissions", label: "Sign-in & permissions" },
  { id: "tools", label: "Tools" },
  { id: "task-flow", label: "How a task runs" },
  { id: "plans", label: "Plans & limits" },
  { id: "security", label: "Security" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

const FACTS = [
  { label: "transport", value: "Streamable HTTP" },
  { label: "auth", value: "OAuth 2.1 + PKCE" },
  { label: "protocol", value: PROTOCOL_VERSIONS[0] },
  { label: "tools", value: String(TOOL_GROUPS.reduce((n, group) => n + group.tools.length, 0)) },
];

function isClientSlug(value: string | undefined): value is ClientSlug {
  return CLIENT_GUIDES.some((guide) => guide.slug === value);
}

const Mono = ({ children }: { children: React.ReactNode }) => (
  <code
    className="font-mono"
    style={{
      fontSize: "0.85em",
      background: "var(--ink-faint)",
      borderRadius: 6,
      padding: "0.1em 0.4em",
      color: "var(--ink)",
    }}
  >
    {children}
  </code>
);

const Section = ({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section
    id={id}
    className="scroll-mt-24 py-12"
    style={{ borderTop: "1px solid var(--ink-line)" }}
  >
    <p className="label-mono mb-3" style={{ color: "var(--ink-dim)", fontSize: 11 }}>
      {number}
    </p>
    <h2 className="mb-6" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}>
      {title}
    </h2>
    {children}
  </section>
);

function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <span className="label-mono shrink-0" style={{ color: "var(--citrus)", fontSize: 10 }}>
        endpoint
      </span>
      <code className="font-mono min-w-0 flex-1 truncate" style={{ fontSize: 14 }}>
        {value}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label="copy endpoint"
        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono transition-opacity hover:opacity-80"
        style={{ fontSize: 12, background: "var(--cream-faint)" }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}

function NumberedSteps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="space-y-5">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <span
            className="font-mono flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--citrus)", color: "var(--ink)", fontSize: 12 }}
          >
            {i + 1}
          </span>
          <div>
            <p className="font-medium" style={{ color: "var(--ink)" }}>
              {step.title}
            </p>
            <p style={{ color: "var(--ink-soft)" }}>{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ClientPanel({ guide }: { guide: ClientGuide }) {
  return (
    <div className="space-y-8">
      <p style={{ color: "var(--ink-soft)", fontSize: "1.1rem" }}>{guide.tagline}</p>
      <CopyField value={endpointFor(guide)} />
      <NumberedSteps steps={guide.steps} />
      <ul
        className="space-y-2 rounded-xl p-5"
        style={{ background: "var(--paper-deep)", color: "var(--ink-soft)", fontSize: 15 }}
      >
        {guide.notes.map((note) => (
          <li key={note}>— {note}</li>
        ))}
      </ul>
    </div>
  );
}

function ToolRow({ tool }: { tool: ToolDoc }) {
  return (
    <div className="py-4" style={{ borderTop: "1px solid var(--ink-faint)" }}>
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <code className="font-mono" style={{ color: "var(--ink)", fontSize: 14 }}>
          {tool.name}
        </code>
        <span
          className="label-mono rounded-full px-2 py-0.5"
          style={{
            fontSize: 9.5,
            background: tool.effect === "outward" ? "var(--coral)" : "var(--ink-faint)",
            color: tool.effect === "outward" ? "var(--cream)" : "var(--ink-dim)",
          }}
        >
          {TOOL_EFFECT_LABEL[tool.effect]}
        </span>
        {tool.needsOutreach && (
          <span
            className="label-mono rounded-full px-2 py-0.5"
            style={{ fontSize: 9.5, border: "1px solid var(--ink-line)", color: "var(--ink-dim)" }}
          >
            needs outreach
          </span>
        )}
      </div>
      <p style={{ color: "var(--ink-soft)", fontSize: 15 }}>{tool.summary}</p>
    </div>
  );
}

export default function DocsMcp() {
  const { client } = useParams();
  const navigate = useNavigate();
  const active: ClientSlug = isClientSlug(client) ? client : DEFAULT_CLIENT;

  useDocumentMeta("Asmi MCP server docs | asmi", [
    {
      name: "description",
      content:
        "Connect Asmi to Claude, ChatGPT or Meta Muse over MCP. Your assistant hands Asmi real-world tasks and Asmi calls, texts and emails until they're done.",
    },
    { property: "og:title", content: "Asmi MCP server docs" },
  ]);

  return (
    <div className="landing-theme" style={{ color: "var(--ink-soft)", lineHeight: 1.7 }}>
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(251, 247, 240, 0.85)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--ink-faint)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8">
          <Link to="/" aria-label="asmi home" className="shrink-0">
            <img src={asmiLogoUrl} alt="asmi" width={112} height={40} className="h-10 w-auto" />
          </Link>
          <span className="font-mono" style={{ color: "var(--ink-dim)", fontSize: 12 }}>
            / docs / mcp
          </span>
          <a
            href="mailto:support@asmiai.com"
            className="ml-auto font-mono hidden sm:block"
            style={{ color: "var(--ink-dim)", fontSize: 12 }}
          >
            support@asmiai.com
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="pt-16 pb-12">
          <p className="label-mono mb-4" style={{ color: "var(--ink-dim)", fontSize: 11 }}>
            developer docs · model context protocol
          </p>
          <h1 style={{ fontSize: "clamp(2.75rem, 7vw, 5.5rem)", color: "var(--ink)" }}>
            asmi, inside your{" "}
            <span style={{ background: "var(--citrus)", padding: "0 0.15em" }}>assistant</span>
          </h1>
          <p className="mt-6 max-w-2xl" style={{ fontSize: "1.2rem" }}>
            Asmi’s MCP server lets Claude, ChatGPT and Meta Muse hand off real-world chores. Your
            assistant describes the goal, and Asmi calls, texts and emails businesses and people,
            keeps following up for hours or days, and reports back when it’s done.
          </p>
          <dl
            className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl sm:grid-cols-4"
            style={{ background: "var(--ink-line)" }}
          >
            {FACTS.map((fact) => (
              <div key={fact.label} className="px-4 py-3" style={{ background: "var(--cream)" }}>
                <dt className="label-mono" style={{ color: "var(--ink-dim)" }}>
                  {fact.label}
                </dt>
                <dd className="font-mono" style={{ color: "var(--ink)", fontSize: 14 }}>
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 pb-24 lg:grid-cols-[180px_minmax(0,1fr)]">
          <nav className="hidden lg:block" aria-label="on this page">
            <div className="sticky top-24 space-y-2">
              <p className="label-mono mb-3" style={{ color: "var(--ink-dim)" }}>
                on this page
              </p>
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block transition-colors hover:text-[var(--ink)]"
                  style={{ fontSize: 14, color: "var(--ink-dim)" }}
                >
                  {section.label}
                </a>
              ))}
            </div>
          </nav>

          <main className="min-w-0 max-w-3xl">
            <Section id="connect" number="01" title="connect your assistant">
              <Tabs
                value={active}
                onValueChange={(slug) => navigate(`/docs/mcp/${slug}`, { replace: true })}
              >
                <TabsList
                  className="mb-8 h-auto rounded-full p-1"
                  style={{ background: "var(--paper-deep)" }}
                >
                  {CLIENT_GUIDES.map((guide) => (
                    <TabsTrigger
                      key={guide.slug}
                      value={guide.slug}
                      className="rounded-full px-5 py-2 data-[state=active]:bg-[var(--ink)] data-[state=active]:text-[var(--paper)]"
                      style={{ fontSize: 15 }}
                    >
                      {guide.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {CLIENT_GUIDES.map((guide) => (
                  <TabsContent key={guide.slug} value={guide.slug}>
                    <ClientPanel guide={guide} />
                  </TabsContent>
                ))}
              </Tabs>
            </Section>

            <Section id="permissions" number="02" title="sign-in & permissions">
              <p className="mb-6">
                Connecting opens Asmi’s own sign-in page, never a form inside the chat. You enter
                the phone number or email you use with Asmi, confirm a 6-digit code, and choose what
                your assistant may do. New to Asmi? An account is created when you sign in. The page
                always names the app you’re connecting, so check it before approving.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {SCOPES.map((scope) => (
                  <div
                    key={scope.name}
                    className="rounded-xl p-5"
                    style={{ background: "var(--cream)", border: "1px solid var(--ink-line)" }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Mono>{scope.name}</Mono>
                      <span className="label-mono" style={{ color: "var(--ink-dim)" }}>
                        {scope.optional ? "optional" : "always"}
                      </span>
                    </div>
                    <p className="font-medium" style={{ color: "var(--ink)" }}>
                      {scope.label}
                    </p>
                    <p style={{ fontSize: 15 }}>{scope.body}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="tools" number="03" title="tools">
              <p className="mb-8">
                Your assistant sees these tools once you’re connected. You don’t call them yourself:
                describe what you want and your assistant picks the right one.
              </p>
              <div className="space-y-10">
                {TOOL_GROUPS.map((group) => (
                  <div key={group.name}>
                    <h3 className="mb-1" style={{ fontSize: "1.5rem", color: "var(--ink)" }}>
                      {group.name}
                    </h3>
                    <p className="mb-2" style={{ fontSize: 15, color: "var(--ink-dim)" }}>
                      {group.blurb}
                    </p>
                    {group.tools.map((tool) => (
                      <ToolRow key={tool.name} tool={tool} />
                    ))}
                  </div>
                ))}
              </div>
            </Section>

            <Section id="task-flow" number="04" title="how a task runs">
              <p className="mb-8">
                Asmi’s tasks run in the background. A booking can take a few minutes or a few days,
                depending on when people answer. Your assistant is the only channel back to you, so
                ask it for updates and it will check in.
              </p>
              <NumberedSteps steps={TASK_FLOW} />
              <div
                className="mt-8 rounded-xl p-5"
                style={{ border: "1px dashed var(--ink-strong)", fontSize: 15 }}
              >
                <p className="label-mono mb-2" style={{ color: "var(--ink-dim)" }}>
                  what asmi can’t do
                </p>
                <ul className="space-y-1">
                  {CANNOT_DO.map((item) => (
                    <li key={item}>— {item}</li>
                  ))}
                </ul>
              </div>
            </Section>

            <Section id="plans" number="05" title="plans & limits">
              <p className="mb-6">
                Searching, reading your tasks and checking status are always free. Each task Asmi
                starts for you, where it calls, texts or emails businesses and people, counts
                against your plan’s monthly task quota.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <PlanCard
                  name="Trial"
                  price="free"
                  detail="One free task that contacts a third party, to see Asmi work end to end."
                />
                <PlanCard
                  name="Free"
                  price="free"
                  detail="Search, tasks and status. Calling or messaging people needs a paid plan."
                />
                {PLANS.map((plan) => (
                  <PlanCard
                    key={plan.key}
                    name={plan.name}
                    price={`${formatUsd(plan.price.month)}/mo · ${formatUsd(plan.price.year)}/yr`}
                    detail={`${plan.tasksPerMonth} tasks a month.`}
                    featured={plan.featured}
                  />
                ))}
              </div>
              <p className="mt-6" style={{ fontSize: 15 }}>
                Quotas reset monthly, including on annual plans. You can upgrade from inside the
                chat: your assistant fetches a Stripe checkout link, and you enter card details on
                Stripe, never in the conversation.
              </p>
            </Section>

            <Section id="security" number="06" title="security">
              <ul className="space-y-3">
                <li>
                  — <b>OAuth 2.1 with PKCE (S256)</b>. Claude and ChatGPT identify themselves with a
                  hosted client metadata document. Other clients use dynamic client registration.
                </li>
                <li>
                  — <b>Tokens are bound to one assistant.</b> Each assistant has its own endpoint,
                  and a token issued for one is refused at the others (RFC 8707 audience binding).
                </li>
                <li>
                  — <b>Access tokens last 30 days</b> and refresh tokens rotate on every use. We
                  store only a SHA-256 hash of each token, never the token itself.
                </li>
                <li>
                  — <b>Revocation.</b> Asmi supports standard token revocation (RFC 7009) for
                  assistants that revoke when you disconnect. To cut off a token or an issued key
                  immediately, email support.
                </li>
                <li>
                  — <b>Origin checks</b> on every request block DNS-rebinding attacks.
                </li>
              </ul>
              <p className="mt-6">
                What Asmi stores and why is covered in our{" "}
                <Link to="/privacy" style={{ color: "var(--ink)", textDecoration: "underline" }}>
                  privacy policy
                </Link>
                .
              </p>
            </Section>

            <Section id="troubleshooting" number="07" title="troubleshooting">
              <dl className="space-y-5">
                {TROUBLESHOOTING.map((item) => (
                  <div key={item.symptom}>
                    <dt className="font-medium" style={{ color: "var(--ink)" }}>
                      {item.symptom}
                    </dt>
                    <dd>{item.fix}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-10">
                Still stuck? Email{" "}
                <a
                  href="mailto:support@asmiai.com"
                  style={{ color: "var(--ink)", fontWeight: 600 }}
                >
                  support@asmiai.com
                </a>{" "}
                with your assistant’s name and roughly when it happened.
              </p>
            </Section>
          </main>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function PlanCard({
  name,
  price,
  detail,
  featured,
}: {
  name: string;
  price: string;
  detail: string;
  featured?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: featured ? "var(--ink)" : "var(--cream)",
        color: featured ? "var(--cream-body)" : undefined,
        border: "1px solid var(--ink-line)",
      }}
    >
      <p
        className="font-medium"
        style={{ color: featured ? "var(--paper)" : "var(--ink)", fontSize: 18 }}
      >
        {name}
      </p>
      <p className="font-mono mb-2" style={{ fontSize: 13 }}>
        {price}
      </p>
      <p style={{ fontSize: 15 }}>{detail}</p>
    </div>
  );
}
