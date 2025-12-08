// src/components/common/AppHeader.js
import React from 'react';
import { authService } from '../../services/authService';

const AppHeader = ({ title }) => {
  const user = authService.getCurrentUser();
  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    'User';
  const initials =
    (user?.first_name?.[0] || '') + (user?.last_name?.[0] || '');

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

        {/* Right - notification + avatar */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-xl"
          >
            🔔
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-500 text-sm font-semibold text-white">
              {user?.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                (initials || fullName[0] || '').toUpperCase()
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
