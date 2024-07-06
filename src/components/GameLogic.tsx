"use client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const GameLogic = ({
  game,
  username,
}: {
  game: { id: number; endTime: string };
  username: string;
}) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentShakeStart, setCurrentShakeStart] = useState(0);
  const [permissionRequired, setPermissionRequired] = useState(true);
  const [permissionStateChecking, setPermissionStateChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clicks, setClicks] = useState(0);

  let shakeThreshold = 50; // You can adjust this value
  let lastUpdate = 0;
  let x: number,
    y: number,
    z: number,
    lastX: number,
    lastY: number,
    lastZ: number;

  const updateStats = useCallback(() => {
    if (currentShakeStart === 0) return;
    // alert("Game over!");

    const currentTime = Math.floor(
      (new Date().getTime() - currentShakeStart) / 1000
    );

    // if (new Date(game.endTime).getTime() > Date.now()) {
    setCurrentStreak(currentTime);
    if (currentTime > score) {
      // alert("Game over!");
      setScore(currentTime);
      (async () => {
        await axios.post("/api/update-score", {
          gameId: game.id,
          username,
          score: currentTime,
        });
      })();
    }
    // }
  }, [currentShakeStart, clicks, score]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(new Date(game.endTime).getTime() - Date.now());
      setClicks(Date.now() / 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // alert("Game started!");
    updateStats();
  }, [updateStats]);

  useEffect(() => {
    // Check if permission is needed
    if (typeof (DeviceMotionEvent as any).requestPermission !== "function") {
      setPermissionRequired(false);
    }
  }, []);

  useEffect(() => {
    if (permissionRequired) return;

    initializeMotionDetection();
  }, [permissionRequired]);

  function handleMotionEvent(event: DeviceMotionEvent) {
    let acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    let currentTime = new Date().getTime();

    if (currentTime - lastUpdate > 100) {
      let timeDifference = currentTime - lastUpdate;
      lastUpdate = currentTime;

      x = acceleration.x as number;
      y = acceleration.y as number;
      z = acceleration.z as number;

      let speed =
        (Math.abs(x + y + z - lastX - lastY - lastZ) / timeDifference) * 10000;

      // statusElement.innerText = JSON.stringify(
      //   { x, y, z, lastX, lastY, lastZ, timeDifference },
      //   null,
      //   2
      // );

      if (speed > shakeThreshold) {
        if (!currentShakeStart) {
          setCurrentShakeStart(currentTime);
        }
      } else {
        setCurrentShakeStart(0);
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    }
  }

  function initializeMotionDetection() {
    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleMotionEvent);
    } else {
      setErrorMessage("DeviceMotionEvent is not supported");
    }
  }

  async function requestPermission() {
    if (permissionStateChecking || !permissionRequired) return;
    try {
      const permissionState = await (
        DeviceMotionEvent as any
      ).requestPermission();
      if (permissionState === "granted") {
        initializeMotionDetection();
      } else {
        setErrorMessage("Motion permission denied");
      }
    } catch (error) {
      setErrorMessage("Failed to request permission");
    }
  }

  return (
    <div>
      {permissionRequired && (
        <button onClick={requestPermission}>Request permission</button>
      )}

      {errorMessage && <div>{errorMessage}</div>}

      <h1>Game</h1>
      {currentShakeStart ? (
        <h2>Shake your device!</h2>
      ) : (
        <h2>Shake to start</h2>
      )}
      <h2>Time left: {timeLeft}</h2>
      <h2>Current streak: {currentStreak}</h2>
      <h2>Score: {score}</h2>

      <h1>GameLogic</h1>
    </div>
  );
};
