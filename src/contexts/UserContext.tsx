"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as web3 from "@solana/web3.js";
import axios from "axios";

interface IUserContext {
  isUserCreated: boolean;
  username?: string;
  keypair?: web3.Keypair;
  error?: string;
  createUser: (username: string) => void;
}

export const UserContext = createContext<IUserContext>({} as IUserContext);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [username, setUsername] = useState("");
  const [keypair, setKeypair] = useState<web3.Keypair>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) return;

    // localStorage.removeItem("userInfo");

    try {
      const user = JSON.parse(userInfo);
      setUsername(user.username);
      const privateKey = JSON.parse(user.privateKey);
      console.log(privateKey);
      const _keypair = web3.Keypair.fromSecretKey(Uint8Array.from(privateKey));
      setKeypair(_keypair);
      setIsUserCreated(true);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const createUser = async (_username: string) => {
    if (isUserCreated) return;

    const _keypair = web3.Keypair.generate();

    try {
      await axios.post("/api/create-user", {
        publicKey: _keypair.publicKey.toString(),
        username: _username,
      });

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          username: _username,
          privateKey: `[${_keypair.secretKey.toString()}]`,
        })
      );

      setUsername(_username);
      setKeypair(_keypair);
      setIsUserCreated(true);
      setError(undefined);
    } catch (error) {
      setError((error as any).response.data.error);
      console.error(error);
    }
  };

  return (
    <UserContext.Provider
      value={{ isUserCreated, username, keypair, createUser, error }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
