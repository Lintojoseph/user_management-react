// src/components/common/AppHeader.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';

const AppHeader = ({ title }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    'User';

  const initials =
    ((user?.first_name?.[0] || '') + (user?.last_name?.[0] || '') || fullName[0] || '').toUpperCase();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed, clearing session');
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="w-full bg-sky-200/50 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left - brand / logo */}
        <div className="text-lg font-semibold text-gray-800">SignSite</div>

        {/* Center - title (hidden on small screens) */}
        {title && (
          <h1 className="hidden text-xl font-semibold text-gray-900 sm:block">
            {title}
          </h1>
        )}

        {/* Right - notification + user info + logout */}
        <div className="flex items-center gap-4">
          {/* Notification (optional) */}
          <button
            type="button"
            className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-xl"
          >
            🔔
          </button>

          {/* User avatar + name + logout */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-500 text-sm font-semibold text-white">
              {user?.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="flex flex-col items-end">
              {/* <span className="max-w-[140px] truncate text-sm font-medium text-gray-800">
                {fullName}
              </span> */}
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
