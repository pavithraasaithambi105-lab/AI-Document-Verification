import {
  Bell,
  Check,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function Profile() {
  return (
    <div className="profile-page">

      <div className="page-heading">
        <div>
          <div className="heading-kicker">
            ACCOUNT
          </div>

          <h1>Profile & settings</h1>

          <p>
            Manage your account and verification
            preferences.
          </p>
        </div>
      </div>

      <div className="profile-layout">

        <div className="panel profile-card">
          <div className="profile-cover" />

          <div className="profile-avatar">
            JD
          </div>

          <div className="profile-main">
            <h2>John Doe</h2>
            <p>Administrator</p>

            <div className="profile-email">
              <Mail size={15} />
              john@example.com
            </div>
          </div>

          <div className="profile-badges">
            <span>
              <ShieldCheck size={14} />
              Verified account
            </span>
          </div>
        </div>

        <div className="panel settings-card">
          <div className="settings-header">
            <div>
              <span className="panel-kicker">
                PERSONAL INFORMATION
              </span>
              <h2>Account details</h2>
            </div>

            <UserRound size={21} />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>First name</label>
              <input defaultValue="John" />
            </div>

            <div className="form-group">
              <label>Last name</label>
              <input defaultValue="Doe" />
            </div>

            <div className="form-group full">
              <label>Email address</label>

              <div className="input-with-icon">
                <Mail size={17} />
                <input defaultValue="john@example.com" />
              </div>
            </div>
          </div>

          <button className="primary-button">
            <Save size={17} />
            Save changes
          </button>
        </div>

        <div className="panel settings-card">
          <div className="settings-header">
            <div>
              <span className="panel-kicker">
                SECURITY
              </span>
              <h2>Security preferences</h2>
            </div>

            <Lock size={21} />
          </div>

          <Setting
            title="Verification notifications"
            description="Receive notifications when suspicious documents are detected."
          />

          <Setting
            title="Automatic document deletion"
            description="Delete uploaded documents after verification."
          />

          <Setting
            title="Login alerts"
            description="Receive alerts when your account is accessed."
          />
        </div>
      </div>
    </div>
  );
}

function Setting({ title, description }) {
  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <div className="toggle active">
        <div>
          <Check size={12} />
        </div>
      </div>
    </div>
  );
}