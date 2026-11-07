import MuralHero from "@/components/MuralHero";
import WhyLaDante from "@/components/WhyLaDante";
import CourseCircles from "@/components/CourseCircles";
import LibraryTrio from "@/components/LibraryTrio";
import PlidaTeaser from "@/components/PlidaTeaser";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import MembershipBand from "@/components/MembershipBand";
import WorkshopsGrid from "@/components/WorkshopsGrid";
import WordOfTheWeekFloat from "@/components/WordOfTheWeekFloat";
import SponsorsStrip from "@/components/SponsorsStrip";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Newsletter from "@/components/Newsletter";
import WaveDivider from "@/components/WaveDivider";

// Section order per Giulia's doc: Find Your Course → Happening at Dante →
// Our Workshops → PLIDA → Il Salotto di Dante → Join the Comunità (+ reviews) →
// Sponsors → Newsletter. Upcoming Courses, Visit Us and the black closing band
// removed; opening hours live in the footer.
export default function Home() {
  return (
    <>
      <MuralHero />

      {/* Find Your Course (course grid + why La Dante) */}
      <CourseCircles />
      <WaveDivider from="white" to="sole" />
      <WhyLaDante />

      {/* Happening at Dante */}
      <WaveDivider from="sole" to="white" />
      <FeaturedCarousel />

      {/* Our Workshops */}
      <WaveDivider from="white" to="paper" />
      <WorkshopsGrid />

      {/* PLIDA */}
      <WaveDivider from="paper" to="white" />
      <PlidaTeaser />

      {/* Il Salotto di Dante (library) */}
      <WaveDivider from="white" to="sole" />
      <LibraryTrio />

      {/* Join the Comunità + reviews */}
      <WaveDivider from="sole" to="azzurro" />
      <MembershipBand />
      <WaveDivider from="azzurro" to="paper" />
      <ReviewsCarousel />

      {/* Sponsors */}
      <SponsorsStrip />

      {/* Newsletter */}
      <WaveDivider from="paper" to="white" />
      <Newsletter />

      <WordOfTheWeekFloat />
    </>
  );
}
