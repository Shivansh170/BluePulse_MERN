import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function SurveyorDashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

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
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside
        className={`bg-linear-to-b from-[#005c] via-[#363795] to-[#24C6DC] text-white p-6 flex-col gap-6 shadow-2xl
        fixed md:static top-0 left-0 h-full md:h-auto w-64 z-40 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex justify-between items-center md:block">
          <h1 className="text-2xl font-bold tracking-wide">Surveyor Panel</h1>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-white p-2 rounded-lg"
          >
            <X size={28} />
          </button>
        </div>

        <nav className="flex flex-col gap-4 text-lg font-medium mt-6">
          {menuItems.map((item) => (
            <button
              key={item.to}
              onClick={() => {
                navigate(item.to);
                setOpen(false);
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md py-2 px-4 rounded-lg transition text-left"
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            className="bg-red-400/40 hover:bg-red-400/60 backdrop-blur-md py-2 px-4 rounded-lg transition text-left"
          >
            Logout
          </button>
        </nav>
      </aside>

      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 bg-[#005c] text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={28} />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="flex-1 bg-gray-50 p-5 md:p-10 overflow-y-auto mt-16 md:mt-0">
        <Outlet context={{ name }} />
      </main>
    </div>
  );
}
