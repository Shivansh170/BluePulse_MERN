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
      "river",
      "lake",
    ];
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // keep spaces
      .split(/\s+/) // words
      .filter((w) => w && !stopWords.includes(w)) // remove unwanted words
      .sort() // SORT— makes order irrelevant
      .join(""); // final comparable string
  }

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      const cleaned = normalize(q.trim());
      navigate(`/search?q=${encodeURIComponent(cleaned)}`);
    }
  };

  return (
    <header className="bg-[#06070a] text-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold">
            Blue Pulse
          </Link>

          <nav className="hidden md:flex gap-4">
            <Link to="/" className="hover:text-cyan-300 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-cyan-300 transition">
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={submit} className="flex items-center gap-0">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a location..."
              className="px-3 py-1 rounded-l-full outline-none bg-white text-black border border-gray-300 shadow-sm w-40 md:w-56"
              required
            />
            <button
              type="submit"
              className="bg-cyan-500 text-black px-4 py-1 rounded-r-full font-semibold hover:bg-cyan-400 transition border border-cyan-500"
            >
              Search
            </button>
          </form>

          <div className="hidden md:block">
            <Link
              to="/login"
              className="px-4 py-1 rounded-full bg-white text-black font-semibold"
            >
              Login
            </Link>
          </div>

          <button
            className="md:hidden px-3 py-1 border border-white/10 rounded"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#0a0f1a] px-4 py-4 border-t border-white/5">
          <form onSubmit={submit} className="flex gap-2 mb-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a location..."
              className="flex-1 px-3 py-2 rounded-l-full text-black"
            />
            <button className="bg-cyan-500 px-3 py-2 rounded-r-full font-semibold text-black">
              Search
            </button>
          </form>

          <nav className="flex flex-col gap-2">
            <Link to="/" onClick={() => setOpen(false)} className="py-2">
              Home
            </Link>
            <Link to="/about" onClick={() => setOpen(false)} className="py-2">
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
      )}
    </header>
  );
}
