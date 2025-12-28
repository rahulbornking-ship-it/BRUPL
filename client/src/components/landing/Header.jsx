import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import gsap from 'gsap';

export default function Header() {
    const headerRef = useRef(null);
    const logoRef = useRef(null);

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (logoRef.current) {
            gsap.fromTo(
                logoRef.current,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
            );
        }
    }, []);

    return (
        <header
            ref={headerRef}
            className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm"
        >
            <div className="container-babua">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" ref={logoRef} className="flex items-center gap-2 md:gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
                            {/* Auto-rickshaw icon - simplified */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 6.5H17.5L19.11 11H4.89L6.5 6.5ZM6.5 16C5.67 16 5 15.33 5 14.5C5 13.67 5.67 13 6.5 13C7.33 13 8 13.67 8 14.5C8 15.33 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5C16 13.67 16.67 13 17.5 13C18.33 13 19 13.67 19 14.5C19 15.33 18.33 16 17.5 16Z" fill="#000000"/>
                            </svg>
                        </div>
                        <span className="text-lg md:text-xl font-bold text-blue-600">
                            BabuaLMS
                        </span>
                    </Link>

                    {/* Login Button */}
                    {isAuthenticated ? (
                        <Link
                            to="/dashboard"
                            className="px-4 md:px-6 py-2 md:py-2.5 bg-white border border-gray-200 text-blue-600 font-semibold rounded-lg md:rounded-full transition-all duration-300 hover:bg-gray-50"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 md:px-6 py-2 md:py-2.5 bg-white border border-gray-200 text-blue-600 font-semibold rounded-lg md:rounded-full transition-all duration-300 hover:bg-gray-50"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
