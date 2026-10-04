// Content for /docs/mcp.
//
// - Mirrors mvp_app_internal: backend/mcp/ (clients.py, tools/, oauth/, protocol.py)
// - Tool copy is a human rewrite of each tool's `description`, not the LLM-facing text
// - Update here when a tool, scope, client slug or protocol version changes server-side

export const MCP_BASE_URL = "https://prod.asmiai.com";

export const PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26"];

export type ClientSlug = "claude" | "chatgpt" | "muse";

export interface SetupStep {
  title: string;
  body: string;
}

export interface ClientGuide {
  slug: ClientSlug;
  name: string;
  // Server-side registry slug (clients.py) → the path segment of the endpoint
  serverSlug: string;
  tagline: string;
  steps: SetupStep[];
  notes: string[];
}

export function endpointFor(guide: ClientGuide): string {
  return `${MCP_BASE_URL}/mcp/${guide.serverSlug}/`;
}

export const CLIENT_GUIDES: ClientGuide[] = [
  {
    slug: "claude",
    name: "Claude",
    serverSlug: "claude",
    tagline: "Add Asmi as a custom connector on claude.ai, Claude Desktop or Claude mobile.",
    steps: [
      {
        title: "Open connectors",
        body: "In Claude, go to Settings → Connectors and choose Add custom connector. On Team and Enterprise plans, an owner adds it once under Organization settings → Connectors.",
      },
      {
        title: "Paste the Asmi endpoint",
        body: "Name it Asmi and paste the endpoint above. Leave the advanced OAuth fields empty: Claude identifies itself to Asmi automatically.",
      },
      {
        title: "Sign in to Asmi",
        body: "Choose Connect. A window opens on Asmi where you enter your phone number or email, type the 6-digit code we send, and approve access.",
      },
      {
        title: "Turn it on in a chat",
        body: "Enable Asmi from the tools menu in any conversation, then ask for something real, like “find a plumber near me who can come tomorrow and book them”.",
      },
    ],
    notes: [
      "Claude asks before each tool call by default. You can let read-only tools (task lists, status, search) run without asking.",
      "Connectors you add on claude.ai sync to Claude Desktop and mobile automatically.",
    ],
  },
  {
    slug: "chatgpt",
    name: "ChatGPT",
    serverSlug: "openai",
    tagline: "Connect Asmi as an app in ChatGPT on the web, desktop or mobile.",
    steps: [
      {
        title: "Enable developer mode",
        body: "In ChatGPT, open Settings → Apps & Connectors → Advanced settings and turn on Developer mode. On Business and Enterprise workspaces an admin may need to allow custom apps first.",
      },
      {
        title: "Create the app",
        body: "Back in Apps & Connectors, choose Create. Name it Asmi, paste the endpoint above as the MCP server URL, and pick OAuth for authentication.",
      },
      {
        title: "Sign in to Asmi",
        body: "ChatGPT opens Asmi’s sign-in page. Enter your phone number or email, type the 6-digit code we send, and approve access.",
      },
      {
        title: "Use it in a chat",
        body: "Pick Asmi from the + menu (or mention it by name) and describe what you need done.",
      },
    ],
    notes: [
      "ChatGPT shows a confirmation before any tool that reaches the outside world, such as starting a task that calls a business.",
      "Use the ChatGPT endpoint only. A token issued for ChatGPT is refused at the Claude or Muse endpoint.",
    ],
  },
  {
    slug: "muse",
    name: "Meta Muse",
    serverSlug: "meta",
    tagline: "Bring Asmi into Muse, either by signing in yourself or with a key we issue.",
    steps: [
      {
        title: "Add Asmi as an MCP server",
        body: "In Muse’s connector or tool settings, add a remote MCP server named Asmi and paste the endpoint above.",
      },
      {
        title: "Sign in yourself (recommended)",
        body: "If Muse offers OAuth sign-in, choose it. Muse registers itself with Asmi automatically, then opens Asmi’s sign-in page: enter your phone number or email, type the 6-digit code, and approve access.",
      },
      {
        title: "Or use an API key",
        body: "If your Muse setup only accepts a static credential, email support@asmiai.com with the phone number or email you use with Asmi, and say whether Asmi may contact people for you. We reply with a key. Set it as the header Authorization: Bearer asmi_u_….",
      },
      {
        title: "Start a task",
        body: "Ask Muse to have Asmi handle something, for example “ask Asmi to call the dentist and move my cleaning to next week”.",
      },
    ],
    notes: [
      "Keys we issue last 60 days by default. Ask us for a fresh one before it expires. Treat a key like a password: anyone holding it can act as you.",
      "Lost or leaked key? Email us and we revoke it immediately and issue a new one.",
    ],
  },
];

export interface Scope {
  name: string;
  label: string;
  body: string;
  optional: boolean;
}

export const SCOPES: Scope[] = [
  {
    name: "tasks",
    label: "Read & manage your tasks",
    body: "See the tasks Asmi is working on for you, search the web, check your plan, and get payment links. Always granted.",
    optional: false,
  },
  {
    name: "outreach",
    label: "Contact people for you",
    body: "Start tasks where Asmi calls, texts or emails businesses and people for you, and pass new details into those tasks. Ticked by default on the consent screen. Untick it and Asmi only does work that stays between you and Asmi.",
    optional: true,
  },
];

export type ToolEffect = "read" | "outward" | "write" | "link";

export interface ToolDoc {
  name: string;
  summary: string;
  effect: ToolEffect;
  needsOutreach?: boolean;
}

export interface ToolGroup {
  name: string;
  blurb: string;
  tools: ToolDoc[];
}

export const TOOL_EFFECT_LABEL: Record<ToolEffect, string> = {
  read: "read-only",
  outward: "acts in the world",
  write: "changes your account",
  link: "issues a link",
};

export const TOOL_GROUPS: ToolGroup[] = [
  {
    name: "discover",
    blurb: "Find who to contact before asking Asmi to act.",
    tools: [
      {
        name: "discover_search",
        summary:
          "Search the web for businesses, services, places or facts. Returns short results (id, title, link, phone). Include a location for local searches.",
        effect: "read",
      },
      {
        name: "discover_get_results",
        summary:
          "Fetch full details (address, hours, rating, reviews) for result ids from a search. Ids expire after a while.",
        effect: "read",
      },
    ],
  },
  {
    name: "execute",
    blurb: "Hand Asmi a real-world task and follow it to done.",
    tools: [
      {
        name: "execute_start",
        summary:
          "Start a task: Asmi calls, texts and emails people for you and keeps following up for hours or days until it’s done. Returns a task id right away.",
        effect: "outward",
        needsOutreach: true,
      },
      {
        name: "execute_status",
        summary:
          "Check progress: the current step, a timeline of what happened, and any questions Asmi is waiting on you to answer.",
        effect: "read",
      },
      {
        name: "execute_advance",
        summary:
          "Pass new facts into a running task, such as an answer to Asmi’s question, a corrected detail or a changed preference.",
        effect: "outward",
        needsOutreach: true,
      },
      {
        name: "execute_cancel",
        summary:
          "Stop pursuing a task. Calls or messages that already went out can’t be taken back.",
        effect: "write",
      },
      {
        name: "execute_generate_task_link",
        summary:
          "Get a fresh link to the task’s live dashboard. Links are single-use and expire, so asking for a new one is always safe.",
        effect: "link",
      },
    ],
  },
  {
    name: "tasks",
    blurb: "Everything Asmi is tracking for you, across every channel.",
    tools: [
      {
        name: "tasks_list",
        summary:
          "List your tasks, newest first. Shows active tasks by default; filter by status to see archived or cancelled ones.",
        effect: "read",
      },
      {
        name: "tasks_status",
        summary: "Full detail and updates for one task, including any open questions for you.",
        effect: "read",
      },
    ],
  },
  {
    name: "billing",
    blurb: "Plans, remaining quota and checkout.",
    tools: [
      {
        name: "billing_status",
        summary:
          "Your plan, whether it’s active, the renewal date, and how many third-party calls you have left this month.",
        effect: "read",
      },
      {
        name: "billing_get_tiers",
        summary: "Asmi’s plans with monthly and annual prices, and where your own plan stands.",
        effect: "read",
      },
      {
        name: "billing_get_payment_link",
        summary:
          "A Stripe checkout link for the plan you pick, or your Asmi billing page if you already subscribe. Card details go to Stripe, never through the chat.",
        effect: "link",
      },
    ],
  },
];

export const TASK_FLOW: SetupStep[] = [
  {
    title: "Find",
    body: "Your assistant calls discover_search to find candidates, such as three dentists near you with openings this week.",
  },
  {
    title: "Start",
    body: "execute_start hands Asmi the goal, not the steps. Asmi plans the outreach and replies right away with a task id and a suggested time to check back.",
  },
  {
    title: "Pursue",
    body: "Asmi calls, texts and emails, works through phone menus, retries missed calls, and handles callbacks, often across several candidates at once.",
  },
  {
    title: "Answer",
    body: "If Asmi needs something from you, such as a date of birth or a preferred time, it shows up as questions in execute_status. Your answer goes back through execute_advance.",
  },
  {
    title: "Done",
    body: "Once someone confirms, Asmi closes out every other open thread so nothing gets double-booked, then reports the result.",
  },
];

export const CANNOT_DO = [
  "Make payments or transact on your behalf.",
  "Operate websites for you: filling in forms, staying logged in, or watching a page for changes.",
];

export interface TroubleshootItem {
  symptom: string;
  fix: string;
}

export const TROUBLESHOOTING: TroubleshootItem[] = [
  {
    symptom: "“Key is not valid for this client” (403)",
    fix: "The token was issued for a different assistant. Each assistant has its own endpoint, so use the one in that assistant’s tab above and reconnect.",
  },
  {
    symptom: "outreach_not_permitted",
    fix: "You connected without “Let Asmi contact people for me”. Disconnect, reconnect, and leave that box ticked.",
  },
  {
    symptom: "401 / asked to sign in again",
    fix: "Your session expired or was revoked. Reconnect from your assistant’s settings. Your tasks and history are kept.",
  },
  {
    symptom: "Dashboard link doesn’t open",
    fix: "Task links are single-use and expire. Ask your assistant for a new one; it calls execute_generate_task_link.",
  },
  {
    symptom: "A task says it’s blocked on quota",
    fix: "You’ve used this month’s third-party calls. Upgrade from the chat (billing_get_tiers → billing_get_payment_link) or wait for the monthly reset.",
  },
];
