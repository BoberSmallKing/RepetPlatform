import { Link } from "react-router-dom";

function MonthCard({ month, relationId }) {
  return (
    <Link
      to={`/dashboard/relation/${relationId}/months/${month.id}`}
      className="month-card"
    >
      <div className="month-card-image">
        {month.image ? (
          <img src={month.image} alt={month.title} className="month-img" />
        ) : (
          <div className="month-placeholder" />
        )}
        <div className="month-overlay" />
        <span className="month-badge">{month.year}</span>
      </div>
      <div className="month-card-content">
        <h4 className="month-title">{month.title}</h4>
        <p className="month-target-text">{month.month_target}</p>
        <div className="month-footer">
          <span>Подробнее</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default MonthCard;
