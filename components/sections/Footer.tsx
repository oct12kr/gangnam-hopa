import { phoneNumber, telHref } from "./content";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>강남보스턴</strong>
        <p>서울특별시 강남구 삼성동 143-27</p>
      </div>
      <div>
        <span>예약문의</span>
        <a href={telHref}>{phoneNumber}</a>
      </div>
      <p>Copyright © Boston.</p>
    </footer>
  );
}
