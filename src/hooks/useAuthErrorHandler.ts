import { useEffect } from "react";
import { useNavigate } from "react-router";

function useAuthErrorHandler(statusCode?: number) {
  const navigate = useNavigate();
  const loginPath = "/login";

  useEffect(() => {
    if (statusCode === 401) {
      localStorage.removeItem("token");
      navigate(loginPath);
    } else if (statusCode === 403) {
      navigate("/unauthorized");
    }
  }, [statusCode, loginPath, navigate]);

  // Return a method that can be called manually if needed
  return {
    handleAuthError: () => {
      if (statusCode === 401) {
        localStorage.removeItem("token");
        navigate(loginPath);
      } else if (statusCode === 403) {
        navigate("/unauthorized");
      }
    },
  };
}

export default useAuthErrorHandler;
