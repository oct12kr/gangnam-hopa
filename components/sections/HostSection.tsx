"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const hostTags = ["PREMIUM", "PROFESSIONAL", "FRIENDLY", "LUXURY"];

export default function HostSection() {
  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.45 },
  };

  return (
    <section className="host-section" id="host" aria-label="Professional host">
      <Image className="host-bg-image" src="/images/host/444.png" alt="" fill sizes="100vw" />
      <div className="host-copy">
        <motion.p
          className="host-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          HOST
        </motion.p>
        <motion.h2 className="host-title" {...fadeUp} transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}>
          PROFESSIONAL HOST
        </motion.h2>
        <motion.p className="host-subcopy" {...fadeUp} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}>
          최고의 서비스는
          <br />
          최고의 사람에게서 시작됩니다.
        </motion.p>
      </div>
      <motion.div
        className="host-tagbar"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <div className="host-tagbar-inner" aria-label="Host qualities">
          {hostTags.map((tag, index) => (
            <span className="host-tag-group" key={tag}>
              {index > 0 ? <span className="tag-divider" aria-hidden="true" /> : null}
              <span className="host-tag-item">{tag}</span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
