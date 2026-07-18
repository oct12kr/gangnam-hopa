import GlassCard from "@/components/ui/GlassCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { location, phoneNumber, telHref } from "./content";

export default function LocationSection() {
  const mapSrc = `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=17&hl=ko&output=embed`;

  return (
    <ScrollReveal as="section" className="section location-section" id="location">
      <div className="map-frame">
        <iframe
          title="강남보스턴 위치 지도"
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <GlassCard className="location-card">
        <span className="eyebrow">Location</span>
        <h2>강남보스턴</h2>
        <p>
          서울특별시 강남구
          <br />
          삼성동 143-27
        </p>
        <dl>
          <div>
            <dt>도로명</dt>
            <dd>{location.roadAddress}</dd>
          </div>
          <div>
            <dt>예약문의</dt>
            <dd>
              <a href={telHref}>{phoneNumber}</a>
            </dd>
          </div>
          <div>
            <dt>운영</dt>
            <dd>365일 운영</dd>
          </div>
          <div>
            <dt>좌표</dt>
            <dd>
              {location.lat}, {location.lng}
            </dd>
          </div>
        </dl>
      </GlassCard>
    </ScrollReveal>
  );
}
