// ==========================================
// App-wide Constants
// ==========================================

// Storage keys
export const STORAGE_KEYS = {
  SELECTED_FEATURES: "platme_selected_features",
  BUSINESS_TYPE: "platme_business_type",
  GRAPH_PREFIX: "platme_graph_",
  CHAT_PREFIX: "platme_chat_",
} as const;

// Graph layout
export const GRAPH_LAYOUT = {
  COLS: 3,
  X_START: 80,
  X_GAP: 220,
  Y_START: 60,
  Y_GAP: 140,
} as const;

// Typing animation
export const TYPING_SPEED_MS = 12;

// Default resource values
export const DEFAULTS = {
  STORAGE_GB: 50,
  CAPACITY_USERS: 100,
  MIN_STORAGE: 50,
  MAX_STORAGE: 500,
  STORAGE_STEP: 5,
  MIN_CAPACITY: 10,
  MAX_CAPACITY: 10000,
  CAPACITY_STEP: 10,
} as const;
