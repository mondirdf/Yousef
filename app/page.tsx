import AboutSection from '@/components/AboutSection';
import CreatorIdentitySections from '@/components/CreatorIdentitySections';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import PortfolioSection from '@/components/PortfolioSection';
import SkillsSection from '@/components/SkillsSection';
import SocialSection from '@/components/SocialSection';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <CreatorIdentitySections />
      <PortfolioSection />
      <SkillsSection />
      <SocialSection />
      <Footer />
    </main>
  );
}
