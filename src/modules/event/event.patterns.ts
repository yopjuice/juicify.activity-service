export const ACTIVITY_PATTERNS = {
  CATALOG: {
    ITEM: {
      VIEWED: 'catalog.item.viewed',
    },

    TRACK: {
      LIKED: 'catalog.track.liked',
    }
  }
} as const;

type FlattenValues<T> = T extends string
  ? T
  : T extends object
  ? FlattenValues<T[keyof T]>
  : never;

export type ActivityPattern = FlattenValues<typeof ACTIVITY_PATTERNS>;
