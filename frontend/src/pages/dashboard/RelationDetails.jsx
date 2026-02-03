import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { relationService } from "../../services/relationService";

function RelationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    relationService
      .retrieve(id)
      .then((res) => setData(res.data))
      .catch(() => navigate("/dashboard/relation"));
  }, [id, navigate]);

  if (!data) return <div className="loader">Загрузка...</div>;

  return (
    <div className="relation-details">
      <button
        onClick={() => navigate(-1)}
        className="auth-link"
        style={{
          marginBottom: "20px",
          display: "block",
          border: "none",
          background: "none",
        }}
      >
        ← Назад к списку
      </button>
      <div className="invite-section">
        <h1>Детали связи #{id}</h1>
        <p>
          <strong>Дата создания:</strong>{" "}
          {new Date(data.created_at).toLocaleDateString()}
        </p>
        <hr style={{ margin: "20px 0", opacity: 0.1 }} />
      </div>
    </div>
  );
}

export default RelationDetails;
