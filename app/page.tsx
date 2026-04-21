import MuralHero from "@/components/MuralHero";
import TrustBand from "@/components/TrustBand";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import CourseCircles from "@/components/CourseCircles";
import MembershipBand from "@/components/MembershipBand";
import WorkshopsGrid from "@/components/WorkshopsGrid";
import LibraryTrio from "@/components/LibraryTrio";
import InstagramStrip from "@/components/InstagramStrip";
import SponsorsStrip from "@/components/SponsorsStrip";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Newsletter from "@/components/Newsletter";
import WaveDivider from "@/components/WaveDivider";

export default function Home() {
  return (
    <>
      <MuralHero />
      <TrustBand />
      <WaveDivider from="white" to="sole-soft" />
      <FeaturedCarousel />
      <WaveDivider from="sole-soft" to="white" />
      <CourseCircles />
      <WaveDivider from="white" to="azzurro" />
      <MembershipBand />
      <WaveDivider from="azzurro" to="cream" />
      <WorkshopsGrid />
      <LibraryTrio />
      <WaveDivider from="white" to="sole-soft" />
      <InstagramStrip />
      <WaveDivider from="sole-soft" to="cream" />
      <SponsorsStrip />
      <WaveDivider from="cream" to="azzurro" />
      <ReviewsCarousel />
      <WaveDivider from="azzurro" to="cream" />
      <Newsletter />
    </>
  );
}
