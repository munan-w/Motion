import { useEffect, useRef, useState } from "react";
import { animate, press } from "motion";
import Button from "./components/Button";
import AIButton from "./components/AIButton";
import Checkbox from "./components/Checkbox";
import Carousel from "./components/Carousel";
import Radio from "./components/Radio";
import "./App.css";
import { AnimatePresence, motion } from "motion/react";

function PressBox() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const detach = press(el, (element) => {
      animate(element, { scale: 0.8 }, { type: "spring", stiffness: 1000 });
      return () => animate(element, { scale: 1 }, { type: "spring", stiffness: 500 });
    });
    return () => detach?.();
  }, []);

  return <div className="press-box" ref={ref} tabIndex={0} aria-label="Press demo box" />;
}

function App() {
  const [checked, setChecked] = useState(false);
  const [radioChecked, setRadioChecked] = useState(false);

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Compass Components</p>
          <h1>Compass Motion Design Lab</h1>
          <p className="lede">
            Quick look at the primary button, checkbox, and carousel card with Motion-powered hover/press and an animated checkmark.
          </p>
        </div>
        <div className="tags">
          <span className="tag">React + Vite</span>
          <span className="tag">Motion</span>
        </div>
      </header>

      <section className="panel single-demo">
        <div className="panel__header">
          <div>
            <p className="eyebrow">COMPASS COMPONENTS</p>
            <h2>Examples</h2>
          </div>
          <span className="hint">Demo purpose only.</span>
        </div>
        <div className="single-row dual examples-row">
          <div className="examples-controls">
            <Button label="Button" variant="Primary" state="Rest" />
            <AIButton label="Join BECU" />
            <Checkbox label="Label" showHelper helperText="Helper message" checked={checked} onChange={setChecked} />
            <Radio label="Radio" showHelper helperText="Helper message" checked={radioChecked} onChange={() => setRadioChecked((v) => !v)} />
          </div>
          <div className="examples-carousel">
            <Carousel />
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">MOTION.DEV</p>
            <h2>Motion Token Examples</h2>
          </div>
          <span className="hint">Demo purpose only.</span>
        </div>
        <div className="press-row press-row--three">
          <div className="press-stack">
            <PressBox />
            <HideShow />
            <GestureBox />
          </div>
          <div className="press-copy">
            <p>Using the same Motion press helper on a plain div for parity with the provided snippet.</p>
            <code>import {"{ press }"} from "motion"</code>
            <p>Checkbox uses AnimatePresence + motion paths for check/indeterminate drawing.</p>
            <code>import {"{ AnimatePresence, motion }"} from "motion/react"</code>
            <p>Gesture card uses hover + press to animate on user input.</p>
            <code>whileHover / whileTap for immediate motion feedback</code>
          </div>
          <table className="token-table token-table--compact token-table--inline">
            <tbody>
              <tr>
                <th>Duration</th>
                <td>Buttons & checkbox 0.10s · Cards 0.20s</td>
              </tr>
              <tr>
                <th>Easing</th>
                <td>easeInOut · cubic-bezier(0.4, 0, 0.2, 1)</td>
              </tr>
              <tr>
                <th>Press spring</th>
                <td>stiffness 1000, damping 50, scale 0.8 → 1</td>
              </tr>
              <tr>
                <th>Exit/enter</th>
                <td>scale 0 → 1, opacity 0 → 1</td>
              </tr>
              <tr>
                <th>Card hover/tap</th>
                <td>hover scale 1.02, tap scale 0.98</td>
              </tr>
              <tr>
                <th>Carousel</th>
                <td>AnimatePresence fade + layoutScroll viewport (state preserved)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function HideShow() {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className="hide-show">
      <div className="hide-show__preview">
        <AnimatePresence initial={false}>
          {isVisible ? (
            <motion.div
              key="box"
              className="hide-show__box"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            />
          ) : null}
        </AnimatePresence>
      </div>
      <motion.button
        className="hide-show__button"
        onClick={() => setIsVisible((v) => !v)}
        whileTap={{ y: 1 }}
      >
        {isVisible ? "Hide" : "Show"}
      </motion.button>
    </div>
  );
}

function GestureBox() {
  return (
    <motion.div
      className="gesture-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Gesture card"
    />
  );
}

export default App;
