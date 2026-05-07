import React from "react";
import { Box, Button, Grid2, Link, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CERT_PREVIEW_TEXTS = [
  '"The quiet erosion of trust in online writing has been years in the making. What changed wasn\'t the quality of the writing — it was our ability to know who wrote it..."',
  '"After three months of research, the patterns became impossible to ignore..."',
  '"What I found in those archives changed how I understood the entire story..."',
];

const REFERENCES = [
  {
    href: "https://artificialintelligenceact.eu/article/50/",
    id: "ref-1",
    num: "1",
    tags: [
      { label: "Official", kind: "official" },
      { label: "EU Law", kind: "law" },
    ],
    title: "EU AI Act — Article 50: Transparency Obligations",
    source: "artificialintelligenceact.eu · Enforcement: 2 August 2026",
    url: "artificialintelligenceact.eu/article/50/",
  },
  {
    href: "https://harris-sliwoski.com/chinalawblog/chinas-new-ai-labeling-rules-what-every-china-business-needs-to-know/",
    id: "ref-2",
    num: "2",
    tags: [
      { label: "China Law", kind: "law" },
      { label: "Analysis", kind: "news" },
    ],
    title: "China's Administrative Measures for Labeling of AI-Generated Content",
    source: "Harris Sliwoski LLP · In effect September 1, 2025",
    url: "harris-sliwoski.com/chinalawblog/chinas-new-ai-labeling-rules",
  },
  {
    href: "https://www.congress.gov/bill/119th-congress/senate-bill/1396/text",
    id: "ref-3",
    num: "3",
    tags: [
      { label: "Official", kind: "official" },
      { label: "US Senate", kind: "law" },
    ],
    title: "COPIED Act — S.1396, 119th Congress (2025–2026)",
    source:
      "congress.gov · Content Origin Protection and Integrity from Edited and Deepfaked Media Act",
    url: "congress.gov/bill/119th-congress/senate-bill/1396/text",
  },
  {
    href: "https://legiscan.com/CA/text/AB3211/id/3008403",
    id: "ref-4",
    num: "4",
    tags: [
      { label: "Official", kind: "official" },
      { label: "California Law", kind: "law" },
    ],
    title:
      "California Provenance, Authenticity and Watermarking Standards Act (AB3211)",
    source:
      "LegiScan · Effective February 1, 2025 (platforms March 1, 2025)",
    url: "legiscan.com/CA/text/AB3211/id/3008403",
  },
  {
    href: "https://www.commerce.senate.gov/press/dem/release/cantwell-blackburn-heinrich-reintroduce-bipartisan-bill-to-increase-transparency-combat-ai-deepfakes-put-journalists-artists-songwriters-back-in-control-of-their-content-2025-4/",
    id: "ref-5",
    num: "5",
    tags: [
      { label: "Official", kind: "official" },
      { label: "Press Release", kind: "news" },
    ],
    title:
      "Cantwell, Blackburn, Heinrich Reintroduce COPIED Act — Senate Commerce Committee",
    source:
      "commerce.senate.gov · April 10, 2025 · Includes Public Citizen poll: 79% of people worry online info is fake",
    url: "commerce.senate.gov · COPIED Act reintroduction press release",
  },
  {
    href: "https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content",
    id: "ref-6",
    num: "6",
    tags: [
      { label: "Official", kind: "official" },
      { label: "EU Commission", kind: "law" },
    ],
    title: "EU Code of Practice on Marking and Labelling of AI-Generated Content",
    source:
      "European Commission Digital Strategy · Multi-layered watermarking approach; final code expected June 2026",
    url: "digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content",
  },
  {
    href: "https://www.twobirds.com/en/insights/2025/new-ai-content-labelling-rules-in-china-what-are-they-and-how-do-they-compare-to-the-eu-ai-act",
    id: "ref-7",
    num: "7",
    tags: [{ label: "Legal Analysis", kind: "news" }],
    title: "China vs EU AI Content Labelling Rules — Comparative Analysis",
    source:
      "Bird & Bird LLP · March 2025 · Compares China's Measures with EU AI Act Article 50",
    url: "twobirds.com/en/insights/2025/new-ai-content-labelling-rules-in-china",
  },
  {
    href: "https://www.hsfkramer.com/notes/ip/2026-03/transparency-obligations-for-ai-generated-content-under-the-eu-ai-act-from-principle-to-practice",
    id: "ref-8",
    num: "8",
    tags: [{ label: "Legal Analysis", kind: "news" }],
    title: "EU AI Act Transparency Obligations: From Principle to Practice",
    source:
      "Herbert Smith Freehills Kramer · March 2026 · Analysis of second draft Code of Practice",
    url: "hsfkramer.com/notes/ip/2026-03/transparency-obligations-eu-ai-act",
  },
  {
    href: "https://www.jonesday.com/en/insights/2026/01/european-commission-publishes-draft-code-of-practice-on-ai-labelling-and-transparency",
    id: "ref-9",
    num: "9",
    tags: [{ label: "Legal Analysis", kind: "news" }],
    title: "European Commission Publishes Draft Code of Practice on AI Labelling",
    source:
      "Jones Day · January 2026 · Article 50 multi-layered compliance obligations",
    url: "jonesday.com/en/insights/2026/01/european-commission-publishes-draft-code",
  },
  {
    href: "https://c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html",
    id: "ref-10",
    num: "10",
    tags: [
      { label: "Standard", kind: "official" },
      { label: "ISO", kind: "law" },
    ],
    title:
      "C2PA Specification v2.1 — Coalition for Content Provenance and Authenticity",
    source:
      "c2pa.org · ISO/IEC 22144 · Founding members: Adobe, Microsoft, BBC, Intel, Sony, OpenAI, Google, Meta",
    url: "c2pa.org/specifications/specifications/2.1/",
  },
];

const TOKEN_MECHANICS = [
  { icon: "🏦", label: "Genesis supply", value: "1,000,000 HPN", val: "ink" },
  { icon: "🔒", label: "Stake tiers", value: "0 · 50 · 200 HPN", val: "amber" },
  { icon: "✅", label: "Standard reward", value: "+ 10 HPN", val: "green" },
  {
    icon: "⭐",
    label: "Founding member reward",
    value: "+ 20 HPN + 500 bonus",
    val: "green",
  },
  {
    icon: "⏳",
    label: "Full dispute window",
    value: "7 · 30 · 90 days",
    val: "ink",
  },
  {
    icon: "🔔",
    label: "Soft dispute window",
    value: "Up to 1 year",
    val: "ink",
  },
  { icon: "🤖", label: "Oracle dispute", value: "Indefinite", val: "ink" },
  {
    icon: "⚡",
    label: "Slash on fraud (full tier)",
    value: "- 30% stake",
    val: "red",
  },
  {
    icon: "🎯",
    label: "Trust score",
    value: "0 – 100 composite",
    val: "ink",
  },
  { icon: "🔗", label: "Chain", value: "Polygon / ERC-20", val: "ink" },
];

const TOKEN_POINTS = [
  {
    title:
      "Stake makes the badge trustworthy — and higher stake earns longer protection",
    body: "Stake 0 HPN and your full dispute window is 7 days. Stake 50 HPN and it extends to 30 days. Stake 200 HPN and it extends to 90 days. More skin in the game signals more confidence — and earns a higher trust score visible to every platform.",
  },
  {
    title: "No certified content is ever permanently immune",
    body: "After the full financial window closes, a soft dispute can still flag a badge up to one year. After that, trusted AI detection oracles can flag old content indefinitely if their confidence score exceeds 85/100. Honest certifiers have nothing to fear. Fraudsters have nowhere to hide.",
  },
  {
    title: "Watchdogs get paid to catch fraud",
    body: "When a full-tier dispute is upheld, the fraudster loses 30% of their stake. Half of that slash goes directly to the person who caught them as a bounty. This creates a self-funding fraud detection layer — bad actors pay for their own policing.",
  },
  {
    title: "Your trust score is a composite signal platforms can act on",
    body: "Every certification carries a 0–100 trust score built from reputation history (up to 40 pts), stake tier (up to 30 pts), Worldcoin human verification (20 pts), founding member status (5 pts), and survived-dispute bonus (5 pts). Platforms can gate badge display on a minimum score.",
  },
  {
    title: "No central authority controls it",
    body: "Your certifications, reputation score, and HPN balance live on-chain permanently. No company can revoke them, sell them, or shut them down. Your trust score is yours.",
  },
];

function refTagSx(hp, kind) {
  const map = {
    official: { bgcolor: hp.tagOfficialBg, color: hp.tagOfficial },
    law: { bgcolor: hp.amberLight, color: hp.amber },
    study: { bgcolor: hp.greenLight, color: hp.green },
    news: { bgcolor: "#e8e4dc", color: hp.muted },
  };
  return {
    display: "inline-block",
    fontSize: 9,
    letterSpacing: "0.06em",
    px: 0.875,
    py: 0.25,
    borderRadius: 2.5,
    mr: 0.5,
    mb: 0.5,
    fontWeight: 500,
    ...map[kind],
  };
}

function mechanicValueSx(hp, val, th) {
  const colors = {
    green: hp.green,
    amber: hp.amber,
    red: hp.red,
    ink: hp.ink,
  };
  return {
    fontFamily: th.fontFamily,
    fontWeight: 700,
    fontSize: 14,
    color: colors[val] || hp.ink,
  };
}

function CiteRef({ href, title, children, hp, dark }) {
  return (
    <Link
      href={href}
      title={title}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 16,
        height: 16,
        bgcolor: dark ? hp.certMuted : hp.ink,
        color: hp.paper,
        borderRadius: "50%",
        fontSize: 9,
        fontWeight: 700,
        textDecoration: "none",
        ml: 0.25,
        verticalAlign: "super",
        lineHeight: 1,
        flexShrink: 0,
        fontFamily: (t) => t.typography.humanProofBody.fontFamily,
        "&:hover": { bgcolor: hp.greenAccent },
      }}
    >
      {children}
    </Link>
  );
}

function SectionTag({ children, hp, subtle }) {
  return (
    <Typography
      component="div"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        fontSize: 11,
        letterSpacing: "0.1em",
        color: subtle ? hp.certMuted : hp.muted,
        textTransform: "uppercase",
        mb: 2.5,
        fontWeight: 500,
        "&::before": {
          content: '""',
          width: 20,
          height: 1,
          bgcolor: subtle ? hp.certMuted : hp.muted,
        },
      }}
    >
      {children}
    </Typography>
  );
}

function PersonaTabButton({ active, onClick, children, hp }) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disableRipple
      sx={{
        px: 3,
        py: 1.25,
        borderRadius: 1,
        textTransform: "none",
        fontFamily: (t) => t.typography.humanProofBody.fontFamily,
        fontSize: 13,
        letterSpacing: "0.02em",
        minWidth: "auto",
        border: "none",
        bgcolor: active ? hp.ink : "transparent",
        color: active ? hp.paper : hp.muted,
        "&:hover": { bgcolor: active ? hp.ink : hp.paper2 },
      }}
    >
      {children}
    </Button>
  );
}

export function LandingContent({
  activePersona,
  setActivePersona,
  certPreviewIndex,
  email,
  setEmail,
  onWaitlist,
  waitlistStatus,
}) {
  const theme = useTheme();
  const hp = theme.humanProof;
  const th = theme.typography.humanProofHeading;
  const tb = theme.typography.humanProofBody;
  const ts = theme.typography.humanProofSerif;
  const certText = CERT_PREVIEW_TEXTS[certPreviewIndex % CERT_PREVIEW_TEXTS.length];

  const sectionPad = { px: { xs: 3, md: 9 }, py: { xs: 7.5, md: 12.5 } };

  return (
    <Box
      sx={{
        bgcolor: hp.paper,
        color: hp.ink,
        ...tb,
        overflowX: "hidden",
      }}
    >
      {/* Hero */}
      <Grid2
        container
        sx={{
          minHeight: { md: "100vh" },
          pt: { xs: 4, md: 6 },
          ...sectionPad,
        }}
      >
        <Grid2 size={{ xs: 12, md: 6 }} sx={{ py: { xs: 4, md: 10 }, pr: { md: 6 } }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: hp.amberLight,
              border: `1px solid ${hp.amber}`,
              borderRadius: 0.25,
              px: 1.75,
              py: 0.75,
              fontSize: 11,
              letterSpacing: "0.08em",
              color: hp.amber,
              fontWeight: 500,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: hp.amber,
                animation: "hpBlink 1.4s ease-in-out infinite",
                "@keyframes hpBlink": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.2 },
                },
              }}
            />
            EU AI Act · COPIED Act · CA SB 942 now in effect
          </Box>

          <Typography
            sx={{
              ...th,
              fontSize: { xs: "2.5rem", md: "clamp(2.5rem, 4.5vw, 4.25rem)" },
              mb: 1.5,
            }}
          >
            The internet
            <br />
            needs a
            <br />
            <Box component="em" sx={{ ...ts, color: hp.green }}>
              human stamp.
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: 16,
              color: hp.muted,
              lineHeight: 1.65,
              mb: 5,
              maxWidth: 440,
              fontWeight: 300,
            }}
          >
            Governments are forcing AI to identify itself.{" "}
            <Box component="strong" sx={{ color: hp.ink, fontWeight: 500 }}>
              HumanProof Network
            </Box>{" "}
            is the other side of that equation — cryptographic, on-chain proof
            that your content was made by a human. Backed by real economic
            stake.
          </Typography>

          <Box sx={{ display: "flex", gap: 1.75, flexWrap: "wrap", mb: 6 }}>
            <Button
              component="a"
              href="#waitlist"
              variant="contained"
              sx={{
                bgcolor: hp.ink,
                color: hp.paper,
                px: 3.5,
                py: 1.75,
                ...th,
                fontSize: 14,
                letterSpacing: "0.04em",
                textTransform: "none",
                borderRadius: 1,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: hp.ink,
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 20px #0a0a0844",
                },
              }}
            >
              Join the Founding 1,000
            </Button>
            <Button
              component="a"
              href="#how"
              sx={{
                color: hp.ink,
                fontFamily: tb.fontFamily,
                fontSize: 13,
                textTransform: "none",
                opacity: 0.7,
                "&:hover": { opacity: 1, bgcolor: "transparent" },
              }}
            >
              See how it works →
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
            {[
              ["0–200", "HPN stake tiers"],
              ["C2PA", "ISO standard signing"],
              ["0–100", "Composite trust score"],
            ].map(([num, label], i) => (
              <React.Fragment key={label}>
                {i > 0 && (
                  <Box sx={{ width: 1, height: 32, bgcolor: hp.border }} />
                )}
                <Box>
                  <Typography
                    sx={{
                      ...th,
                      fontSize: 24,
                      color: hp.ink,
                      lineHeight: 1,
                    }}
                  >
                    {num}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: hp.muted,
                      letterSpacing: "0.06em",
                      mt: 0.5,
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              </React.Fragment>
            ))}
          </Box>
        </Grid2>

        <Grid2
          size={{ xs: 12, md: 6 }}
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            bgcolor: hp.ink,
            position: "relative",
            p: 6,
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 30% 50%, #1a4a2a44 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #0a2a1a33 0%, transparent 50%)",
            },
          }}
        >
          <Box
            sx={{
              bgcolor: hp.certBg,
              border: `1px solid ${hp.certBorder}`,
              borderRadius: 3,
              p: 3.5,
              width: "100%",
              maxWidth: 380,
              position: "relative",
              zIndex: 1,
              fontFamily: tb.fontFamily,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "#1a2a1c",
                  border: "1px solid #2db86644",
                  borderRadius: 2.5,
                  px: 1.75,
                  py: 0.75,
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    bgcolor: hp.greenAccent,
                    boxShadow: "0 0 8px #2db866",
                    animation: "hpPulse 2s ease-in-out infinite",
                    "@keyframes hpPulse": {
                      "0%, 100%": { boxShadow: "0 0 4px #2db866" },
                      "50%": { boxShadow: "0 0 14px #2db866" },
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 11,
                    color: hp.greenAccent,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                  }}
                >
                  HUMAN VERIFIED
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 10, color: hp.certMuted }}>
                2 mins ago
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: hp.certInner,
                border: `1px solid ${hp.certBorder}`,
                borderRadius: 1.5,
                p: 1.75,
                mb: 2,
                fontSize: 12,
                color: hp.certText,
                lineHeight: 1.6,
              }}
            >
              <Typography
                component="strong"
                sx={{
                  color: "#aaa99a",
                  display: "block",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  mb: 0.75,
                }}
              >
                CONTENT PREVIEW
              </Typography>
              {certText}
            </Box>

            {[
              ["CONTENT HASH", "0x4f2a...8c3e", false],
              ["C2PA MANIFEST", "✓ ipfs://Qm3x...f9a", true],
              ["CHAIN", "Polygon · block 58,441,203", false],
            ].map(([label, val, green]) => (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.25,
                  borderBottom: `1px solid ${hp.certBorder}`,
                  fontSize: 11,
                }}
              >
                <Typography
                  sx={{ color: hp.certMuted, letterSpacing: "0.04em" }}
                >
                  {label}
                </Typography>
                <Typography
                  sx={{
                    color: green ? hp.greenAccent : hp.certText,
                    fontFamily: tb.fontFamily,
                  }}
                >
                  {val}
                </Typography>
              </Box>
            ))}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                mt: 2,
                p: 1.5,
                bgcolor: hp.certInner,
                borderRadius: 1.5,
                border: `1px solid ${hp.certBorder}`,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, #1a4a2a, ${hp.greenAccent})`,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 11, color: "#888880", mb: 0.25 }}>
                  0x7f3a...2b1c
                </Typography>
                <Typography sx={{ fontSize: 10, color: hp.certMuted }}>
                  Reputation: 47 · 47 certifications
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1.75,
                px: 1.75,
                py: 1.25,
                bgcolor: "#0f1a11",
                border: "1px solid #1a3a1e",
                borderRadius: 1.5,
              }}
            >
              <Typography sx={{ fontSize: 11, color: hp.greenAccent }}>
                + 20 HPN earned{" "}
                <Box component="span" sx={{ fontSize: 9, opacity: 0.7 }}>
                  (founding member)
                </Box>
              </Typography>
              <Typography sx={{ fontSize: 11, color: hp.certMuted }}>
                50 HPN staked · trust 72/100
              </Typography>
            </Box>
          </Box>
        </Grid2>
      </Grid2>

      {/* Problem */}
      <Box sx={{ ...sectionPad, bgcolor: hp.ink, color: hp.paper }}>
        <SectionTag hp={hp} subtle>
          The problem
        </SectionTag>
        <Typography sx={{ ...th, fontSize: { xs: 32, md: 48 }, color: hp.paper, mb: 2 }}>
          Three crises.
          <br />
          One solution.
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
            color: "#888880",
            lineHeight: 1.7,
            maxWidth: 560,
            fontWeight: 300,
            mb: 0,
          }}
        >
          The content authenticity problem is not one crisis — it is three,
          converging simultaneously. HumanProof addresses all three.
        </Typography>

        <Grid2
          container
          sx={{
            mt: 8,
            borderRadius: 2,
            overflow: "hidden",
            border: `1px solid #1e1e18`,
            bgcolor: "#1e1e18",
            gap: "1px",
          }}
        >
          {[
            {
              icon: "✍️",
              title: "Creators are losing work to AI doubt",
              body: (
                <>
                  Clients can no longer tell if the writer they hired produced
                  the work. Rates are falling. Trust is collapsing. Freelancers
                  who write every word themselves have no way to prove it.
                  <CiteRef
                    hp={hp}
                    dark
                    href="#ref-5"
                    title="Public Citizen poll: 79% worry online info is fake"
                  >
                    1
                  </CiteRef>
                </>
              ),
            },
            {
              icon: "🌐",
              title: "Publishers can't verify what they publish",
              body: (
                <>
                  AI-generated slop floods submission inboxes. Editors run AI
                  detectors that are wrong 30% of the time. Advertisers are
                  pulling spend from sites they can&apos;t verify. The trust
                  stack is broken.
                  <CiteRef
                    hp={hp}
                    dark
                    href="#ref-6"
                    title="C2PA / Adobe Content Credentials standard"
                  >
                    2
                  </CiteRef>
                </>
              ),
            },
            {
              icon: "⚖️",
              title: "Regulators are demanding disclosure",
              body: (
                <>
                  The EU AI Act, China&apos;s watermarking mandate, and the US
                  COPIED Act all require AI content to identify itself. Platforms
                  face nine-figure fines for non-compliance. The infrastructure
                  doesn&apos;t exist yet.
                  <CiteRef hp={hp} dark href="#ref-1" title="EU AI Act Article 50">
                    3
                  </CiteRef>
                  <CiteRef hp={hp} dark href="#ref-3" title="COPIED Act S.1396">
                    4
                  </CiteRef>
                </>
              ),
            },
          ].map((card) => (
            <Grid2 key={card.title} size={{ xs: 12, md: 4 }} sx={{ bgcolor: hp.ink, p: 4 }}>
              <Typography sx={{ fontSize: 28, mb: 2, display: "block" }}>
                {card.icon}
              </Typography>
              <Typography
                sx={{
                  ...th,
                  fontSize: 17,
                  color: hp.paper,
                  mb: 1.25,
                  lineHeight: 1.2,
                }}
              >
                {card.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  color: "#666660",
                  lineHeight: 1.65,
                  fontWeight: 300,
                }}
              >
                {card.body}
              </Typography>
            </Grid2>
          ))}
        </Grid2>
      </Box>

      {/* Regulation */}
      <Box id="regulation" sx={{ ...sectionPad, bgcolor: hp.paper2 }}>
        <SectionTag hp={hp}>Regulatory tailwind</SectionTag>
        <Typography sx={{ ...th, fontSize: { xs: 32, md: 48 }, mb: 2 }}>
          Governments are
          <br />
          forcing AI to
          <br />
          <Box component="em" sx={ts}>
            show its hand.
          </Box>
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
            color: hp.muted,
            lineHeight: 1.7,
            maxWidth: 560,
            fontWeight: 300,
            mb: 6,
          }}
        >
          Every major jurisdiction is mandating that AI-generated content carry
          an identifier. That creates a binary the internet has never had
          before — and HumanProof sits on the human side of it.
        </Typography>

        <Grid2 container spacing={{ xs: 4, md: 10 }}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                {
                  flag: "🇨🇳",
                  name: (
                    <>
                      China Deep Synthesis Law{" "}
                      <CiteRef
                        hp={hp}
                        href="#ref-2"
                        title="China AI Content Labeling Measures, Sept 2025"
                      >
                        5
                      </CiteRef>
                    </>
                  ),
                  desc: "Every piece of AI-generated content must carry both visible and invisible watermarks. Altering or removing these identifiers is illegal.",
                  status: "In effect Sept 2025",
                  statusSx: { bgcolor: hp.greenLight, color: hp.green },
                },
                {
                  flag: "🇪🇺",
                  name: (
                    <>
                      EU AI Act — Article 50{" "}
                      <CiteRef
                        hp={hp}
                        href="#ref-1"
                        title="EU AI Act Article 50 official text"
                      >
                        3
                      </CiteRef>
                    </>
                  ),
                  desc: "General-purpose AI systems must embed machine-readable markings in all synthetic outputs. Fines up to €15M or 3% of global turnover for non-compliance.",
                  status: "Enforcement Aug 2026",
                  statusSx: { bgcolor: hp.amberLight, color: hp.amber },
                },
                {
                  flag: "🇺🇸",
                  name: (
                    <>
                      COPIED Act (US Senate){" "}
                      <CiteRef
                        hp={hp}
                        href="#ref-3"
                        title="COPIED Act S.1396 Congress.gov"
                      >
                        4
                      </CiteRef>
                    </>
                  ),
                  desc: "Mandates content provenance standards and watermarking for AI-generated material under NIST guidance. Prohibits removal of provenance data.",
                  status: "Reintroduced April 2025",
                  statusSx: { bgcolor: hp.amberLight, color: hp.amber },
                },
                {
                  flag: "🇺🇸",
                  name: (
                    <>
                      California AI Transparency Act{" "}
                      <CiteRef
                        hp={hp}
                        href="#ref-4"
                        title="California AB3211 / SB 942"
                      >
                        6
                      </CiteRef>
                    </>
                  ),
                  desc: "Targets generative AI systems with over 1 million monthly users. Requires watermarking and provenance disclosure for all AI-generated content.",
                  status: "Effective Jan 2026",
                  statusSx: { bgcolor: "#e8e4dc", color: hp.muted },
                },
              ].map((law) => (
                <Box
                  key={law.status}
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 2.5,
                    bgcolor: hp.white,
                    border: `1px solid ${hp.border}`,
                    borderRadius: 1.5,
                    transition: "border-color 0.2s, transform 0.2s",
                    "&:hover": {
                      borderColor: hp.green,
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: 22, lineHeight: 1, mt: 0.25 }}>
                    {law.flag}
                  </Typography>
                  <Box>
                    <Typography
                      sx={{
                        ...th,
                        fontSize: 14,
                        color: hp.ink,
                        mb: 0.5,
                      }}
                    >
                      {law.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: hp.muted,
                        lineHeight: 1.55,
                        fontWeight: 300,
                      }}
                    >
                      {law.desc}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 10,
                        display: "inline-block",
                        mt: 0.75,
                        px: 1,
                        py: 0.25,
                        borderRadius: 2.5,
                        letterSpacing: "0.04em",
                        fontWeight: 500,
                        ...law.statusSx,
                      }}
                    >
                      {law.status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }} sx={{ position: { md: "sticky" }, top: { md: 24 } }}>
            <Box
              sx={{
                bgcolor: hp.ink,
                color: hp.paper,
                borderRadius: 2,
                p: 4.5,
                mb: 2.5,
              }}
            >
              <Typography sx={{ ...th, fontSize: 20, color: hp.paper, mb: 2 }}>
                Why this is your biggest tailwind
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  color: "#888880",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  mb: 2.5,
                }}
              >
                Once AI watermarking is universal and mandatory, the internet
                splits into two categories. Content with an AI stamp is
                machine-made. Content without one is unverified.
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "center",
                  gap: 2,
                  my: 2.5,
                }}
              >
                <Box sx={{ height: 1, bgcolor: "#2a2a24" }} />
                <Typography
                  sx={{
                    fontSize: 10,
                    color: hp.certMuted,
                    letterSpacing: "0.1em",
                    whiteSpace: "nowrap",
                  }}
                >
                  THE NEW BINARY
                </Typography>
                <Box sx={{ height: 1, bgcolor: "#2a2a24" }} />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    bgcolor: "#1a0a0a",
                    border: "1px solid #3a1a1a",
                    borderRadius: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 18 }}>🤖</Typography>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: "#cc6666", fontWeight: 500, mb: 0.25 }}>
                      AI Watermark Present
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: hp.certMuted }}>
                      &quot;This was made by a machine&quot;
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    bgcolor: "#0a1a0f",
                    border: "1px solid #1a3a20",
                    borderRadius: 1,
                  }}
                >
                  <Typography sx={{ fontSize: 18 }}>✋</Typography>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: hp.greenAccent, fontWeight: 500, mb: 0.25 }}>
                      HumanProof Cert Present
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: hp.certMuted }}>
                      &quot;A verified human made this — and staked money on it&quot;
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography
                sx={{
                  fontSize: 13,
                  color: hp.greenAccent,
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                HumanProof fills the human side of this gap.
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2.5,
                bgcolor: hp.amberLight,
                border: `1px solid ${hp.amber}`,
                borderRadius: 1.5,
              }}
            >
              <Typography sx={{ ...th, fontSize: 13, color: hp.amber, mb: 1 }}>
                Compliance angle for platforms
              </Typography>
              <Typography sx={{ fontSize: 12, color: hp.amber, opacity: 0.8, lineHeight: 1.6, fontWeight: 300 }}>
                Publishers integrating HumanProof don&apos;t just get a trust
                badge — they get documented, auditable evidence of content
                provenance that satisfies regulatory disclosure requirements.
              </Typography>
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      {/* How */}
      <Box id="how" sx={{ ...sectionPad, bgcolor: hp.white }}>
        <SectionTag hp={hp}>How it works</SectionTag>
        <Typography sx={{ ...th, fontSize: { xs: 32, md: 48 }, mb: 2 }}>
          Four steps.
          <br />
          <Box component="em" sx={ts}>
            Permanent proof.
          </Box>
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
            color: hp.muted,
            lineHeight: 1.7,
            maxWidth: 560,
            fontWeight: 300,
            mb: 6,
          }}
        >
          Built on C2PA — the ISO standard used by Adobe, Microsoft, and the
          BBC — with an economic layer that makes the verification trustworthy.
        </Typography>

        <Grid2 container sx={{ bgcolor: hp.border, gap: "2px" }}>
          {[
            {
              n: "01",
              title: "Connect your wallet",
              body: "Link MetaMask in one click. Your wallet address becomes your permanent author identity on-chain. No username. No password. Just your cryptographic key.",
            },
            {
              n: "02",
              title: "Certify your content",
              body: "Paste your article, post, or document. The SDK builds a C2PA manifest — the same ISO standard Adobe uses — hashes it, and uploads it to IPFS.",
            },
            {
              n: "03",
              title: "Stake and sign",
              body: "Choose your stake level — 0, 50, or 200 HPN. Higher stake means a longer full dispute window and a higher trust score. Your wallet signs the hash. The contract verifies it. It is permanent.",
            },
            {
              n: "04",
              title: "Earn and share",
              body:
                "You earn 10 HPN immediately — or 20 HPN if you\u2019re a founding member. Your public profile updates with a composite trust score (0–100). Any platform can verify your certification for free, forever, on-chain.",
            },
          ].map((step, idx) => (
            <Grid2 key={step.n} size={{ xs: 12, sm: 6, md: 3 }} sx={{ bgcolor: hp.white, p: 3, position: "relative" }}>
              {idx < 3 && (
                <Box
                  sx={{
                    display: { xs: "none", md: "block" },
                    position: "absolute",
                    right: -1,
                    top: 32,
                    width: 2,
                    height: 40,
                    bgcolor: hp.border,
                  }}
                />
              )}
              <Typography
                sx={{
                  ...th,
                  fontSize: 48,
                  color: hp.border,
                  lineHeight: 1,
                  mb: 2,
                  letterSpacing: "-0.04em",
                }}
              >
                {step.n}
              </Typography>
              <Typography sx={{ ...th, fontSize: 16, color: hp.ink, mb: 1.25, lineHeight: 1.2 }}>
                {step.title}
              </Typography>
              <Typography sx={{ fontSize: 13, color: hp.muted, lineHeight: 1.6, fontWeight: 300 }}>
                {step.body}
              </Typography>
            </Grid2>
          ))}
        </Grid2>
      </Box>

      {/* Dispute */}
      <Box
        id="dispute"
        sx={{
          ...sectionPad,
          bgcolor: hp.paper2,
          borderTop: `1px solid ${hp.border}`,
        }}
      >
        <SectionTag hp={hp}>Dispute system</SectionTag>
        <Typography sx={{ ...th, fontSize: { xs: 32, md: 48 }, mb: 2 }}>
          Nothing is ever
          <br />
          <Box component="em" sx={ts}>
            permanently immune.
          </Box>
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
            color: hp.muted,
            lineHeight: 1.7,
            maxWidth: 560,
            fontWeight: 300,
            mb: 6,
          }}
        >
          No certified content can be permanently locked in as human if
          evidence later proves otherwise. Three tiers ensure financial
          consequences are time-bounded while accountability never expires.
        </Typography>

        <Grid2 container spacing={2} sx={{ mt: 1 }}>
          {[
            {
              accent: hp.red,
              label: "Tier 1 — Full",
              range: "0 – 90 days",
              sub: "Window scales with stake: 7 days (0 HPN) · 30 days (50 HPN) · 90 days (200 HPN)",
              lines: [
                "✗ 30% of stake slashed if upheld",
                "✓ 50% of slash paid as bounty to disputer",
                "✗ Badge fully revoked",
                "✗ Reputation −3 points",
              ],
            },
            {
              accent: hp.amber,
              label: "Tier 2 — Soft",
              range: "Day 31 – 1 year",
              sub: "Financial penalty window has closed. Reputational accountability remains open.",
              lines: [
                "— No financial penalty",
                "— Stake fully returned",
                "✗ Badge permanently flagged with warning",
                "✗ Reputation −3 points",
              ],
            },
            {
              accent: hp.green,
              label: "Tier 3 — Oracle / DAO",
              range: "1 year onwards",
              sub: "Only a trusted AI oracle (confidence ≥ 85/100) or DAO supermajority can raise a dispute.",
              lines: [
                "— No financial consequences",
                "— No closing date — ever",
                "✗ Badge permanently flagged if upheld",
                "✗ Reputation −3 points",
              ],
            },
          ].map((tier) => (
            <Grid2 key={tier.label} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  bgcolor: hp.white,
                  border: `1px solid ${hp.border}`,
                  borderTop: `3px solid ${tier.accent}`,
                  borderRadius: 2,
                  p: 3.5,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: tb.fontFamily,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: tier.accent,
                    mb: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  {tier.label}
                </Typography>
                <Typography sx={{ ...th, fontSize: 18, color: hp.ink, mb: 0.75 }}>
                  {tier.range}
                </Typography>
                <Typography sx={{ fontSize: 12, color: hp.muted, mb: 2, lineHeight: 1.6, fontWeight: 300 }}>
                  {tier.sub}
                </Typography>
                <Box sx={{ fontSize: 12, color: hp.ink, lineHeight: 1.7, fontWeight: 400 }}>
                  {tier.lines.map((line) => (
                    <Box key={line} sx={{ mb: 0.75 }}>
                      {line}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid2>
          ))}
        </Grid2>

        <Box
          sx={{
            mt: 3,
            p: 2.5,
            bgcolor: hp.greenLight,
            border: `1px solid ${hp.green}`,
            borderRadius: 1.5,
            fontSize: 13,
            color: hp.green,
            lineHeight: 1.6,
          }}
        >
          <Box component="strong" sx={{ ...th }}>
            The honest certifier&apos;s guarantee:
          </Box>{" "}
          If you never certify AI content as human, Tier 1 disputes will be
          rejected and you&apos;ll receive your full stake back plus a +2
          reputation bonus. Higher stake signals higher confidence — and earns
          a longer window for your certification to be verified as legitimate.
        </Box>
      </Box>

      {/* Token */}
      <Box id="token" sx={{ ...sectionPad, bgcolor: hp.paper, borderTop: `1px solid ${hp.border}` }}>
        <SectionTag hp={hp}>The HPN Token</SectionTag>
        <Typography sx={{ ...th, fontSize: { xs: 32, md: 48 }, mb: 2 }}>
          The badge means
          <br />
          something because
          <br />
          <Box component="em" sx={ts}>
            it costs something.
          </Box>
        </Typography>

        <Grid2 container spacing={{ xs: 4, md: 8 }} sx={{ mt: 2 }}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                width: 160,
                height: 160,
                background: "linear-gradient(145deg, #d4a844, #8a6620)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 32px #c4730a44, inset 0 2px 4px #ffffff22",
                mx: "auto",
                mb: 5,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 1,
                  borderRadius: "50%",
                  border: "1px solid #ffffff22",
                },
              }}
            >
              <Typography sx={{ ...th, fontSize: 36, color: hp.paper, letterSpacing: "-0.02em" }}>
                HPN
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {TOKEN_MECHANICS.map((row) => (
                <Box
                  key={row.label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2.5,
                    py: 2,
                    bgcolor: hp.white,
                    border: `1px solid ${hp.border}`,
                    borderRadius: 0.5,
                    "&:hover": { borderColor: hp.ink },
                  }}
                >
                  <Typography sx={{ fontSize: 13, color: hp.muted, display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Box component="span" sx={{ fontSize: 16 }}>
                      {row.icon}
                    </Box>
                    {row.label}
                  </Typography>
                  <Typography sx={mechanicValueSx(hp, row.val, th)}>{row.value}</Typography>
                </Box>
              ))}
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {TOKEN_POINTS.map((pt) => (
                <Box
                  key={pt.title}
                  sx={{
                    pl: 2.5,
                    borderLeft: `2px solid ${hp.border}`,
                    "&:hover": { borderColor: hp.green },
                  }}
                >
                  <Typography sx={{ ...th, fontSize: 15, color: hp.ink, mb: 0.75 }}>
                    {pt.title}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: hp.muted, lineHeight: 1.6, fontWeight: 300 }}>
                    {pt.body}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      {/* Personas */}
      <Box sx={{ ...sectionPad, bgcolor: hp.paper2 }}>
        <SectionTag hp={hp}>Who it&apos;s for</SectionTag>
        <Typography sx={{ ...th, fontSize: { xs: 32, md: 48 }, mb: 3 }}>
          Three people.
          <br />
          <Box component="em" sx={ts}>
            One network.
          </Box>
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            mb: 5,
            bgcolor: hp.paper,
            border: `1px solid ${hp.border}`,
            borderRadius: 1.5,
            p: 0.5,
            width: "fit-content",
            flexWrap: "wrap",
          }}
        >
          <PersonaTabButton active={activePersona === "writer"} onClick={() => setActivePersona("writer")} hp={hp}>
            Freelance Writer
          </PersonaTabButton>
          <PersonaTabButton active={activePersona === "publisher"} onClick={() => setActivePersona("publisher")} hp={hp}>
            Publisher
          </PersonaTabButton>
          <PersonaTabButton active={activePersona === "watchdog"} onClick={() => setActivePersona("watchdog")} hp={hp}>
            Watchdog
          </PersonaTabButton>
        </Box>

        {activePersona === "writer" && (
          <PersonaWriter hp={hp} th={th} tb={tb} ts={ts} />
        )}
        {activePersona === "publisher" && (
          <PersonaPublisher hp={hp} th={th} tb={tb} ts={ts} />
        )}
        {activePersona === "watchdog" && (
          <PersonaWatchdog hp={hp} th={th} tb={tb} ts={ts} />
        )}
      </Box>

      {/* Waitlist */}
      <Box
        id="waitlist"
        sx={{
          ...sectionPad,
          bgcolor: hp.ink,
          color: hp.paper,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 600,
            background: "radial-gradient(ellipse, #1a4a2a44 0%, transparent 70%)",
            pointerEvents: "none",
          },
        }}
      >
        <Typography
          sx={{
            ...th,
            fontSize: { xs: 36, md: 60 },
            color: hp.paper,
            mb: 2,
            position: "relative",
          }}
        >
          The internet is splitting
          <br />
          in two. Be on the
          <br />
          <Box component="em" sx={{ ...ts, color: hp.greenAccent }}>
            human side.
          </Box>
        </Typography>
        <Typography
          sx={{
            fontSize: 15,
            color: "#666660",
            lineHeight: 1.6,
            maxWidth: 500,
            mx: "auto",
            mb: 6,
            fontWeight: 300,
            position: "relative",
          }}
        >
          Join the founding 1,000 creators. Earn double HPN rewards for your
          first year, receive a permanent founding member badge, and help shape
          the governance of the network.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            maxWidth: 460,
            mx: "auto",
            mb: 3.5,
            flexDirection: { xs: "column", sm: "row" },
            position: "relative",
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "center",
          }}
        >
          <Box
            component="input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              flex: 1,
              py: 1.75,
              px: 2.25,
              bgcolor: hp.certBg,
              border: `1px solid ${hp.certBorder}`,
              borderRadius: 1,
              color: hp.paper,
              fontFamily: tb.fontFamily,
              fontSize: 14,
              outline: "none",
              "&:focus": { borderColor: hp.greenAccent },
              "&::placeholder": { color: hp.certMuted },
            }}
          />
          <Button
            type="button"
            onClick={onWaitlist}
            disabled={waitlistStatus === "submitting"}
            sx={{
              ...th,
              bgcolor: hp.greenAccent,
              color: hp.ink,
              px: 3,
              py: 1.75,
              fontSize: 14,
              textTransform: "none",
              borderRadius: 1,
              whiteSpace: "nowrap",
              "&:hover": { bgcolor: hp.greenAccent, opacity: 0.85 },
              ...(waitlistStatus === "success" && {
                bgcolor: "#1a5a3a",
                color: hp.greenAccent,
              }),
            }}
          >
            {waitlistStatus === "submitting"
              ? "Submitting..."
              : waitlistStatus === "success"
                ? "✓ You're on the list"
                : "Claim Your Spot"}
          </Button>
        </Box>
        {waitlistStatus === "invalid" && (
          <Typography sx={{ color: hp.amber, fontSize: 13, mb: 1, position: "relative" }}>
            Please enter a valid email address.
          </Typography>
        )}
        {waitlistStatus === "error" && (
          <Typography sx={{ color: hp.red, fontSize: 13, mb: 1, position: "relative" }}>
            Something went wrong. Please try again.
          </Typography>
        )}

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            fontSize: 12,
            color: hp.greenAccent,
            bgcolor: "#1a2a1c",
            border: "1px solid #2db86633",
            borderRadius: 2.5,
            px: 2,
            py: 0.75,
            position: "relative",
          }}
        >
          ✦ Founding members earn 20 HPN per cert for 12 months + 500 HPN welcome
          bonus
        </Box>
      </Box>

      {/* References */}
      <Box id="references" sx={{ ...sectionPad, bgcolor: hp.paper2, borderTop: `1px solid ${hp.border}` }}>
        <SectionTag hp={hp}>Sources &amp; References</SectionTag>
        <Typography sx={{ ...th, fontSize: 28, mb: 2 }}>Citations</Typography>
        <Typography sx={{ fontSize: 13, color: hp.muted, lineHeight: 1.7, maxWidth: 560, fontWeight: 300, mb: 4 }}>
          All claims on this page are sourced from official legislation,
          government publications, or established legal and policy analysis. Click
          any reference to read the primary source.
        </Typography>

        <Grid2 container spacing={1.25}>
          {REFERENCES.map((r) => (
            <Grid2 key={r.id} size={{ xs: 12, md: 6 }}>
              <Link
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                id={r.id}
                underline="none"
                sx={{
                  display: "flex",
                  gap: 1.75,
                  alignItems: "flex-start",
                  p: 2,
                  bgcolor: hp.white,
                  border: `1px solid ${hp.border}`,
                  borderRadius: 1.5,
                  transition: "border-color 0.2s, transform 0.15s",
                  "&:hover": { borderColor: hp.ink, transform: "translateX(3px)" },
                }}
              >
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    bgcolor: hp.ink,
                    color: hp.paper,
                    borderRadius: "50%",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontFamily: tb.fontFamily,
                    mt: 0.125,
                  }}
                >
                  {r.num}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {r.tags.map((t) => (
                    <Box
                      key={t.label}
                      component="span"
                      sx={refTagSx(hp, t.kind === "law" ? "law" : t.kind === "official" ? "official" : "news")}
                    >
                      {t.label}
                    </Box>
                  ))}
                  <Typography sx={{ ...th, fontSize: 13, color: hp.ink, mb: 0.5, lineHeight: 1.3 }}>
                    {r.title}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: hp.muted, mb: 0.5, fontWeight: 300 }}>
                    {r.source}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 10,
                      color: hp.green,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "block",
                      fontWeight: 400,
                    }}
                  >
                    {r.url}
                  </Typography>
                </Box>
              </Link>
            </Grid2>
          ))}
        </Grid2>
      </Box>

      {/* Evolving concept notice */}
      <Box
        sx={{
          px: { xs: 3, md: 9 },
          py: { xs: 4, md: 5 },
          bgcolor: hp.paper,
          borderTop: `1px solid ${hp.border}`,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            color: hp.muted,
            lineHeight: 1.75,
            maxWidth: 720,
            fontWeight: 300,
          }}
        >
          HumanProof is an evolving concept. Nothing on this site is presented as
          final or 100% accurate; what you see here is the proposed structure of
          the idea so far. If plans or details change, we will share notifications
          so you can stay up to date.
        </Typography>
      </Box>
    </Box>
  );
}

function PersonaWriter({ hp, th, tb, ts }) {
  return (
    <Grid2 container spacing={6}>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <Box sx={{ bgcolor: hp.white, border: `1px solid ${hp.border}`, borderRadius: 2, p: 4.5 }}>
          <Typography sx={{ ...th, fontSize: 22, color: hp.ink, mb: 0.5 }}>Maya</Typography>
          <Typography sx={{ fontSize: 12, color: hp.muted, letterSpacing: "0.06em", textTransform: "uppercase", mb: 2.5 }}>
            Freelance Copywriter · 8 years experience
          </Typography>
          <Typography sx={{ ...ts, fontSize: 18, color: hp.ink, lineHeight: 1.5, mb: 2.5, pl: 2, borderLeft: `3px solid ${hp.green}` }}>
            &quot;I lost three clients in a month. Not because my work got worse — because they couldn&apos;t tell if it was mine.&quot;
          </Typography>
          <Typography sx={{ fontSize: 13, color: hp.muted, lineHeight: 1.7, fontWeight: 300 }}>
            Maya certifies every piece she writes with 50 HPN staked per cert, giving her a 30-day full dispute window on each one. Her HumanProof profile shows a trust score of 84/100, built from 200+ honest certifications and Worldcoin human verification. Clients don&apos;t ask if her work is AI anymore. They check her profile score.
          </Typography>
        </Box>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <BenefitList
          hp={hp}
          th={th}
          items={[
            { icon: "🔗", title: "Permanent, verifiable authorship", desc: "Every piece of writing you produce is timestamped, signed, and stored on-chain forever. No one can claim otherwise." },
            { icon: "🪙", title: "Earn HPN for every certification", desc: "10 HPN per certification — 20 HPN if you join as a founding member, plus a 500 HPN welcome bonus. Writing honestly becomes financially rewarding from day one." },
            { icon: "📈", title: "A composite trust score clients can actually read", desc: "Your 0–100 trust score is built from certification history, stake level, human verification, and dispute outcomes. It\u2019s public, auditable, and impossible to fake." },
          ]}
        />
      </Grid2>
    </Grid2>
  );
}

function PersonaPublisher({ hp, th, tb, ts }) {
  return (
    <Grid2 container spacing={6}>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <Box sx={{ bgcolor: hp.white, border: `1px solid ${hp.border}`, borderRadius: 2, p: 4.5 }}>
          <Typography sx={{ ...th, fontSize: 22, color: hp.ink, mb: 0.5 }}>James</Typography>
          <Typography sx={{ fontSize: 12, color: hp.muted, letterSpacing: "0.06em", textTransform: "uppercase", mb: 2.5 }}>
            Editor-in-Chief · Independent news site
          </Typography>
          <Typography sx={{ ...ts, fontSize: 18, color: hp.ink, lineHeight: 1.5, mb: 2.5, pl: 2, borderLeft: `3px solid ${hp.green}` }}>
            &quot;Our advertisers don&apos;t want to appear next to AI content. I needed a way to prove every byline is real. AI detectors kept flagging our best writers.&quot;
          </Typography>
          <Typography sx={{ fontSize: 13, color: hp.muted, lineHeight: 1.7, fontWeight: 300 }}>
            James embedded the HumanProof verification SDK in his CMS. Every submitted article is automatically checked against the contract — any cert with a trust score below 60 is flagged for editorial review. Certified pieces above that threshold get a &quot;Human Verified&quot; badge in the byline. His advertiser deck now includes &quot;100% HPN-verified content&quot; as a headline stat.
          </Typography>
        </Box>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <BenefitList
          hp={hp}
          th={th}
          items={[
            { icon: "✅", title: "One JS snippet, instant verification", desc: "Drop in the SDK and every article submission is automatically checked. No manual review. No unreliable AI detectors." },
            { icon: "⚖️", title: "Regulatory compliance documentation", desc: "Auditable, on-chain provenance data satisfies disclosure requirements under the EU AI Act and California's Transparency Act." },
            { icon: "💰", title: "Advertiser confidence signal", desc: "Show brand safety partners documented proof that your content is human-verified. Turn compliance into a revenue argument." },
          ]}
        />
      </Grid2>
    </Grid2>
  );
}

function PersonaWatchdog({ hp, th, tb, ts }) {
  return (
    <Grid2 container spacing={6}>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <Box sx={{ bgcolor: hp.white, border: `1px solid ${hp.border}`, borderRadius: 2, p: 4.5 }}>
          <Typography sx={{ ...th, fontSize: 22, color: hp.ink, mb: 0.5 }}>Priya</Typography>
          <Typography sx={{ fontSize: 12, color: hp.muted, letterSpacing: "0.06em", textTransform: "uppercase", mb: 2.5 }}>
            Researcher · AI content integrity
          </Typography>
          <Typography sx={{ ...ts, fontSize: 18, color: hp.ink, lineHeight: 1.5, mb: 2.5, pl: 2, borderLeft: `3px solid ${hp.green}` }}>
            &quot;I found a content farm certifying thousands of AI articles as human. I raised the dispute. The evidence was clear. I earned the bounty.&quot;
          </Typography>
          <Typography sx={{ fontSize: 13, color: hp.muted, lineHeight: 1.7, fontWeight: 300 }}>
            Priya monitors the HumanProof network for suspicious certification patterns. She raised 12 full-tier disputes in her first month — all within the financial window. Nine were upheld. She earned 50% of each slashed stake as a bounty. Two more were soft-tier disputes that flagged badges without financial consequence. The network is more trustworthy because of her work.
          </Typography>
        </Box>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <BenefitList
          hp={hp}
          th={th}
          items={[
            { icon: "🔍", title: "Earn bounties for catching fraud", desc: "When a full-tier dispute you raise is upheld within the financial window, you receive 50% of the fraudster's slashed stake directly. The more fraud you catch in time, the more you earn." },
            { icon: "🗳️", title: "DAO governance voting rights", desc: "HPN token holders vote on disputed certifications. Your vote protects the integrity of the network and the value of every legitimate cert." },
            { icon: "🏆", title: "Build public watchdog reputation", desc: "Your dispute history is public. A strong track record of upheld disputes makes your challenges more credible and commands higher community trust." },
          ]}
        />
      </Grid2>
    </Grid2>
  );
}

function BenefitList({ hp, th, items }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {items.map((b) => (
        <Box
          key={b.title}
          sx={{
            display: "flex",
            gap: 1.75,
            alignItems: "flex-start",
            p: 2,
            bgcolor: hp.white,
            border: `1px solid ${hp.border}`,
            borderRadius: 1.5,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              bgcolor: hp.greenLight,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {b.icon}
          </Box>
          <Box>
            <Typography sx={{ ...th, fontSize: 14, color: hp.ink, mb: 0.5 }}>{b.title}</Typography>
            <Typography sx={{ fontSize: 12, color: hp.muted, lineHeight: 1.55, fontWeight: 300 }}>{b.desc}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
