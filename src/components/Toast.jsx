import React from "react";
import { useNotifications } from "../context/NotificationContext";
import { FaRegCircleXmark, FaXmark } from "react-icons/fa6";

const Toast = () => {
  const { notifications, removeNotificationWithDelay } = useNotifications();

  return (
        <div className="toast-container fixed z-50 right-10 top-20">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`mb-2 flex items-center w-full max-w-xs p-4 gap-x-4 divide-x rtl:divide-x-reverse rounded-lg shadow text-gray-400 divide-gray-700 space-x bg-gray-800 animate__animated`}
              role="alert"
            >
              <FaRegCircleXmark
                className="h-5 w-5 flex-shrink-0 text-red-300"
                aria-hidden="true"
              />
              <div className="text-sm font-normal">{notification.message}</div>
              <FaXmark
                onClick={() => removeNotificationWithDelay(notification.id)}
              />
            </div>
          ))}
        </div>
  );
};

export default Toast;
