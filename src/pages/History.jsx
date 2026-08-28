import {
  CalendarDays,
  Download,
  FileSearch,
  Filter,
  Search,
} from "lucide-react";

import StatusBadge from "../components/StatusBadge";

import { verificationHistory } from "../data/mockData";

export default function History() {
  return (
    <div className="history-page">

      <div className="page-heading">
        <div>
          <div className="heading-kicker">
            VERIFICATION LOG
          </div>

          <h1>Verification history</h1>

          <p>
            Review and monitor all previously analyzed
            documents.
          </p>
        </div>

        <button className="outline-button">
          <Download size={17} />
          Export CSV
        </button>
      </div>

      <div className="history-toolbar">
        <div className="history-search">
          <Search size={17} />
          <input placeholder="Search documents..." />
        </div>

        <button className="filter-button">
          <CalendarDays size={17} />
          Date range
        </button>

        <button className="filter-button">
          <Filter size={17} />
          Status
        </button>
      </div>

      <div className="panel history-panel">
        <div className="history-summary">
          <div>
            <strong>1,284</strong>
            <span>Total verifications</span>
          </div>

          <div>
            <strong>1,108</strong>
            <span>Authentic</span>
          </div>

          <div>
            <strong>126</strong>
            <span>Suspicious</span>
          </div>

          <div>
            <strong>50</strong>
            <span>Fraud detected</span>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>DOCUMENT</th>
                <th>TYPE</th>
                <th>VERIFIED ON</th>
                <th>AI SCORE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {verificationHistory.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="document-cell">
                      <div className="small-file-icon">
                        <FileSearch size={17} />
                      </div>

                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>{item.type}</td>

                  <td>
                    <strong>{item.date}</strong>
                    <small>{item.time}</small>
                  </td>

                  <td>
                    <div className="table-score">
                      <strong>{item.score}%</strong>

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
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>Showing 1–5 of 1,284</span>

          <div>
            <button>‹</button>
            <button className="current">1</button>
            <button>2</button>
            <button>3</button>
            <button>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}