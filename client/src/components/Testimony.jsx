export default function Testimony() {
  const cards = [
    {
      title: "Real-time Monitoring",
      desc: "Efficient and precise tracking of water quality and parameters.",
      review:
        "This app has completely transformed how we monitor water quality in Delhi. The real-time data is incredibly accurate!",
      author: "Dr. Ramesh Gupta, Environmentalist",
    },
    {
      title: "User-friendly Interface",
      desc: "Easy to use, even for people with no technical expertise.",
      review:
        "A user-friendly platform that's essential for tackling water pollution. Highly recommend it!",
      author: "Ananya Verma, Surveyor",
    },
    {
      title: "Public Collaboration",
      desc: "Involving the community in environmental monitoring and preservation.",
      review:
        "Blue Pulse is a game-changer for public awareness and participation in water body rejuvenation.",
      author: "Rajeev Singh, NGO Volunteer",
    },
  ];

  return (
    <section className="text-center text-white py-12 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-8">
        What People Say About Blue Pulse
      </h2>

      <div className="flex flex-wrap justify-center gap-6">
        {cards.map((c, i) => (
          <div key={i} className="card w-full max-w-xs perspective">
            <div className="card-flip relative w-full h-80">
              {/* Front */}
              <div className="card-side absolute w-full h-full bg-cyan-600 text-white rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mt-12">{c.title}</h3>
                <p className="text-sm mt-2">{c.desc}</p>
              </div>

              {/* Back */}
              <div className="card-side absolute w-full h-full bg-black text-white rounded-xl p-6 shadow-xl rotate-y-180">
                <p className="italic text-lg">{c.review}</p>
                <span className="block mt-4 text-sm">{c.author}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
