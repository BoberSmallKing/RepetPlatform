import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { relationService } from "../../services/relationService";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/Input";
import "../../styles/dashboard.css";

function Relation() {
  const { user } = useAuth();
  const [relations, setRelations] = useState([]);
  const [copied, setCopied] = useState(false);
  const [selectedRel, setSelectedRel] = useState(null);
  const [formData, setFormData] = useState({
    target: "",
    lesson_type: "online",
  });

  useEffect(() => {
    loadRelations();
  }, []);

  const loadRelations = () => {
    relationService.list().then((res) => {
      setRelations(res.data.results || res.data || []);
    });
  };

  const handleUpdateRelation = async (e) => {
    e.preventDefault();
    try {
      await relationService.update(selectedRel.id, formData);
      setSelectedRel(null);
      loadRelations();
    } catch (err) {
      alert("Ошибка при сохранении данных");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setSelectedRel(null);
    }
  };

  const openModal = (e, rel) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedRel(rel);
    setFormData({
      target: rel.target || "",
      lesson_type: rel.lesson_type || "online",
    });
  };

  return (
    <div className="relation-page">
      <h1>Управление связями</h1>

      {user?.role === "tutor" && user?.tutor_profile?.invite_code && (
        <div className="invite-section">
          <h3>Пригласительная ссылка</h3>
          <div className="invite-grid">
            <input
              readOnly
              value={`${window.location.origin}/join/${user.tutor_profile.invite_code}`}
              className="invite-input"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/join/${user.tutor_profile.invite_code}`
                );
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="main-button"
              style={{ width: "auto", margin: 0 }}
            >
              {copied ? "Скопировано" : "Копировать"}
            </button>
          </div>
        </div>
      )}

      <div className="relations-list">
        <h3>
          {user?.role === "tutor" ? "Список учеников" : "Мои преподаватели"}
        </h3>

        {relations.length > 0 ? (
          relations.map((rel) => {
            const person = user?.role === "tutor" ? rel.student : rel.tutor;
            const isFilled = rel.target && rel.lesson_type;

            return (
              <Link
                key={rel.id}
                to={`/dashboard/relation/${rel.id}`}
                className="relation-item-card"
              >
                <div className="relation-info">
                  <div className="status-container">
                    {isFilled ? (
                      <span className="status-text completed">
                        <span className="check-icon">✓</span> Карточка заполнена
                      </span>
                    ) : user?.role === "tutor" ? (
                      <button
                        className="fill-link-btn"
                        onClick={(e) => openModal(e, rel)}
                      >
                        Заполнить данные
                      </button>
                    ) : (
                      <span className="status-text pending">
                        📌 Репетитор запоняет информацию
                      </span>
                    )}
                  </div>
                  <div className="relation-name">
                    {person?.user?.full_name || person?.full_name}
                  </div>
                  <div className="relation-email">
                    {person?.user?.email || person?.email}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="empty-state">У вас пока нет активных связей.</p>
        )}
      </div>

      {selectedRel && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setSelectedRel(null)}
            >
              &times;
            </button>
            <h3>Параметры обучения</h3>
            <p className="modal-subtitle">
              Настройка для: {selectedRel.student?.full_name}
            </p>

            <form onSubmit={handleUpdateRelation}>
              <Input
                label="Цель занятий"
                placeholder="Напр: Подготовка к IELTS"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })
                }
                required
              />
              <div className="select-group">
                <label>Формат обучения</label>
                <select
                  className="select-input"
                  value={formData.lesson_type}
                  onChange={(e) =>
                    setFormData({ ...formData, lesson_type: e.target.value })
                  }
                >
                  <option value="online">Онлайн сессии</option>
                  <option value="offline">Офлайн встречи</option>
                  <option value="mixed">Смешанный формат</option>
                </select>
              </div>
              <button type="submit" className="main-button">
                Сохранить изменения
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Relation;
