import { Outlet, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard Overview", to: "/admin" },
    { label: "Manage Surveyors", to: "/admin/surveyors" },
    { label: "All Surveys", to: "/admin/surveys" },
    { label: "Water Bodies Status", to: "/admin/water-bodies" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <aside className="w-64 bg-linear-to-b from-[#005c] via-[#363795] to-[#24C6DC] text-white p-6 flex flex-col gap-6 shadow-2xl">
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
            onClick={() => {
              sessionStorage.clear("user");
              sessionStorage.clear("token");
              navigate("/");
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Right Main Content */}
      <main className="flex-1 bg-gray-50 p-10">
        <Outlet />
      </main>
    </div>
  );
}
