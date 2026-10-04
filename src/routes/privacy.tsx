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
      <p className="label-mono mb-3" style={{ color: "var(--ink-dim)" }}>
        {number}
      </p>
      <h2
        className="font-serif mb-4"
        style={{
          color: "var(--ink)",
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
      borderLeft: "4px solid var(--ink)",
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
      className="landing-theme flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--paper)", color: "var(--color-foreground)" }}
    >
      {/* Navigation */}
      <nav className="px-5 sm:px-8 py-6">
        <Link
          to="/"
          className="font-serif italic"
          style={{ color: "var(--ink-dim)", fontSize: 14 }}
        >
          ← back to asmi
        </Link>
      </nav>

      <main
        className="flex flex-col items-center flex-1 px-5 sm:px-8 pb-16"
        style={{ color: "var(--ink-soft)", fontSize: "1.05rem", lineHeight: 1.7 }}
      >
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              className="font-serif italic"
              style={{
                color: "var(--ink)",
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              }}
            >
              asmi
            </h1>
            <p
              className="font-serif"
              style={{
                color: "var(--ink)",
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
            <p style={{ color: "var(--ink-dim)" }}>Effective: October 2026</p>
            <p className="label-mono mt-2" style={{ color: "var(--ink-dim)" }}>
              Humint Labs, Inc. (incorporated in Delaware)
            </p>
            <p style={{ color: "var(--ink-dim)", marginTop: "0.25rem", fontSize: "0.9rem" }}>
              710 Lakeway Drive, Suite 200, Sunnyvale, CA 94085
            </p>
          </div>

          {/* Intro */}
          <p className="mb-10">
            Asmi works by remembering - your preferences, your tasks, and the context that makes
            every interaction more useful than the last. This policy explains exactly what we save,
            why we save it, who can see it, and what you can do about it.{" "}
            <span style={{ fontWeight: "bold" }}>No fine print.</span>
          </p>

          <div style={{ borderTop: "1px solid var(--color-border)", marginBottom: "2rem" }} />

          {/* Sections */}
          <PrivacySection number="01 - What We Save" title="What we save" delay={0}>
            <p className="mb-4">
              When you have a conversation with Asmi - whether over a phone call, text message, or
              another supported channel - we save a record of that conversation. This includes:
            </p>
            <ul className="mb-4 space-y-3" style={{ lineHeight: 1.7 }}>
              <li>
                — <span style={{ fontWeight: "bold" }}>Audio recordings</span> of your calls with
                Asmi
              </li>
              <li>
                — <span style={{ fontWeight: "bold" }}>Transcripts</span> of what was said
              </li>
              <li>
                — <span style={{ fontWeight: "bold" }}>Tasks and preferences</span> you share with
                Asmi across conversations
              </li>
              <li>
                —{" "}
                <span style={{ fontWeight: "bold" }}>Memory and context Asmi builds over time</span>
                , including recurring preferences, names, habits, and patterns that help Asmi serve
                you better
              </li>
            </ul>
            <p>
              We do not save conversations on your device that do not involve Asmi. We do not have
              access to your general call log, messages, contacts, or other device data unless you
              explicitly share that information with Asmi.
            </p>
          </PrivacySection>

          <PrivacySection number="02 - Why We Save It" title="Why we save it" delay={1}>
            <Blockquote>
              "Asmi saves your conversations to build your memory over time, so nothing slips
              through the cracks."
            </Blockquote>
            <p className="mb-4">
              Memory is the product. Asmi is useful because it can remember what you told it before,
              learn your preferences without making you repeat them, and follow up on things you
              mentioned days or weeks ago. None of that is possible without saving your
              conversations.
            </p>
            <p>
              We save your conversations{" "}
              <span style={{ fontWeight: "bold" }}>to make Asmi more useful to you.</span> We do not
              sell your data. We do not use it to target you with advertising. We do not share it
              with third parties for their commercial benefit.
            </p>
          </PrivacySection>

          <PrivacySection number="03 - Your Calls With Asmi" title="Your calls with Asmi" delay={2}>
            <p className="mb-4">
              Asmi may call you - for example, for a scheduled check-in, to take tasks, or to brief
              you on anything outstanding. These calls are recorded and transcribed so Asmi can act
              on what you discussed and remember it for future conversations.
            </p>
            <p className="mb-4">
              You consent to this recording when you set up Asmi. You can withdraw that consent at
              any time by contacting us using the details below. Withdrawing consent means Asmi can
              no longer function as intended because memory is core to the product.
            </p>
            <p>
              Calls use AI-generated voice technology. Asmi is not a human; it is an AI assistant.
              Humint Labs, Inc. complies with applicable laws governing AI-generated voice calls and
              call recording, including the U.S. Telephone Consumer Protection Act (TCPA) and the
              California Invasion of Privacy Act (CIPA).
            </p>
          </PrivacySection>

          <PrivacySection
            number="04 - Calls Made On Your Behalf"
            title="Calls made on your behalf"
            delay={3}
          >
            <p className="mb-4">
              When you ask Asmi to call someone on your behalf - such as a plumber, restaurant, or
              service provider - Asmi places that call using an AI-generated voice and records it so
              it can brief you accurately afterward.
            </p>
            <Blockquote>
              "Hi, this is Asmi, an AI assistant calling on behalf of [your name]. I am keeping a
              record of this call so I can brief them afterward. They're looking to [task] - is now
              a good time?"
            </Blockquote>
            <p className="mb-4">
              This opening tells the recipient that they are speaking with an AI assistant, who the
              call is on behalf of, why Asmi is calling, and that the call is being recorded. If the
              recipient objects to recording, Asmi stops recording immediately. Asmi may continue
              without recording only where that is lawful and technically possible; otherwise, it
              ends the call and notifies you.
            </p>
            <p className="mb-4">
              Asmi places calls to third parties only when you explicitly instruct it to do so for a
              specific task. We do not call your contacts without your instruction.
            </p>
            <p>
              After each call made on your behalf, Asmi shares a summary, transcript, or recording
              with you so you can review what was discussed and what was agreed.
            </p>
          </PrivacySection>

          <PrivacySection
            number="05 - Calls Asmi Will Not Make"
            title="Calls Asmi will not make"
            delay={4}
          >
            <p className="mb-4">
              Asmi is a personal assistant, not a marketing or outreach tool. Regardless of what you
              ask, Asmi will refuse to place the following types of calls:
            </p>
            <ul className="mb-4 space-y-3" style={{ lineHeight: 1.7 }}>
              <li>
                — <span style={{ fontWeight: "bold" }}>Unsolicited promotional calls</span> -
                advertising, marketing, or soliciting a product or service to someone who did not
                request contact
              </li>
              <li>
                — <span style={{ fontWeight: "bold" }}>Debt collection calls</span> - requesting,
                demanding, or following up on repayment of money owed by anyone
              </li>
              <li>
                — <span style={{ fontWeight: "bold" }}>Emergency services</span> - calling 911, 112,
                999, 100, 101, 108, or any emergency equivalent. If you are in an emergency, contact
                emergency services directly
              </li>
              <li>
                — <span style={{ fontWeight: "bold" }}>Political solicitation</span> - soliciting
                votes, donations, or support for any political candidate, party, or cause
              </li>
              <li>
                —{" "}
                <span style={{ fontWeight: "bold" }}>Harassment or repeated unwanted contact</span>{" "}
                - calling anyone who has asked not to be contacted, or otherwise making unwanted
                repeated contact
              </li>
              <li>
                —{" "}
                <span style={{ fontWeight: "bold" }}>Legal threats or securities solicitation</span>{" "}
                - verbal cease-and-desist notices, demand letters, investment solicitation, or calls
                in which Asmi would act as an unauthorized agent of a third party
              </li>
            </ul>
            <p>
              When Asmi declines a request, it will notify you through an available communication
              channel and suggest an alternative when one exists.
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
                        color: "var(--ink-dim)",
                      }}
                    >
                      Who
                    </th>
                    <th
                      className="label-mono px-4 py-3 text-left"
                      style={{
                        borderBottom: "1px solid var(--color-border)",
                        color: "var(--ink-dim)",
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
                      reason:
                        "Full access to your conversation history. You can request a copy or deletion at any time.",
                    },
                    {
                      who: "Asmi (the AI)",
                      reason:
                        "Reads your conversation history to provide context-aware responses and carry out tasks on your behalf.",
                    },
                    {
                      who: "Humint Labs, Inc.",
                      reason:
                        "Access only for support, safety, and legal compliance. We do not use this access for advertising or sell the data to third parties.",
                    },
                    {
                      who: "ElevenLabs",
                      reason:
                        "Our voice infrastructure provider. It processes and stores call audio for us under a data processing agreement. Training use of your recordings is disabled.",
                    },
                    {
                      who: "Twilio",
                      reason:
                        "Our telephony provider. It routes calls for us and does not store conversation content.",
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
              We do not sell your data. We do not share your data with advertisers. We do not use
              your conversations to train AI models without your explicit consent.
            </p>
          </PrivacySection>

          <PrivacySection
            number="06A - Third-Party Integrations"
            title="Third-party integrations"
            delay={0}
          >
            <p>
              If you connect Asmi through an external platform or integration, we receive the
              information needed to carry out your requests - such as task descriptions, contact
              details, and account identifiers you provide through that integration. This data is
              handled under this policy exactly like data you provide to us directly.
            </p>
          </PrivacySection>

          <PrivacySection number="07 - Your Rights" title="Your rights" delay={1}>
            <p className="mb-4">You have the following rights over your data at any time:</p>
            <ul className="mb-4 space-y-3" style={{ lineHeight: 1.7 }}>
              <li>
                — <span style={{ fontWeight: "bold" }}>Access</span> - request a copy of everything
                Asmi has saved about you
              </li>
              <li>
                — <span style={{ fontWeight: "bold" }}>Deletion</span> - ask us to delete your
                entire conversation history and profile. Deletion is permanent and cannot be undone
              </li>
            </ul>
            <p className="mb-4">
              California residents have additional rights under the California Consumer Privacy Act
              (CCPA), as amended, including the right to know what personal information is
              collected, the right to delete, and the right to non-discrimination for exercising
              these rights.
            </p>
            <p>
              To exercise any of these rights, contact us using the details in the Contact section
              below. We will respond within 30 days.
            </p>
          </PrivacySection>

          <PrivacySection number="08 - How Long We Keep It" title="How long we keep it" delay={2}>
            <p className="mb-4">
              We retain your conversation data for as long as your account is active. If you delete
              your account or request deletion, we remove your data within 30 days. We may retain
              anonymized, aggregated data for product improvement, but that data cannot be linked
              back to you.
            </p>
            <p>
              Call recordings are retained for 90 days by default. Transcripts and the memory Asmi
              builds from them are retained for the lifetime of your account. You can request
              deletion of specific recordings or your entire history at any time.
            </p>
          </PrivacySection>

          <PrivacySection number="09 - SMS Communications" title="SMS communications" delay={3}>
            <p className="mb-4">
              We may send you SMS text messages based on your interactions with Asmi. We send them
              only after you provide consent, either during account registration or through an
              explicit confirmation during an interaction.
            </p>
            <p className="mb-4">
              SMS messages are strictly transactional and informational. They may include
              interaction summaries, confirmations, and responses to requests you initiated. Message
              frequency varies based on your activity.
            </p>
            <p className="mb-4">
              You may opt out of SMS messages at any time by replying{" "}
              <span className="font-mono">STOP</span>. You may request assistance by replying{" "}
              <span className="font-mono">HELP</span>. Message and data rates may apply.
            </p>
            <p>We do not send unsolicited marketing or promotional messages by SMS.</p>
          </PrivacySection>

          <PrivacySection
            number="10 - Changes To This Policy"
            title="Changes to this policy"
            delay={4}
          >
            <p className="mb-4">
              We will notify you of any material changes to this policy through an available
              messaging channel or by email before the changes take effect. If you continue to use
              Asmi after the notified effective date, you accept the updated policy. If you do not
              agree with a change, you may delete your account at any time.
            </p>
            <p>The version history of this policy is available on request.</p>
          </PrivacySection>

          <PrivacySection number="11 - Contact" title="Contact" delay={0}>
            <p className="mb-4">
              For questions about this policy, to exercise your data rights, or to report a concern,
              contact:
            </p>
            <div className="space-y-1" style={{ fontSize: "0.95rem" }}>
              <p style={{ fontWeight: "bold" }}>Humint Labs, Inc.</p>
              <p style={{ color: "var(--ink-dim)" }}>(operating as Asmi AI)</p>
              <p style={{ color: "var(--ink-dim)" }}>710 Lakeway Drive, Suite 200</p>
              <p style={{ color: "var(--ink-dim)" }}>Sunnyvale, CA 94085</p>
              <p style={{ color: "var(--ink-dim)" }}>Incorporated in Delaware</p>
              <p style={{ marginTop: "0.5rem" }}>
                <a
                  href="mailto:support@asmiai.com"
                  style={{
                    fontWeight: "bold",
                    color: "var(--ink)",
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
