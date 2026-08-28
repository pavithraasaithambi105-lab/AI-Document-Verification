import {
  ArrowRight,
  Fingerprint,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">

      <div className="auth-visual">

        <div className="auth-glow glow-one" />
        <div className="auth-glow glow-two" />

        <div className="auth-brand">
          <div className="brand-logo">
            <ShieldCheck size={23} />
          </div>

          <div className="brand-name">
            Veri<span>fy</span>
          </div>
        </div>

        <div className="auth-content">
          <div className="eyebrow">
            <Sparkles size={14} />
            AI DOCUMENT SECURITY
          </div>

          <h1>
            Trust what
            <br />
            <span>you verify.</span>
          </h1>

          <p>
            Intelligent document verification built to
            detect fraud before it becomes a problem.
          </p>

          <div className="auth-stats">
            <div>
              <strong>1.2M+</strong>
              <span>Documents analyzed</span>
            </div>

            <div>
              <strong>99.2%</strong>
              <span>Detection accuracy</span>
            </div>
          </div>
        </div>

        <div className="auth-document">
          <div className="auth-doc-top">
            <ShieldCheck size={18} />
            VERIFIED
          </div>

          <div className="auth-doc-line large" />
          <div className="auth-doc-line" />
          <div className="auth-doc-line short" />

          <div className="auth-fingerprint">
            <Fingerprint size={37} />
          </div>

          <div className="auth-doc-bottom">
            <span>AUTHENTIC</span>
            <span>98.4%</span>
          </div>
        </div>
      </div>

      <div className="auth-form-area">

        <div className="auth-form">

          <div className="mobile-auth-brand">
            <div className="brand-logo">
              <ShieldCheck size={21} />
            </div>
            <strong>Verify</strong>
          </div>

          <div className="form-intro">
            <span>WELCOME BACK</span>

            <h2>Sign in to your workspace</h2>

            <p>
              Continue protecting your documents with
              AI-powered verification.
            </p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label>Email address</label>

              <input
                type="email"
                placeholder="you@example.com"
                defaultValue="john@example.com"
              />
            </div>

            <div className="form-group">
              <div className="password-label">
                <label>Password</label>
                <a href="#forgot">Forgot password?</a>
              </div>

              <div className="password-input">
                <Lock size={17} />

                <input
                  type="password"
                  placeholder="••••••••"
                  defaultValue="password"
                />
              </div>
            </div>

            <label className="remember">
              <input type="checkbox" defaultChecked />
              <span />
              Remember me
            </label>

            <button className="auth-submit">
              Sign in
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            className="demo-button"
            onClick={() => navigate("/dashboard")}
          >
            Continue with demo workspace
          </button>

          <div className="auth-footer">
            Don't have an account?
            <Link to="/register">Create account</Link>
          </div>

          <div className="auth-security">
            <ShieldCheck size={14} />
            Protected by enterprise-grade security
          </div>
        </div>
      </div>
    </div>
  );
}