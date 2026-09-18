/* @name AddFavorite */
INSERT INTO user_favorites (user_id, item_type, item_id)
VALUES (:userId!, :itemType!, :itemId!)
ON CONFLICT (user_id, item_type, item_id) DO NOTHING
RETURNING *;
