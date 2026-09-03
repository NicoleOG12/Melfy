import { useEffect } from "react";

export function useReveal() {
  useEffect(() => {
    function check() {
      document.querySelectorAll(".reveal").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100)
          el.classList.add("visible");
      });
    }
    check();
    window.addEventListener("scroll", check);
    return () => window.removeEventListener("scroll", check);
  }, []);
}
