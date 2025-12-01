import { Navigate } from "react-router-dom";

export function AdminRoute({ children }) {
  const rawUser = sessionStorage.getItem("user");
  let user = {};

  try {
    user = rawUser ? JSON.parse(rawUser) : {};
  } catch {
    user = {};
  }

  if (!user?.role || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function SurveyorRoute({ children }) {
  const rawUser = sessionStorage.getItem("user");
  let user = {};

  try {
    user = rawUser ? JSON.parse(rawUser) : {};
  } catch {
    user = {};
  }

  if (!user?.role || user.role !== "surveyor") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
