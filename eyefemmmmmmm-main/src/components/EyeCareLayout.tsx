import { ReactNode } from 'react';
import EyeCareNavbar from './EyeCareNavbar';
import Footer from './Footer';
import PageTransition from './PageTransition';

interface EyeCareLayoutProps {
  children: ReactNode;
}

const EyeCareLayout = ({ children }: EyeCareLayoutProps) => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <EyeCareNavbar />
        <main className="flex-grow w-full pt-16">
          <div className="w-full mx-auto">
            {children}
          </div>
        </main>
        <Footer />
        
        {/* Elfsight WhatsApp Chat Widget for Eyecare */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="elfsight-app-a33bc770-938d-4a29-a90b-1d1514e16817" data-elfsight-app-lazy></div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EyeCareLayout;
