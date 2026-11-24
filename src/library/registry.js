/* The open library. To add a component: drop a self-contained file in src/library/components, import it here with ?raw
   (that is what people copy and download), and add one entry to COMPONENTS. Nothing else needs to change. */
import CardStack from "./components/CardStack.jsx";
import ContextMeter from "./components/ContextMeter.jsx";
import TextWaterfall from "./components/TextWaterfall.jsx";
import ScrollCarousel from "./components/ScrollCarousel.jsx";
import MorphSignIn from "./components/MorphSignIn.jsx";
import MorphSlingshot from "./components/MorphSlingshot.jsx";
import MorphPasscode from "./components/MorphPasscode.jsx";
import ScrollParallax from "./components/ScrollParallax.jsx";
import VerticalSliders from "./components/VerticalSliders.jsx";
import PressButton from "./components/PressButton.jsx";
import SegmentedPill from "./components/SegmentedPill.jsx";
import Typewriter from "./components/Typewriter.jsx";
import Skeleton from "./components/Skeleton.jsx";
import SwipeToConfirm from "./components/SwipeToConfirm.jsx";
import TiltCard from "./components/TiltCard.jsx";
import NodeConnect from "./components/NodeConnect.jsx";
import MorphIconButtons from "./components/MorphIconButtons.jsx";
import nodeConnectSrc from "./components/NodeConnect.jsx?raw";
import cardStackSrc from "./components/CardStack.jsx?raw";
import contextMeterSrc from "./components/ContextMeter.jsx?raw";
import textWaterfallSrc from "./components/TextWaterfall.jsx?raw";
import scrollCarouselSrc from "./components/ScrollCarousel.jsx?raw";
import morphSignInSrc from "./components/MorphSignIn.jsx?raw";
import morphSlingSrc from "./components/MorphSlingshot.jsx?raw";
import passcodeSrc from "./components/MorphPasscode.jsx?raw";
import scrollParallaxSrc from "./components/ScrollParallax.jsx?raw";
import verticalSlidersSrc from "./components/VerticalSliders.jsx?raw";
import pressButtonSrc from "./components/PressButton.jsx?raw";
import segmentedPillSrc from "./components/SegmentedPill.jsx?raw";
import typewriterSrc from "./components/Typewriter.jsx?raw";
import skeletonSrc from "./components/Skeleton.jsx?raw";
import swipeSrc from "./components/SwipeToConfirm.jsx?raw";
import tiltSrc from "./components/TiltCard.jsx?raw";
import iconBtnSrc from "./components/MorphIconButtons.jsx?raw";

export const CATEGORIES = ["All", "Hover", "Press", "Drag", "Slide", "Swipe", "Type", "Select", "Loading", "Physics"];

const c = (key, label, min, max, step, value) => ({ key, label, min, max, step, value });
const g = (group, ctl) => ({ ...ctl, group });

export const COMPONENTS = [
  { id: "card-stack", name: "Card stack", category: "Swipe", Component: CardStack, source: cardStackSrc, added: "2026-11-16", description: "A small stack of photos that fans out as you reach for it. Drag the top card away, let go, and it springs back under the pile.",
    controls: [c("cards", "Cards", 2, 6, 1, 4), c("spread", "Spread", 4, 40, 1, 18), c("corner", "Corner", 0, 32, 1, 14), c("bounce", "Bounce", 0, 10, 1, 5)] },
  { id: "context-meter", name: "Context meter", category: "Loading", Component: ContextMeter, source: contextMeterSrc, added: "2026-11-16", description: "A number that counts up and a segmented bar that fills in. Good for usage, storage and progress readouts.",
    controls: [c("used", "Used", 0, 200, 1, 175), c("total", "Total", 100, 400, 10, 200), c("compact", "Compact", 0, 1, 1, 0)] },
  { id: "morph-slingshot", name: "Slingshot toggle", category: "Drag", from: "MORPH", Component: MorphSlingshot, source: morphSlingSrc, added: "2026-11-18", description: "From MORPH. Pull the ball back in its elastic socket and let go: it flies on an arc, bounces off the walls, settles back, and each launch flips the band between orange and dark.",
    controls: [c("power", "Power %", 40, 220, 1, 145), c("bounce", "Bounce", 0, 100, 1, 55)] },
  { id: "morph-passcode", name: "Passcode reveal", category: "Press", from: "MORPH", Component: MorphPasscode, source: passcodeSrc, added: "2026-11-19", description: "From MORPH. Press the eye: the dots turn into digits one after another, the eye closes, the border lights up. Press again and it runs back. The open eye follows the cursor.",
    controls: [c("duration", "Duration (s)", 0.15, 1.5, 0.01, 0.34), c("follow", "Eye follows cursor", 0, 1, 1, 1)] },
  { id: "scroll-parallax", name: "Scroll parallax", category: "Swipe", Component: ScrollParallax, source: scrollParallaxSrc, added: "2026-11-19", description: "A strip of picture cards you scroll sideways; each picture slides inside its frame as it passes the middle, with a reflection below.",
    controls: [c("travel", "Travel", 0, 1.2, 0.05, 0.75), c("gap", "Gap (rem)", 0.5, 3, 0.1, 1.5), c("padding", "Padding (rem)", 0, 4, 0.1, 1.5), c("reflect", "Reflect", 0, 1, 1, 1), c("animate", "Animate", 0, 1, 1, 1), c("cards", "Cards", 4, 12, 1, 8), c("drive", "Scroll drive", 0, 1, 1, 1), c("ratio", "Ratio", 0.3, 3, 0.1, 1), c("smoothness", "Smoothness (s)", 0.05, 0.8, 0.05, 0.22), c("snap", "Snap to card", 0, 1, 1, 1)] },
  { id: "vertical-sliders", name: "Sliders", category: "Slide", Component: VerticalSliders, source: verticalSlidersSrc, added: "2026-11-19", description: "Three tall sliders you drag up and down. The fill rises, the icon follows the level, and the pill swells under your finger.",
    controls: [c("height", "Height", 80, 200, 1, 120), c("radius", "Roundness", 4, 22, 1, 14)] },
  { id: "press-button", name: "Press button", category: "Press", Component: PressButton, source: pressButtonSrc, added: "2026-11-16", description: "A chunky key that sinks when you press it and springs back, with a little squash.",
    controls: [c("depth", "Depth", 2, 14, 1, 8), c("squish", "Squish", 0, 10, 1, 4)] },
  { id: "segmented-pill", name: "Segmented pill", category: "Select", Component: SegmentedPill, source: segmentedPillSrc, added: "2026-11-16", description: "Pick one option and a pill slides under it, with a touch of overshoot.",
    controls: [c("radius", "Radius", 0, 20, 1, 12), c("speed", "Speed", 1, 10, 1, 4)] },
  { id: "typewriter", name: "Typewriter", category: "Type", Component: Typewriter, source: typewriterSrc, added: "2026-11-16", description: "Types a line, holds it, erases it, then moves to the next.",
    controls: [c("speed", "Speed", 1, 10, 1, 5), c("hold", "Hold (s)", 0.4, 4, 0.1, 1.4)] },
  { id: "skeleton", name: "Skeleton", category: "Loading", Component: Skeleton, source: skeletonSrc, added: "2026-11-16", description: "Placeholder lines with a soft shimmer that sweeps across while content loads.",
    controls: [c("rows", "Rows", 1, 6, 1, 3), c("speed", "Speed", 1, 10, 1, 5)] },
  { id: "swipe-to-confirm", name: "Swipe to confirm", category: "Slide", Component: SwipeToConfirm, source: swipeSrc, added: "2026-11-16", description: "Drag the handle all the way across to confirm. Let go early and it slides back.",
    controls: [c("threshold", "Threshold %", 50, 100, 1, 85)] },
  { id: "tilt-card", name: "Tilt card", category: "Hover", Component: TiltCard, source: tiltSrc, added: "2026-11-16", description: "A card that leans toward your pointer, with a soft light that follows it.",
    controls: [c("tilt", "Tilt", 0, 30, 1, 14), c("glare", "Glare", 0, 80, 1, 40)] },
  { id: "scroll-carousel", name: "Scroll carousel", category: "Swipe", Component: ScrollCarousel, source: scrollCarouselSrc, added: "2026-11-20", description: "Picture cards stood round a 3D barrel. Scroll, drag or use the arrow keys and the barrel turns, with the cards facing away dimmed. Rotation X and Z lean it, and there are switches for vertical, infinite, backface and debug.",
    controls: [g("Config", c("animate", "Animate", 0, 1, 1, 0)), g("Config", c("panel", "Config panel on stage", 0, 1, 1, 0)), g("Config", c("grid", "Grid (scroll ruler)", 0, 1, 1, 1)),
      g("Scrolling", c("drive", "Scroll drive", 0, 1, 1, 1)), g("Scrolling", c("vertical", "Vertical", 0, 1, 1, 0)), g("Scrolling", c("infinite", "Infinite", 0, 1, 1, 1)), g("Scrolling", c("ratio", "Ratio", 0.3, 3, 0.1, 1)), g("Scrolling", c("smoothness", "Smoothness (s)", 0.05, 0.9, 0.05, 0.28)), g("Scrolling", c("snap", "Snap to card", 0, 1, 1, 0)), g("Scrolling", c("debug", "Debug", 0, 1, 1, 1)),
      g("Rotation", c("rotX", "X", -60, 60, 1, 0)), g("Rotation", c("rotZ", "Z", -90, 90, 1, 0)),
      g("Mask", c("backface", "Backface", 0, 1, 1, 1)), g("Mask", c("perspective", "Perspective (px)", 150, 1200, 10, 320)), g("Mask", c("gap", "Gap", 0, 1, 0.05, 0.1)), g("Mask", c("items", "Items", 6, 24, 1, 16)), g("Mask", c("sort", "Sort them", 0, 1, 1, 1))] },

  { id: "text-waterfall", name: "Text waterfall", category: "Type", Component: TextWaterfall, source: textWaterfallSrc, added: "2026-11-24", description: "Three.js. A sentence falling in strands that bend outward. Each letter drops in at its own speed and eases out into a line set with real letter widths; the lines then scroll on and speed up as they come out. Move the pointer to swing the camera.",
    controls: [c("speed", "Speed", 0, 4, 0.1, 1), c("fall", "Fall", 0, 2, 0.1, 1), c("settle", "Settle", 0.5, 1.5, 0.05, 1), c("scatter", "Scatter", 0, 3, 0.1, 0.6), c("tracking", "Tracking (em)", -0.05, 0.3, 0.01, 0.04), c("strands", "Strands", 3, 26, 1, 18), c("size", "Size", 0.6, 2.5, 0.05, 1.2), c("fan", "Bend", 0, 12, 0.5, 5.5), c("height", "Height", 8, 40, 1, 26), c("lens", "Lens (fov)", 15, 80, 1, 30), c("label", "Label", 0, 1, 1, 1)] },
  { id: "morph-signin", name: "Morph sign-in", category: "Press", Component: MorphSignIn, source: morphSignInSrc, added: "2026-11-20", description: "A Sign In pill that grows into a sign-in card and back: size, corner and colour follow one spring while the contents blur in row by row.",
    controls: [c("duration", "Smoothness (s)", 0.2, 1.4, 0.05, 0.55), c("bounce", "Bounce", 0, 0.6, 0.05, 0.15), c("blur", "Blur (px)", 0, 14, 1, 6), c("stagger", "Stagger", 0, 0.3, 0.02, 0.1)] },
  { id: "node-connect", name: "Node connect", category: "Drag", Component: NodeConnect, source: nodeConnectSrc, added: "2026-11-17", description: "Two nodes. Drag a wire from the first to the second: the second card starts to shiver as the wire gets close, jitters when it connects, then a solid tab forms between them. Tap the tab to disconnect.",
    controls: [c("shiver", "Shiver", 0, 10, 0.5, 4), c("duration", "Duration (s)", 0.2, 1.4, 0.05, 0.5), c("tab", "Tab size", 6, 26, 1, 14)] },
  { id: "morph-icon-buttons", name: "Icon buttons", category: "Press", from: "MORPH", Component: MorphIconButtons, source: iconBtnSrc, added: "2026-11-16", description: "From MORPH. The toolbar icon button: quiet until hovered, soft orange when active.",
    controls: [c("size", "Size", 24, 44, 1, 28)] },
];

export const defaultsOf = (comp) => Object.fromEntries(comp.controls.map((k) => [k.key, k.value]));
/** the snippet that goes with the code: how to use it with the settings you tuned */
export const usageOf = (comp, values) => {
  const name = comp.source.match(/export default function (\w+)/)?.[1] || "Component";
  const props = comp.controls.map((k) => `${k.key}={${values[k.key]}}`).join(" ");
  return `import ${name} from "./${name}";\n\n<div style={{ width: 320, height: 240 }}>\n  <${name} ${props} />\n</div>`;
};
