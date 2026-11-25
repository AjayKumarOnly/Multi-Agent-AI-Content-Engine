import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  GitBranch,
  History,
  BarChart3,
  Scale,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Cpu,
} from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const ICONS = {
  LayoutDashboard,
  Sparkles,
  GitBranch,
  History,
  BarChart3,
  Scale,
  Settings,
};

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentNav = NAV_ITEMS.find((n) => n.path === location.pathname) || NAV_ITEMS[0];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-canvas-surface border-r border-border-subtle select-none">
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-border-subtle shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-tight text-ink-primary truncate">
                Multi-Agent Engine
              </p>
              <p className="text-[10px] text-ink-muted truncate">LangGraph Orchestrator</p>
            </div>
          )}
        </div>
        {isMobile ? (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md text-ink-muted hover:text-ink-primary hover:bg-canvas-hover"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-md text-ink-muted hover:text-ink-primary hover:bg-canvas-hover hidden lg:inline-flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon] || LayoutDashboard;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => isMobile && setMobileOpen(false)}
              title={collapsed && !isMobile ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-subtle text-violet-500 dark:text-violet-400'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-canvas-hover'
                } ${collapsed && !isMobile ? 'justify-center' : ''}`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile, Theme & Logout */}
      <div className="p-2.5 border-t border-border-subtle space-y-2 shrink-0">
        <div
          className={`flex items-center gap-2 ${
            collapsed && !isMobile ? 'flex-col' : 'justify-between'
          }`}
        >
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-ink-secondary hover:text-ink-primary hover:bg-canvas-hover w-full justify-center"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Moon className="w-3.5 h-3.5 shrink-0" />
            )}
            {(!collapsed || isMobile) && (
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-ink-secondary hover:text-rose-500 hover:bg-rose-500/10 w-full justify-center"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>

        <div
          className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-canvas-elevated/70 ${
            collapsed && !isMobile ? 'justify-center' : ''
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center text-xs font-semibold shrink-0">
            {user?.avatarInitials || 'AR'}
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-ink-primary truncate">
                {user?.name || 'Alex Rivera'}
              </p>
              <p className="text-[11px] text-ink-muted truncate">
                {user?.email || 'alex.rivera@contentengine.ai'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-canvas text-ink-primary">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ${
          collapsed ? 'w-[68px]' : 'w-[236px]'
        }`}
      >
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            <SidebarContent isMobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border-subtle bg-canvas-surface/80 backdrop-blur-sm sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-canvas-hover"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-medium text-ink-muted hidden sm:inline">
                Multi – Agent AI Content Engine
              </span>
              <span className="text-ink-muted hidden sm:inline">/</span>
              <h1 className="text-sm font-semibold text-ink-primary truncate">
                {currentNav.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-border-subtle bg-canvas-elevated text-ink-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Engine Ready (Demo SSE)
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
