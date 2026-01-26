import { useEffect } from "react";
import authService from "../../services/authService";

function Logout() {
  useEffect(() => {
    authService.logout();
  });

  return <h1>This is Logout page!</h1>;
}

export default Logout;
