import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the session data
interface SessionContextType {
  employeeId: number | null;
  setEmployeeId: (id: number) => void;
}

// Create the context with an undefined default
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Provider to wrap around the app and give session data to components
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [employeeId, setEmployeeId] = useState<number | null>(null); // Store employee_id

  return (
    <SessionContext.Provider value={{ employeeId, setEmployeeId }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to access session data easily
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
