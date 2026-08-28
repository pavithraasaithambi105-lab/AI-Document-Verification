import {
  LayoutDashboard,
  ScanLine,
  History,
  UserRound,
  Settings,
  ShieldCheck,
  LogOut,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Verify Document",
    path: "/verify",
    icon: ScanLine,
  },
  {
    label: "Verification History",
    path: "/history",
    icon: History,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserRound,
  },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/login");
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">
            <ShieldCheck size={23} />
          </div>

          <div>
            <div className="brand-name">Veri<span>fy</span></div>
            <div className="brand-subtitle">AI DOCUMENT SECURITY</div>
          </div>
        </div>

        <div className="workspace-card">
          <div className="workspace-icon">
            <ShieldCheck size={18} />
          </div>

          <div>
            <span>Workspace</span>
            <strong>Personal Account</strong>
          </div>

          <ChevronRight size={15} />
        </div>

        <div className="nav-section">
          <p className="nav-title">MAIN MENU</p>

          <nav>
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="nav-section settings-section">
          <p className="nav-title">SYSTEM</p>

          <NavLink to="/profile" className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </NavLink>

          <button className="nav-item nav-button">
            <HelpCircle size={19} />
            <span>Help Center</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="security-status">
            <div className="pulse-dot" />

            <div>
              <strong>AI Security Active</strong>
              <span>System operational</span>
            </div>
          </div>

          <button className="logout-button" onClick={logout}>
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}