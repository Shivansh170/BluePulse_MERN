import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard Overview", to: "/admin" },
    { label: "Manage Surveyors", to: "/admin/surveyors" },
    { label: "All Surveys", to: "/admin/surveys" },
    { label: "Water Bodies Status", to: "/admin/water-bodies" },
  ];

  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="hidden md:flex md:w-64 bg-linear-to-b from-[#005c] via-[#363795] to-[#24C6DC] text-white p-6 flex-col gap-6 shadow-2xl">
        <h1 className="text-2xl font-bold tracking-wide">BluePulse Admin</h1>

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
            className="bg-red-400/40 hover:bg-red-400/60 backdrop-blur-md py-2 px-4 rounded-lg transition text-left"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
      </aside>
      <div className="md:hidden bg-[#005c] text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-semibold">BluePulse Admin</h1>

        <button onClick={() => setOpen(true)}>
          <Menu size={28} />
        </button>
      </div>
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-50"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-linear-to-b from-[#005c] via-[#363795] to-[#24C6DC] text-white p-6 shadow-2xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-4 text-lg font-medium">
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
            className="bg-red-400/40 hover:bg-red-400/60 backdrop-blur-md py-2 px-4 rounded-lg transition text-left"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-50 p-5 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
