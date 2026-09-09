import MuralHero from "@/components/MuralHero";
import UpcomingCourses from "@/components/UpcomingCourses";
import WhyLaDante from "@/components/WhyLaDante";
import CourseCircles from "@/components/CourseCircles";
import LibraryTrio from "@/components/LibraryTrio";
import PlidaTeaser from "@/components/PlidaTeaser";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import MembershipBand from "@/components/MembershipBand";
import WorkshopsGrid from "@/components/WorkshopsGrid";
import WordOfTheDay from "@/components/WordOfTheDay";
import InstagramStrip from "@/components/InstagramStrip";
import SponsorsStrip from "@/components/SponsorsStrip";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import VisitUs from "@/components/VisitUs";
import ClosingCta from "@/components/ClosingCta";
import Newsletter from "@/components/Newsletter";
import WaveDivider from "@/components/WaveDivider";

export default function Home() {
  return (
    <>
      <MuralHero />
      <UpcomingCourses />
      <WaveDivider from="white" to="sole-soft" />
      <WhyLaDante />
      <WaveDivider from="sole-soft" to="white" />
      <CourseCircles />
      <LibraryTrio />
      <PlidaTeaser />
      <WaveDivider from="white" to="sole-soft" />
      <FeaturedCarousel />
      <WaveDivider from="sole-soft" to="paper" />
      <MembershipBand />
      <WaveDivider from="paper" to="cream" />
      <WorkshopsGrid />
      <WaveDivider from="cream" to="white" />
      <WordOfTheDay />
      <WaveDivider from="white" to="sole-soft" />
      <InstagramStrip />
      <WaveDivider from="sole-soft" to="cream" />
      <SponsorsStrip />
      <WaveDivider from="cream" to="paper" />
      <ReviewsCarousel />
      <WaveDivider from="paper" to="cream" />
      <VisitUs />
      <WaveDivider from="cream" to="ink" />
      <ClosingCta />
      <WaveDivider from="ink" to="cream" />
      <Newsletter />
    </>
  );
}
