import { useRef } from "react";
import { motion } from "motion/react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export default function PageWrapper({
  children,
  className = "",
  centered = false,
}: PageWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      // Motion laisse `filter` posé en style inline en permanence, même une fois
      // à "blur(0px)". Or `filter` (même nul) crée une nouvelle zone de rendu qui
      // coupe le `backdrop-filter` des cartes en verre du fond animé derrière
      // elles — leur flou arrêtait de voir l'aurore, seulement le reste de la
      // page. On retire la propriété une fois l'entrée terminée pour que le
      // verre retrouve vraiment tout ce qu'il y a derrière.
      onAnimationComplete={(definition) => {
        if (definition === "animate" && ref.current) {
          ref.current.style.filter = "";
        }
      }}
      className={`relative z-10 min-h-screen pt-24 pb-12 px-4 md:px-6 flex flex-col ${centered ? "items-center justify-center" : "items-center justify-start"} ${className}`}
    >
      {children}
    </motion.div>
  );
}
