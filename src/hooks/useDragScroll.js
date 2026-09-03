import { useEffect, useRef } from "react";

export function useDragScroll() {
  const ref      = useRef(null);
  const dragging = useRef(false);
  const startX   = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const down  = (e) => { dragging.current = true;  startX.current = e.pageX - el.offsetLeft; scrollLeft.current = el.scrollLeft; };
    const leave = ()  => { dragging.current = false; };
    const up    = ()  => { dragging.current = false; };
    const move  = (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      el.scrollLeft = scrollLeft.current - (e.pageX - el.offsetLeft - startX.current) * 2;
    };
    const tdown = (e) => { dragging.current = true;  startX.current = e.touches[0].pageX - el.offsetLeft; scrollLeft.current = el.scrollLeft; };
    const tmove = (e) => {
      if (!dragging.current) return;
      el.scrollLeft = scrollLeft.current - (e.touches[0].pageX - el.offsetLeft - startX.current) * 2;
    };

    el.addEventListener("mousedown",  down);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("mouseup",    up);
    el.addEventListener("mousemove",  move);
    el.addEventListener("touchstart", tdown);
    el.addEventListener("touchend",   up);
    el.addEventListener("touchmove",  tmove);

    return () => {
      el.removeEventListener("mousedown",  down);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("mouseup",    up);
      el.removeEventListener("mousemove",  move);
      el.removeEventListener("touchstart", tdown);
      el.removeEventListener("touchend",   up);
      el.removeEventListener("touchmove",  tmove);
    };
  }, []);

  return ref;
}
