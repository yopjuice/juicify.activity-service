/* @name GetFavoriteLikedSubset */
SELECT item_id
FROM user_favorites
WHERE user_id = :userId! AND item_type = :itemType! AND item_id = ANY(:itemIds!::uuid[]);
