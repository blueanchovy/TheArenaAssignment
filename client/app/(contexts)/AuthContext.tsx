"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { User, fetchUser, updateUser } from "../(utils)/api";

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  authStatus: AuthStatus;
  isAuthenticated: boolean;
  user: User | null;
  login: (walletAddress: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
}

// Create a default context value to avoid undefined errors
const defaultContextValue: AuthContextType = {
  authStatus: 'loading',
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
  updateUserProfile: async () => false
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);
  
  // Check if user is already logged in (e.g., from localStorage)
  useEffect(() => {
    const storedWalletAddress = localStorage.getItem('walletAddress');
    
    if (storedWalletAddress) {
      login(storedWalletAddress);
    } else {
      setAuthStatus('unauthenticated');
    }
  }, []);
  
  // Login function
  const login = async (walletAddress: string): Promise<boolean> => {
    setAuthStatus('loading');
    
    try {
      // Fetch user from API
      let userData = await fetchUser(walletAddress);
      
      // If user doesn't exist, create a new user
      if (!userData) {
        const newUser: User = {
          walletAddress,
          username: null,
          bio: null,
          profilePicUrl: null
        };
        
        // You might want to create the user in the backend here
        userData = newUser;
      }
      
      // Store wallet address in localStorage
      localStorage.setItem('walletAddress', walletAddress);
      
      setUser(userData);
      setAuthStatus('authenticated');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setAuthStatus('unauthenticated');
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('walletAddress');
    setUser(null);
    setAuthStatus('unauthenticated');
  };
  
  // Update user profile
  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user?.walletAddress) return false;
    
    try {
      const updatedUser = await updateUser({
        ...userData,
        walletAddress: user.walletAddress
      });
      
      if (updatedUser) {
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };
  
  const isAuthenticated = authStatus === 'authenticated';
  
  return (
    <AuthContext.Provider 
      value={{ 
        authStatus, 
        isAuthenticated, 
        user, 
        login, 
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  return context;
}
