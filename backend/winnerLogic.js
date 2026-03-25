export const calculateWinners = (scores, drawNumbers) => {
  // Group all scores by user_id
  const scoresByUser = {};
  scores.forEach((s) => {
    if (!scoresByUser[s.user_id]) scoresByUser[s.user_id] = [];
    scoresByUser[s.user_id].push(s.score);
  });

  const winners = [];

  Object.entries(scoresByUser).forEach(([user_id, userScores]) => {
    const matchCount = userScores.filter((score) =>
      drawNumbers.includes(score)
    ).length;

    if (matchCount >= 3) {
      const type =
        matchCount >= 5
          ? "5-match"
          : matchCount === 4
          ? "4-match"
          : "3-match";

      winners.push({
        user_id,
        matched_numbers: matchCount,
        payment_status: "pending",
      });
    }
  });

  return winners;
};
