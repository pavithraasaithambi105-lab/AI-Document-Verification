import {
  Bell,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";

export default function Topbar({ setMobileOpen }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={21} />
        </button>

        <div className="breadcrumb">
          <span>Workspace</span>
          <span>/</span>
          <strong>Document Security</strong>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="top-search">
          <Search size={17} />
          <input placeholder="Search documents..." />
          <kbd>⌘ K</kbd>
        </div>

        <button className="icon-button notification">
          <Bell size={19} />
          <span />
        </button>

        <div className="top-avatar">
          <div className="avatar-image">JD</div>

          <div className="top-user">
            <strong>John Doe</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}