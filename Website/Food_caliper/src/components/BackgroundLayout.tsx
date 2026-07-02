import React from "react";
import bgTexture from "@/assets/bg-texture.jpg";

interface BackgroundLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BackgroundLayout: React.FC<BackgroundLayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative min-h-screen bg-background-light dark:bg-background-dark ${className}`}>
      {/* Background Texture Layer */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${bgTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Cloud-White Mesh Overlay - In Front */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(236, 240, 241, 0.08) 1.5px, transparent 1.5px)',
          backgroundSize: '25px 25px',
          backgroundPosition: '0 0',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Content Container - Higher z-index */}
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default BackgroundLayout;
