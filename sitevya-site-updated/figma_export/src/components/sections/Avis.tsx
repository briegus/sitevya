import { motion } from "motion/react";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Thomas L.",
    role: "Gérant de studio photo",
    initials: "TL",
    color: "from-[#3040a8] to-[#7855b8]",
    rating: 5,
    comment:
      "Équipe très réactive et professionnelle. Le site livré dépasse toutes mes attentes : animations fluides, responsive parfait et temps de chargement ultra rapide. Je recommande sans hésitation.",
  },
  {
    name: "Manon R.",
    role: "Community manager Discord",
    initials: "MR",
    color: "from-[#7855b8] to-[#c570aa]",
    rating: 5,
    comment:
      "Dashboard pour notre bot Discord exactement comme demandé. L'interface est intuitive, la gestion des tickets est top et l'équipe a su s'adapter à nos besoins spécifiques.",
  },
  {
    name: "Kévin D.",
    role: "Fondateur d'association sportive",
    initials: "KD",
    color: "from-[#c570aa] to-[#3040a8]",
    rating: 5,
    comment:
      "Site vitrine moderne et rapide pour notre asso. La section événements et le formulaire d'inscription fonctionnent parfaitement. Communication transparente du début à la fin.",
  },
];

export default function Avis() {
  return (
    <section id="avis" className="py-32 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-white/50 mb-4">
            TÉMOIGNAGES
          </p>
          <h2 className="section-heading text-white mb-5">
            Ce que disent{" "}
            <span className="sv-gradient-text">nos clients</span>
          </h2>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-white/50 text-sm">5/5 — 3 avis vérifiés</span>
          </div>
        </motion.div>

        {/* Review cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="rounded-2xl p-6 glass-card hover:border-white/[0.12] transition-all duration-400 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-white/65 text-sm leading-relaxed flex-1">
                "{review.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br ${review.color} text-white text-xs font-semibold shrink-0`}
                >
                  {review.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{review.name}</p>
                  <p className="text-white/40 text-xs">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Moderation notice */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/25 text-xs mt-10"
        >
          Les avis sont vérifiés et modérés avant publication.
        </motion.p>
      </div>
    </section>
  );
}
