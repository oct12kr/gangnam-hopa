"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { phoneNumber, telHref } from "./content";

export default function HeroSection() {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="hero-section" id="home" aria-label="BOSTON hero">
      <div className="hero-media">
        <Image className="hero-image" src="/images/hero/000.png" alt="" fill priority sizes="100vw" />
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        <motion.p className="hero-kicker" {...fadeUp} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}>
          강남 프리미엄 퍼블릭
        </motion.p>
        <motion.h1 className="hero-title" {...fadeUp} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}>
          BOSTON
        </motion.h1>
        <motion.div
          className="hero-divider"
          aria-hidden="true"
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        />
        <motion.p className="hero-subcopy" {...fadeUp} transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}>
          품격이 다른 프리미엄 라운지
        </motion.p>
        <motion.a
          className="hero-phone-line"
          href={telHref}
          aria-label={`${phoneNumber} 전화 걸기`}
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <span className="hero-phone-rule" aria-hidden="true" />
          <span className="hero-phone-number">{phoneNumber}</span>
          <span className="hero-phone-rule" aria-hidden="true" />
        </motion.a>
      </div>
      <motion.a
        className="scroll-cue"
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
      >
        <motion.span
          className="scroll-cue-inner"
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
        >
          <span className="scroll-cue-line" aria-hidden="true" />
          <span className="scroll-cue-text">SCROLL DOWN</span>
        </motion.span>
      </motion.a>
    </section>
  );
}
