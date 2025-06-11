"use client";

import '@rainbow-me/rainbowkit/styles.css';
import {
  createAuthenticationAdapter,
  getDefaultConfig,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { createSiweMessage } from 'viem/siwe';
import { AuthProvider } from './(contexts)/AuthContext';
import { useIsMounted } from './(hooks)/useIsMounted';

const config = getDefaultConfig({
  appName: 'the-arena',
  projectId: '75b8def255dbc39cbb994f53dae3689d',
  chains: [mainnet],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  const isMounted = useIsMounted();
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  // Only run effects when component is mounted on the client
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // This will be handled by the AuthContext now
        const walletAddress = localStorage.getItem('walletAddress');
        setAuthStatus(walletAddress ? 'authenticated' : 'unauthenticated');
      } catch (error) {
        console.log('error: ', error);
        setAuthStatus('unauthenticated');
      }
    }
    fetchUser();

    window.addEventListener("focus", fetchUser);

    return () => {
      window.removeEventListener("focus", fetchUser);
    };
  }, []);

  const authAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        const response = await fetch('http://localhost:8000/auth/nonce');
        const {nonce} = await response.json();
        return nonce;
      },
    
      createMessage: ({ nonce, address, chainId }) => {
        return createSiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to the app.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
        });
      },

      getMessageBody: ({ message }) => {
        return message.prepareMessage();
      },
    
      verify: async ({ message, signature }) => {
        const verifyRes = await fetch('http://localhost:8000/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, signature }),
        });
    
        return Boolean(verifyRes.ok);
      },
    
      signOut: async () => {
        await fetch('http://localhost:8000/auth/logout');
      },
    });
  }, [])
  
  // Only render the full provider tree when we're mounted on the client
  if (!isMounted) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider adapter={authAdapter} status={authStatus}>
          <RainbowKitProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}