"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.45 },
  };

  const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.45 },
  };

  return (
    <section className="about-section" id="about" aria-label="About BOSTON">
      <Image className="about-bg-image" src="/images/about/222.png" alt="" fill sizes="100vw" />
      <div className="about-panel" aria-label="강남보스턴 소개">
        <motion.div className="about-panel-top" {...fadeIn} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}>
          <p className="about-label">ABOUT</p>
          <div className="about-ornament" aria-hidden="true">
            <span className="about-ornament-line" />
            <span className="about-ornament-diamond" />
            <span className="about-ornament-line" />
          </div>
        </motion.div>
        <motion.h2 className="about-title" {...fadeUp} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}>
          강남보스턴
        </motion.h2>
        <motion.p className="about-description" {...fadeUp} transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}>
          프리미엄 공간과
          <br />
          품격있는 서비스를 제공하는
          <br />
          럭셔리 퍼블릭입니다.
        </motion.p>
        <motion.div
          className="about-ornament about-ornament-bottom"
          aria-hidden="true"
          {...fadeIn}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        >
          <span className="about-ornament-line" />
          <span className="about-ornament-diamond" />
          <span className="about-ornament-line" />
        </motion.div>
      </div>
    </section>
  );
}
