import { Eye } from "lucide-react";
import { useState } from "react";
import { ArrowLeftFromLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, toggleShowPassword] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/user/loginUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        alert(data.message || "Login failed");
        return; // ⛔ stop here
      }
      sessionStorage.setItem("accessToken", data.token);
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          ...data.user,
          role: data.user.role.toLowerCase(), // 🔥 FIX HERE
        })
      );

      if (data.user.role.toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/surveyor");
      }
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <>
      <div className="bg-linear-to-tr from-[#005c] via-[#363795] to-[#24C6DC] w-full min-h-screen">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition"
        >
          <ArrowLeftFromLine size={28} className="text-white" />
        </button>

        <div className="flex items-center justify-center h-[90vh]">
          <form
            onSubmit={handleLogin}
            className="bg-white shadow-xl rounded-2xl flex flex-col gap-4 p-6 w-full max-w-sm"
          >
            <h1 className="text-3xl text-[#005c] font-bold text-center py-3">
              Login to BluePulse
            </h1>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-blue-100 p-3 rounded-full outline-none focus:ring-2 focus:ring-[#005c] px-6"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <div className="w-full flex items-center bg-blue-100 rounded-full px-3 focus-within:ring-2 focus-within:ring-[#005c]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="flex-1 bg-blue-100 p-3 rounded-full outline-none"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  toggleShowPassword(!showPassword);
                }}
              >
                <Eye className="w-5 h-5 text-[#005c]" />
              </button>
            </div>

            {/* Login Button */}
            <button className="bg-[#005c] py-3 rounded-full text-white text-lg font-semibold shadow hover:shadow-md transition">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
