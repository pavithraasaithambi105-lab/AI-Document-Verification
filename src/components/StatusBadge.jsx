import {
  CheckCircle2,
  TriangleAlert,
  XCircle,
} from "lucide-react";

export default function StatusBadge({ status }) {
  const config = {
    Authentic: {
      icon: CheckCircle2,
      className: "status-authentic",
    },
    Suspicious: {
      icon: TriangleAlert,
      className: "status-suspicious",
    },
    Fake: {
      icon: XCircle,
      className: "status-fake",
    },
  };

  const item = config[status] || config.Suspicious;
  const Icon = item.icon;

  return (
    <span className={`status-badge ${item.className}`}>
      <Icon size={14} />
      {status}
    </span>
  );
}