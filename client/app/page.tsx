"use client";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useIsMounted } from "./(hooks)/useIsMounted";

export default function Home() {
  const isMounted = useIsMounted();
  const {address, isConnected} = useAccount();

  if (!isMounted) return null;

  return (
    <div>
   <ConnectButton />
      <h1>Home</h1>
    </div>
  );
}
