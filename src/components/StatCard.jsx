import {
  FileCheck2,
  ShieldCheck,
  TriangleAlert,
  ScanLine,
} from "lucide-react";

const icons = {
  scan: ScanLine,
  shield: ShieldCheck,
  warning: TriangleAlert,
  fraud: FileCheck2,
};

export default function StatCard({
  title,
  value,
  change,
  description,
  icon,
}) {
  const Icon = icons[icon] || ShieldCheck;

  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className={`stat-icon ${icon}`}>
          <Icon size={21} />
        </div>

        <span className="stat-change">{change}</span>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-label">{title}</div>

      <div className="stat-description">{description}</div>

      <div className="stat-line">
        <span />
      </div>
    </div>
  );
}