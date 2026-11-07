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

export default function HomeZh() {
  return (
    <>
      <MuralHero />

      {/* Find Your Course */}
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
