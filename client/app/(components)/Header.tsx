"use client";

import dynamic from 'next/dynamic';

const ConnectWallet = dynamic(() => import('./ConnectWallet'), { ssr: false });

export default function Header() {
    
  return (
    <header className="text-white body-font w-full flex flex-row justify-between p-3 border-b border-[#2f3336]">
        <a className="">
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff7ce5] to-[#ff3b3b] filter backdrop-blur-md rounded-md">web3.social</span>
        </a>
        <nav className="">
          <ConnectWallet />
        </nav>
    </header>
  );
}
