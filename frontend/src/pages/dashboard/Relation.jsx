import { useEffect, useState } from "react";
import { relationService } from "../../services/relationService";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/dashboard.css";

function Relation() {
  const { user } = useAuth();
  const [relations, setRelations] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    relationService.list().then((res) => setRelations(res.data.results || []));
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
      <h1>Ваши связи</h1>

      {user?.role === "tutor" && (
        <div
          className="invite-section"
          style={{
            padding: "20px",
            background: "var(--white)",
            borderRadius: "12px",
            boxShadow: "var(--shadow)",
            marginBottom: "30px",
          }}
        >
          <h3>Пригласить ученика</h3>
          <p style={{ color: "var(--text-gray)", fontSize: "0.9rem" }}>
            Отправьте эту ссылку ученику, чтобы он мог привязаться к вашему
            аккаунту:
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <input
              readOnly
              value={inviteLink}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #eee",
                background: "var(--soft-bg)",
              }}
            />
            <button
              onClick={copyToClipboard}
              className="auth-button"
              style={{ width: "auto", padding: "0 20px", margin: 0 }}
            >
              {copied ? "Скопировано!" : "Копировать"}
            </button>
          </div>
        </div>
      )}

      <div className="relations-list">
        <h3>Список {user?.role === "tutor" ? "учеников" : "репетиторов"}</h3>
        {relations.length > 0 ? (
          relations.map((rel) => {
            const target = user?.role === "tutor" ? rel.student : rel.tutor;
            return (
              <div
                key={rel.id}
                className="relation-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "var(--white)",
                  boxShadow: "var(--shadow)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{target?.full_name}</div>
                  <div style={{ color: "var(--text-gray)", fontSize: "0.9rem" }}>
                    {target?.email}
                  </div>
                </div>
                <div style={{ color: "var(--text-gray)", fontSize: "0.85rem" }}>
                  #{rel.id}
                </div>
              </div>
            );
          })
        ) : (
          <p>У вас пока нет активных связей.</p>
        )}
      </div>
    </div>
  );
}

export default Relation;
