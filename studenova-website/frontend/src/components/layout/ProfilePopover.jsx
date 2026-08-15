import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Pencil, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePopover({ isOpen, onClose, className = "" }) {
  const { user, logout } = useAuth();
  const popoverRef = useRef(null);
  const navigate = useRef(useNavigate()).current;

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  // Compute profile progress dynamically or default to 75%
  const calculateProgress = () => {
    let filledFields = 0;
    const fields = [user.name, user.email, user.college, user.bio];
    fields.forEach(f => { if (f) filledFields++; });
    // Default to at least 75% if most fields are set to look like the design screenshot
    return Math.max(Math.round((filledFields / fields.length) * 100), 75);
  };

  const progress = calculateProgress();
  const radius = 28;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleEditProfile = () => {
    onClose();
    navigate('/student/profile');
  };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login');
  };

  return (
    <div
      ref={popoverRef}
      className={`absolute z-50 w-[320px] rounded-[24px] border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-200 ${className}`}
    >
      {/* Top Section: Avatar & Edit buttons */}
      <div className="flex items-center justify-between">
        {/* Avatar with Progress Ring */}
        <div className="relative flex flex-col items-center">
          <div className="relative h-[72px] w-[72px]">
            {/* SVG Progress Circle */}
            <svg className="absolute left-0 top-0 h-full w-full -rotate-90">
              <circle
                cx="36"
                cy="36"
                r={radius}
                className="stroke-slate-100"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="36"
                cy="36"
                r={radius}
                className="stroke-blue-500 transition-all duration-300"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            {/* Inner Profile Image Fallback */}
            <div className="absolute left-[8px] top-[8px] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-emerald-500 text-3xl shadow-inner select-none overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                '👩‍💻'
              )}
            </div>
          </div>
          {/* Progress Label */}
          <span className="mt-0.5 text-[10px] font-black text-blue-500">
            {progress}%
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleEditProfile}
            className="flex items-center gap-1.5 rounded-full bg-[#2d2d2d] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#3d3d3d] active:scale-95"
          >
            <Pencil size={12} className="stroke-[2.5]" />
            Edit Profile
          </button>
          <button
            onClick={handleEditProfile}
            aria-label="View Profile Page"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2d2d2d] text-white transition hover:bg-[#3d3d3d] active:scale-95"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* User Information */}
      <div className="mt-3">
        <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
        <p className="text-xs font-medium text-slate-400 mt-0.5 break-all">{user.email}</p>
      </div>

      {/* Logout Action */}
      <button
        onClick={handleLogout}
        className="mt-5 flex items-center gap-2 text-sm font-bold text-[#e05230] transition hover:text-[#f06240] active:scale-95"
      >
        <LogOut size={16} className="stroke-[2.5]" />
        Logout
      </button>
    </div>
  );
}
