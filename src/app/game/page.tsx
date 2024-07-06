"use client";

import { useUserContext } from "@/contexts/UserContext";
import axios from "axios";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GameLogic } from "../../components/GameLogic";

export default function GamePage() {
  const { isUserCreated, username } = useUserContext();
  const [nextGame, setNextGame] = useState<{
    id: number;
    startTime: string;
    endTime: string;
  }>();
  const [error, setError] = useState(false);
  const [isUserMember, setIsUserMember] = useState(false);

  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!nextGame) return;

    const interval = setInterval(() => {
      if (new Date(nextGame.endTime).getTime() < Date.now()) {
        setGameOver(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextGame?.endTime]);

  if (!isUserCreated) {
    return redirect("/");
  }

  const fetchNextGame = useCallback(async () => {
    if (!username) return;

    (async () => {
      try {
        const { data } = await axios.post("/api/get-next-game", { username });

        setNextGame(data.game);
        setIsUserMember(data.isUserMember);
        setError(false);
      } catch (error) {
        setError(true);
        console.error(error);
      }
    })();
  }, [username]);

  useEffect(() => {
    // const interval = setInterval(() => {
    fetchNextGame();
    // }, 1000);

    // return () => clearInterval(interval);
  }, [fetchNextGame]);

  const joinGame = useCallback(() => {
    if (!username || !nextGame) return;

    (async () => {
      try {
        await axios.post("/api/join-game", {
          gameId: nextGame.id,
          username,
        });

        setIsUserMember(true);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [username, nextGame?.id]);

  if (error) {
    return <div>Game not found</div>;
  }

  if (!nextGame || !username) {
    return <div>Loading...</div>;
  }

  if (gameOver) {
    return redirect(`/leaderboard/${nextGame.id}`);
  }

  return (
    <div>
      Game
      {isUserMember ? (
        <GameLogic username={username} game={nextGame} />
      ) : (
        <button onClick={joinGame}>Join</button>
      )}
    </div>
  );
}
