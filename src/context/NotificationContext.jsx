import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    setNotifications([notification, ...notifications]);
    setTimeout(() => {
      setNotifications((currentNotifications) =>
        currentNotifications.filter((notif) => notif.id !== notification.id)
      );
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const removeNotificationWithDelay = (id) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, removing: true }
          : notification
      )
    );
    setTimeout(() => {
      setNotifications((currentNotifications) =>
        currentNotifications.filter((notification) => notification.id !== id)
      );
    }, 0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        removeNotificationWithDelay,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
