import ScrollReveal from "@/components/ui/ScrollReveal";
import { phoneNumber, telHref } from "./content";

export default function ReservationSection() {
  return (
    <ScrollReveal as="section" className="reservation-section" id="reservation">
      <div className="reservation-inner">
        <span className="eyebrow">Premium Reservation</span>
        <h2>
          지금 예약하시면
          <br />
          빠른 안내를 도와드립니다.
        </h2>
        <div className="reservation-actions">
          <a className="primary-action" href={telHref}>
            전화예약 {phoneNumber}
          </a>
          {/* TODO: 카카오톡 채널 링크 연결 필요 */}
          <a className="secondary-action" href="#">
            카카오톡 상담
          </a>
          {/* TODO: 네이버예약 연동 추후 진행 */}
          <button className="disabled-action" type="button" disabled>
            네이버예약 추후 오픈 예정
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
}
