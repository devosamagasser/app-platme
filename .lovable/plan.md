

# Plan: Auto-Intro Message + Preserve Chat Between Tabs

## Problem
1. The initial message is a hardcoded static string — user wants Gomaa to introduce itself dynamically via AI
2. Switching between Chat and Preview tabs on mobile destroys and recreates the LeftPanel, losing chat history

## Solution

### 1. Preserve Chat State Across Tabs
**File: `src/pages/Composer.tsx`** — In the mobile layout, instead of conditionally rendering one panel at a time (`{mobileTab === "chat" ? <LeftPanel /> : <CenterPanel />}`), render BOTH panels always but hide the inactive one with CSS (`hidden` class). This preserves all React state (messages, scroll position) without needing to lift state.

```text
Before:  {mobileTab === "chat" ? <LeftPanel /> : <CenterPanel />}
After:   <div class={mobileTab !== "chat" ? "hidden" : ""}><LeftPanel /></div>
         <div class={mobileTab !== "preview" ? "hidden" : ""}><CenterPanel /></div>
```

### 2. Auto-Introduction Message from Gomaa
**File: `src/components/composer/LeftPanel.tsx`** — On mount, automatically trigger a call to the AI with a system-level greeting prompt (e.g., send a hidden `"start"` message) so Gomaa responds with a real introduction explaining who it is, what modules are available, and what the user should do. Replace the current static `initialMessage` with this auto-triggered AI response.

- Add a `useEffect` that runs once on mount to call `streamChat` with an initial user message like `"ابدأ"` / `"start"` 
- The system prompt in the edge function already instructs Gomaa to welcome the user and explain defaults — so this will work automatically
- Show a loading spinner while the intro loads

