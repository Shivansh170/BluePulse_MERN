import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-[#121212] text-white px-5 py-10 font-roboto">
      <div className="flex flex-wrap justify-between mb-5">
        {/* About Section */}
        <div className="w-full md:w-[30%] mb-5">
          <h3 className="text-xl font-semibold mb-2">About Blue Pulse</h3>
          <p className="text-sm leading-relaxed">
            Blue Pulse is dedicated to restoring water bodies through real-time
            monitoring and public collaboration. Together, we can ensure a
            healthier environment for future generations.
          </p>
        </div>

        {/* Quick Links */}
        <div className="w-full md:w-[30%] mb-5">
          <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-[#24C6DC] transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#24C6DC] transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#24C6DC] transition">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#24C6DC] transition">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="w-full md:w-[30%] mb-5">
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#">
              <Facebook />
            </a>
            <a href="#">
              <Twitter />
            </a>
            <a href="#">
              <Instagram />
            </a>
            <a href="#">
              <Linkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs border-t border-white/20 pt-3 mt-5">
        &copy; 2025 Blue Pulse | All rights reserved
      </div>
    </footer>
  );
}
