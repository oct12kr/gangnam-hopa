"use client";

import { CalendarCheck, ConciergeBell, DoorOpen, Gem, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

type SystemCard = {
  title: string;
  description: [string, string];
  Icon: LucideIcon;
};

const systemCards: SystemCard[] = [
  {
    title: "RESERVATION",
    description: ["간편하고 빠른 예약 시스템으로", "편리하게 이용하실 수 있습니다."],
    Icon: CalendarCheck,
  },
  {
    title: "PREMIUM",
    description: ["최상의 인테리어와 서비스로", "프리미엄 경험을 선사합니다."],
    Icon: Gem,
  },
  {
    title: "PRIVATE",
    description: ["프라이빗 룸과 공간으로", "특별한 시간을 제공합니다."],
    Icon: DoorOpen,
  },
  {
    title: "SERVICE",
    description: ["고객 맞춤형 서비스로", "최고의 만족을 드립니다."],
    Icon: ConciergeBell,
  },
];

function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`system-ornament ${className}`} aria-hidden="true">
      <span className="system-ornament-line" />
      <span className="system-ornament-diamond" />
      <span className="system-ornament-line" />
    </div>
  );
}

export default function SystemSection() {
  return (
    <section className="system-section" id="system" aria-label="BOSTON system">
      <Image className="system-bg-image" src="/images/system/333.png" alt="" fill sizes="100vw" />
      <div className="system-inner">
        <motion.div
          className="system-title-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Ornament className="system-title-ornament" />
          <h2>SYSTEM</h2>
          <Ornament className="system-title-ornament" />
        </motion.div>

        <div className="system-grid">
          {systemCards.map(({ title, description, Icon }, index) => (
            <motion.article
              className="glass-card-light system-card"
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
            >
              <div className="system-icon-ring" aria-hidden="true">
                <Icon size={40} strokeWidth={1.5} />
              </div>
              <h3>{title}</h3>
              <Ornament className="system-card-ornament" />
              <p>
                {description[0]}
                <br />
                {description[1]}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
