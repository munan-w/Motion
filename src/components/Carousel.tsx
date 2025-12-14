"use client";
import { useEffect, useRef, useState } from "react";
import { motion, wrap } from "motion/react";
import "./carousel.css";

type Slide = {
  id: string;
  title: string;
  linkLabel: string;
  href?: string;
  accent: string;
  illustration?: string;
};

const slides: Slide[] = [
  {
    id: "profits",
    title: "We give our profits to our members.",
    linkLabel: "Our commitment",
    accent: "linear-gradient(135deg, #ffaf45 0%, #ff6b6b 100%)",
  },
  {
    id: "communities",
    title: "We support our communities.",
    linkLabel: "Giving & partnerships",
    accent: "linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)",
  },
  {
    id: "wellbeing",
    title: "We improve your financial well-being.",
    linkLabel: "Financial Health Center",
    accent: "linear-gradient(135deg, #ffc371 0%, #ff5f6d 100%)",
  },
];

export default function Carousel() {
  const [selected, setSelected] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const selectedRef = useRef(0);
  const suppressUntil = useRef<number>(0);

  const updateSelected = (nextIndex: number) => {
    selectedRef.current = nextIndex;
    setSelected(nextIndex);
  };

  function setSlide(newDirection: 1 | -1) {
    suppressUntil.current = performance.now() + 400; // give programmatic scroll a moment
    setSelected((current) => {
      const next = wrap(0, slides.length, current + newDirection);
      selectedRef.current = next;
      return next;
    });
  }

  const slideIndex = wrap(0, slides.length, selected);
  const slide = slides[slideIndex];

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(`[data-slide-id="${slide.id}"]`);
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [slide.id]);

  // When scrolling manually, auto-focus the card nearest the viewport center.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (performance.now() < suppressUntil.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const viewportRect = el.getBoundingClientRect();
        const viewportCenter = viewportRect.left + viewportRect.width / 2;
        const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-slide-id]"));
        if (!cards.length) return;

        let bestIdx = selectedRef.current;
        let bestDist = Number.POSITIVE_INFINITY;

        cards.forEach((card, idx) => {
          const rect = card.getBoundingClientRect();
          const center = rect.left + rect.width / 2;
          const dist = Math.abs(center - viewportCenter);
          // Prefer fully visible cards; fall back to nearest center otherwise.
          const fullyVisible = rect.left >= viewportRect.left && rect.right <= viewportRect.right;
          const score = fullyVisible ? dist * 0.5 : dist;
          if (score < bestDist) {
            bestDist = score;
            bestIdx = idx;
          }
        });

        if (bestIdx !== selectedRef.current) {
          updateSelected(bestIdx);
        }
      });
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="carousel">
      <motion.button
        type="button"
        className="carousel__button"
        onClick={() => setSlide(-1)}
        aria-label="Previous"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.04 }}
      >
        <ArrowLeft />
      </motion.button>

      <motion.div
        className="carousel__viewport"
        layoutScroll
        ref={viewportRef}
        style={{ overflowX: "auto", overflowY: "visible" }}
      >
        {slides.map((item) => (
          <SlideCard key={item.id} slide={item} isActive={item.id === slide.id} />
        ))}
      </motion.div>

      <motion.button
        type="button"
        className="carousel__button"
        onClick={() => setSlide(1)}
        aria-label="Next"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.04 }}
      >
        <ArrowRight />
      </motion.button>
    </div>
  );
}

function SlideCard({ slide, isActive }: { slide: Slide; isActive: boolean }) {
  return (
    <motion.article
      className="carousel__card"
      data-slide-id={slide.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.35 } }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      tabIndex={0}
      style={{
        outline: isActive ? "1px solid #2D4157" : "none",
        outlineOffset: isActive ? 2 : 0,
      }}
    >
      <div className="carousel__media" style={{ background: slide.accent }} aria-hidden />
      <div className="carousel__body">
        <h3>{slide.title}</h3>
        <a className="carousel__link" href={slide.href ?? "#"} onClick={(e) => e.preventDefault()}>
          {slide.linkLabel}
          <span aria-hidden>›</span>
        </a>
      </div>
    </motion.article>
  );
}

function ArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
