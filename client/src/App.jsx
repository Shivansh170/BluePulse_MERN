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
import { useState, useEffect } from "react";
import SurveyorDashboard from "./pages/Surveyor";
import SurveyorHome from "./components/SurveyorHome";
import SurveyorMySurveys from "./components/SurveyorMySurveys";
import SurveyorSingle from "./components/SurveyorSingle";
import SurveyorNewSurvey from "./components/SurveyorNewSurvey";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SearchResults from "./pages/SearchResults";
import HomeContent from "./components/HomeContent";
import PredictPage from "./pages/PredictPage";

export default function App() {
  let rawUser = sessionStorage.getItem("user");

  let user = {};

  try {
    user = rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : {};
  } catch {
    user = {};
  }
  const [adminName, setAdminName] = useState("");
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) setAdminName(user.name);
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<HomeContent />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="/predict/:name" element={<PredictPage />} />
        </Route>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHero name={adminName} />} />
          <Route path="surveyors" element={<ManageSurveyors />} />
          <Route path="surveys" element={<AdminAllSurveys />} />
          <Route path="surveys/:surveyId" element={<AdminSingleSurvey />} />
          <Route path="water-bodies" element={<WaterBodiesStatus />} />
          <Route
            path="/admin/predict/:waterBodyName"
            element={<AdminPredictPage />}
          />
        </Route>

        <Route path="/surveyor" element={<SurveyorDashboard />}>
          <Route index element={<SurveyorHome />} />
          <Route path="surveys" element={<SurveyorMySurveys />} />
          <Route path="surveys/:surveyId" element={<SurveyorSingle />} />
          <Route path="new-survey" element={<SurveyorNewSurvey />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
