import gsap from "gsap";

/**
 * Tiny, subtle hover scale for buttons that don't already have a
 * CSS hover transform (kept separate so it never fights existing
 * :hover transitions elsewhere in the app).
 */
export const onBtnEnter = (e) => {
  gsap.to(e.currentTarget, { scale: 1.05, duration: 0.15, ease: "power1.out" });
};

export const onBtnLeave = (e) => {
  gsap.to(e.currentTarget, { scale: 1, duration: 0.15, ease: "power1.out" });
};
