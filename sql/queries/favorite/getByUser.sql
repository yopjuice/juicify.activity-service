/* @name GetFavoriteByUser */
SELECT item_id
FROM user_favorites
WHERE user_id = :userId! AND item_type = :itemType!
ORDER BY created_at DESC;
