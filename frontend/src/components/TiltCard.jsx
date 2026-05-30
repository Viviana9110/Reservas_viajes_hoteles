import { useRef, useCallback } from "react";

const TiltCard = ({ children, className = "", tiltDegree = 8, glare = true }) => {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * -tiltDegree;
    const tiltY = (x - 0.5) * tiltDegree;
    el.style.setProperty("--tilt-x", `${tiltX}deg`);
    el.style.setProperty("--tilt-y", `${tiltY}deg`);
    if (glare) {
      el.style.setProperty("--glare-x", `${x * 100}%`);
      el.style.setProperty("--glare-y", `${y * 100}%`);
      el.style.setProperty("--glare-opacity", "1");
    }
  }, [tiltDegree, glare]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    if (glare) {
      el.style.setProperty("--glare-opacity", "0");
    }
  }, [glare]);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card ${className}`}
      style={{
        transform: "perspective(800px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
        transition: "transform 0.15s ease-out",
      }}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.25) 0%, transparent 60%)",
            opacity: "var(--glare-opacity, 0)",
          }}
        />
      )}
      {children}
    </div>
  );
};

export default TiltCard;
