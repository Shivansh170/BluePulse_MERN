import { Eye } from "lucide-react";
import { useState } from "react";
import { ArrowLeftFromLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, toggleShowPassword] = useState(false);
  const handleLogin = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <div className="bg-linear-to-tr from-[#005c] via-[#363795] to-[#24C6DC] w-full min-h-screen">
        <button
          className="p-4"
          onClick={() => {
            navigate("/");
          }}
        >
          <ArrowLeftFromLine size={48} color="white" />
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
              type="text"
              placeholder="Enter username"
              className="w-full bg-blue-100 p-3 rounded-full outline-none focus:ring-2 focus:ring-[#005c] px-6"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
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
