// src/components/Footer.jsx
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#04060a] text-white/80 mt-12">
      <div className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-white font-bold text-lg">Blue Pulse</h4>
          <p className="mt-2 text-sm text-white/70">
            Realtime water monitoring & community reporting to restore local
            water bodies.
          </p>
        </div>

        <div>
          <h5 className="text-white font-semibold">Quick links</h5>
          <ul className="mt-2 text-sm space-y-2">
            <li>
              <a href="/" className="hover:text-cyan-300">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-cyan-300">
                About
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-cyan-300">
                Privacy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold">Follow us</h5>
          <div className="mt-3 flex gap-3">
            <a className="p-2 rounded bg-white/5">
              <Facebook />
            </a>
            <a className="p-2 rounded bg-white/5">
              <Twitter />
            </a>
            <a className="p-2 rounded bg-white/5">
              <Instagram />
            </a>
            <a className="p-2 rounded bg-white/5">
              <Linkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 text-center py-4 text-xs">
        &copy; {new Date().getFullYear()} Blue Pulse — All rights reserved
      </div>
    </footer>
  );
}
