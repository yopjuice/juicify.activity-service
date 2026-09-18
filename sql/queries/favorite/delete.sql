/* @name DeleteFavorite */
DELETE FROM user_favorites
WHERE user_id = :userId! AND item_type = :itemType! AND item_id = :itemId!
RETURNING *;
