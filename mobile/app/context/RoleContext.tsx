import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'family' | 'volunteer';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  // Shared volunteer demo states
  isAvailable: boolean;
  setIsAvailable: (val: boolean) => void;
  demoStep: 'idle' | 'received' | 'accepted' | 'arrived' | 'verified' | 'completed' | 'checkout';
  setDemoStep: (step: 'idle' | 'received' | 'accepted' | 'arrived' | 'verified' | 'completed' | 'checkout') => void;
  isEmergencyAlertActive: boolean;
  setIsEmergencyAlertActive: (val: boolean) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('family');
  const [isAvailable, setIsAvailable] = useState(true);
  const [demoStep, setDemoStep] = useState<'idle' | 'received' | 'accepted' | 'arrived' | 'verified' | 'completed' | 'checkout'>('idle');
  const [isEmergencyAlertActive, setIsEmergencyAlertActive] = useState(false);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isAvailable,
        setIsAvailable,
        demoStep,
        setDemoStep,
        isEmergencyAlertActive,
        setIsEmergencyAlertActive,
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
