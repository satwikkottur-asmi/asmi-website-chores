import { useEffect } from "react";
import { Link } from "react-router-dom";

interface PrivacySectionProps {
  number: string;
  title: string;
  delay: number;
  children: React.ReactNode;
}

const PrivacySection = ({ number, title, children }: PrivacySectionProps) => {
  return (
    <section className="mb-10 pb-8" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <p
        className="label-mono mb-3"
        style={{ color: "var(--color-stone-dim)" }}
      >
        {number}
      </p>
      <h2
        className="font-serif mb-4"
        style={{
          color: "var(--color-espresso-strong)",
          fontSize: "1.75rem",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
};

const Blockquote = ({ children }: { children: React.ReactNode }) => (
  <div
    className="mb-4 p-4 italic"
    style={{
      borderLeft: "4px solid var(--color-espresso-strong)",
      backgroundColor: "var(--color-card)",
    }}
  >
    {children}
  </div>
);

const BulletList = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="mb-4 space-y-2" style={{ lineHeight: 1.7 }}>
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | asmi";
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--color-background)", color: "var(--color-foreground)" }}
    >
      {/* Navigation */}
      <nav className="px-5 sm:px-8 py-6">
        <Link
          to="/"
          className="font-serif italic"
          style={{ color: "var(--color-stone-dim)", fontSize: 14 }}
        >
          ← back to asmi
        </Link>
      </nav>

      <main className="flex flex-col items-center flex-1 px-5 sm:px-8 pb-16" style={{ color: "var(--color-ink)", fontSize: "1.05rem", lineHeight: 1.7 }}>
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              className="font-serif italic"
              style={{
                color: "var(--color-espresso-strong)",
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              }}
            >
              asmi
            </h1>
            <p
              className="font-serif"
              style={{
                color: "var(--color-espresso-strong)",
                fontSize: "1.75rem",
                marginTop: "0.5rem",
              }}
            >
              Privacy Policy
            </p>
          </div>

          <div
            className="mb-8 pb-6 text-center"
            style={{
              borderBottom: "1px solid var(--color-border)",
              fontSize: "0.95rem",
            }}
          >
            <p style={{ color: "var(--color-stone-dim)" }}>Effective: April 2026</p>
            <p
              className="label-mono mt-2"
              style={{ color: "var(--color-stone-dim)" }}
            >
              Humint Labs, Inc. (incorporated in Delaware)
            </p>
            <p style={{ color: "var(--color-stone-dim)", marginTop: "0.25rem", fontSize: "0.9rem" }}>
              710 Lakeway Drive, Suite 200, Sunnyvale, CA 94085
            </p>
          </div>

          {/* Intro */}
          <p className="mb-10">
            Asmi works by remembering - your preferences, your tasks, the context that makes every
            interaction more useful than the last. This page explains exactly what we save, why we save it,
            who can see it, and what you can do about it. <span style={{ fontWeight: "bold" }}>No fine print.</span>
          </p>

          <div style={{ borderTop: "1px solid var(--color-border)", marginBottom: "2rem" }} />

          {/* Sections */}
          <PrivacySection number="01 - What We Save" title="What we save" delay={0}>
            <p className="mb-4">
              When you have a conversation with Asmi - whether over a phone call or through WhatsApp or
              iMessage - we save a record of that conversation. This includes:
            </p>
            <ul className="mb-4 space-y-3" style={{ lineHeight: 1.7 }}>
              <li>— <span style={{ fontWeight: "bold" }}>Audio recordings</span> of your calls with Asmi</li>
              <li>— <span style={{ fontWeight: "bold" }}>Transcripts</span> of what was said</li>
              <li>— <span style={{ fontWeight: "bold" }}>Tasks and preferences</span> you share with Asmi across conversations</li>
              <li>— <span style={{ fontWeight: "bold" }}>Context Asmi builds over time</span> - recurring preferences, names, habits, and patterns that help Asmi serve you better</li>
            </ul>
            <p>
              We do not save conversations you have on your phone that don't involve Asmi. We have no
              access to your general call log, messages, contacts, or any other data on your device unless
              you explicitly share it with Asmi during a conversation.
            </p>
          </PrivacySection>

          <PrivacySection number="02 - Why We Save It" title="Why we save it" delay={1}>
            <Blockquote>
              "Asmi saves your conversations to build your memory over time, so nothing slips through the
              cracks."
            </Blockquote>
            <p className="mb-4">
              Memory is the product. Asmi is only useful because it remembers what you told it last Tuesday,
              knows your preferences without being asked, and can follow up on things you mentioned weeks
              ago. None of that is possible without saving your conversations.
            </p>
            <p>
              We save your conversations for one purpose: <span style={{ fontWeight: "bold" }}>to make Asmi more useful to you.</span> We do not
              sell your data. We do not use it to target you with advertising. We do not share it with third
              parties for their commercial benefit.
            </p>
          </PrivacySection>

          <PrivacySection number="03 - Your Calls With Asmi" title="Your calls with Asmi" delay={2}>
            <p className="mb-4">
              Asmi calls you - typically once each morning - to check in, take tasks, and brief you on anything
              outstanding. These calls are recorded and transcribed so Asmi can act on what you discussed
              and remember it for future conversations.
            </p>
            <p className="mb-4">
              You consented to this recording when you set up Asmi. You can withdraw this consent at any
              time by contacting us at the address below. Withdrawing consent means Asmi can no longer
              function as intended, as memory is core to how the product works.
            </p>
            <p>
              Calls are conducted using AI-generated voice technology. Asmi is not a human - it is an AI
              assistant. Humint Labs, Inc. complies with all applicable regulations governing AI-generated
              voice calls, including the US Telephone Consumer Protection Act (TCPA) and California's
              Invasion of Privacy Act (CIPA).
            </p>
          </PrivacySection>

          <PrivacySection number="04 - Calls Made On Your Behalf" title="Calls made on your behalf" delay={3}>
            <p className="mb-4">
              When you ask Asmi to call someone on your behalf - a plumber, a restaurant, a service provider
              - Asmi places that call using AI-generated voice and records it so it can brief you accurately
              afterward.
            </p>
            <Blockquote>
              "Hi, this is Asmi, an AI assistant calling on behalf of [your name]. I am keeping a record of
              this call so I can brief them afterward. They're looking to [task] - is now a good time?"
            </Blockquote>
            <p className="mb-4">
              This disclosure ensures the person being called knows they are speaking with an AI, knows the
              call is being recorded, and knows who sent the call. If the recipient objects to being recorded,
              Asmi will either stop recording and proceed or end the call and notify you.
            </p>
            <p className="mb-4">
              Asmi only places calls to third parties when explicitly instructed to do so by you for a specific
              task. We do not place calls to your contacts without your instruction.
            </p>
            <p>
              Following each call made on your behalf, Asmi shares a summary, transcript, or recording of
              that call with you so you can review what was discussed and what was agreed.
            </p>
          </PrivacySection>

          <PrivacySection number="05 - Calls Asmi Will Not Make" title="Calls Asmi will not make" delay={4}>
            <p className="mb-4">
              Asmi is a personal assistant, not a marketing or outreach tool. Regardless of what you ask,
              Asmi will refuse to place the following types of calls:
            </p>
            <ul className="mb-4 space-y-3" style={{ lineHeight: 1.7 }}>
              <li>— <span style={{ fontWeight: "bold" }}>Unsolicited promotional calls</span> - advertising, marketing, or soliciting any product or service to someone who did not request contact</li>
              <li>— <span style={{ fontWeight: "bold" }}>Debt collection calls</span> - requesting, demanding, or following up on repayment of money owed by anyone</li>
              <li>— <span style={{ fontWeight: "bold" }}>Emergency services</span> - 911, 112, 999, 100, 101, 108, or any emergency equivalent. If you are in an emergency, call emergency services directly</li>
              <li>— <span style={{ fontWeight: "bold" }}>Calls outside permitted hours</span> - before 8:00 AM or after 9:00 PM in the recipient's local time zone</li>
              <li>— <span style={{ fontWeight: "bold" }}>Political solicitation</span> - soliciting votes, donations, or support for any political candidate, party, or cause</li>
              <li>— <span style={{ fontWeight: "bold" }}>Harassment or repeated unwanted contact</span> - calling anyone who has previously asked not to be contacted</li>
              <li>— <span style={{ fontWeight: "bold" }}>Legal threats or securities solicitation</span> - verbal cease and desist notices, demand letters, investment solicitation, or any call where Asmi would be acting as an unauthorised agent of a third party</li>
            </ul>
            <p>
              When Asmi declines a request, it will notify you via WhatsApp or iMessage and suggest an
              alternative where one exists.
            </p>
          </PrivacySection>

          <PrivacySection number="06 - Who Sees Your Data" title="Who sees your data" delay={0}>
            <p className="mb-4">Your conversations are private. Here is who has access and why:</p>

            <div
              className="mb-6 overflow-x-auto rounded"
              style={{
                border: "1px solid var(--color-border)",
              }}
            >
              <table className="w-full" style={{ fontSize: "0.95rem" }}>
                <thead style={{ backgroundColor: "var(--color-card)" }}>
                  <tr>
                    <th
                      className="label-mono px-4 py-3 text-left"
                      style={{
                        borderBottom: "1px solid var(--color-border)",
                        color: "var(--color-stone-dim)",
                      }}
                    >
                      Who
                    </th>
                    <th
                      className="label-mono px-4 py-3 text-left"
                      style={{
                        borderBottom: "1px solid var(--color-border)",
                        color: "var(--color-stone-dim)",
                      }}
                    >
                      Access & reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      who: "You",
                      reason: "Full access to your conversation history at all times. Request a copy or deletion anytime.",
                    },
                    {
                      who: "Asmi (the AI)",
                      reason:
                        "Reads your conversation history to provide context-aware responses and execute tasks on your behalf.",
                    },
                    {
                      who: "Humint Labs, Inc.",
                      reason:
                        "Access only for support, safety, and legal compliance purposes. Not used for advertising or sold to third parties.",
                    },
                    {
                      who: "ElevenLabs",
                      reason:
                        "Our voice infrastructure provider. Processes and stores call audio on our behalf under a data processing agreement. We have disabled training data use on your recordings.",
                    },
                    {
                      who: "Twilio",
                      reason: "Our telephony provider. Routes calls on our behalf. Does not store conversation content.",
                    },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: i < 4 ? "1px solid var(--color-border)" : "none",
                      }}
                    >
                      <td className="px-4 py-3" style={{ fontWeight: "bold" }}>
                        {row.who}
                      </td>
                      <td className="px-4 py-3">{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              We do not sell your data. We do not share your data with advertisers. We do not use your
              conversations to train AI models without your explicit consent.
            </p>
          </PrivacySection>

          <PrivacySection number="07 - Your Rights" title="Your rights" delay={1}>
            <p className="mb-4">You have the following rights over your data at any time:</p>
            <ul className="mb-4 space-y-3" style={{ lineHeight: 1.7 }}>
              <li>— <span style={{ fontWeight: "bold" }}>Access</span> - request a copy of everything Asmi has saved about you</li>
              <li>— <span style={{ fontWeight: "bold" }}>Deletion</span> - ask Asmi to delete your entire conversation history and profile. Contact us below. Deletion is permanent and cannot be undone</li>
            </ul>
            <p className="mb-4">
              California residents have additional rights under the California Consumer Privacy Act (CCPA),
              including the right to know what personal information is collected, the right to delete, and the
              right to non-discrimination for exercising these rights.
            </p>
            <p>
              To exercise any of these rights, contact us at the address in the Contact section below. We will
              respond within 30 days.
            </p>
          </PrivacySection>

          <PrivacySection number="08 - How Long We Keep It" title="How long we keep it" delay={2}>
            <p className="mb-4">
              We retain your conversation data for as long as your account is active. If you delete your
              account or request deletion, we remove your data within 30 days. Some anonymised,
              aggregated data may be retained for product improvement purposes - this cannot be linked
              back to you.
            </p>
            <p>
              Call recordings are retained for 90 days by default. Transcripts and the memory Asmi builds
              from them are retained for the lifetime of your account. You can request deletion of specific
              recordings or your entire history at any time.
            </p>
          </PrivacySection>

          <PrivacySection number="09 - SMS Communications" title="SMS communications" delay={3}>
            <p className="mb-4">
              We may send SMS (text) messages to users based on their interactions with Asmi. These messages
              are sent only after the user provides consent, either during account registration or through
              explicit confirmation during an interaction (such as a call).
            </p>
            <p className="mb-4">
              SMS messages are strictly transactional and informational, including summaries of interactions,
              confirmations, and responses to user-initiated requests. Message frequency varies based on user
              activity.
            </p>
            <p className="mb-4">
              Users may opt out of receiving SMS messages at any time by replying <span className="font-mono">STOP</span> and may
              request assistance by replying <span className="font-mono">HELP</span>. Message and data rates may apply.
            </p>
            <p>
              We do not send unsolicited marketing or promotional messages via SMS.
            </p>
          </PrivacySection>

          <PrivacySection number="10 - Changes To This Policy" title="Changes to this policy" delay={4}>
            <p className="mb-4">
              We will notify you of any material changes to this policy via WhatsApp/iMessage or email before
              they take effect. Continued use of Asmi after notification constitutes acceptance of the updated
              policy. If you do not agree with any changes, you may delete your account at any time.
            </p>
            <p>The version history of this policy is available on request.</p>
          </PrivacySection>

          <PrivacySection number="11 - Contact" title="Contact" delay={0}>
            <p className="mb-4">
              For any questions about this policy, to exercise your data rights, or to report a concern:
            </p>
            <div className="space-y-1" style={{ fontSize: "0.95rem" }}>
              <p style={{ fontWeight: "bold" }}>Humint Labs, Inc.</p>
              <p style={{ color: "var(--color-stone-dim)" }}>(operating as Asmi AI)</p>
              <p style={{ color: "var(--color-stone-dim)" }}>710 Lakeway Drive, Suite 200</p>
              <p style={{ color: "var(--color-stone-dim)" }}>Sunnyvale, CA 94085</p>
              <p style={{ color: "var(--color-stone-dim)" }}>Incorporated in Delaware</p>
              <p style={{ marginTop: "0.5rem" }}>
                <a
                  href="mailto:support@asmiai.com"
                  style={{
                    fontWeight: "bold",
                    color: "var(--color-espresso-strong)",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  support@asmiai.com
                </a>
              </p>
            </div>
          </PrivacySection>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
