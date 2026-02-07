import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { relationService } from "../../services/relationService";
import { monthService } from "../../services/monthService";
import MonthCard from "../../components/MonthCard";
import "../../styles/dashboard.css";

function Months() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataRelation, setDataRelation] = useState(null);
  const [dataMonths, setDataMonths] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTarget, setNewTarget] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    relationService
      .retrieve(id)
      .then((res) => setDataRelation(res.data))
      .catch(() => navigate("/dashboard/relation"));

    monthService.list(id).then((res) => {
      setDataMonths(res.data.results || res.data || []);
    });
  }, [id, navigate]);

  const handleCreateMonth = async (e) => {
    e.preventDefault();
    if (!newTarget.trim()) return;

    setLoading(true);
    try {
      const response = await monthService.create(newTarget, id);
      setDataMonths([response.data, ...dataMonths]);
      setIsCreating(false);
      setNewTarget("");
    } catch (err) {
      alert("Ошибка при создании месяца");
    } finally {
      setLoading(false);
    }
  };

  if (!dataRelation) return <div className="loader">Загрузка...</div>;

  return (
    <div className="months-container">
      <header className="months-header">
        <div>
          <h1>Учебные периоды</h1>
          <p className="relation-email">
            Связь с:{" "}
            <strong>
              {dataRelation.student?.full_name || dataRelation.tutor?.full_name}
            </strong>
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="main-button"
            style={{ width: "auto", padding: "12px 24px" }}
          >
            + Создать месяц
          </button>
        )}
      </header>

      {isCreating && (
        <div className="invite-section animate-slide-down">
          <h3>Новый учебный период</h3>
          <form onSubmit={handleCreateMonth}>
            <textarea
              className="invite-input"
              placeholder="Введите цель обучения на этот месяц..."
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              style={{
                minHeight: "100px",
                marginBottom: "15px",
                resize: "vertical",
              }}
              required
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="main-button" disabled={loading}>
                {loading ? "Создание..." : "Подтвердить создание"}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="main-button"
                style={{ background: "#eee", color: "#333" }}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="months-grid">
        {dataMonths.length > 0 ? (
          dataMonths.map((month) => (
            <MonthCard key={month.id} month={month} relationId={id} />
          ))
        ) : (
          <div className="empty-state">Учебные месяцы еще не созданы.</div>
        )}
      </div>
    </div>
  );
}

export default Months;
