import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

function Activate() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await api.get(`auth/activate/${uid}/${token}/`);

        const { access, refresh } = response.data;

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        navigate("/");
      } catch (err) {
        navigate("/login");
      }
    };

    activateAccount();
  }, [uid, token, navigate]);

  return <p>Активация аккаунта...</p>;
}

export default Activate;
