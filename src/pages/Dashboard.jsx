import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Fingerprint,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Activity,
  LockKeyhole,
  Zap,
  AlertTriangle,
  ShieldAlert,
  Database,
  Cpu,
} from "lucide-react";

import { Link } from "react-router-dom";

import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

import {
  dashboardStats,
  verificationHistory,
} from "../data/mockData";

export default function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="dashboard-hero">

        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-grid" />

        {/* LEFT SIDE */}

        <div className="hero-content">

          <div className="eyebrow">
            <span className="live-dot" />
            <Sparkles size={15} />
            AI SECURITY ENGINE ONLINE
          </div>

          <h1>
            Verify documents.
            <br />
            <span>Trust the data.</span>
          </h1>

          <p>
            Detect forged, manipulated and suspicious documents
            using AI-powered forensic analysis, OCR intelligence,
            QR validation and tamper detection.
          </p>

          <div className="hero-buttons">

            <Link
              to="/verify"
              className="primary-button"
            >
              <ScanLine size={18} />

              Verify a document

              <ArrowRight size={17} />
            </Link>

            <Link
              to="/history"
              className="secondary-button"
            >
              View verification history
            </Link>

          </div>

          {/* TRUST FEATURES */}

          <div className="hero-trust">

            <div className="trust-item">
              <ShieldCheck size={17} />
              <span>AI Powered</span>
            </div>

            <div className="trust-item">
              <LockKeyhole size={17} />
              <span>Secure Analysis</span>
            </div>

            <div className="trust-item">
              <Zap size={17} />
              <span>Instant Results</span>
            </div>

          </div>

        </div>


        {/* =====================================================
            3D VISUAL
        ===================================================== */}

        <div className="hero-visual">

          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="orb orb-one" />
          <div className="orb orb-two" />

          {/* 3D DOCUMENT */}

          <div className="document-3d">

            <div className="doc-shine" />

            {/* HEADER */}

            <div className="doc-header">

              <div className="doc-logo">
                <ShieldCheck size={19} />
              </div>

              <div>
                <span>SECURE AI</span>
                <strong>
                  VERIFICATION REPORT
                </strong>
              </div>

              <div className="doc-check">
                <CheckCircle2 size={20} />
              </div>

            </div>


            {/* TITLE */}

            <div className="doc-title">

              <span>
                DOCUMENT AUTHENTICATION
              </span>

              <h3>
                Certificate of
                <br />
                Authenticity
              </h3>

            </div>


            {/* LINES */}

            <div className="doc-lines">

              <div className="doc-line large" />

              <div className="doc-line" />

              <div className="doc-line short" />

            </div>


            {/* DATA */}

            <div className="doc-data-grid">

              <div>
                <span>DOCUMENT ID</span>
                <strong>VX-92841</strong>
              </div>

              <div>
                <span>ISSUED DATE</span>
                <strong>28 AUG 2026</strong>
              </div>

              <div>
                <span>AI ANALYSIS</span>
                <strong>COMPLETE</strong>
              </div>

              <div>
                <span>RISK LEVEL</span>
                <strong className="safe-text">
                  VERY LOW
                </strong>
              </div>

            </div>


            {/* SCORE */}

            <div className="verification-ring">

              <div className="ring-inner">

                <strong>98</strong>

                <span>
                  TRUST
                </span>

              </div>

            </div>


            {/* FOOTER */}

            <div className="doc-footer">

              <div>
                <CheckCircle2 size={15} />
                AUTHENTIC DOCUMENT
              </div>

              <QrCode size={29} />

            </div>

          </div>


          {/* =====================================================
              AI FORENSICS CARD
          ===================================================== */}

          <div className="floating-card floating-card-one">

            <div className="floating-icon">
              <Fingerprint size={19} />
            </div>

            <div>
              <strong>AI Forensics</strong>

              <span>
                24 security checks passed
              </span>
            </div>

            <CheckCircle2 size={17} />

          </div>


          {/* =====================================================
              RISK CARD
          ===================================================== */}

          <div className="floating-card floating-card-two">

            <div className="mini-pulse" />

            <div>
              <strong>Risk Level</strong>

              <span>
                Very Low · 1.2%
              </span>
            </div>

          </div>


          {/* =====================================================
              LIVE SCAN CARD
          ===================================================== */}

          <div className="floating-card floating-card-three">

            <ScanLine size={18} />

            <div>
              <strong>Live Analysis</strong>

              <span>
                AI engine ready
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="stats-grid">

        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))}

      </section>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="quick-actions">

        <Link
          to="/verify"
          className="quick-action-card"
        >

          <div className="quick-action-icon">
            <ScanLine size={22} />
          </div>

          <div>
            <strong>
              Verify Document
            </strong>

            <span>
              Upload and analyze a document
            </span>
          </div>

          <ArrowRight size={18} />

        </Link>


        <Link
          to="/verify"
          className="quick-action-card"
        >

          <div className="quick-action-icon">
            <QrCode size={22} />
          </div>

          <div>
            <strong>
              Scan QR Code
            </strong>

            <span>
              Validate document information
            </span>
          </div>

          <ArrowRight size={18} />

        </Link>


        <Link
          to="/history"
          className="quick-action-card"
        >

          <div className="quick-action-icon">
            <FileSearch size={22} />
          </div>

          <div>
            <strong>
              Review History
            </strong>

            <span>
              View previous verification results
            </span>
          </div>

          <ArrowRight size={18} />

        </Link>

      </section>


      {/* =====================================================
          ANALYTICS + SECURITY
      ===================================================== */}

      <section className="dashboard-grid">

        {/* ANALYTICS */}

        <div className="panel analytics-panel">

          <div className="panel-header">

            <div>

              <span className="panel-kicker">
                ANALYTICS
              </span>

              <h2>
                Verification activity
              </h2>

              <p className="panel-description">
                AI verification volume over the last seven days.
              </p>

            </div>

            <select className="chart-select">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>

          </div>


          {/* CHART */}

          <div className="chart">

            <div className="chart-y">

              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>

            </div>


            <div className="chart-area">

              <div className="grid-lines">

                <span />
                <span />
                <span />
                <span />
                <span />

              </div>


              <svg
                viewBox="0 0 600 230"
                preserveAspectRatio="none"
                className="chart-svg"
              >

                <defs>

                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#ff8a1f"
                      stopOpacity=".35"
                    />

                    <stop
                      offset="100%"
                      stopColor="#ff8a1f"
                      stopOpacity="0"
                    />

                  </linearGradient>

                </defs>


                <path
                  d="
                    M0,175
                    C50,145 80,155 120,120
                    S180,105 220,130
                    S280,75 320,92
                    S390,52 430,82
                    S490,50 530,68
                    S570,25 600,42
                    L600,230
                    L0,230
                    Z
                  "
                  fill="url(#chartGradient)"
                />


                <path
                  d="
                    M0,175
                    C50,145 80,155 120,120
                    S180,105 220,130
                    S280,75 320,92
                    S390,52 430,82
                    S490,50 530,68
                    S570,25 600,42
                  "
                  fill="none"
                  stroke="#ff8a1f"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

              </svg>


              <div className="chart-labels">

                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>

              </div>

            </div>

          </div>


          {/* ANALYTICS FOOTER */}

          <div className="analytics-footer">

            <div>
              <Activity size={16} />
              <span>Total verifications</span>
              <strong>842</strong>
            </div>

            <div>
              <CheckCircle2 size={16} />
              <span>Authentic</span>
              <strong>796</strong>
            </div>

            <div>
              <AlertTriangle size={16} />
              <span>Suspicious</span>
              <strong>46</strong>
            </div>

          </div>

        </div>


        {/* SECURITY */}

        <div className="panel security-panel">

          <div className="panel-kicker">
            SECURITY HEALTH
          </div>

          <h2>
            Trust score
          </h2>


          <div className="big-score">

            <div className="score-ring">

              <div>

                <strong>
                  94
                </strong>

                <span>
                  /100
                </span>

              </div>

            </div>

          </div>


          <div className="score-status">

            <CheckCircle2 size={17} />

            Excellent security posture

          </div>


          <p>
            Your verification environment is protected
            against common document fraud patterns.
          </p>


          {/* SECURITY METRICS */}

          <div className="security-metrics">

            <SecurityMetric
              label="OCR Analysis"
              value="99%"
            />

            <SecurityMetric
              label="Tamper Detection"
              value="96%"
            />

            <SecurityMetric
              label="QR Validation"
              value="94%"
            />

            <SecurityMetric
              label="Metadata Analysis"
              value="91%"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          AI WORKFLOW
      ===================================================== */}

      <section className="panel workflow-panel">

        <div className="panel-header">

          <div>

            <span className="panel-kicker">
              AI VERIFICATION PIPELINE
            </span>

            <h2>
              How your documents are analyzed
            </h2>

          </div>

        </div>


        <div className="workflow">

          <WorkflowStep
            number="01"
            icon={<FileSearch size={21} />}
            title="Document Upload"
            description="Securely upload PDF, JPG or PNG documents."
          />

          <WorkflowLine />

          <WorkflowStep
            number="02"
            icon={<ScanLine size={21} />}
            title="OCR Analysis"
            description="Extract and compare text from the document."
          />

          <WorkflowLine />

          <WorkflowStep
            number="03"
            icon={<Fingerprint size={21} />}
            title="AI Forensics"
            description="Detect edits, inconsistencies and manipulation."
          />

          <WorkflowLine />

          <WorkflowStep
            number="04"
            icon={<QrCode size={21} />}
            title="QR Validation"
            description="Check QR data against trusted information."
          />

          <WorkflowLine />

          <WorkflowStep
            number="05"
            icon={<ShieldCheck size={21} />}
            title="Final Result"
            description="Generate authenticity and risk score."
          />

        </div>

      </section>


      {/* =====================================================
          RECENT VERIFICATIONS
      ===================================================== */}

      <section className="panel recent-panel">

        <div className="panel-header">

          <div>

            <span className="panel-kicker">
              RECENT ACTIVITY
            </span>

            <h2>
              Latest verifications
            </h2>

          </div>


          <Link
            to="/history"
            className="text-button"
          >
            View all
            <ArrowRight size={16} />
          </Link>

        </div>


        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>DOCUMENT</th>
                <th>TYPE</th>
                <th>DATE</th>
                <th>AI SCORE</th>
                <th>STATUS</th>

              </tr>

            </thead>


            <tbody>

              {verificationHistory
                .slice(0, 4)
                .map((item) => (

                  <tr key={item.id}>

                    <td>

                      <div className="document-cell">

                        <div className="small-file-icon">
                          <FileSearch size={17} />
                        </div>


                        <div>

                          <strong>
                            {item.name}
                          </strong>

                          <span>
                            {item.id}
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>
                      {item.type}
                    </td>


                    <td>

                      <div>
                        {item.date}
                      </div>

                      <small>
                        {item.time}
                      </small>

                    </td>


                    <td>

                      <div className="table-score">

                        <strong>
                          {item.score}%
                        </strong>

                        <div className="score-progress">

                          <span
                            style={{
                              width: `${item.score}%`,
                            }}
                          />

                        </div>

                      </div>

                    </td>


                    <td>

                      <StatusBadge
                        status={item.status}
                      />

                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* =====================================================
          SECURITY TECHNOLOGY
      ===================================================== */}

      <section className="security-tech-grid">

        <TechCard
          icon={<Cpu size={22} />}
          title="AI Forensics"
          text="Machine learning models inspect visual inconsistencies and suspicious modifications."
        />

        <TechCard
          icon={<Database size={22} />}
          title="Metadata Analysis"
          text="Document metadata is analyzed for unexpected creation and modification patterns."
        />

        <TechCard
          icon={<QrCode size={22} />}
          title="QR Intelligence"
          text="Embedded QR information can be extracted and compared against trusted data."
        />

        <TechCard
          icon={<ShieldAlert size={22} />}
          title="Fraud Detection"
          text="Suspicious signals are combined into an overall document risk assessment."
        />

      </section>

    </div>
  );
}


/* ============================================================
   SECURITY METRIC
============================================================ */

function SecurityMetric({
  label,
  value,
}) {
  return (
    <div className="security-metric">

      <div>

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>


      <div className="metric-bar">

        <span
          style={{
            width: value,
          }}
        />

      </div>

    </div>
  );
}


/* ============================================================
   WORKFLOW STEP
============================================================ */

function WorkflowStep({
  number,
  icon,
  title,
  description,
}) {
  return (
    <div className="workflow-step">

      <div className="workflow-number">
        {number}
      </div>

      <div className="workflow-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

    </div>
  );
}


/* ============================================================
   WORKFLOW CONNECTOR
============================================================ */

function WorkflowLine() {
  return (
    <div className="workflow-line">
      <ArrowRight size={16} />
    </div>
  );
}


/* ============================================================
   TECHNOLOGY CARD
============================================================ */

function TechCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="tech-card">

      <div className="tech-icon">
        {icon}
      </div>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}