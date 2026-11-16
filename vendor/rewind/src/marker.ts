/**
 * The rewind marker's message-source identity.
 *
 * A producer owns its source `kind` outright (`MessageSourceMap` is
 * merge-extensible and has no catch-all `plugin` kind since session format v4),
 * so this module declares the `ui-stronger-rewind` source every marker carries. Kept in
 * a leaf with no cordis or node imports.
 *
 * @module ui-stronger-rewind/marker
 */

declare module '@deepseek-ai/dsh-llm' {
  interface MessageSourceMap {
    'ui-stronger-rewind': { kind: 'ui-stronger-rewind' }
  }
}

/** Producer kind carried by every marker this plugin appends. */
const REWIND_MARKER_KIND = 'ui-stronger-rewind'

/** The marker's source: one producer-owned kind, no private fields. */
export const REWIND_MARKER_SOURCE = Object.freeze({ kind: REWIND_MARKER_KIND } as const)
