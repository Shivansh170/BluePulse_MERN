export default function Testimony() {
  const cards = [
    {
      title: "Real-time Monitoring",
      desc: "Efficient and precise tracking of water quality and parameters.",
      review: "This app transformed water monitoring. Extremely accurate.",
      author: "Dr. Ramesh Gupta",
    },
    {
      title: "User-friendly",
      desc: "Simple UI for citizens and surveyors.",
      review: "Perfect for non-technical users. Smooth and intuitive.",
      author: "Ananya Verma",
    },
    {
      title: "Community Impact",
      desc: "Reports initiated cleanup drives within 48 hours.",
      review: "Blue Pulse truly empowers community participation.",
      author: "Rajeev Singh",
    },
  ];

  return (
    <section className="py-16">
      <h2 className="text-center text-3xl font-bold mb-10 text-white">
        What People Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {cards.map((c, i) => (
          <div key={i} className="flip-card w-full h-64">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <p className="mt-2 text-white/80 text-sm">{c.desc}</p>
              </div>
              <div className="flip-card-back">
                <p className="italic text-sm">"{c.review}"</p>
                <p className="mt-4 text-xs text-white/90">{c.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
