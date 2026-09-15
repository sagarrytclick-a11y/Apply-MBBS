"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

const makeVariants = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0 },
});

export function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 16,
  once = true,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      variants={makeVariants(y)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default FadeIn;
