import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Quels sont vos délais de livraison ?",
    a: "Les délais varient selon la complexité du projet. Un site vitrine standard est livré en 2 à 4 semaines. Un dashboard Discord complet peut prendre 3 à 6 semaines. Nous définissons ensemble un planning précis avant de commencer.",
  },
  {
    q: "Comment se déroule le suivi de projet ?",
    a: "Vous avez accès à un canal dédié sur notre serveur Discord. Vous recevez des mises à jour régulières, des aperçus avant livraison, et pouvez soumettre vos retours à chaque étape. Le dialogue est constant.",
  },
  {
    q: "Proposez-vous de la maintenance après livraison ?",
    a: "Oui. Nous proposons des prestations de maintenance et mises à jour selon vos besoins. Nous restons disponibles pour corriger d'éventuels bugs et faire évoluer votre projet dans le temps.",
  },
  {
    q: "Puis-je demander des modifications après livraison ?",
    a: "Absolument. Chaque projet inclut une période de retouches. Nous voulons que le résultat final vous corresponde parfaitement.",
  },
  {
    q: "Comment puis-je commencer ?",
    a: "Rendez-vous dans la section Contact. Choisissez entre nous contacter par email ou rejoindre notre serveur Discord. Décrivez votre projet et nous reviendrons vers vous rapidement.",
  },
  {
    q: "Travaillez-vous avec des clients hors de France ?",
    a: "Oui, nous travaillons avec des clients francophones en France, Belgique, Suisse, Canada et partout dans le monde. Toute notre communication se fait en ligne.",
  },
];

function FAQItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer group"
      >
        <span className="text-white/85 group-hover:text-white transition-colors text-sm md:text-base font-medium">
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-white/40 group-hover:text-white/60 transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-white/50 text-sm leading-relaxed pr-8">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-32 px-6"
      style={{ background: "linear-gradient(180deg, #05020d 0%, #000 100%)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-white/50 mb-4">
            QUESTIONS FRÉQUENTES
          </p>
          <h2 className="section-heading text-white mb-5">
            Tout ce que vous{" "}
            <span className="sv-gradient-text">voulez savoir</span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="rounded-2xl glass-panel px-6 md:px-8"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-white/40 text-sm mt-10"
        >
          Vous ne trouvez pas votre réponse ?{" "}
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="sv-gradient-text hover:opacity-80 transition-opacity cursor-pointer"
          >
            Contactez-nous directement.
          </button>
        </motion.p>
      </div>
    </section>
  );
}
