/* @name GetTopItems */
SELECT
    item_id,
    SUM(weight)::int AS score
FROM user_interactions
WHERE item_type = :itemType! AND created_at >= NOW() - (:daysAgo! || ' days')::interval
GROUP BY item_id
HAVING SUM(weight) > 0
ORDER BY score DESC
LIMIT :limit;
