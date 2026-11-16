import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import PartnerSection from "./components/PartnerSection";
import Services from "./components/Services";
import VerdicSection from "./components/VerdicSection";
import ProcessSection from "./components/ProcessSection";
import ResultsSection from "./components/ResultsSection";
import LeadMagnet from "./components/LeadMagnet";

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <PartnerSection />
      <hr className="divider" />
      <Services />
      <VerdicSection />
      <ProcessSection />
      <ResultsSection />
      <LeadMagnet />
    </main>
  );
}
