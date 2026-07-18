"use client";

import { ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { location, phoneNumber, telHref } from "./content";

export default function ReservationSection() {
  return (
    <section className="reservation-section" id="reservation" aria-label="강남보스턴 예약 안내">
      <Image className="reservation-bg-image" src="/images/777.png" alt="" fill sizes="100vw" />
      <div className="reservation-bg-wash" aria-hidden="true" />

      <div className="reservation-inner">
        <div className="reservation-cta">
          <motion.span
            className="reservation-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            PREMIUM RESERVATION
          </motion.span>

          <motion.p
            className="reservation-copy"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
          >
            예약은 간편한 한 통이면 완료됩니다.
          </motion.p>

          <motion.a
            className="reservation-phone"
            href={telHref}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.75, delay: 0.3, ease: "easeOut" }}
          >
            {phoneNumber}
          </motion.a>

          <motion.a
            className="call-now-btn"
            href={telHref}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          >
            CALL NOW
            <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </motion.a>
        </div>

        <motion.div
          className="reservation-info-bar"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, delay: 0.65, ease: "easeOut" }}
        >
          <div className="reservation-brand">
            <strong>BOSTON</strong>
            <span>강남보스턴</span>
          </div>
          <div className="reservation-bar-divider" aria-hidden="true" />
          <div className="reservation-address">
            <MapPin size={14} strokeWidth={1.8} aria-hidden="true" />
            <span>{location.address}</span>
          </div>
          <div className="reservation-bar-divider" aria-hidden="true" />
          {/* TODO: 실제 대표자명 확정 후 교체 필요 */}
          <span className="reservation-owner">대표 OOO</span>
          <div className="reservation-bar-divider" aria-hidden="true" />
          <a className="reservation-bar-phone" href={telHref}>
            예약문의 {phoneNumber}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
