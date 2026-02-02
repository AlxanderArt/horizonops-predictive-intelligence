import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Activity,
  Globe,
  Terminal,
  Settings,
  LayoutGrid,
  LogOut,
  Search,
  Clock,
  Bell,
  Play,
  User,
  Menu,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Command Console' },
  { to: '/dashboard/telemetry', icon: Activity, label: 'Live Telemetry' },
  { to: '/dashboard/security', icon: ShieldCheck, label: 'Security Core' },
  { to: '/dashboard/fleet', icon: Globe, label: 'Fleet Network' },
  { to: '/dashboard/logs', icon: Terminal, label: 'Kernel Logs' },
  { to: '/dashboard/parameters', icon: Settings, label: 'Parameters' },
];

export function Layout() {
  const navigate = useNavigate();
  const { mode, user, isDemo, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getModeConfig = () => {
    if (isDemo) {
      return {
        label: 'DEMO MODE',
        icon: Play,
        bgColor: 'bg-[#4fa3d1]/20',
        borderColor: 'border-[#4fa3d1]/30',
        textColor: 'text-[#4fa3d1]',
        description: 'Viewing simulated data'
      };
    }
    return {
      label: 'AUTHENTICATED',
      icon: User,
      bgColor: 'bg-[#3FB950]/20',
      borderColor: 'border-[#3FB950]/30',
      textColor: 'text-[#3FB950]',
      description: 'Personal data'
    };
  };

  const modeConfig = getModeConfig();
  const ModeIcon = modeConfig.icon;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b1320] text-[#e2e8f0]">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Desktop always visible, Mobile as drawer */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-64 bg-[#0d1624] border-r border-white/5 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 lg:p-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            onClick={closeMobileMenu}
          >
            <div className="w-8 h-8 bg-[#4fa3d1] rounded flex items-center justify-center text-white shrink-0">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <span className="font-bold tracking-tight text-lg uppercase italic text-white">
              HorizonOps <span className="text-[#4fa3d1] not-italic">Command</span>
            </span>
          </Link>
          {/* Mobile close button */}
          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#4fa3d1] rounded"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-2 lg:mt-6" role="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 lg:px-6 py-3 lg:py-4 cursor-pointer transition-all border-l-3 border-transparent group focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4fa3d1] ${
                  isActive
                    ? 'sidebar-item-active text-white'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-[#4fa3d1]' : 'group-hover:text-slate-300'}>
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fa3d1]"
            aria-label="Log out"
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center shrink-0">
              {isDemo ? (
                <Play size={16} className="text-[#4fa3d1]" aria-hidden="true" />
              ) : (
                <User size={16} className="text-slate-400" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-bold text-white leading-none truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {isDemo ? 'Demo Mode' : user?.role || 'Operator'}
              </p>
            </div>
            <LogOut size={14} className="text-slate-600" aria-hidden="true" />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Command Bar */}
        <header className="h-14 lg:h-16 border-b border-white/5 bg-[#0b1320] flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-3 lg:gap-6">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fa3d1] rounded"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu size={20} />
            </button>

            {/* Search - hidden on mobile */}
            <div className="hidden md:flex items-center bg-[#151d29] border border-white/5 rounded px-3 py-1.5 w-48 lg:w-64">
              <Search size={14} className="text-slate-500 mr-2" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-xs w-full text-slate-300"
                aria-label="Search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Mode Indicator */}
            <div className={`flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 ${modeConfig.bgColor} border ${modeConfig.borderColor} rounded`}>
              <ModeIcon size={14} className={modeConfig.textColor} aria-hidden="true" />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${modeConfig.textColor} hidden sm:inline`}>
                {modeConfig.label}
              </span>
            </div>

            {/* Date - hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#151d29] border border-white/5 rounded text-xs text-slate-400">
              <Clock size={14} aria-hidden="true" />
              <span className="mono">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>

            {/* Notifications */}
            <button
              className="p-2 text-slate-500 hover:text-white transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fa3d1] rounded"
              aria-label="View notifications"
            >
              <Bell size={18} aria-hidden="true" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></span>
            </button>
          </div>
        </header>

        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="bg-[#4fa3d1]/10 border-b border-[#4fa3d1]/20 px-4 lg:px-8 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Play size={14} className="text-[#4fa3d1] shrink-0" aria-hidden="true" />
              <span className="text-[#4fa3d1] text-xs font-medium truncate">
                <span className="hidden sm:inline">Demo Mode: Viewing simulated aerospace manufacturing data</span>
                <span className="sm:hidden">Demo Mode</span>
              </span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="text-[#4fa3d1] text-xs hover:underline shrink-0 ml-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4fa3d1] rounded px-1"
            >
              Exit
            </button>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>

        {/* Global Footer - hidden on mobile */}
        <footer className="hidden md:flex h-10 bg-[#0d1624] border-t border-white/5 items-center justify-between px-4 lg:px-8 text-[9px] font-bold text-slate-600 uppercase tracking-widest shrink-0">
          <div className="flex items-center gap-4 lg:gap-6">
            <span>Server Latency: <span className="text-emerald-500">{isDemo ? '14ms' : '--'}</span></span>
            <span className="hidden lg:inline">Uptime: {isDemo ? '99.998%' : '--'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline">Facility: {isDemo ? 'TX-DA-092 (Lockheed Martin Cluster)' : 'Not Connected'}</span>
            <span className="lg:hidden">{isDemo ? 'TX-DA-092' : 'Offline'}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
