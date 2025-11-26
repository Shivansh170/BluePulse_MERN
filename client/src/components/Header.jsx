import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [location, setLocation] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const searchLocation = (e) => {
    e.preventDefault();
    console.log("Form was submitted");
  };

  return (
    <header className="bg-black/90 py-4 px-4 flex justify-between items-center">
      {/* Left Side Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-white">
        Blue Pulse
      </h1>

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-white text-3xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Right Side Items (hidden in mobile unless opened) */}
      <div
        className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-6 
                    absolute md:static left-0 top-16 w-full md:w-auto 
                    bg-black/95 md:bg-transparent p-4 md:p-0 
                    transition-all duration-300 
                    ${menuOpen ? "flex" : "hidden md:flex"}`}
      >

        {/* Search Bar */}
        <form
          onSubmit={searchLocation}
          className="flex w-full md:w-auto justify-center"
        >
          <input
            type="text"
            className="bg-white px-3 py-1 rounded-l-2xl outline-none w-2/3 md:w-auto"
            placeholder="Search a location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-1 rounded-r-2xl font-semibold">
            Search
          </button>
        </form>

        {/* Navigation Links */}
        <nav className="flex flex-col md:flex-row gap-3 text-white text-lg md:text-xl text-center">
          <Link
            to="/"
            className="hover:text-blue-400 transition font-semibold"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="hover:text-blue-400 transition font-semibold"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
