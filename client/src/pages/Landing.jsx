import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import GameMapSection from '../components/landing/GameMapSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pb-20 md:pb-24">
                <HeroSection />
                <GameMapSection />
                <TestimonialsSection />
                <CTASection />
            </main>
            <LandingFooter />
        </div>
    );
}
