import Image from "next/image";
import type { ProjectDTO } from "@/lib/validations/content";
import { cn } from "@/lib/utils/cn";

export const categoryLabels: Record<ProjectDTO["category"], string> = {
  WEB: "Web",
  MOBILE: "Mobile",
  AI_ML: "AI / ML",
  RESEARCH: "Research",
  SYSTEM: "System",
  OTHER: "Other",
};

type CoverProject = Pick<ProjectDTO, "title" | "coverImage" | "category" | "tags" | "techStack">;

interface ProjectCoverProps {
  project: CoverProject;
  /** Position in the list — numbers the poster and alternates its glow. */
  index: number;
  sizes: string;
  priority?: boolean;
  /**
   * Rest uploaded images in monochrome until a `group` ancestor is hovered
   * (see .cover-mono). Posters already sit in the brand palette, so they don't.
   */
  mono?: boolean;
  /**
   * Poster only: drop the title and set the motif large in the middle — for
   * where the title already sits beside the cover (the case-study page).
   */
  art?: boolean;
  className?: string;
}

/**
 * A project's cover, filling its positioned parent. Uses the uploaded cover
 * image when there is one; otherwise draws an on-brand poster — the title in
 * Anton, the lead tag in the volt serif and a line motif picked from what the
 * project is (phone, browser, chat, viewfinder, network). Uploading a cover in
 * the admin replaces the poster.
 */
export function ProjectCover({
  project,
  index,
  sizes,
  priority,
  mono,
  art,
  className,
}: ProjectCoverProps) {
  if (project.coverImage) {
    return (
      <Image
        src={project.coverImage}
        alt={`${project.title} — cover`}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", mono && "cover-mono", className)}
      />
    );
  }
  return <GeneratedCover project={project} index={index} art={art} className={className} />;
}

/**
 * The notched corner with its round arrow button, for a cover inside a
 * `group` link (see .notch in globals.css).
 */
export function NotchArrow() {
  return (
    <span aria-hidden className="notch">
      <span className="absolute bottom-0 right-0 flex h-11 w-11 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-500 ease-out-expo group-hover:-rotate-45 md:h-14 md:w-14">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 md:h-5 md:w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
        >
          <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  );
}

const W = 1600;
const H = 1000;
const LINE = "rgb(241 239 233 / 0.2)";
const VOLT = "#c6f135";

/** The motif's box is roughly x 940–1480, y 150–650; art mode centers it, enlarged. */
const ART_MOTIF = "translate(800 500) scale(1.55) translate(-1210 -400)";

function GeneratedCover({
  project,
  index,
  art,
  className,
}: {
  project: CoverProject;
  index: number;
  art?: boolean;
  className?: string;
}) {
  const glowAt = art ? "50% 0%" : index % 2 === 0 ? "88% 0%" : "8% 0%";

  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{
        backgroundColor: "#16170f",
        backgroundImage: `radial-gradient(ellipse 70% 80% at ${glowAt}, rgb(198 241 53 / 0.24), transparent 70%)`,
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={`${project.title} — cover`}
      >
        <g
          fill="none"
          stroke={LINE}
          strokeWidth={art ? 1.8 : 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={art ? ART_MOTIF : undefined}
        >
          <Motif kind={motifFor(project)} />
        </g>
        {!art && <PosterText project={project} index={index} />}
      </svg>
    </div>
  );
}

function PosterText({ project, index }: { project: CoverProject; index: number }) {
  const lines = titleLines(project.title.toUpperCase());
  const longest = Math.max(...lines.map((l) => l.length));
  // Anton caps run ~0.5em wide. Fit the longest line into ~80% of the width,
  // clear of the notched corner cards cut into the bottom right.
  const size = Math.min(280, 1200 / (longest * 0.5));
  const lead = 0.92 * size;
  const baseline = 880;
  const titleTop = baseline - lead * (lines.length - 1) - size * 0.78;

  return (
    <>
      <text
        x={1480}
        y={140}
        textAnchor="end"
        className="font-grotesk"
        fontSize={26}
        letterSpacing={7}
        fill="rgb(241 239 233 / 0.55)"
      >
        {`N°${String(index + 1).padStart(2, "0")} — ${categoryLabels[project.category].toUpperCase()}`}
      </text>

      {project.tags[0] && (
        <text x={116} y={titleTop - 34} className="font-serif" fontSize={78} fill={VOLT}>
          {project.tags[0]}
        </text>
      )}
      {lines.map((line, i) => (
        <text
          key={line}
          x={108}
          y={baseline - lead * (lines.length - 1 - i)}
          className="font-display"
          fontSize={size}
          fill="#f5f5f3"
        >
          {line}
        </text>
      ))}
    </>
  );
}

/** One line, or two balanced ones for long multi-word titles. */
function titleLines(title: string): string[] {
  const words = title.split(/\s+/);
  if (title.length <= 14 || words.length < 2) return [title];
  let best = [title];
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const diff = Math.abs(a.length - b.length);
    if (diff < bestDiff) {
      best = [a, b];
      bestDiff = diff;
    }
  }
  return best;
}

type MotifKind = "phone" | "browser" | "chat" | "viewfinder" | "network";

function motifFor(project: CoverProject): MotifKind {
  const tags = project.tags.join(" ").toLowerCase();
  if (project.category === "MOBILE") return "phone";
  if (/vision|camera|image/.test(tags)) return "viewfinder";
  if (/nlp|chat|conversational|llm/.test(tags)) return "chat";
  if (project.category === "WEB") return "browser";
  return "network";
}

/** Line drawings in the poster's upper right (roughly x 940–1480, y 180–560). */
function Motif({ kind }: { kind: MotifKind }) {
  switch (kind) {
    case "phone":
      return (
        <g transform="rotate(-9 1230 380)">
          <rect x={1095} y={150} width={270} height={500} rx={44} />
          <rect x={1195} y={172} width={70} height={16} rx={8} />
          <rect x={1125} y={222} width={210} height={110} rx={18} stroke={VOLT} />
          <rect x={1125} y={350} width={98} height={86} rx={16} />
          <rect x={1237} y={350} width={98} height={86} rx={16} />
          <path d="M1125 470 H1335 M1125 505 H1290 M1125 540 H1310" />
          <circle cx={1150} cy={262} r={14} fill={VOLT} stroke="none" />
          <path d="M1180 256 H1290 M1180 284 H1250" stroke={VOLT} />
        </g>
      );
    case "browser":
      return (
        <g>
          <rect x={940} y={190} width={540} height={360} rx={22} />
          <path d="M940 240 H1480" />
          <circle cx={972} cy={215} r={7} />
          <circle cx={996} cy={215} r={7} />
          <circle cx={1020} cy={215} r={7} />
          <rect x={975} y={275} width={230} height={150} rx={12} stroke={VOLT} />
          <path d="M1235 290 H1440 M1235 325 H1400 M1235 360 H1420 M975 470 H1440 M975 505 H1320" />
        </g>
      );
    case "chat":
      return (
        <g>
          <path d="M960 200 H1300 A24 24 0 0 1 1324 224 V330 A24 24 0 0 1 1300 354 H1010 L968 392 V354 A24 24 0 0 1 960 330 Z" />
          <path d="M996 250 H1270 M996 295 H1200" />
          <path
            d="M1140 410 H1456 A24 24 0 0 1 1480 434 V520 A24 24 0 0 1 1456 544 H1440 V584 L1398 544 H1140 A24 24 0 0 1 1116 520 V434 A24 24 0 0 1 1140 410 Z"
            stroke={VOLT}
          />
          <circle cx={1250} cy={477} r={12} fill={VOLT} stroke="none" />
          <circle cx={1298} cy={477} r={12} fill={VOLT} stroke="none" opacity={0.7} />
          <circle cx={1346} cy={477} r={12} fill={VOLT} stroke="none" opacity={0.4} />
        </g>
      );
    case "viewfinder": {
      // Corner brackets around a voice waveform: sign in, speech out.
      const bars = [40, 90, 150, 70, 190, 120, 60, 160, 100, 46, 130, 80, 30];
      return (
        <g>
          <path
            d="M950 250 V200 H1010 M1420 200 H1480 V250 M1480 510 V560 H1420 M1010 560 H950 V510"
            strokeWidth={4}
          />
          <path d="M1205 210 V230 M1205 530 V550 M960 380 H980 M1430 380 H1450" />
          {bars.map((h, i) => (
            <path
              key={i}
              d={`M${1031 + i * 29} ${380 - h / 2} V${380 + h / 2}`}
              stroke={i === 4 || i === 7 ? VOLT : LINE}
              strokeWidth={9}
            />
          ))}
        </g>
      );
    }
    case "network": {
      const cols = [
        { x: 990, ys: [250, 380, 510] },
        { x: 1200, ys: [200, 320, 440, 560] },
        { x: 1420, ys: [300, 460] },
      ];
      const edges: string[] = [];
      for (let c = 0; c < cols.length - 1; c++)
        for (const a of cols[c]!.ys)
          for (const b of cols[c + 1]!.ys)
            edges.push(`M${cols[c]!.x} ${a} L${cols[c + 1]!.x} ${b}`);
      return (
        <g>
          <path d={edges.join(" ")} strokeWidth={1.5} />
          {cols.flatMap((col, c) =>
            col.ys.map((y, i) => (
              <circle
                key={`${c}-${i}`}
                cx={col.x}
                cy={y}
                r={c === 1 && i === 1 ? 20 : 15}
                fill={c === 1 && i === 1 ? VOLT : "#16170f"}
                stroke={c === 1 && i === 1 ? "none" : LINE}
              />
            )),
          )}
        </g>
      );
    }
  }
}
