import React from "react";

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
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAyH-QeO3uQ7GDZPILAvrD79bT8p5RO3DpJgdgxE8GHvAd9Ot0b5I7HGtNGYihXSPOQErJrT_JWOY_VYcAsQ1rI3YaMMnVIbB_gQNTK8HQLyP6IMDaNWQ5rrct9BloFXctFUu9IFy9g2V9Mwi6hQIL0Qc6z2HeE2R8IOrfKRXTSmfwbuZ0GTPCSpwwOER8knokw-kTzD5wUgwspbaFuSkk9LwjWQ_oVXJ0Gxgw7ieRcv6Dvgl-IglwJ4XSyoGb6O5gFyiaBJHKemzQ")',
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
