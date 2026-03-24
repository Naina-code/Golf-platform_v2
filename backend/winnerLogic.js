export const calculateWinners = (scores, drawNumbers) => {
  let winners = [];

  scores.forEach((s) => {
    let matchCount = drawNumbers.includes(s.score) ? 1 : 0;

    if (matchCount >= 3) {
      let type =
        matchCount === 5
          ? "5-match"
          : matchCount === 4
          ? "4-match"
          : "3-match";

      winners.push({
        user_id: s.user_id,
        match_count: matchCount,
        type,
        status: "pending",
        payment_status: "pending",
      });
    }
  });

  return winners;
};
