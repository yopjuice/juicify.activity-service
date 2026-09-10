export const ItemType = {
  Track: 'TRACK',
  Album: 'ALBUM',
  Artist: 'ARTIST',
} as const;

export type ItemType = typeof ItemType[keyof typeof ItemType];

export const ActionType = {
  View: 'VIEW', 
  Like: 'LIKE',
  Dislike: 'DISLIKE',
  PlaylistAdd: 'PLAYLIST_ADD',
} as const;

export type ActionType = typeof ActionType[keyof typeof ActionType];
