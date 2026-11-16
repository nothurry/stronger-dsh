/**
 * Client plugin styling: one injected `<style>` tag (scoped class names),
 * following the dsh design tokens (`--dsw-*`) so the per-message action, the
 * mode popover, the failure toast and the settings card blend with the
 * conversation chrome.
 *
 * @module ui-stronger-rewind/client/styles
 */

/** Class names shared between the injected DOM and the stylesheet. */
export const CLASS = {
  action: 'ui-stronger-rewind-action',
  popover: 'ui-stronger-rewind-popover',
  popoverBelow: 'ui-stronger-rewind-popover-below',
  popoverTitle: 'ui-stronger-rewind-popover-title',
  popoverTarget: 'ui-stronger-rewind-popover-target',
  popoverOption: 'ui-stronger-rewind-popover-option',
  popoverOptionLabel: 'ui-stronger-rewind-popover-option-label',
  popoverOptionHint: 'ui-stronger-rewind-popover-option-hint',
  popoverImpact: 'ui-stronger-rewind-popover-impact',
  popoverNote: 'ui-stronger-rewind-popover-note',
  popoverActions: 'ui-stronger-rewind-popover-actions',
  popoverPrimary: 'ui-stronger-rewind-popover-primary',
  popoverGhost: 'ui-stronger-rewind-popover-ghost',
  guardHint: 'ui-stronger-rewind-guard-hint',
} as const

/** One injected stylesheet (scoped under `.ui-stronger-rewind-*`). */
export const STYLE = `
/* The official action chrome, value for value: the action is Copy's peer in the
   same 28px row, so a different box, glyph scale, or resting tier would read as
   a different kind of control. */
.ui-stronger-rewind-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: calc(28px + var(--dsh-content-font-delta, 0px));
  height: calc(28px + var(--dsh-content-font-delta, 0px));
  padding: 6px;
  border: none;
  border-radius: var(--dsw-radius-sm, 8px);
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
}
.ui-stronger-rewind-action svg {
  width: calc(15px + var(--dsh-content-font-delta, 0px));
  height: calc(15px + var(--dsh-content-font-delta, 0px));
}
@media (hover: hover) {
  .ui-stronger-rewind-action:hover {
    background: var(--dsw-alias-interactive-bg-hover);
    color: var(--dsw-alias-label-secondary);
  }
}

.ui-stronger-rewind-popover {
  position: fixed;
  z-index: 1100;
  box-sizing: border-box;
  /* Keep the plugin's 300px panel width while using the official anchor
     sizing model; max-content lets long impact paths size up to that cap. */
  width: max-content;
  min-width: min(300px, calc(100vw - 24px));
  max-width: min(300px, calc(100vw - 24px));
  padding: 16px;
  border: 0;
  border-radius: var(--dsw-radius-lg);
  background: var(--dsw-specific-menu, var(--dsw-alias-bg-layer-3));
  backdrop-filter: var(--dsw-menu-backdrop-filter);
  isolation: isolate;
  --dsw-elevation-stroke-color: var(--dsw-alias-border-l1);
  /* Elevated surface: match the menu cards' l2 scrollbar tokens. */
  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
  box-shadow: var(--dsw-elevation-prominent);
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-primary);
  max-height: calc(100dvh - 12px - max(12px, var(--dsh-frame-overlay-top, 12px)));
  overflow-x: hidden;
  overflow-y: auto;
  position-area: none;
  top: max(12px, var(--dsh-frame-overlay-top, 12px));
  bottom: max(12px, calc(anchor(top) + 4px));
  left: max(12px, anchor(left));
  right: 12px;
  position-try-fallbacks: --ui-stronger-rewind-window, --ui-stronger-rewind-opposite, --ui-stronger-rewind-wide-opposite, --ui-stronger-rewind-tall, --ui-stronger-rewind-viewport;
  align-self: end;
  justify-self: start;
  height: fit-content;
  min-height: 0;
  margin: 0;
}
/* Below-first mirror of the official fallback order: same-side wide, opposite
   anchored, opposite wide (the official window rule), tall, viewport. */
.ui-stronger-rewind-popover.ui-stronger-rewind-popover-below {
  top: max(12px, calc(anchor(bottom) + 4px));
  bottom: 12px;
  align-self: start;
  position-try-fallbacks: --ui-stronger-rewind-below-window, --ui-stronger-rewind-below-opposite, --ui-stronger-rewind-window, --ui-stronger-rewind-tall, --ui-stronger-rewind-viewport;
}
@position-try --ui-stronger-rewind-below-window {
  position-area: none;
  top: max(12px, calc(anchor(bottom) + 4px));
  bottom: 12px;
  left: 12px;
  right: 12px;
  margin: 0;
  align-self: start;
  justify-self: safe end;
}
@position-try --ui-stronger-rewind-below-opposite {
  top: max(12px, var(--dsh-frame-overlay-top, 12px));
  bottom: max(12px, calc(anchor(top) + 4px));
  align-self: end;
}
@position-try --ui-stronger-rewind-window {
  position-area: none;
  top: max(12px, var(--dsh-frame-overlay-top, 12px));
  bottom: max(12px, calc(anchor(top) + 4px));
  left: 12px;
  right: 12px;
  margin: 0;
  align-self: safe end;
  justify-self: safe end;
}
@position-try --ui-stronger-rewind-opposite {
  top: max(12px, calc(anchor(bottom) + 4px));
  bottom: 12px;
  align-self: start;
}
@position-try --ui-stronger-rewind-wide-opposite {
  top: max(12px, calc(anchor(bottom) + 4px));
  bottom: 12px;
  left: 12px;
  right: 12px;
  align-self: start;
  justify-self: safe end;
}
@position-try --ui-stronger-rewind-tall {
  position-area: none;
  top: max(12px, var(--dsh-frame-overlay-top, 12px));
  bottom: 12px;
  left: max(12px, anchor(left));
  right: 12px;
  margin: 0;
  align-self: safe start;
  justify-self: start;
}
@position-try --ui-stronger-rewind-viewport {
  position-area: none;
  inset: max(12px, var(--dsh-frame-overlay-top, 12px)) 12px 12px;
  margin: 0;
  align-self: safe start;
  justify-self: safe end;
}
.ui-stronger-rewind-popover-title {
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
}
.ui-stronger-rewind-popover-target {
  margin: 2px 0 10px;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary);
  word-break: break-all;
  /* The full message sits above the popover; two lines are enough context. */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.ui-stronger-rewind-popover-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  margin: 0 0 2px;
  padding: 6px 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.ui-stronger-rewind-popover-option:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
/* Arrow navigation moves real focus, so the focused row carries the pointer's
   fill and the browser ring is suppressed: in dark mode the UA two-tone ring
   draws its dark half against the filled row and reads as a residue edge (the
   harness Menu suppresses it the same way). */
.ui-stronger-rewind-popover-option:focus-visible:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  outline: none;
}
.ui-stronger-rewind-popover-option:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-stronger-rewind-popover-option-label {
  font-weight: 500;
}
.ui-stronger-rewind-popover-option-hint {
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-tertiary);
}
.ui-stronger-rewind-popover-impact {
  margin: 4px 0 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--dsw-alias-interactive-bg-hover);
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-secondary);
  white-space: pre-wrap;
  max-height: 160px;
  overflow: auto;
}
.ui-stronger-rewind-popover-note {
  margin-top: 6px;
  font-size: 11px;
  line-height: 15px;
  color: var(--dsw-alias-label-tertiary);
}
.ui-stronger-rewind-popover-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}
.ui-stronger-rewind-popover-primary,
.ui-stronger-rewind-popover-ghost {
  height: 28px;
  padding: 0 10px;
  border: none;
  border-radius: 8px;
  font: inherit;
  cursor: pointer;
}
.ui-stronger-rewind-popover-primary {
  background: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-label-primary-foreground);
}
.ui-stronger-rewind-popover-primary:hover:not(:disabled) {
  background: var(--dsw-alias-button-primary-hover);
}
.ui-stronger-rewind-popover-primary:disabled {
  opacity: 0.4;
  cursor: default;
}
.ui-stronger-rewind-popover-ghost {
  background: transparent;
  color: var(--dsw-alias-label-secondary);
}
.ui-stronger-rewind-popover-ghost:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.ui-stronger-rewind-popover-ghost:active {
  background: var(--dsw-alias-interactive-bg-active);
}

.ui-stronger-rewind-guard-hint {
  position: fixed;
  z-index: 1000;
  max-width: min(440px, calc(100vw - 24px));
  padding: 8px 12px;
  border: 0;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-specific-menu, var(--dsw-alias-bg-layer-3));
  backdrop-filter: var(--dsw-menu-backdrop-filter);
  isolation: isolate;
  --dsw-elevation-stroke-color: var(--dsw-alias-border-l1);
  box-shadow: var(--dsw-elevation-panel);
  font-size: 13px;
  line-height: 18px;
  color: var(--dsw-alias-label-primary);
  pointer-events: none;
}

/* ---- Plugin configuration form ---- */
/* Only the card's own controls: the two switch rows, their hints, and the divider. */
.ui-stronger-rewind-settings-divider {
  border-top: 1px solid var(--dsw-alias-border-l2);
}
.ui-stronger-rewind-settings-section {
  display: grid;
  gap: 6px;
  padding: 12px 0;
}
.ui-stronger-rewind-settings-toggle-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--dsw-alias-label-primary);
}
.ui-stronger-rewind-settings-toggle-label {
  flex: 1;
  min-width: 0;
}
.ui-stronger-rewind-settings-hint {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--dsw-alias-label-tertiary);
}
`
