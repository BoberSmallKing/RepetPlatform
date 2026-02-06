import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { relationService } from "../../services/relationService";

function Months() {
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
    <button type="submit" className="main-button">
      Создать месяц
    </button>
  );
}

export default Months;
