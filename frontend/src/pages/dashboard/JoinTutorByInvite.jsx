import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { relationService } from "../../services/relationService";
import AuthStatusMessage from "../../components/AuthStatusMessage";

function JoinTutorByInvite() {
  const { invite_code } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    const performJoin = async () => {
      try {
        await relationService.joinByInvite(invite_code);
        setStatus("success");
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/login", { state: { next: `/join/${invite_code}` } });
          return;
        }
        setStatus("error");
      }
    };
    performJoin();
  }, [invite_code, navigate]);

  if (status === "loading") {
    return (
      <div className="auth-card">
        <h1>Устанавливаем связь...</h1>
      </div>
    );
  }

  return (
    <div className="auth-card">
      {status === "success" ? (
        <AuthStatusMessage
          icon="🤝"
          title="Связь установлена!"
          message="Вы успешно добавили репетитора. Теперь вы можете начать обучение."
          buttonText="В личный кабинет"
          linkTo="/dashboard"
        />
      ) : (
        <AuthStatusMessage
          icon="❌"
          title="Ошибка привязки"
          message="Ссылка недействительна, либо вы уже связаны с этим репетитором."
          buttonText="Вернуться назад"
          linkTo="/dashboard"
        />
      )}
    </div>
  );
}

export default JoinTutorByInvite;
