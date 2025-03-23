import React, { createContext, useContext, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";


export const NotificationContext = createContext(null);

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "success") => {
    const id = Date.now();

    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message, type, id },
    ]);

    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}

      {/* Toast Notifications */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center p-4 border-4 border-blue-900 bg-gray-900 text-white rounded-md shadow-lg transition-opacity duration-500"
          >
            {/* Icon based on type */}
            {notification.type === "success" ? (
              <CheckCircleIcon className="w-6 h-6 text-green-400 mr-2" />
            ) : (
              <XCircleIcon className="w-6 h-6 text-red-400 mr-2" />
            )}
            <span className="text-xs sm:text-base">{notification.message}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
