import { motion } from "motion/react";

export default function NewNumber() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{ background: "#0B0A16" }}
    >
      <SpaceScene />

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 font-serif italic tracking-tight"
        style={{
          color: "#F4EFE6",
          fontSize: "clamp(34px, 9vw, 52px)",
          lineHeight: 1.16,
          textShadow: "0 2px 30px rgba(0,0,0,0.55)",
        }}
      >
        asmi has a
        <br />
        <span
          style={{
            background:
              "linear-gradient(100deg, var(--color-clay, #E0A87A), var(--color-terracotta))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          new number.
        </span>
      </motion.h1>

      <motion.a
        href="https://asmi-ai.link/imsg"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="relative z-10 mt-9 inline-flex items-center gap-2 rounded-full"
        style={{
          padding: "9px 18px 9px 9px",
          background: "rgba(255, 253, 248, 0.06)",
          border: "1px solid rgba(255, 253, 248, 0.16)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: "#F4EFE6",
          fontFamily: "var(--font-mono, ui-monospace, monospace)",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
        aria-label="Message asmi on iMessage"
      >
        <svg width={26} height={26} viewBox="0 0 66.145836 66.145836" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="nn-imsg-grad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0" stopColor="#0cbd2a" />
              <stop offset="1" stopColor="#5bf675" />
            </linearGradient>
          </defs>
          <rect width={66.145836} height={66.145836} rx={14.567832} ry={14.567832} fill="url(#nn-imsg-grad)" />
          <path
            fill="#fff"
            d="m 33.072934,11.450461 a 24.278298,20.222157 0 0 0 -24.278105,20.22202 24.278298,20.222157 0 0 0 11.79463,17.31574 27.365264,20.222157 0 0 1 -4.245218,5.94228 23.85735,20.222157 0 0 0 9.86038,-3.87367 24.278298,20.222157 0 0 0 6.868313,0.83768 24.278298,20.222157 0 0 0 24.278106,-20.22203 24.278298,20.222157 0 0 0 -24.278106,-20.22202 z"
          />
        </svg>
        message asmi
      </motion.a>
    </main>
  );
}

function SpaceScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <style>{`
        .nn-space-base {
          position: absolute; inset: 0;
          background: radial-gradient(140% 120% at 50% -10%, #2A2440, #16132A 34%, #0B0A16 62%, #07060F 100%);
        }
        .nn-nebula {
          position: absolute; inset: -20%;
          background:
            radial-gradient(38% 30% at 22% 30%, rgba(126, 20, 255, 0.20), transparent 60%),
            radial-gradient(32% 26% at 78% 22%, rgba(70, 120, 200, 0.16), transparent 60%),
            radial-gradient(40% 34% at 62% 74%, rgba(194, 91, 63, 0.16), transparent 62%),
            radial-gradient(30% 26% at 30% 82%, rgba(160, 60, 200, 0.12), transparent 60%);
          filter: blur(14px);
          animation: nn-nebula-drift 46s ease-in-out infinite alternate;
        }
        @keyframes nn-nebula-drift {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to   { transform: translate3d(-3%, 2.5%, 0) scale(1.08); }
        }
        .nn-stars { position: absolute; inset: -50px; background-repeat: repeat; }
        .nn-stars.s1 {
          background-image:
            radial-gradient(1.4px 1.4px at 12% 18%, #fff, transparent),
            radial-gradient(1.2px 1.2px at 47% 62%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1.6px 1.6px at 73% 12%, #fff, transparent),
            radial-gradient(1.3px 1.3px at 88% 54%, rgba(255,255,255,0.85), transparent),
            radial-gradient(1.2px 1.2px at 28% 88%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1.5px 1.5px at 62% 40%, #fff, transparent);
          background-size: 420px 420px;
          animation: nn-drift-slow 120s linear infinite, nn-twinkle 5s ease-in-out infinite;
        }
        .nn-stars.s2 {
          background-image:
            radial-gradient(1px 1px at 20% 40%, rgba(255,255,255,0.75), transparent),
            radial-gradient(1.1px 1.1px at 55% 78%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 82% 30%, rgba(255,255,255,0.72), transparent),
            radial-gradient(1.2px 1.2px at 35% 15%, rgba(255,255,255,0.68), transparent),
            radial-gradient(1px 1px at 70% 66%, rgba(255,255,255,0.7), transparent);
          background-size: 300px 300px;
          opacity: 0.8;
          animation: nn-drift-med 80s linear infinite, nn-twinkle 7s ease-in-out infinite reverse;
        }
        .nn-stars.s3 {
          background-image:
            radial-gradient(0.9px 0.9px at 15% 70%, rgba(200,210,255,0.6), transparent),
            radial-gradient(0.9px 0.9px at 60% 25%, rgba(255,230,210,0.55), transparent),
            radial-gradient(0.9px 0.9px at 90% 80%, rgba(255,255,255,0.5), transparent),
            radial-gradient(0.9px 0.9px at 42% 50%, rgba(210,220,255,0.55), transparent);
          background-size: 220px 220px;
          opacity: 0.7;
          animation: nn-drift-fast 55s linear infinite, nn-twinkle 4s ease-in-out infinite;
        }
        @keyframes nn-drift-slow { from { transform: translateY(0); } to { transform: translateY(-420px); } }
        @keyframes nn-drift-med  { from { transform: translateY(0); } to { transform: translateY(-300px); } }
        @keyframes nn-drift-fast { from { transform: translateY(0); } to { transform: translateY(-220px); } }
        @keyframes nn-twinkle { 0%, 100% { opacity: 0.9; } 50% { opacity: 0.5; } }

        .nn-planet-wrap {
          position: absolute;
          bottom: -32vmin; left: 50%;
          width: min(96vmin, 680px); height: min(96vmin, 680px);
          transform: translateX(-50%);
          animation: nn-planet-float 26s ease-in-out infinite;
        }
        @keyframes nn-planet-float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-2.2vmin); }
        }
        .nn-planet { position: absolute; inset: 0; border-radius: 50%; overflow: hidden; background: #120A22; }
        .nn-surface {
          position: absolute; inset: 0;
          background:
            radial-gradient(circle at 18% 34%, rgba(128, 100, 148, 0.55), transparent 22%),
            radial-gradient(circle at 60% 62%, rgba(70, 54, 92, 0.62), transparent 26%),
            radial-gradient(circle at 86% 30%, rgba(194, 91, 63, 0.34), transparent 20%),
            radial-gradient(circle at 40% 82%, rgba(92, 70, 116, 0.5), transparent 24%),
            linear-gradient(180deg, #2C2142, #1A1130);
          background-size: 40vmin 100%;
          background-repeat: repeat;
          animation: nn-spin 44s linear infinite;
        }
        @keyframes nn-spin { to { background-position: -40vmin 0; } }
        .nn-shade {
          position: absolute; inset: 0; border-radius: 50%;
          background:
            radial-gradient(circle at 30% 24%, rgba(255, 232, 205, 0.14), transparent 42%),
            radial-gradient(circle at 30% 26%, transparent 44%, rgba(0,0,0,0.55) 100%);
          box-shadow: inset -16vmin -12vmin 30vmin rgba(0,0,0,0.82);
        }
        .nn-rim {
          position: absolute; inset: -0.8vmin; border-radius: 50%;
          background: radial-gradient(circle at 28% 22%, rgba(224,168,122,0.85), rgba(194,91,63,0.35) 12%, transparent 34%);
          filter: blur(3px);
          mix-blend-mode: screen;
          opacity: 0.85;
          animation: nn-rim-pulse 9s ease-in-out infinite;
        }
        @keyframes nn-rim-pulse { 0%, 100% { opacity: 0.72; } 50% { opacity: 1; } }
        .nn-moon-orbit {
          position: absolute; inset: -7vmin;
          border-radius: 50%;
          animation: nn-orbit 32s linear infinite;
        }
        @keyframes nn-orbit { to { transform: rotate(360deg); } }
        .nn-moon {
          position: absolute; top: -1.5vmin; left: 50%;
          width: 3vmin; height: 3vmin; margin-left: -1.5vmin;
          border-radius: 50%;
          background: radial-gradient(circle at 34% 34%, #ded5e8, #7a688a 58%, #3c3049);
          box-shadow: 0 0 10px rgba(220, 205, 245, 0.45);
        }
        .nn-shoot {
          position: absolute;
          width: 150px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9));
          filter: drop-shadow(0 0 4px rgba(255,255,255,0.7));
          opacity: 0;
        }
        .nn-shoot.a { top: 12%; left: -12%; animation: nn-shoot 9s ease-in 1s infinite; }
        .nn-shoot.b { top: 34%; left: -12%; animation: nn-shoot 12s ease-in 5.5s infinite; }
        .nn-shoot.c { top: 6%;  left: -12%; animation: nn-shoot 15s ease-in 10s infinite; }
        @keyframes nn-shoot {
          0%  { transform: translate(0, 0) rotate(16deg); opacity: 0; }
          2%  { opacity: 1; }
          12% { transform: translate(78vw, 26vh) rotate(16deg); opacity: 0; }
          100% { opacity: 0; }
        }
        .nn-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(4,3,10,0.55) 100%);
        }
        @media (prefers-reduced-motion: reduce) {
          .nn-nebula, .nn-stars, .nn-planet-wrap, .nn-surface, .nn-rim, .nn-moon-orbit, .nn-shoot { animation: none !important; }
          .nn-shoot { display: none; }
        }
      `}</style>
      <div className="nn-space-base" />
      <div className="nn-nebula" />
      <div className="nn-stars s1" />
      <div className="nn-stars s2" />
      <div className="nn-stars s3" />
      <div className="nn-shoot a" />
      <div className="nn-shoot b" />
      <div className="nn-shoot c" />
      <div className="nn-planet-wrap">
        <div className="nn-planet">
          <div className="nn-surface" />
          <div className="nn-shade" />
          <div className="nn-rim" />
        </div>
        <div className="nn-moon-orbit">
          <span className="nn-moon" />
        </div>
      </div>
      <div className="nn-vignette" />
    </div>
  );
}
