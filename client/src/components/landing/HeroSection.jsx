import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export default function HeroSection() {
    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const illustrationRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate hero content
            gsap.from('.hero-content > *', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
            });

            // Animate illustration
            gsap.from('.hero-illustration', {
                x: 60,
                opacity: 0,
                duration: 1,
                delay: 0.3,
                ease: 'power3.out',
            });

            // Floating animation for rickshaw
            gsap.to('.rickshaw-float', {
                y: -12,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            // Floating clouds
            gsap.to('.cloud-1', {
                x: 15,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            gsap.to('.cloud-2', {
                x: -10,
                duration: 5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            className="pt-24 md:pt-32 pb-12 md:pb-16"
            style={{ 
                background: 'linear-gradient(to bottom, #e0f2fe 0%, #fef3c7 30%, #fed7aa 50%, #bbf7d0 70%, #ffffff 100%)'
            }}
        >
            <div className="container-babua">
                {/* Centered Layout */}
                <div className="flex flex-col items-center">
                    {/* Illustration Card */}
                    <div ref={illustrationRef} className="hero-illustration w-full max-w-2xl mb-6 md:mb-8">
                        {/* Sky background card */}
                        <div
                            className="relative rounded-3xl p-6 md:p-8 pt-12 md:pt-16 pb-8 md:pb-12 overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-sky-50"
                        >
                            {/* Decorative clouds */}
                            <div className="cloud-1 absolute top-4 md:top-6 left-4 md:left-6 w-12 md:w-16 h-6 md:h-8 bg-white rounded-full opacity-80">
                                <div className="absolute -left-1 md:-left-2 top-1 md:top-2 w-6 md:w-8 h-4 md:h-6 bg-white rounded-full"></div>
                                <div className="absolute -right-1 md:-right-2 top-1 md:top-2 w-8 md:w-10 h-4 md:h-6 bg-white rounded-full"></div>
                            </div>

                            <div className="cloud-2 absolute top-8 md:top-12 right-6 md:right-8 w-10 md:w-12 h-5 md:h-6 bg-white rounded-full opacity-70">
                                <div className="absolute -left-1 md:-left-2 top-0.5 md:top-1 w-5 md:w-6 h-4 md:h-5 bg-white rounded-full"></div>
                            </div>

                            {/* Speech Bubble with Profile Picture */}
                            <div className="relative mb-6 md:mb-8">
                                {/* Profile Picture */}
                                <div className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 z-10">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-white shadow-lg flex items-center justify-center">
                                        <span className="text-xl md:text-2xl">👓</span>
                                    </div>
                                </div>
                                
                                {/* Speech Bubble */}
                                <div className="relative bg-white rounded-2xl px-4 md:px-6 py-3 md:py-4 shadow-lg mx-auto max-w-xs md:max-w-sm mt-4">
                                    <p className="text-gray-800 font-medium text-center text-sm md:text-base">
                                        Babua, interview crack karna chahte ho?
                                    </p>
                                    {/* Bubble tail */}
                                    <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 w-4 md:w-6 h-4 md:h-6 bg-white transform rotate-45"></div>
                                </div>
                            </div>

                            {/* Auto Rickshaw Illustration */}
                            <div className="rickshaw-float relative flex justify-center">
                                <div className="relative w-56 md:w-72 h-40 md:h-48">
                                    {/* Rickshaw body - Green */}
                                    <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 h-24 md:h-28 bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-t-3xl rounded-b-lg shadow-lg">
                                        {/* Driver cabin - Yellow */}
                                        <div className="absolute -left-1 md:-left-2 top-0 w-16 md:w-20 h-full bg-gradient-to-b from-amber-400 to-amber-500 rounded-t-2xl rounded-bl-lg">
                                            {/* Windshield */}
                                            <div className="absolute top-1 md:top-2 left-1 md:left-2 right-1 md:right-2 h-10 md:h-12 bg-sky-200 rounded-t-xl border-2 border-amber-600"></div>
                                            {/* Driver emoji */}
                                            <div className="absolute top-12 md:top-14 left-1/2 -translate-x-1/2 text-xl md:text-2xl">👨</div>
                                        </div>

                                        {/* Passenger area */}
                                        <div className="absolute right-3 md:right-4 top-3 md:top-4 bottom-3 md:bottom-4 left-20 md:left-24 bg-amber-400 rounded-lg overflow-hidden">
                                            <div className="h-full w-full flex flex-col justify-evenly">
                                                <div className="h-0.5 md:h-1 bg-amber-500"></div>
                                                <div className="h-0.5 md:h-1 bg-amber-500"></div>
                                                <div className="h-0.5 md:h-1 bg-amber-500"></div>
                                            </div>
                                        </div>

                                        {/* Canopy */}
                                        <div className="absolute -top-2 md:-top-3 left-16 md:left-20 right-1 md:right-2 h-3 md:h-4 bg-emerald-600 rounded-t-lg"></div>
                                    </div>

                                    {/* Wheels */}
                                    <div className="absolute bottom-1 md:bottom-2 left-8 md:left-10 w-10 md:w-12 h-10 md:h-12 bg-slate-700 rounded-full border-4 border-slate-500 flex items-center justify-center">
                                        <div className="w-3 md:w-4 h-3 md:h-4 bg-slate-400 rounded-full"></div>
                                    </div>
                                    <div className="absolute bottom-1 md:bottom-2 right-10 md:right-12 w-10 md:w-12 h-10 md:h-12 bg-slate-700 rounded-full border-4 border-slate-500 flex items-center justify-center">
                                        <div className="w-3 md:w-4 h-3 md:h-4 bg-slate-400 rounded-full"></div>
                                    </div>
                                    <div className="absolute bottom-1 md:bottom-2 right-3 md:right-4 w-8 md:w-10 h-8 md:h-10 bg-slate-700 rounded-full border-4 border-slate-500 flex items-center justify-center">
                                        <div className="w-2 md:w-3 h-2 md:h-3 bg-slate-400 rounded-full"></div>
                                    </div>

                                    {/* Headlight */}
                                    <div className="absolute bottom-12 md:bottom-14 left-3 md:left-4 w-3 md:w-4 h-3 md:h-4 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50"></div>
                                </div>
                            </div>

                            {/* Decorative tech icons */}
                            <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 text-lg md:text-2xl">💻</div>
                            <div className="absolute top-16 md:top-20 right-3 md:right-4 text-base md:text-xl">⚡</div>
                        </div>
                    </div>

                    {/* Title and Subtitle */}
                    <div ref={contentRef} className="hero-content text-center mb-6 md:mb-8">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 leading-tight">
                            <span className="text-gray-900">Babua LMS</span>
                        </h1>

                        <p className="text-lg md:text-xl lg:text-2xl text-blue-600 font-medium">
                            Desi way to crack tech interviews
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full max-w-md">
                        <Link 
                            to="/register" 
                            className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white font-semibold rounded-lg md:rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg text-center"
                        >
                            Start Learning 🚀
                        </Link>
                        <Link 
                            to="/patterns" 
                            className="px-6 md:px-8 py-3 md:py-4 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-lg md:rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg text-center"
                        >
                            Explore Courses 🗺️
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
