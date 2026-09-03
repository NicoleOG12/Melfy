import { useEffect } from "react";

export function useCounters() {
  useEffect(() => {
    const section = document.querySelector(".story-section");
    if (!section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".stat-number").forEach((el) => {
          const target = +el.getAttribute("data-target");
          const step   = target / (2000 / 16);
          let cur = 0;
          const tick = () => {
            cur += step;
            if (cur < target) {
              el.textContent = Math.floor(cur).toLocaleString("pt-BR");
              requestAnimationFrame(tick);
            } else {
              el.textContent = target.toLocaleString("pt-BR");
            }
          };
          tick();
        });
        obs.unobserve(entry.target);
      },
      { threshold: 0.5 }
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, []);
}
