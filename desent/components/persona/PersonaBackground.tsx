"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type PersonaBackgroundProps = {
  reveal: boolean;
  blur: boolean;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function PersonaBackground({ reveal, blur }: PersonaBackgroundProps) {
  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={{ opacity: reveal ? 1 : 0 }}
      transition={{ duration: 1.3, ease: "easeOut" }}
      className="absolute inset-0 overflow-hidden"
    >
      <motion.div
        initial={false}
        animate={{
          filter: blur ? "blur(16px)" : "blur(0px)",
          scale: blur ? 1.08 : 1.02,
        }}
        transition={{ duration: 0.9, ease: EASE }}
        className="absolute inset-0"
      >
        <Image
          src="/office.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: blur ? 1 : 0.6 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/30 to-stone-950/15"
      />
    </motion.div>
  );
}
