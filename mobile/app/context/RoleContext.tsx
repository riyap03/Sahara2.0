import React, { createContext, useContext, useState, ReactNode } from 'react';
import { globalStore, AppRole } from '../../constants/store';

type Role = AppRole;

interface RoleContextType {
  role: Role | null;
  setRole: (role: Role) => void;
  token: string | null;
  setToken: (token: string) => void;
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(globalStore.getRole());
  const [token, setTokenState] = useState<string | null>(globalStore.getToken());
  const [user, setUserState] = useState<any>(globalStore.getUser());

  const setRole = (nextRole: Role) => {
    globalStore.setRole(nextRole);
    setRoleState(nextRole);
  };

  const setToken = (nextToken: string) => {
    globalStore.setToken(nextToken);
    setTokenState(nextToken);
  };

  const setUser = (nextUser: any) => {
    globalStore.setUser(nextUser);
    setUserState(nextUser);
  };

  const logout = () => {
    globalStore.setRole(null);
    globalStore.setToken(null);
    globalStore.setUser(null);
    globalStore.setConnectedSenior(null);
    setRoleState(null);
    setTokenState(null);
    setUserState(null);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        token,
        setToken,
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

export default function RoleContextRoute() {
  return null;
}
