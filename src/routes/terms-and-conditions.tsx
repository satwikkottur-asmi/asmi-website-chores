import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/asmi/SiteFooter";

interface TermsSectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

const TermsSection = ({ number, title, children }: TermsSectionProps) => {
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

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-serif mb-2 mt-6" style={{ color: "var(--ink)", fontSize: "1.25rem" }}>
    {children}
  </h3>
);

const DashList = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="mb-4 space-y-3" style={{ lineHeight: 1.7 }}>
    {items.map((item, i) => (
      <li key={i}>— {item}</li>
    ))}
  </ul>
);

const Bold = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontWeight: "bold" }}>{children}</span>
);

const SupportEmail = () => (
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
);

const InlineLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} style={{ color: "var(--ink)", textDecoration: "underline" }}>
    {children}
  </Link>
);

const TermsAndConditions = () => {
  useEffect(() => {
    document.title = "Terms of Service | asmi";
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
              Terms of Service
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
            These Terms of Service (the "Terms") are an agreement between you and Humint Labs, Inc.
            ("Humint Labs," "we," "us," or "our"), a Delaware corporation. They govern your access
            to and use of Asmi, including our websites, applications, communications, and related
            services (together, the "Service").
          </p>

          <div style={{ borderTop: "1px solid var(--color-border)", marginBottom: "2rem" }} />

          {/* Sections */}
          <TermsSection number="01 - Acceptance" title="Acceptance of these Terms">
            <p className="mb-4">
              By creating an account, buying a subscription, submitting a task, or otherwise using
              the Service, you agree to these Terms and to our{" "}
              <InlineLink to="/privacy">Privacy Policy</InlineLink>. If you do not agree, do not use
              the Service.
            </p>
            <p className="mb-4">
              If you use the Service for a company or another organization, you confirm that you
              have authority to bind that organization to these Terms. "You" then means both you and
              that organization.
            </p>
            <p>
              Some consumer-protection laws give you rights that cannot be waived by contract.
              Nothing in these Terms limits those rights.
            </p>
          </TermsSection>

          <TermsSection number="02 - What Asmi Does" title="What Asmi does">
            <p className="mb-4">
              Asmi is an artificial intelligence assistant that helps complete tasks in the offline
              world. At your direction, Asmi may call, text, or email people and businesses, switch
              between those channels, follow up over time, collect information, present options, and
              report progress or results to you.
            </p>
            <p className="mb-4">
              Examples include requesting appointments, making or changing reservations, gathering
              quotes, following up on orders or refunds, and handling other user-directed tasks that
              a third party must respond to or complete.
            </p>
            <p className="mb-4">
              Asmi supports your task; it does not control the people or businesses it contacts. A
              third party may decline, delay, change terms, provide inaccurate information, or fail
              to respond. We do not guarantee that a task will be completed, that a particular
              result will be achieved, or that it will happen by a particular time.
            </p>
            <p>
              Asmi is not an emergency service and is not a substitute for professional medical,
              legal, financial, or other regulated advice.
            </p>
          </TermsSection>

          <TermsSection number="03 - Eligibility" title="Who may use Asmi">
            <p>
              You must be at least 18 years old and legally able to enter into a binding agreement.
              You may not use the Service if applicable law prohibits you from doing so.
            </p>
          </TermsSection>

          <TermsSection number="04 - Your Account" title="Your account">
            <p className="mb-4">
              You may need an account to use some or all of the Service. You agree to:
            </p>
            <DashList
              items={[
                "Provide complete, current, and accurate registration and billing information.",
                "Keep your account information up to date.",
                "Protect your password, access links, devices, and other sign-in methods.",
                <>
                  Tell us promptly at <SupportEmail /> if you suspect unauthorized access or
                  activity.
                </>,
              ]}
            />
            <p>
              You are responsible for activity under your account unless it results from our breach
              of these Terms or failure to use reasonable security. You may not sell, transfer, or
              share your account in a way that defeats account or plan limits.
            </p>
          </TermsSection>

          <TermsSection
            number="05 - Subscriptions & Billing"
            title="Subscriptions, billing, cancellation, and refunds"
          >
            <SubHeading>5.1 Plans and prices</SubHeading>
            <p className="mb-4">
              Some features require a paid subscription. The plan, price, billing interval, included
              usage, and any limits shown to you at checkout form part of these Terms. Current
              subscription prices and plan limits are $10/month for 20 tasks, and $49/month for 100
              tasks; see <InlineLink to="/pricing">asmiai.com/pricing</InlineLink> for all current
              plans, including annual billing. Taxes and other charges may apply where required by
              law.
            </p>

            <SubHeading>5.2 Payment through Stripe</SubHeading>
            <p className="mb-4">
              Payments are processed by Stripe or its affiliates. By providing a payment method, you
              authorize Stripe and Humint Labs to charge the amounts shown at checkout, including
              recurring subscription charges and applicable taxes. Stripe may apply its own terms
              and privacy practices to payment processing.
            </p>

            <SubHeading>5.3 Automatic renewal</SubHeading>
            <p className="mb-4">
              Unless the checkout page says otherwise, a paid subscription renews automatically at
              the end of each billing period until you cancel. Renewal is monthly or annual,
              depending on the subscription type. If a payment fails, we may retry the charge, ask
              you to update your payment method, limit paid features, or suspend the subscription.
            </p>

            <SubHeading>5.4 Cancel anytime</SubHeading>
            <p className="mb-4">
              You may cancel your subscription at any time through your account settings or by
              contacting <SupportEmail />. Unless we tell you otherwise at checkout, cancellation
              stops future renewals and your paid access continues until the end of the current paid
              billing period. Canceling does not automatically refund charges already paid.
            </p>

            <SubHeading>5.5 Refunds</SubHeading>
            <p className="mb-4">
              Refund eligibility, request window, method, and any exceptions are at our discretion.
              Except where the law requires otherwise or our confirmed refund policy says otherwise,
              fees are non-refundable and we do not provide credits for partial billing periods,
              unused time, or unused task capacity.
            </p>

            <SubHeading>5.6 Price or plan changes</SubHeading>
            <p className="mb-4">
              We may change prices, included usage, or plan features. We will give you at least 30
              days' advance notice of a material change before it applies to your next renewal. If
              you do not agree, you may cancel before the change takes effect.
            </p>

            <SubHeading>5.7 Trials and promotions</SubHeading>
            <p>
              Any free trial, discount, credit, or promotional offer is subject to the terms
              presented with that offer. Trial length, conversion to a paid subscription, expiration
              of credits, and eligibility rules are at our discretion. We may limit or revoke an
              offer if it is abused.
            </p>
          </TermsSection>

          <TermsSection
            number="06 - Authorization"
            title="Your authorization to contact third parties"
          >
            <p className="mb-4">
              When you submit a task, you authorize Asmi and Humint Labs to take the reasonable
              steps needed to work on that task, including contacting relevant people or businesses
              by phone, text message, or email on your behalf. Your authorization is limited to the
              task you submitted and ends when the task is completed, canceled, stopped, or
              otherwise closed, except for communications reasonably needed to confirm closure or
              preserve records.
            </p>
            <p className="mb-4">You confirm that:</p>
            <DashList
              items={[
                "The task details and contact information you provide are accurate to the best of your knowledge.",
                "You have the right to ask us to contact the named person or business for that purpose.",
                "The request is lawful and does not violate another person's rights, contractual obligations, or communications preferences.",
                "You will give us information or approvals we reasonably need and will not ask us to misrepresent you or conceal material facts.",
              ]}
            />
            <p>
              We may ask you to confirm instructions, approve an option, or provide more information
              before continuing. You may cancel a task through the available product controls or by
              contacting support. We will use reasonable efforts to stop further outreach, but a
              message already sent or a call already placed cannot always be recalled.
            </p>
          </TermsSection>

          <TermsSection number="07 - AI Disclosure" title="AI disclosure">
            <p className="mb-4">
              Asmi uses artificial intelligence to understand tasks, generate content, and
              communicate. Calls may use an AI-generated voice. At the beginning of a call, Asmi
              identifies itself as an AI assistant calling on your behalf. Asmi will not claim to be
              you or a human representative.
            </p>
            <p>
              AI can make mistakes, misunderstand context, or produce incomplete or inaccurate
              information. Review important details before relying on them, especially prices,
              dates, availability, policies, commitments, and information that could affect your
              health, safety, legal rights, or finances.
            </p>
          </TermsSection>

          <TermsSection number="08 - Acceptable Use" title="Acceptable use">
            <p className="mb-4">
              Use Asmi only for lawful, legitimate tasks. You may not use or try to use the Service
              for:
            </p>
            <DashList
              items={[
                "Unsolicited promotional outreach, bulk marketing, spam, lead generation, or robocalling.",
                "Collecting or attempting to collect a debt, including making repeated payment demands or contacting third parties about another person's debt.",
                "Emergency-service requests or communications to emergency numbers, public-safety answering points, crisis lines, or similar services.",
                "Political solicitation, campaign outreach, lobbying calls, voter persuasion, or fundraising for political purposes.",
                "Harassment, stalking, intimidation, threats, abuse, discrimination, hate, or repeated contact after a person has asked for contact to stop.",
                "Legal threats, demands intended to intimidate, impersonating a lawyer or government official, or providing legal services without authorization.",
                "Securities solicitation, investment promotion, market manipulation, or offers to buy or sell securities or regulated financial products.",
                "Fraud, impersonation, deception, phishing, identity theft, evading another person's communications preferences, or obtaining information without authorization.",
                "Illegal goods or services, exploitation, sexual abuse material, trafficking, or any activity that violates law or another person's rights.",
                "Interfering with, probing, reverse engineering, scraping, overloading, or bypassing security, access, usage, or rate limits of the Service, except where applicable law expressly permits it.",
              ]}
            />
            <p>
              Humint Labs may review, refuse, pause, narrow, or stop a task that we reasonably
              believe violates these Terms, creates safety or legal risk, is outside the Service's
              capabilities, or is not suitable for AI-assisted outreach. We may take steps to
              prevent repeated misuse, including suspending or terminating an account.
            </p>
          </TermsSection>

          <TermsSection number="09 - Communications" title="Communications with you">
            <p className="mb-4">
              You agree that we may call, text, or email you at the contact details you provide when
              reasonably needed to operate the Service. These communications may include task
              updates, questions, approval requests, security alerts, account notices, billing
              notices, and support responses.
            </p>
            <p className="mb-4">
              For text messages, reply <span className="font-mono">STOP</span> to opt out and{" "}
              <span className="font-mono">HELP</span> for help. After a STOP request, we may send
              one confirmation message and will stop non-exempt messages to that number. You can
              also contact <SupportEmail />. Message and data rates may apply. Message frequency
              varies based on your tasks and account activity. Opting out of text messages may
              prevent some task features from working, but we will not condition a purchase on
              consent to receive promotional texts.
            </p>
            <p>
              Where required, promotional communications are sent only with the consent required by
              law. You may unsubscribe using the method in the message. We may still send
              non-promotional communications needed for your account, transactions, security, or
              tasks.
            </p>
          </TermsSection>

          <TermsSection number="10 - Third Parties" title="Third-party services and transactions">
            <p className="mb-4">
              People and businesses contacted through Asmi are independent third parties. Humint
              Labs does not employ, control, endorse, or guarantee them or their goods, services,
              statements, availability, pricing, policies, or conduct. Their own terms, privacy
              notices, cancellation rules, and refund policies may apply to your interaction or
              transaction.
            </p>
            <p className="mb-4">
              Unless the Service clearly says otherwise, Humint Labs is not a party to an agreement
              between you and a third party. You are responsible for reviewing and approving
              material terms before you commit, including the provider, item or service, date, time,
              location, price, taxes, fees, cancellation policy, and refund policy.
            </p>
            <p>
              Asmi will not knowingly make a purchase or enter a binding commitment for you without
              the instruction or approval required by the product flow. You are responsible for
              amounts you approve and for any third-party charges, penalties, or cancellation fees
              resulting from your instructions, except to the extent caused by our breach of these
              Terms or negligence.
            </p>
          </TermsSection>

          <TermsSection number="11 - Ownership" title="Ownership and license">
            <SubHeading>11.1 The Service</SubHeading>
            <p className="mb-4">
              Humint Labs and its licensors own the Service, including its software, design,
              branding, and related intellectual property. Subject to these Terms, we give you a
              limited, personal, non-exclusive, non-transferable, and revocable right to use the
              Service for its intended purpose.
            </p>

            <SubHeading>11.2 Your content</SubHeading>
            <p className="mb-4">
              You keep any rights you have in the instructions, documents, messages, and other
              content you submit ("Your Content"). You give Humint Labs a worldwide, non-exclusive
              license to host, process, reproduce, transmit, and use Your Content only as reasonably
              needed to provide, secure, support, and improve the Service, comply with law, and
              enforce these Terms, consistent with our Privacy Policy.
            </p>
            <p className="mb-4">
              You confirm that you have the rights and permissions needed for us to process Your
              Content for those purposes. Do not submit sensitive information unless it is necessary
              for the task and the Service allows it.
            </p>

            <SubHeading>11.3 Feedback</SubHeading>
            <p>
              If you choose to send ideas or feedback, we may use them without restriction or
              payment to you. This does not give us ownership of Your Content or your personal
              information.
            </p>
          </TermsSection>

          <TermsSection number="12 - Privacy" title="Privacy">
            <p>
              Our <InlineLink to="/privacy">Privacy Policy</InlineLink> explains what personal
              information we collect, how we use and disclose it, how long we keep it, and the
              choices and rights available to you. The Privacy Policy is part of these Terms. If
              these Terms conflict with the Privacy Policy about how we handle personal information,
              the Privacy Policy controls for that issue.
            </p>
          </TermsSection>

          <TermsSection number="13 - Disclaimers" title="Service availability and disclaimers">
            <p className="mb-4">
              We work to provide a useful and reliable Service, but Asmi is provided "as is" and "as
              available." To the fullest extent allowed by law, Humint Labs and its affiliates,
              officers, directors, employees, contractors, and licensors disclaim implied
              warranties, including merchantability, fitness for a particular purpose, title, and
              non-infringement.
            </p>
            <p className="mb-4">
              We do not promise that the Service will be uninterrupted, secure, error-free, or
              available in every location; that AI output will always be accurate or complete; that
              a third party will answer, cooperate, honor a quote, or perform as promised; or that
              any task will be completed or completed on time.
            </p>
            <p>
              Some places do not allow certain warranty disclaimers. In those places, the
              disclaimers apply only to the extent the law permits. Nothing in these Terms excludes
              any warranty or consumer right that cannot lawfully be excluded.
            </p>
          </TermsSection>

          <TermsSection number="14 - Limitation Of Liability" title="Limitation of liability">
            <p className="mb-4">
              To the fullest extent allowed by law, Humint Labs and its affiliates, officers,
              directors, employees, contractors, and licensors will not be liable for indirect,
              incidental, special, consequential, exemplary, or punitive damages; loss of profits,
              revenue, data, goodwill, or opportunities; or harm caused by a third party's acts,
              omissions, goods, services, information, or refusal to cooperate, even if we were told
              that such harm was possible.
            </p>
            <p className="mb-4">
              To the fullest extent allowed by law, the total liability of Humint Labs and the other
              parties listed above for all claims arising out of or relating to the Service or these
              Terms will not exceed the greater of the fees you paid to Humint Labs in the 12 months
              before the event giving rise to the claim or US$100.
            </p>
            <p>
              These limits do not apply where liability cannot legally be limited, including any
              liability that applicable law says cannot be excluded. The limits apply regardless of
              the legal theory and even if a remedy fails of its essential purpose.
            </p>
          </TermsSection>

          <TermsSection number="15 - Indemnity" title="Indemnity">
            <p className="mb-4">
              To the extent allowed by law, you agree to defend, indemnify, and hold harmless Humint
              Labs and its affiliates, officers, directors, employees, and contractors from
              third-party claims, damages, losses, and reasonable costs, including attorneys' fees,
              arising from: (a) your unlawful or unauthorized use of the Service; (b) Your Content;
              (c) your material breach of these Terms; or (d) a task you submitted that infringes or
              violates another person's rights.
            </p>
            <p>
              This obligation does not apply to the extent a claim results from Humint Labs' own
              breach, negligence, or willful misconduct. We will give you reasonable notice of a
              covered claim and may control its defense and settlement. You may not settle a claim
              in a way that admits fault by or imposes obligations on Humint Labs without our
              written consent.
            </p>
          </TermsSection>

          <TermsSection number="16 - Termination" title="Ending these Terms">
            <SubHeading>16.1 You may stop using Asmi</SubHeading>
            <p className="mb-4">
              You may stop using the Service at any time. You may cancel a paid subscription as
              described in Section 5. If available, you may also request account deletion through
              your account settings or by contacting <SupportEmail />.
            </p>

            <SubHeading>16.2 We may suspend or terminate access</SubHeading>
            <p className="mb-4">
              We may suspend or terminate access if you materially or repeatedly violate these
              Terms, create a safety or legal risk, fail to pay amounts due, misuse the Service, or
              if we are required to do so by law. Where reasonable and lawful, we will give notice
              and an opportunity to fix the issue before termination. We may act immediately when
              needed to protect third parties, Humint Labs, or the Service.
            </p>

            <SubHeading>16.3 What happens afterward</SubHeading>
            <p>
              When these Terms end, your right to use the Service ends. Cancellation and refund
              rules remain governed by Section 5. We handle deletion, retention, and access to
              personal information as described in our Privacy Policy. Sections that by their nature
              should continue will survive, including payment obligations, ownership, disclaimers,
              liability limits, indemnity, dispute terms, and general terms.
            </p>
          </TermsSection>

          <TermsSection number="17 - Changes" title="Changes to these Terms">
            <p className="mb-4">
              We may update these Terms as the Service or law changes. If a change materially
              affects your rights or obligations, we will give at least one month's advance notice
              by email, an in-product notice, or another reasonable method before it takes effect.
              The notice will include the new effective date.
            </p>
            <p>
              If you do not agree to an updated version, you must stop using the Service and cancel
              any subscription before the updated Terms take effect. Continued use after the
              effective date means you accept the updated Terms, except where the law requires
              another form of consent.
            </p>
          </TermsSection>

          <TermsSection number="18 - Governing Law" title="Governing law and disputes">
            <p className="mb-4">
              These Terms are governed by the laws of the State of Delaware, without regard to
              conflict-of-law rules. Any dispute that is not resolved informally will be brought
              exclusively in the state or federal courts located in Delaware, and each party
              consents to those courts' jurisdiction.
            </p>
            <p className="mb-4">
              Before filing a claim, you and Humint Labs agree to try in good faith to resolve the
              issue informally for 30 days. To start that process, email <SupportEmail /> with your
              name, account email, a description of the issue, and the result you want.
            </p>
            <p>
              Nothing in this section prevents either party from seeking urgent injunctive relief
              where allowed by law. If you live somewhere with mandatory consumer-protection rights,
              you keep those rights and may have the right to bring a claim in your local courts.
            </p>
          </TermsSection>

          <TermsSection number="19 - General Terms" title="General terms">
            <DashList
              items={[
                <>
                  <Bold>Entire agreement.</Bold> These Terms, the Privacy Policy, and any plan or
                  offer terms shown to you at checkout are the entire agreement between you and
                  Humint Labs about the Service. They replace earlier agreements about the same
                  subject, except for separate written agreements signed by both parties.
                </>,
                <>
                  <Bold>Order of precedence.</Bold> If plan or offer terms presented at checkout
                  conflict with these Terms, the more specific plan or offer terms control for that
                  subscription or offer. The Privacy Policy controls for personal-information
                  practices.
                </>,
                <>
                  <Bold>Severability.</Bold> If a court finds part of these Terms unenforceable, the
                  rest remains in effect, and the unenforceable part will be enforced to the maximum
                  extent permitted by law.
                </>,
                <>
                  <Bold>No waiver.</Bold> If either party does not enforce a provision immediately,
                  that does not waive the right to enforce it later.
                </>,
                <>
                  <Bold>Assignment.</Bold> You may not transfer these Terms or your account without
                  our written consent. We may transfer these Terms as part of a merger, acquisition,
                  reorganization, sale of assets, or by operation of law, provided the transfer does
                  not reduce your non-waivable consumer rights.
                </>,
                <>
                  <Bold>Force majeure.</Bold> Neither party is responsible for delay or failure
                  caused by events beyond its reasonable control, except that this does not excuse
                  amounts already due.
                </>,
                <>
                  <Bold>No third-party beneficiaries.</Bold> These Terms do not give rights to
                  anyone other than you and Humint Labs, except where these Terms expressly say
                  otherwise.
                </>,
                <>
                  <Bold>Electronic notices.</Bold> You agree that notices and agreements may be
                  delivered electronically. Keep your account email current.
                </>,
              ]}
            />
          </TermsSection>

          <TermsSection number="20 - Contact" title="Contact us">
            <p className="mb-4">Questions about these Terms or the Service can be sent to:</p>
            <div className="space-y-1" style={{ fontSize: "0.95rem" }}>
              <p style={{ fontWeight: "bold" }}>Humint Labs, Inc.</p>
              <p style={{ color: "var(--ink-dim)" }}>710 Lakeway Drive, Suite 200</p>
              <p style={{ color: "var(--ink-dim)" }}>Sunnyvale, CA 94085</p>
              <p style={{ marginTop: "0.5rem" }}>
                <SupportEmail />
              </p>
            </div>
          </TermsSection>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default TermsAndConditions;
