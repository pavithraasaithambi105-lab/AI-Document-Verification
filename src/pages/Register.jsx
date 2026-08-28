import {
  ArrowRight,
  CheckCircle2,
  Lock,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">

      <div className="auth-visual register-visual">

        <div className="auth-brand">
          <div className="brand-logo">
            <ShieldCheck size={23} />
          </div>

          <div className="brand-name">
            Veri<span>fy</span>
          </div>
        </div>

        <div className="register-message">
          <span>GET STARTED</span>

          <h1>
            Build trust into
            <br />
            <span>every document.</span>
          </h1>

          <p>
            Create your secure verification workspace and
            start detecting document fraud.
          </p>

          <div className="feature-list">
            <Feature text="AI-powered tamper detection" />
            <Feature text="QR and digital signature validation" />
            <Feature text="Complete verification history" />
            <Feature text="Enterprise-grade encryption" />
          </div>
        </div>
      </div>

      <div className="auth-form-area">

        <div className="auth-form">

          <div className="form-intro">
            <span>CREATE ACCOUNT</span>

            <h2>Start verifying documents</h2>

            <p>
              Create your account in less than a minute.
            </p>
          </div>

          <form onSubmit={handleRegister}>

            <div className="form-grid">
              <div className="form-group">
                <label>First name</label>
                <input placeholder="John" />
              </div>

              <div className="form-group">
                <label>Last name</label>
                <input placeholder="Doe" />
              </div>
            </div>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <div className="password-input">
                <Lock size={17} />

                <input
                  type="password"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <label className="terms">
              <input type="checkbox" required />
              <span />
              I agree to the Terms of Service and Privacy
              Policy.
            </label>

            <button className="auth-submit">
              Create account
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </div>

          <div className="auth-security">
            <CheckCircle2 size={14} />
            Your account is protected with secure encryption
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="register-feature">
      <CheckCircle2 size={17} />
      <span>{text}</span>
    </div>
  );
}