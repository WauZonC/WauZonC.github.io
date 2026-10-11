/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Written by `pnpm sync:backgrounds` (scripts/background-photos.mjs) from the
 * files actually present in `public/images/backgrounds`.
 * Source of truth for what each photo MEANS is `config.ts`; this file only says
 * which photos exist. Re-run `pnpm sync:backgrounds` after adding/removing a photo.
 *
 * type: 'day'  fallback: 'hash'  default: 'default'
 */

export const BACKGROUND_POOL = [
  { id: 'default', bytes: 1650995 },
] as const;

export type BackgroundId = (typeof BACKGROUND_POOL)[number]['id'];

export const BACKGROUND_IDS: readonly string[] = BACKGROUND_POOL.map((p) => p.id);
