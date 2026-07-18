import SiteHeader from "@/components/ui/SiteHeader";
import RevealController from "@/components/ui/RevealController";
import AboutSection from "./AboutSection";
import Footer from "./Footer";
import GallerySection from "./GallerySection";
import HeroSection from "./HeroSection";
import HostSection from "./HostSection";
import LocationSection from "./LocationSection";
import ReservationSection from "./ReservationSection";
import SystemSection from "./SystemSection";

export default function BostonLanding() {
  return (
    <>
      <RevealController />
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <SystemSection />
        <HostSection />
        <GallerySection />
        <LocationSection />
        <ReservationSection />
      </main>
      <Footer />
    </>
  );
}
