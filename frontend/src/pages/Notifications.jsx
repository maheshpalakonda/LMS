import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import { useSelector, useDispatch } from 'react-redux';
import { setNotifications, markNotificationAsRead } from '../redux/userSlice';
import { serverUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

function Notifications() {
  const dispatch = useDispatch();
  const { userData, notifications } = useSelector(state => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [userData]);

  const fetchNotifications = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/notifications", {withCredentials: true});
      dispatch(setNotifications(result.data.notifications));
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.post(serverUrl + `/api/user/notifications/${id}/read`, {}, {withCredentials: true});
      dispatch(markNotificationAsRead(id));
      toast.success("Notification marked as read");
    } catch (error) {
      console.log(error);
      toast.error("Failed to mark as read");
    }
  };

  if (!userData) {
    return (
      <div>
        <Nav />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl">Please login to view notifications</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="min-h-screen py-[130px] px-[20px]">
        <h1 className="text-3xl font-bold mb-6">My Notifications</h1>
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500">No notifications</p>
        ) : (
          <div className="space-y-4">
            {notifications.map(notif => (
              <div key={notif._id} className={`p-4 border rounded-lg ${!notif.read ? 'bg-gray-100 border-blue-500' : 'bg-white border-gray-300'}`}>
                <p className="text-sm">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(notif.createdAt).toLocaleDateString()}</p>
                {!notif.read && (
                  <button
                    className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    onClick={() => handleMarkAsRead(notif._id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
