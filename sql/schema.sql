CREATE TYPE "ItemType" AS ENUM ('ARTIST', 'ALBUM', 'TRACK');
CREATE TYPE "ActionType" AS ENUM ('VIEW', 'LIKE', 'DISLIKE', 'PLAYLIST_ADD');

CREATE TABLE user_interactions (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    item_type "ItemType" NOT NULL,
    item_id UUID NOT NULL,
    action_type "ActionType" NOT NULL,
    weight SMALLINT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT current_timestamp,

    CONSTRAINT interactions_pkey PRIMARY KEY (id)

);

CREATE INDEX idx_interactions_user_perf ON user_interactions (user_id, created_at DESC);
CREATE INDEX idx_interactions_item_stats ON user_interactions (item_id, item_type, created_at DESC);

CREATE TABLE user_favorites (
    user_id UUID NOT NULL,
    item_type "ItemType" NOT NULL,
    item_id UUID NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (user_id, item_type, item_id)
);

CREATE INDEX idx_user_favorites_lookup ON user_favorites (user_id, item_type);
