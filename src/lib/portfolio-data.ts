export type ProjectGallerySlide = {
  title: string;
  subtitle: string;
  detail: string;
  imageSrc?: string;
};

export type Project = {
  id: string;
  title: string;
  eyebrow: string;
  category: "AI Systems" | "Full Stack" | "Data Engineering";
  description: string;
  longDescription: string;
  impact: string[];
  tech: string[];
  metrics: { label: string; value: string }[];
  palette: [string, string];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  gallery: ProjectGallerySlide[];
};

export const personalDetails = {
  name: "Subhasish Kumar Sahu",
  firstName: "Subhasish",
  title: "AI Engineer • Full Stack Developer • Data Systems Builder",
  location: "Bhubaneswar, Odisha, India",
  email: "sahusubhasish6@gmail.com",
  phone: "+91 9348802996",
  githubUrl: "https://github.com/Subhasish-33",
  linkedinUrl: "https://www.linkedin.com/in/subhasish-kumar-sahu-847545310/",
  xUrl: "https://x.com/Sic_Subhasish",
  leetcodeUrl: "https://leetcode.com/u/Schrodingers_cat33/",
  instagramUrl: "https://www.instagram.com/schrodingers_cat.33/",
  kofiUrl: "https://ko-fi.com/subhasish_33",
  githubUsername: "Subhasish-33",
  whatsappUrl: "https://wa.me/919348802996",
  resumeUrl: "/Subhasish_Kumar_Sahu_Resume.pdf",
  yearsLabel: "2+ years of hands-on building across AI, dashboards, and product prototypes",
  summary:
    "B.Tech CSE student specializing in AI Engineering and Predictive Analytics, currently pursuing an IIT Guwahati credit-linked program in Data Science & Machine Learning. I build intelligent products that combine RAG pipelines, reinforcement learning, realtime interfaces, and scalable FastAPI backends.",
  shortBio:
    "I love designing systems where raw, messy data becomes an experience people can actually trust. My work usually lives at the intersection of machine learning, backend architecture, and front-end polish.",
  specializations: [
    "RAG and LLM application design",
    "Reinforcement learning systems",
    "FastAPI and Python backends",
    "React and Node.js product interfaces",
    "Data visualization and analytics dashboards",
  ],
};

export const heroHighlights = [
  "92% energy prediction accuracy",
  "1,000+ concurrent users handled",
  "600+ AI upskilling hours",
];

export const heroBadgeList = [
  "RAG Pipelines",
  "Reinforcement Learning",
  "FastAPI",
  "React",
  "MongoDB",
  "Data Intelligence",
];

export const rotatingRoles = [
  "AI systems that think clearly",
  "full-stack products that feel premium",
  "dashboards that explain the signal",
];

export const expertise = [
  {
    label: "AI Systems",
    value: 92,
    note: "LLMs, RAG, NLP, RL and model evaluation pipelines.",
  },
  {
    label: "Backend Architecture",
    value: 88,
    note: "FastAPI services, database design, caching, and API ergonomics.",
  },
  {
    label: "Data Intelligence",
    value: 90,
    note: "Pandas, NumPy, semantic search, vector workflows, and analytics.",
  },
  {
    label: "Frontend Experience",
    value: 82,
    note: "React interfaces with motion, dashboards, and purposeful interactions.",
  },
];

export const techStack = [
  "PyTorch",
  "LangChain",
  "FastAPI",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "ChromaDB",
  "Docker",
  "AWS",
  "Scikit-learn",
];

export const careerTimeline = [
  {
    year: "Sept 2023 - Present",
    title: "B.Tech in Computer Science & Engineering",
    org: "C.V. Raman Global University",
    body: "Maintaining an 8.7 CGPA while building a strong base in AI engineering, predictive analytics, and production-grade software development.",
  },
  {
    year: "Jan 2025 - Present",
    title: "Data Science Trainee",
    org: "IIT Guwahati, Masai School & NSDC",
    body: "Completed 600+ hours of advanced AI training, analyzed 10,000+ records, and built dashboards that accelerated model deployment timelines by 25%.",
  },
  {
    year: "Feb 2025",
    title: "Bhubaneswar Energy Twin",
    org: "Applied AI Project",
    body: "Combined NASA Power data, PPO reinforcement learning, and FastAPI into a digital twin capable of real-time energy intelligence.",
  },
  {
    year: "Apr 2026",
    title: "oyeee.chat",
    org: "Realtime Product Build",
    body: "Shipped an anonymous messaging experience with WebSockets, Redis-backed session design, and gamified engagement loops.",
  },
  {
    year: "Aug 2025",
    title: "Customer Churn Prediction",
    org: "Predictive Modeling Project",
    body: "Built a churn-risk modeling workflow focused on customer segmentation, retention signals, and interpretable prediction outputs.",
  },
  {
    year: "Dec 2025",
    title: "Job Application Tracker",
    org: "Workflow Automation Project",
    body: "Created a dashboard driven by MongoDB aggregations and status automation to simplify large-scale job tracking workflows.",
  },
];

export const projects: Project[] = [
  {
    id: "energy-twin",
    title: "Bhubaneswar Energy Twin",
    eyebrow: "Predictive Intelligence",
    category: "AI Systems",
    description:
      "A digital twin for energy forecasting that blends NASA Power data, PPO-based reinforcement learning, and a low-latency FastAPI backend.",
    longDescription:
      "This system turns weather and energy signals into decision-ready forecasts. I designed the extraction pipeline, trained the PPO agent, and built the API layer for semantic sensor queries and live modeling workflows.",
    impact: [
      "92% prediction accuracy in real-time modeling scenarios",
      "18% reduction in energy surcharges through smarter peak distribution",
      "Sub-200ms semantic sensor query responses at 500+ concurrent connections",
    ],
    tech: ["Python", "FastAPI", "PPO", "MongoDB", "NASA Power API", "RL"],
    metrics: [
      { label: "Accuracy", value: "92%" },
      { label: "Latency", value: "<200ms" },
      { label: "Concurrent Requests", value: "500+" },
    ],
    palette: ["#22d3ee", "#3b82f6"],
    primaryCta: {
      label: "Open GitHub Repo",
      href: "https://github.com/Subhasish-33/Bhubaneswar-Energy-Twin",
    },
    secondaryCta: { label: "Request Walkthrough", href: "#contact" },
    gallery: [
      {
        title: "Digital Twin Cockpit",
        subtitle: "Forecasting interface",
        detail: "Live demand predictions, peak alerts, and climate-aware energy views.",
        imageSrc: "/projects/energy-twin/correlation-heatmap.png",
      },
      {
        title: "RL Decision Engine",
        subtitle: "Training feedback loop",
        detail: "PPO agent tuning for smarter schedule optimization and load balancing.",
      },
      {
        title: "FastAPI Query Layer",
        subtitle: "Semantic backend",
        detail: "Low-latency endpoints for sensors, metadata, and operational insights.",
      },
    ],
  },
  {
    id: "oyeee-chat",
    title: "oyeee.chat",
    eyebrow: "Realtime Social Platform",
    category: "Full Stack",
    description:
      "An anonymous messaging platform with websocket-first performance, gamified engagement, and secure session design.",
    longDescription:
      "I built the realtime communication layer, tuned the system for hackathon-scale concurrency, and designed a playful engagement loop with Aura Points to increase retention without compromising anonymity.",
    impact: [
      "Sub-100ms realtime interactions during demos",
      "Handled 1,000+ concurrent users in a hackathon setting",
      "Increased average session duration by 40% through gamification",
    ],
    tech: ["React", "Node.js", "Socket.io", "MongoDB", "Redis"],
    metrics: [
      { label: "Latency", value: "<100ms" },
      { label: "Concurrent Users", value: "1,000+" },
      { label: "Engagement Lift", value: "40%" },
    ],
    palette: ["#f472b6", "#8b5cf6"],
    primaryCta: {
      label: "Open GitHub Repo",
      href: "https://github.com/Anshu0105/Oyeee_Project",
    },
    secondaryCta: { label: "See Product Story", href: "#contact" },
    gallery: [
      {
        title: "Anonymous Inbox",
        subtitle: "Realtime conversations",
        detail: "Fast message delivery, playful identity shielding, and session continuity.",
        imageSrc: "/projects/oyeee/live-rooms.png",
      },
      {
        title: "Aura Points Engine",
        subtitle: "Gamified retention",
        detail: "Reward loops designed to boost engagement and repeat interactions.",
        imageSrc: "/projects/oyeee/identity-customization.png",
      },
      {
        title: "Session Security Layer",
        subtitle: "Trust by design",
        detail: "Redis-backed sessions and MongoDB persistence without data leakage.",
        imageSrc: "/projects/oyeee/leaderboard.png",
      },
    ],
  },
  {
    id: "customer-churn-prediction",
    title: "Customer Churn Prediction",
    eyebrow: "Retention Intelligence",
    category: "AI Systems",
    description:
      "A predictive analytics project that identifies churn risk using customer behavior signals, feature engineering, and interpretable machine learning outputs.",
    longDescription:
      "This build focuses on turning historical customer patterns into retention-ready insight. I worked on cleaning the dataset, shaping the predictive features, training the model, and framing the outputs so churn probability could be understood as an actionable business signal instead of just a score.",
    impact: [
      "Flagged high-risk customer segments for early retention outreach",
      "Improved visibility into the strongest churn drivers through feature analysis",
      "Turned raw customer history into a more decision-friendly ML workflow",
    ],
    tech: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn", "ML"],
    metrics: [
      { label: "Use Case", value: "Retention" },
      { label: "Model Focus", value: "Churn Risk" },
      { label: "Output", value: "Interpretable Insights" },
    ],
    palette: ["#fb7185", "#f59e0b"],
    primaryCta: {
      label: "Open GitHub Repo",
      href: "https://github.com/Subhasish-33/Customer-Churn-Prediction",
    },
    secondaryCta: { label: "Discuss Modeling", href: "#contact" },
    gallery: [
      {
        title: "Churn Signal Mapping",
        subtitle: "Feature-driven analysis",
        detail: "Behavioral variables, tenure trends, and service patterns surfaced as the strongest retention indicators.",
        imageSrc: "/projects/customer-churn-preview.png",
      },
      {
        title: "Prediction Workflow",
        subtitle: "Model training pipeline",
        detail: "Structured preprocessing, feature engineering, and supervised modeling designed for practical classification outcomes.",
      },
      {
        title: "Retention Lens",
        subtitle: "Decision-ready outputs",
        detail: "The result is a clearer understanding of which customers are at risk and why intervention timing matters.",
      },
    ],
  },
  {
    id: "job-tracker",
    title: "Job Application Tracker",
    eyebrow: "Workflow Visibility",
    category: "Data Engineering",
    description:
      "A job search command center built with the MERN stack and advanced MongoDB aggregations for fast filtering and automation.",
    longDescription:
      "I focused on operational clarity: building a dashboard that could surface application pipeline health, automate follow-ups, and reduce manual overhead for large numbers of roles and statuses.",
    impact: [
      "Tracked 500+ applications with multidimensional filtering",
      "Reduced manual tracking overhead by 50% through workflow automation",
      "Improved response time with status update triggers and notification flows",
    ],
    tech: ["MongoDB", "Express", "React", "Node.js", "Aggregation Pipelines"],
    metrics: [
      { label: "Applications", value: "500+" },
      { label: "Manual Work Reduced", value: "50%" },
      { label: "Views", value: "Multi-Dimensional" },
    ],
    palette: ["#34d399", "#14b8a6"],
    primaryCta: {
      label: "Open GitHub Repo",
      href: "https://github.com/Subhasish-33/Job-Application-Tracker",
    },
    secondaryCta: { label: "View Case Study", href: "#contact" },
    gallery: [
      {
        title: "Pipeline Dashboard",
        subtitle: "Search workflow at a glance",
        detail: "Role stages, response windows, and recruiter visibility in a single view.",
        imageSrc: "/projects/job-tracker-preview.png",
      },
      {
        title: "Aggregation Engine",
        subtitle: "Fast filtering",
        detail: "Complex MongoDB queries designed for summaries, drilldowns, and signals.",
      },
      {
        title: "Automation Triggers",
        subtitle: "Follow-up intelligence",
        detail: "Status changes, reminders, and workflow actions to reduce repetitive work.",
      },
    ],
  },
];

export const filterOptions = [
  "All",
  "AI Systems",
  "Full Stack",
  "Data Engineering",
] as const;

export const dashboardMetrics = [
  {
    label: "Flagship Builds",
    value: 3,
    suffix: "+",
    note: "Projects spanning AI systems, realtime products, and workflow tooling.",
  },
  {
    label: "Training Hours",
    value: 600,
    suffix: "+",
    note: "Advanced AI and ML coursework through the IIT Guwahati-linked program.",
  },
  {
    label: "Records Analyzed",
    value: 10000,
    suffix: "+",
    note: "Alternative data exploration, model validation, and dashboarding pipelines.",
  },
  {
    label: "Peak Concurrent Users",
    value: 1000,
    suffix: "+",
    note: "Realtime system load achieved during a live hackathon demonstration.",
  },
];

export const languageUsage = [
  { name: "Python", value: 36, color: "#38bdf8" },
  { name: "TypeScript", value: 22, color: "#60a5fa" },
  { name: "JavaScript", value: 18, color: "#8b5cf6" },
  { name: "SQL", value: 14, color: "#34d399" },
  { name: "CSS", value: 10, color: "#f472b6" },
];

export const activitySeries = [
  { month: "Jan", focus: 32, shipping: 24, research: 20 },
  { month: "Feb", focus: 56, shipping: 35, research: 28 },
  { month: "Mar", focus: 62, shipping: 41, research: 34 },
  { month: "Apr", focus: 72, shipping: 58, research: 37 },
  { month: "May", focus: 66, shipping: 52, research: 42 },
  { month: "Jun", focus: 78, shipping: 61, research: 48 },
];

export const radarFocus = [
  { skill: "AI", score: 92 },
  { skill: "Backend", score: 88 },
  { skill: "Data", score: 90 },
  { skill: "Frontend", score: 82 },
  { skill: "Systems", score: 84 },
  { skill: "Product", score: 80 },
];

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const contributionHeatmap = Array.from({ length: 18 * 7 }, (_, index) => {
  const week = Math.floor(index / 7);
  const day = index % 7;
  const level = (week * 3 + day * 2 + (week % 4)) % 5;

  return {
    id: `${week}-${day}`,
    day: weekLabels[day],
    week: week + 1,
    level,
    label:
      level === 0
        ? "Planning and review"
        : level === 1
          ? "Light coding"
          : level === 2
            ? "Steady build session"
            : level === 3
              ? "Deep implementation"
              : "High-output sprint",
  };
});

/** 18 weekly rows × 7 day columns (Mon–Sun), GitHub-style grid */
export const contributionHeatmapWeeks = Array.from({ length: 18 }, (_, w) =>
  contributionHeatmap.slice(w * 7, w * 7 + 7),
);

export const heatmapDayLabels = weekLabels;

export const funFacts = [
  {
    title: "Strategy Brain",
    body: "Competitive chess keeps my pattern recognition sharp. I love the overlap between good openings, smart algorithms, and clear product thinking.",
  },
  {
    title: "Night Shift Friendly",
    body: "I’m comfortable collaborating across US timezone windows, which makes async handoffs and fast remote iteration feel natural.",
  },
  {
    title: "Model-to-UX Builder",
    body: "My favorite projects are the ones where I can design the intelligence and then shape how humans actually experience it.",
  },
  {
    title: "Signal Hunter",
    body: "Turning noisy, unstructured data into dashboards and decisions is one of the parts of engineering I enjoy most.",
  },
];

export const instagramMoments = [
  {
    src: "/images/insta-01.jpg",
    alt: "Subhasish in a casual outdoor portrait.",
    caption: "Off-duty frame, still thinking in product systems.",
    stamp: "Weekend reset",
  },
  {
    src: "/images/insta-02.jpg",
    alt: "Subhasish in a candid lifestyle shot.",
    caption: "Ideas usually arrive between walks, notes, and unfinished prototypes.",
    stamp: "Idea capture",
  },
  {
    src: "/images/insta-03.jpg",
    alt: "Subhasish in a portrait-style frame.",
    caption: "A little editorial, a little experimental, still very me.",
    stamp: "Portrait drop",
  },
  {
    src: "/images/insta-04.jpg",
    alt: "Subhasish in a stylish candid frame.",
    caption: "I like products that feel composed, even when the build behind them is intense.",
    stamp: "Composed chaos",
  },
  {
    src: "/images/insta-05.jpg",
    alt: "Subhasish in a bright candid moment.",
    caption: "Good aesthetics matter, but only when they support clarity.",
    stamp: "Clean energy",
  },
  {
    src: "/images/insta-06.jpg",
    alt: "Subhasish in a candid photo with a relaxed vibe.",
    caption: "A lot of my best debugging happens after stepping away for a minute.",
    stamp: "Debug break",
  },
  {
    src: "/images/insta-07.jpg",
    alt: "Subhasish in a lifestyle snapshot.",
    caption: "Builder mode, but with enough personality to keep the work human.",
    stamp: "Photo dump",
  },
];

export const likes = [
  "RAG pipelines with clear retrieval logic",
  "FastAPI backends that stay readable under pressure",
  "Realtime products with playful interactions",
  "Chess, strategy games, and systems thinking",
  "Glassmorphism with restraint and contrast",
  "Dashboards that tell the truth fast",
];

export const dislikes = [
  "Silent API failures and vague error states",
  "Untyped payloads sneaking into production",
  "Needlessly complex architecture for simple problems",
  "Avoidable merge conflicts and unclear ownership",
  "Brittle UI layouts that break at one random breakpoint",
  "Interfaces that hide important decisions behind clutter",
];

export const socialLinks = [
  {
    label: "GitHub",
    href: personalDetails.githubUrl,
    handle: "Subhasish-33",
  },
  {
    label: "LinkedIn",
    href: personalDetails.linkedinUrl,
    handle: "subhasish-sahu",
  },
  {
    label: "Email",
    href: `mailto:${personalDetails.email}`,
    handle: personalDetails.email,
  },
  {
    label: "WhatsApp",
    href: personalDetails.whatsappUrl,
    handle: personalDetails.phone,
  },
  {
    label: "X",
    href: personalDetails.xUrl,
    handle: "@Sic_Subhasish",
  },
  {
    label: "LeetCode",
    href: personalDetails.leetcodeUrl,
    handle: "Schrodingers_cat33",
  },
  {
    label: "Instagram",
    href: personalDetails.instagramUrl,
    handle: "schrodingers_cat.33",
  },
  {
    label: "Resume",
    href: personalDetails.resumeUrl,
    handle: "Download PDF",
  },
];

export const photoMoments = [
  {
    src: "/images/about-primary.jpg",
    alt: "Subhasish smiling outdoors, used as the primary About section portrait.",
    label: "Primary portrait",
  },
  {
    src: "/images/profile-cafe.jpg",
    alt: "Subhasish in a cafe with hands behind his head.",
    label: "Cafe energy",
  },
  {
    src: "/images/profile-lantern.jpg",
    alt: "Subhasish standing on a lantern-lit street at night.",
    label: "Night city vibe",
  },
  {
    src: "/images/profile-red.jpg",
    alt: "Subhasish in a red shirt in front of light curtains.",
    label: "Streetwear frame",
  },
  {
    src: "/images/profile-sunset.jpg",
    alt: "Subhasish silhouetted against a warm sunset skyline.",
    label: "Sunset frame",
  },
];