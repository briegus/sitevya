import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";

const faqs = [
  {
    q: "Quels sont vos délais de livraison ?",
    a: "Les délais varient selon la complexité. Un site vitrine standard est livré en 2 à 4 semaines. Un dashboard Discord complet peut prendre 3 à 6 semaines. Nous définissons un planning précis avant de commencer.",
  },
  {
    q: "Comment se déroule le suivi de projet ?",
    a: "Vous accédez à un canal dédié sur notre serveur Discord. Vous recevez des mises à jour régulières, des aperçus avant livraison, et pouvez soumettre vos retours à chaque étape.",
  },
  {
    q: "Proposez-vous de la maintenance après livraison ?",
    a: "Oui. Nous proposons des prestations de maintenance et mises à jour selon vos besoins. Nous restons disponibles pour corriger d'éventuels bugs et faire évoluer votre projet.",
  },
  {
    q: "Puis-je demander des modifications après livraison ?",
    a: "Absolument. Chaque projet inclut une période de retouches.",
  },
  {
    q: "Comment puis-je commencer ?",
    a: "Rendez-vous dans la section Contact. Choisissez email ou Discord. Décrivez votre projet et nous reviendrons vers vous rapidement.",
  },
  {
    q: "Travaillez-vous avec des clients hors de France ?",
    a: "Oui, nous travaillons avec des clients francophones en France, Belgique, Suisse, Canada et partout dans le monde.",
  },
];

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/[0.07] last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 px-7 text-left cursor-pointer group"
      >
        <span className="text-white/80 group-hover:text-white transition-colors text-sm font-medium">
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-white/35 group-hover:text-purple-400 transition-colors"
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
            <p className="pb-5 px-7 text-white/50 text-sm leading-relaxed pr-12">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <PageWrapper centered>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-white/40 mb-3">
            QUESTIONS FRÉQUENTES
          </p>
          <h1 className="section-heading text-4xl md:text-6xl text-white mb-4">
            Tout ce que vous{" "}
            <span className="sv-gradient-text">voulez savoir</span>
          </h1>
        </div>

        {/* Accordion */}
        <div className="glass-panel rounded-3xl overflow-hidden">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <p className="text-center text-white/30 text-sm mt-8">
          Vous ne trouvez pas votre réponse ?{" "}
          <Link
            to="/contact"
            className="sv-gradient-text hover:opacity-75 transition-opacity"
          >
            Contactez-nous.
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
}
