import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SurveyorDashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) setName(user.name);
  }, []);

  const menuItems = [
    { label: "Dashboard", to: "/surveyor" },
    { label: "My Surveys", to: "/surveyor/surveys" },
    { label: "Submit Survey", to: "/surveyor/new-survey" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-linear-to-b from-[#005c] via-[#363795] to-[#24C6DC] text-white p-6 flex flex-col gap-6 shadow-2xl">
        <h1 className="text-2xl font-bold tracking-wide">Surveyor Panel</h1>

        <nav className="flex flex-col gap-4 text-lg font-medium">
          {menuItems.map((item) => (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md py-2 px-4 rounded-lg transition text-left"
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="bg-red-400/40 hover:bg-red-400/60 backdrop-blur-md py-2 px-4 rounded-lg transition text-left"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1 bg-gray-50 p-10 overflow-y-auto">
        <Outlet context={{ name }} />
      </main>
    </div>
  );
}
