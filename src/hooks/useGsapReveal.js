import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Subtle, one-time entrance animation (fade + 20px Y + stagger).
 * Animates the direct children of the returned ref's element.
 * Runs only once per mount so it never replays on data updates.
 */
const useGsapReveal = ({ stagger = 0.08, y = 20, duration = 0.5 } = {}) => {
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    const el = containerRef.current;
    if (!el || !el.children || el.children.length === 0) return;

    hasAnimatedRef.current = true;
    gsap.fromTo(
      el.children,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        ease: "power2.out",
        stagger,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
};

/**
 * Same subtle fade + 20px Y treatment, but animates the ref'd
 * element itself rather than its children. Useful for a single
 * heading or paragraph that isn't part of a list/grid.
 */
export const useGsapRevealSelf = ({ delay = 0, y = 20, duration = 0.5 } = {}) => {
  const elRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    const el = elRef.current;
    if (!el) return;

    hasAnimatedRef.current = true;
    gsap.fromTo(
      el,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration, delay, ease: "power2.out" },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return elRef;
};

export default useGsapReveal;
