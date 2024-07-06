"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function LeaderboardPage({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  const [error, setError] = useState(false);
  const [game, setGame] = useState<{
    id: number;
    startTime: string;
    endTime: string;
    users: { username: string; points: number }[];
  }>();

  const updateScore = async () => {
    // fetch user's score
    try {
      const { data } = await axios.get(`/api/leaderboard/${gameId}`);
      setGame(data.game);
      setError(false);
    } catch (err) {
      setError(true);
      console.error("Failed to fetch user's score");
      return;
    }
  };

  useEffect(() => {
    updateScore();
  }, []);

  useEffect(() => {
    if (!game) return;

    const interval = setInterval(() => {
      if (new Date(game.endTime).getTime() + 20 * 1000 < new Date().getTime()) {
        updateScore();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [game]);

  if (error) {
    return <div>Game not found</div>;
  }

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="">Game #{gameId}</div>
      <>
        {game.users.map((user, i) => (
          <div key={i}>
            {i + 1}
            {user.username}
            {user.points}
          </div>
        ))}
      </>
    </div>
  );
}
