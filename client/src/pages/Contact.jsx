import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-[#071029] to-[#071427] text-white">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 transition"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Home</span>
      </button>

      {/* HERO */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide">
          Contact Us
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
          Have questions, suggestions, or want to collaborate? We’d love to hear
          from you.
        </p>
      </section>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* CONTACT DETAILS */}
        <div className="bg-white/10 p-8 rounded-3xl border border-white/10 backdrop-blur shadow-xl space-y-6">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>

          <ContactItem label="Name" value="Shivansh Lavaniya" />
          <ContactItem label="Phone" value="8267005726" link="tel:8267005726" />
          <ContactItem
            label="Email"
            value="shivanshlavaniya456@gmail.com"
            link="mailto:shivanshlavaniya456@gmail.com"
          />
          <ContactItem
            label="LinkedIn"
            value="linkedin.com/in/shivansh-lavaniya"
            link="https://www.linkedin.com/in/shivansh-lavaniya-012145293/"
          />
          <ContactItem
            label="GitHub"
            value="github.com/Shivansh170"
            link="https://github.com/Shivansh170"
          />

          <p className="text-white/60 text-sm mt-6">
            I usually respond within 24 hours. Looking forward to connecting
            with you!
          </p>
        </div>

        {/* CONTACT FORM */}
        <div className="bg-white/10 p-8 rounded-3xl border border-white/10 backdrop-blur shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Send a Message</h2>

          <form className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 rounded-xl bg-white/20 text-white outline-none focus:ring-2 focus:ring-cyan-400 placeholder-white/60"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 rounded-xl bg-white/20 text-white outline-none focus:ring-2 focus:ring-cyan-400 placeholder-white/60"
            />

            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full p-4 rounded-xl bg-white/20 text-white outline-none focus:ring-2 focus:ring-cyan-400 placeholder-white/60"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-cyan-500 py-3 rounded-xl text-black font-semibold text-lg shadow hover:scale-[1.02] transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* CONTACT ITEM */
function ContactItem({ label, value, link }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-cyan-300">{label}</p>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-lg hover:text-cyan-300 transition"
        >
          {value}
        </a>
      ) : (
        <p className="text-white/90 text-lg">{value}</p>
      )}
    </div>
  );
}
