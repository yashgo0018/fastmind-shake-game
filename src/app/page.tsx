"use client";

import { useUserContext } from "@/contexts/UserContext";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { width } = useWindowDimensions();
  const { isUserCreated, createUser, error } = useUserContext();
  const [username, setUsername] = useState("");

  if (isUserCreated) {
    return redirect("/game");
  }

  console.log(useWindowDimensions());

  return (
    <>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={() => createUser(username)}>Create Account</button>
      <div>{error}</div>
    </>
  );
}
