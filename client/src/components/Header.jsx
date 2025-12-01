import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function normalize(str) {
    if (!str) return "";
    const stopWords = [
      "river",
      "lake",
      "nadi",
      "talav",
      "talab",
      "jheel",
      "sarovar",
      "reservoir",
      "pond",
      "waterbody",
      "water",
      "dam",
    ];
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w && !stopWords.includes(w))
      .sort()
      .join("");
  }

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      const cleaned = normalize(q.trim());
      navigate(`/search?q=${encodeURIComponent(cleaned)}`);
      setOpen(false);
    }
  };

  return (
    <header className="bg-[#06070a] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LEFT - Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold whitespace-nowrap">
            Blue Pulse
          </Link>

          <nav className="hidden md:flex gap-6 text-[1rem]">
            <Link to="/" className="hover:text-cyan-300 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-cyan-300 transition">
              About
            </Link>
          </nav>
        </div>

        {/* RIGHT - Search + Buttons */}
        <div className="flex items-center gap-3">
          {/* Desktop Search */}
          <form onSubmit={submit} className="hidden sm:flex items-center gap-0">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search location..."
              className="px-3 py-1 rounded-l-full outline-none bg-white text-black border border-gray-300 shadow-sm w-36 sm:w-48 md:w-56 lg:w-64 transition-all"
              required
            />
            <button
              type="submit"
              className="bg-cyan-500 text-black px-4 py-1 rounded-r-full font-semibold hover:bg-cyan-400 border border-cyan-500 transition"
            >
              Search
            </button>
          </form>

          {/* Desktop Login */}
          <div className="hidden md:block">
            <Link
              to="/login"
              className="px-4 py-1 rounded-full bg-white text-black font-semibold shadow-sm"
            >
              Login
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden px-3 py-2 border border-white/20 rounded-lg text-xl"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden bg-[#0a0f1a] overflow-hidden transition-all duration-300 border-t border-white/10 ${
          open ? "max-h-[500px] py-4" : "max-h-0 py-0"
        }`}
      >
        {/* Mobile Search */}
        <form onSubmit={submit} className="flex px-4 mb-4 w-full gap-2">
          <div className="flex-1 flex items-center bg-white rounded-full overflow-hidden shadow-sm border border-gray-300">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search location..."
              className="flex-1 px-4 py-2 text-black outline-none text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-cyan-500 text-black px-4 py-2 rounded-full font-semibold hover:bg-cyan-400 transition whitespace-nowrap"
          >
            Search
          </button>
        </form>

        {/* Mobile Nav */}
        <nav className="flex flex-col gap-3 px-4 text-lg">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="py-2 border-b border-white/10"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className="py-2 border-b border-white/10"
          >
            About
          </Link>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="py-2 font-semibold"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
