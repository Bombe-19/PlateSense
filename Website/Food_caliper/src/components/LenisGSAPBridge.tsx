import { useEffect } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

export default function LenisGSAPBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Update GSAP ScrollTrigger on every Lenis smooth scroll tick
    const handleScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", handleScroll);

    // Clean up the scroll listener on unmount
    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis]);

  return null;
}
