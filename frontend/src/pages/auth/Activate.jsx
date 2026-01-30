import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import AuthStatusMessage from "../../components/AuthStatusMessage";
import "../../styles/auth.css";

function Activate() {
  const { uid, token } = useParams();

  // Состояния: 'loading', 'success', 'error'
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const activateAccount = async () => {
      try {
        // Имитируем небольшую задержку, чтобы пользователь не видел "прыгающий" интерфейс
        const response = await api.get(`auth/activate/${uid}/${token}/`);

        const { access, refresh } = response.data;
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    activateAccount();
  }, [uid, token]);

  return (
    <div className="auth-card">
      {status === "loading" && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="loader"></div>{" "}
          {/* Можно добавить простой CSS лоадер */}
          <h2 style={{ marginTop: "20px" }}>Активация...</h2>
          <p style={{ color: "var(--text-gray)" }}>
            Пожалуйста, подождите, мы подтверждаем ваш email.
          </p>
        </div>
      )}

      {status === "success" && (
        <AuthStatusMessage
          icon="✅"
          title="Почта подтверждена!"
          message="Ваш аккаунт успешно активирован. Теперь вам доступны все функции платформы."
          buttonText="Перейти в личный кабинет"
          linkTo="/dashboard"
        />
      )}

      {status === "error" && (
        <AuthStatusMessage
          icon="❌"
          title="Ошибка активации"
          message="Ссылка недействительна или срок её действия истек. Попробуйте запросить ссылку снова."
          buttonText="Вернуться на главную"
          linkTo="/"
        />
      )}
    </div>
  );
}

export default Activate;
