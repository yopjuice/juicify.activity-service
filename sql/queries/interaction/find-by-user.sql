/* @name FindUserInteractions */
SELECT * FROM user_interactions
WHERE user_id = :userId!
ORDER BY created_at DESC
LIMIT :limit;
