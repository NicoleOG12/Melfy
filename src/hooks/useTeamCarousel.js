import { useState, useEffect, useRef } from "react";

export function useTeamCarousel(total) {
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef(null);

  function goTo(index) {
    const next = (index + total) % total;
    setCurrent(next);
    const el = carouselRef.current;
    if (!el || !el.children[0]) return;
    const w = el.children[0].offsetWidth + 32;
    el.scrollTo({ left: next * w, behavior: "smooth" });
  }

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % total;
        const el = carouselRef.current;
        if (el && el.children[0]) {
          const w = el.children[0].offsetWidth + 32;
          el.scrollTo({ left: next * w, behavior: "smooth" });
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [total]);

  return { current, carouselRef, goTo };
}
