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
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-10 min-h-screen pt-24 pb-12 px-4 md:px-6 flex flex-col ${centered ? "items-center justify-center" : "items-center justify-start"} ${className}`}
    >
      {children}
    </motion.div>
  );
}
