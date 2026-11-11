import MuralHero from "@/components/MuralHero";
import CourseCircles from "@/components/CourseCircles";
import LibraryTrio from "@/components/LibraryTrio";
import PlidaTeaser from "@/components/PlidaTeaser";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import MembershipBand from "@/components/MembershipBand";
import WorkshopsGrid from "@/components/WorkshopsGrid";
import SponsorsStrip from "@/components/SponsorsStrip";
import Newsletter from "@/components/Newsletter";
import WaveDivider from "@/components/WaveDivider";

// Section order per Giulia's doc:
//   1 Find Your Course (+ placement-test box + "Why Dante HK" strip)
//   2 Happening at Dante   3 Our Workshops   4 PLIDA   5 Il Salotto di Dante
//   6 Join the Comunità (+ reviews)   7 Sponsors   8 Newsletter
// Word of the week lives inside the hero; opening hours live in the footer.
// The two collage sections draw their own waves so the photos meet the wave line.
export default function HomeZh() {
  return (
    <>
      <MuralHero />

      {/* 1. Find Your Course */}
      <CourseCircles />

      {/* 2. Happening at Dante */}
      <FeaturedCarousel above="white" below="paper" />

      {/* 3. Our Workshops */}
      <WorkshopsGrid />

      {/* 4. PLIDA */}
      <WaveDivider from="paper" to="white" />
      <PlidaTeaser />

      {/* 5. Il Salotto di Dante */}
      <LibraryTrio above="white" below="azzurro" />

      {/* 6. Join the Comunità + reviews */}
      <MembershipBand />

      {/* 7. Sponsors */}
      <WaveDivider from="azzurro" to="paper" />
      <SponsorsStrip />

      {/* 8. Newsletter */}
      <WaveDivider from="paper" to="white" />
      <Newsletter />
    </>
  );
}
