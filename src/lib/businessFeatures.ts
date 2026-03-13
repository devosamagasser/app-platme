export interface BusinessModule {
  id: string;
  label: string;
  category: string;
  description: string;
  dependencies: string[];
  storage: string;
  capacity: string;
  config: string[];
}

export interface BusinessVertical {
  id: string;
  label: string;
  description: string;
  icon: string;
  active: boolean;
  modules: BusinessModule[];
  suggestions: string[];
}

export const businessVerticals: Record<string, BusinessVertical> = {
  education: {
    id: "education",
    label: "Education",
    description: "Build complete learning management systems with courses, memberships, and certification.",
    icon: "GraduationCap",
    active: true,
    suggestions: [
      "Build a course platform",
      "Add student memberships",
      "Enable cohort-based learning",
      "Add certification system",
      "Set up analytics dashboard",
    ],
    modules: [
      { id: "auth", label: "Authentication", category: "Security", description: "User login, registration, OAuth, MFA", dependencies: [], storage: "2 MB", capacity: "10K users", config: ["OAuth 2.0", "JWT Tokens", "MFA Support"] },
      { id: "roles", label: "User Roles", category: "Access Control", description: "RBAC with student, instructor, admin roles", dependencies: ["auth"], storage: "1 MB", capacity: "100 roles", config: ["RBAC", "Permission Matrix", "Inheritance"] },
      { id: "courses", label: "Course Engine", category: "Core", description: "Structured curriculum with modules, lessons, quizzes", dependencies: ["auth", "storage"], storage: "50 GB", capacity: "10K courses", config: ["Versioning", "Drip Content", "Prerequisites"] },
      { id: "membership", label: "Membership System", category: "Payments", description: "Multi-tier subscription access control", dependencies: ["auth", "billing"], storage: "500 MB", capacity: "50K members", config: ["Tiers", "Trial Periods", "Upgrades"] },
      { id: "cohorts", label: "Cohort Management", category: "Core", description: "Group-based enrollment and scheduling", dependencies: ["auth", "courses"], storage: "200 MB", capacity: "5K cohorts", config: ["Enrollment Windows", "Capacity Limits", "Scheduling"] },
      { id: "certification", label: "Certification", category: "Credentials", description: "Automated credential issuance and verification", dependencies: ["courses", "roles"], storage: "1 GB", capacity: "100K certs", config: ["Templates", "Verification", "Expiration"] },
      { id: "analytics", label: "Analytics Engine", category: "Telemetry", description: "Real-time engagement and progress tracking", dependencies: ["auth"], storage: "5 GB", capacity: "1M events/mo", config: ["Real-time", "Dashboards", "Exports"] },
      { id: "content_delivery", label: "Content Delivery", category: "Infrastructure", description: "CDN-backed media distribution with access gating", dependencies: ["storage"], storage: "100 GB", capacity: "Elastic", config: ["CDN", "Transcoding", "Access Gating"] },
      { id: "storage", label: "Storage Layer", category: "Infrastructure", description: "File storage with encryption and lifecycle rules", dependencies: [], storage: "100 GB", capacity: "Elastic", config: ["S3 Compatible", "Encryption", "Lifecycle Rules"] },
      { id: "billing", label: "Billing Engine", category: "Payments", description: "Payment processing, invoicing, webhooks", dependencies: ["auth"], storage: "500 MB", capacity: "50K transactions", config: ["Stripe Integration", "Invoicing", "Webhooks"] },
    ],
  },
  ecommerce: {
    id: "ecommerce",
    label: "E-Commerce",
    description: "Full-stack commerce infrastructure with inventory, payments, and fulfillment.",
    icon: "ShoppingCart",
    active: true,
    suggestions: [
      "Build a product catalog",
      "Add shopping cart",
      "Set up payment processing",
      "Add inventory management",
      "Enable order tracking",
    ],
    modules: [
      { id: "auth", label: "Authentication", category: "Security", description: "Customer accounts, OAuth, guest checkout", dependencies: [], storage: "2 MB", capacity: "100K users", config: ["OAuth 2.0", "Guest Checkout", "MFA"] },
      { id: "catalog", label: "Product Catalog", category: "Core", description: "Product listings, categories, variants, search", dependencies: ["storage"], storage: "10 GB", capacity: "500K products", config: ["Variants", "Categories", "Search Index"] },
      { id: "cart", label: "Shopping Cart", category: "Core", description: "Cart management with persistence and upsells", dependencies: ["auth", "catalog"], storage: "1 GB", capacity: "Dynamic", config: ["Persistence", "Upsells", "Discounts"] },
      { id: "payments", label: "Payment Processing", category: "Payments", description: "Multi-gateway payment processing", dependencies: ["auth", "cart"], storage: "500 MB", capacity: "100K transactions", config: ["Stripe", "PayPal", "Webhooks"] },
      { id: "inventory", label: "Inventory Management", category: "Operations", description: "Stock tracking, warehouses, low-stock alerts", dependencies: ["catalog"], storage: "2 GB", capacity: "500K SKUs", config: ["Multi-warehouse", "Alerts", "Bulk Updates"] },
      { id: "orders", label: "Order Management", category: "Operations", description: "Order lifecycle, fulfillment, returns", dependencies: ["payments", "inventory"], storage: "5 GB", capacity: "1M orders", config: ["Status Tracking", "Returns", "Notifications"] },
      { id: "shipping", label: "Shipping Engine", category: "Logistics", description: "Rate calculation, label generation, tracking", dependencies: ["orders"], storage: "1 GB", capacity: "Dynamic", config: ["Multi-carrier", "Labels", "Tracking"] },
      { id: "analytics", label: "Analytics Engine", category: "Telemetry", description: "Sales analytics, conversion funnels, reporting", dependencies: ["auth"], storage: "5 GB", capacity: "1M events/mo", config: ["Funnels", "Revenue Reports", "Cohort Analysis"] },
      { id: "storage", label: "Storage Layer", category: "Infrastructure", description: "Product images, documents, media", dependencies: [], storage: "100 GB", capacity: "Elastic", config: ["CDN", "Image Optimization", "Lifecycle Rules"] },
    ],
  },
  gym: {
    id: "gym",
    label: "Gym & Fitness",
    description: "Gym management systems with member tracking, scheduling, and trainer tools.",
    icon: "Dumbbell",
    active: false,
    suggestions: [],
    modules: [],
  },
  clinic: {
    id: "clinic",
    label: "Clinic & Healthcare",
    description: "Clinic management with appointments, patient records, and billing.",
    icon: "Stethoscope",
    active: false,
    suggestions: [],
    modules: [],
  },
  restaurant: {
    id: "restaurant",
    label: "Restaurant",
    description: "Restaurant operations with ordering, reservations, and kitchen management.",
    icon: "UtensilsCrossed",
    active: false,
    suggestions: [],
    modules: [],
  },
};

export function getSystemPrompt(businessType: string): string {
  const vertical = businessVerticals[businessType];
  if (!vertical) return "You are Gomaa, a system architect AI.";

  const moduleList = vertical.modules
    .map((m) => `- **${m.label}** (${m.category}): ${m.description}`)
    .join("\n");

  return `You are Gomaa (جمعة), a Guided Intelligence™ System Architect for PLATME.

You are helping the user build a ${vertical.label} system. Your role is to act as a sales architect — understand what the user needs and propose infrastructure modules one at a time.

Available modules for ${vertical.label}:
${moduleList}

BEHAVIOR RULES:
1. Ask what the user wants to build. Understand their specific needs.
2. Propose modules one at a time. Explain what each module does and why they need it.
3. When the user confirms they want a module, use the add_module tool to add it to the architecture.
4. After adding a module, ask about the next logical feature they might need.
5. Suggest dependencies automatically — if a module requires another, explain that and propose both.
6. Speak in a professional, architectural tone. You are a system designer, not a chatbot.
7. Keep responses concise — 2-3 sentences max per message unless explaining a complex module.
8. Never add modules without user confirmation.

TONE: Professional, confident, architectural. Think infrastructure engineer meets enterprise sales.`;
}
