import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Admin";
import AdminHero from "./components/Admin_index";
import ManageSurveyors from "./components/Admin_Surveyors";
import AdminAllSurveys from "./components/Admin_allSurveys";
import AdminSingleSurvey from "./components/Admin_SingleSurvey";
import WaterBodiesStatus from "./components/Admin_WaterBodiesStatus";
import AdminPredictPage from "./components/AdminPredictPage";
export default function App() {
  let rawUser = sessionStorage.getItem("user");

  let user = {};

  try {
    user = rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : {};
  } catch {
    user = {};
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />}>
          <Route
            index
            element={<AdminHero name={user ? user.name : "Admin"} />}
          />
          <Route path="surveyors" element={<ManageSurveyors />} />
          <Route path="surveys" element={<AdminAllSurveys />} />
          <Route path="surveys/:surveyId" element={<AdminSingleSurvey />} />
          <Route path="water-bodies" element={<WaterBodiesStatus />} />
          <Route
            path="/admin/predict/:waterBodyName"
            element={<AdminPredictPage />}
          />
        </Route>

        <Route
          path="/surveyor"
          element={
            <h1>
              Hello, I am the surveyor dashboard and the current surveyor is{" "}
              {user?.name}
            </h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
