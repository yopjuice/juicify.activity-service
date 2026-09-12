/* @name DeleteInteraction */
DELETE FROM user_interactions
WHERE id = :id!
RETURNING *;
