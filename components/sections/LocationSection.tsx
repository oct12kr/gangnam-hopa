"use client";

import { motion } from "framer-motion";
import { Navigation } from "lucide-react";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import { location, phoneNumber, telHref } from "./content";

function LocationTitleOrnament({ className = "" }: { className?: string }) {
  return (
    <div className={`gallery-title-ornament ${className}`} aria-hidden="true">
      <span className="gallery-ornament-line" />
      <span className="gallery-ornament-diamond" />
      <span className="gallery-ornament-line" />
    </div>
  );
}

export default function LocationSection() {
  // TODO: 커스텀 마커 디자인 필요 시 Maps JS API로 교체 고려
  const mapSrc = `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;

  return (
    <section className="location-section" id="location" aria-label="강남보스턴 오시는 길">
      <Image className="location-bg-image" src="/images/666.png" alt="" fill sizes="100vw" />
      <div className="location-bg-wash" aria-hidden="true" />

      <div className="location-inner">
        <motion.header
          className="location-heading"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <div className="gallery-title-row location-title-row">
            <LocationTitleOrnament />
            <h2>LOCATION</h2>
            <LocationTitleOrnament />
          </div>
          <p>오시는 길</p>
        </motion.header>

        <div className="location-grid">
          <motion.div
            className="map-frame"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, delay: 0.2, ease: "easeOut" }}
          >
            <iframe
              title="강남보스턴 위치 지도"
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          <motion.div
            className="location-card-shell"
            initial={{ opacity: 0, x: 20, y: 18 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, delay: 0.35, ease: "easeOut" }}
          >
            <GlassCard className="location-card">
              <h3>강남보스턴</h3>
              <address>{location.address}</address>

              <div className="location-contact">
                <span>예약문의</span>
                <a href={telHref}>{phoneNumber}</a>
              </div>

              <p className="location-hours">365일 운영</p>

              <a className="location-directions" href={directionsHref} target="_blank" rel="noreferrer">
                <Navigation size={17} strokeWidth={1.8} aria-hidden="true" />
                길찾기
              </a>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
