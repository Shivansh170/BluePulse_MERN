export default function About() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#071029] to-[#071427] text-white">
      {/* HERO */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide">
          About BluePulse
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
          A real-time water quality monitoring and prediction platform built to
          protect and restore India’s lakes and rivers — powered by surveyors,
          administrators, and AI-driven insights.
        </p>
      </section>

      {/* MISSION */}
      <section className="container mx-auto px-6 py-12">
        <div className="bg-white/10 p-8 rounded-3xl border border-white/10 backdrop-blur shadow-xl max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-white/80 leading-relaxed text-lg">
            BluePulse was created with the purpose of tackling India’s water
            pollution crisis through technology. By combining verified survey
            data, smart dashboards, and AI-based predictions, we help
            authorities and citizens take meaningful action to revive our water
            bodies.
          </p>
        </div>
      </section>

      {/* ABOUT PLATFORM */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">
          What BluePulse Does
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AboutCard
            title="Real-time Data Collection"
            desc="Field surveyors continuously record pH, turbidity, temperature and dissolved oxygen levels from water bodies."
          />
          <AboutCard
            title="Verified Monitoring"
            desc="Admin verification ensures that only valid, trustworthy survey data is published to the dashboard."
          />
          <AboutCard
            title="AI-driven Insights"
            desc="Machine learning predicts pollution trends and generates 7-day forecasts for actionable intervention."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          How BluePulse Works
        </h2>

        <div className="bg-white/10 p-8 rounded-3xl border border-white/10 backdrop-blur shadow-xl max-w-5xl mx-auto space-y-6">
          <Step
            number="01"
            title="Surveyors Collect Data"
            desc="Authorized surveyors visit lakes, rivers, and reservoirs to measure water quality using mobile devices."
          />
          <Step
            number="02"
            title="Admin Verification"
            desc="Admin users review survey submissions, flag anomalies, and approve valid records."
          />
          <Step
            number="03"
            title="AI Prediction Engine"
            desc="Our model analyzes historical readings to forecast future pollution risks and trends."
          />
          <Step
            number="04"
            title="Public Dashboard"
            desc="Aggregated data is displayed visually, enabling citizens and authorities to monitor water quality live."
          />
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Want to Get Involved?</h2>
        <p className="text-white/70 max-w-2xl mx-auto mb-8">
          Whether you're a student, developer, environmental activist, or
          policymaker — BluePulse welcomes your contribution in restoring
          India’s water bodies.
        </p>

        <a
          href="/contact"
          className="px-8 py-4 bg-cyan-500 text-black font-semibold rounded-full shadow hover:scale-105 transition"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}

/* --- About Card --- */
function AboutCard({ title, desc }) {
  return (
    <div className="bg-white/10 border border-white/10 p-6 rounded-2xl shadow-md hover:scale-[1.02] transition backdrop-blur">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/70">{desc}</p>
    </div>
  );
}

/* --- Step Block --- */
function Step({ number, title, desc }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="text-4xl font-extrabold text-cyan-400">{number}</div>
      <div>
        <h4 className="text-2xl font-bold">{title}</h4>
        <p className="text-white/70 mt-1 text-lg">{desc}</p>
      </div>
    </div>
  );
}
