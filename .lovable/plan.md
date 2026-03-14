

# Plan: Chat UX Improvements + Preview Blocks Fix

## Issues to Fix

1. **Typing animation** — Currently text appears all at once per chunk. Add a character-by-character typing effect for assistant messages.
2. **RTL/LTR per message** — Detect language direction of each message and apply `dir="rtl"` or `dir="ltr"` accordingly.
3. **After adding a module, AI should continue** — Remove the `✅ **X** added.` static text appended client-side. The system prompt already instructs the AI to continue after tool calls (rule #3, #11). The issue is that the client appends a static confirmation which may cut off the AI's continuation. Let the AI handle the confirmation and next suggestion naturally.
4. **Blocks not showing in Preview** — The viewport is 681px which triggers `useIsMobile()` (likely `< 768px`), so the mobile layout is active. The CenterPanel is rendered but hidden via `hidden` class when on Chat tab. When switching to Preview tab it should show. Need to verify — the current code looks correct. The real issue may be that `useIsMobile` returns true at 681px width (desktop-ish). Let me check the hook.

## File Changes

### 1. `src/components/composer/LeftPanel.tsx` — Typing animation + RTL detection + remove static tool call text

**Typing animation approach**: The streaming already provides a typing-like effect via `onDelta`. But the chunks come in bursts. Add a small queue-based character reveal: buffer incoming deltas and reveal them character by character with a small interval (15-20ms).

**RTL detection**: Simple heuristic — check if first non-whitespace character is Arabic/Hebrew. Apply `dir` attribute per message bubble.

**Remove static "✅ added" text**: In both `onToolCall` handlers (intro and send), stop appending `✅ **${module.label}** added.` — the AI's response will naturally continue with next suggestion after the tool call.

### 2. `src/hooks/use-mobile.tsx` — Check breakpoint

Need to verify the breakpoint. At 681px the user is on a desktop browser viewing the preview panel — this shouldn't be treated as mobile.

### 3. `supabase/functions/chat/index.ts` — No changes needed

The system prompt already has rule #3 and #11 instructing the AI to continue after adding a module. The fix is on the client side (stop appending static confirmation text that may interfere).

## Technical Details

### Typing Animation
- Add a `displayedContent` state separate from `rawContent` for assistant messages
- Use `requestAnimationFrame` or `setInterval` to reveal characters gradually
- Simple approach: track a `typingQueue` ref. When `onDelta` fires, push chars to queue. A `useEffect` interval pops chars from queue and appends to displayed text.

### RTL Detection Helper
```typescript
function detectDir(text: string): "rtl" | "ltr" {
  const firstChar = text.trim().charAt(0);
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(firstChar) ? "rtl" : "ltr";
}
```

### Files to Modify
- `src/components/composer/LeftPanel.tsx` — Main changes (typing animation, RTL, remove static confirmation)
- `src/hooks/use-mobile.tsx` — Verify/adjust breakpoint if needed

