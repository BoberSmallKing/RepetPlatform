import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { relationService } from "../../services/relationService";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/dashboard.css";

function Relation() {
  const { user } = useAuth();
  const [relations, setRelations] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    relationService.list().then((res) => {
      setRelations(res.data.results || res.data || []);
    });
  }, []);

  const inviteCode = user?.tutor_profile?.invite_code;
  const inviteLink = inviteCode
    ? `${window.location.origin}/join/${inviteCode}`
    : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relation-page">
      <h1>Управление связями</h1>

      {user?.role === "tutor" && (
        <div className="invite-section">
          <h3>Пригласить ученика</h3>
          <p>Поделитесь ссылкой для быстрой привязки аккаунта:</p>
          <div className="invite-grid">
            <input readOnly value={inviteLink} className="invite-input" />
            <button
              onClick={copyToClipboard}
              className="auth-button"
              style={{ width: "auto", margin: 0 }}
            >
              {copied ? "Готово!" : "Копировать"}
            </button>
          </div>
        </div>
      )}

      <div className="relations-list">
        <h3>{user?.role === "tutor" ? "Мои ученики" : "Мои репетиторы"}</h3>
        {relations.length > 0 ? (
          relations.map((rel) => {
            const target = user?.role === "tutor" ? rel.student : rel.tutor;
            return (
              <Link
                to={`/dashboard/relation/${rel.id}`}
                key={rel.id}
                className="relation-item"
              >
                <div className="relation-info">
                  {rel.target & rel.type_class ? (
                    <h1>Карточка заполнена</h1>
                  ) : (
                    <button>Заполните каоточку</button>
                  )}
                  <div className="relation-name">{target?.full_name}</div>
                  <div className="relation-email">{target?.email}</div>
                </div>
                <div className="relation-id">#{rel.id}</div>
              </Link>
            );
          })
        ) : (
          <p className="user-email">Активных связей не найдено.</p>
        )}
      </div>
    </div>
  );
}

export default Relation;
