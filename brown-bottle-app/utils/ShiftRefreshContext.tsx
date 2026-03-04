import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Shared refresh signal for shift-related UI.
type ShiftRefreshContextValue = {
  refreshTrigger: number;
  triggerShiftRefresh: () => void;
};

const ShiftRefreshContext = createContext<ShiftRefreshContextValue | null>(null);

export function ShiftRefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Incrementing a simple counter is an easy way to trigger dependent effects.
  const triggerShiftRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // Refresh when notification payload has shift/scr identifiers.
    // This keeps calendar + shift-cover screens in sync with push events.
    const shouldRefresh = (data: Record<string, unknown> | undefined) =>
      !!data && (typeof data.shift_id !== 'undefined' || typeof data.cover_request_id !== 'undefined');

    const onNotification = (notification: Notifications.Notification) => {
      const data = notification.request.content.data as Record<string, unknown> | undefined;
      if (shouldRefresh(data)) {
        triggerShiftRefresh();
      }
    };

    const notificationListener = Notifications.addNotificationReceivedListener(onNotification);
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown> | undefined;
      if (shouldRefresh(data)) {
        triggerShiftRefresh();
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [triggerShiftRefresh]);

  return (
    <ShiftRefreshContext.Provider value={{ refreshTrigger, triggerShiftRefresh }}>
      {children}
    </ShiftRefreshContext.Provider>
  );
}

export function useShiftRefresh(): ShiftRefreshContextValue {
  const ctx = useContext(ShiftRefreshContext);
  if (!ctx) {
    // Guard to catch usage outside provider during development.
    throw new Error('useShiftRefresh must be used within ShiftRefreshProvider');
  }
  return ctx;
}
