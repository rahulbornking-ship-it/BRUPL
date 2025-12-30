import { useLocation } from 'react-router-dom';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#0b0f14]">
            {children}
        </div>
    );
}
