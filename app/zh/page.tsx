import MuralHero from "@/components/MuralHero";
import TrustBand from "@/components/TrustBand";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import CourseCircles from "@/components/CourseCircles";
import MembershipBand from "@/components/MembershipBand";
import WorkshopsGrid from "@/components/WorkshopsGrid";
import LibraryTrio from "@/components/LibraryTrio";
import WordOfTheDay from "@/components/WordOfTheDay";
import InstagramStrip from "@/components/InstagramStrip";
import SponsorsStrip from "@/components/SponsorsStrip";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import Newsletter from "@/components/Newsletter";
import WaveDivider from "@/components/WaveDivider";

export default function HomeZh() {
  return (
    <>
      <MuralHero />
      <TrustBand />
      <WaveDivider from="white" to="sole-soft" />
      <FeaturedCarousel />
      <WaveDivider from="sole-soft" to="white" />
      <CourseCircles />
      <WaveDivider from="white" to="paper" />
      <MembershipBand />
      <WaveDivider from="paper" to="cream" />
      <WorkshopsGrid />
      <LibraryTrio />
      <WordOfTheDay />
      <WaveDivider from="white" to="sole-soft" />
      <InstagramStrip />
      <WaveDivider from="sole-soft" to="cream" />
      <SponsorsStrip />
      <WaveDivider from="cream" to="paper" />
      <ReviewsCarousel />
      <WaveDivider from="paper" to="cream" />
      <Newsletter />
    </>
  );
}
