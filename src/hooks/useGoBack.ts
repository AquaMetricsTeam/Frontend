import { useNavigate } from "react-router";

export const useGoBack = (fallbackPath: string = "/") => {
  const navigate = useNavigate();

  return () => {
    // More reliable way to check if we can go back
    // Check if the current URL is different from the referrer
    const hasPreviousPage =
      document.referrer &&
      document.referrer !== window.location.href &&
      document.referrer.includes(window.location.origin);

    if (hasPreviousPage) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };
};
