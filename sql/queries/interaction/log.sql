/* @name LogInteraction */
INSERT INTO user_interactions (user_id, item_type, item_id, action_type, weight)
VALUES (:userId!, :itemType!, :itemId!, :actionType!, :weight!)
RETURNING *;
