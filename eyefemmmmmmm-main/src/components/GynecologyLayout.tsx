import { ReactNode, useEffect } from 'react';
import GynecologyNavbar from './GynecologyNavbar';
import Footer from './Footer';
import PageTransition from './PageTransition';

interface GynecologyLayoutProps {
  children: ReactNode;
}

const GynecologyLayout = ({ children }: GynecologyLayoutProps) => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <GynecologyNavbar />
        <main className="flex-grow w-full pt-16">
          <div className="w-full mx-auto">
            {children}
          </div>
        </main>
        <Footer />
        {/* Elfsight WhatsApp Chat Widget */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="elfsight-app-f5987c20-7de0-4b19-a688-ad23bc2c6457" data-elfsight-app-lazy></div>
        </div>
      </div>
    </PageTransition>
  );
};

export default GynecologyLayout;
