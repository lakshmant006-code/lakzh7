/* The open library. To add a component: drop a self-contained file in src/library/components, import it here with ?raw
   (that is what people copy and download), and add one entry to COMPONENTS. Nothing else needs to change. */
import CardStack from "./components/CardStack.jsx";
import ContextMeter from "./components/ContextMeter.jsx";
import DotSphere from "./components/DotSphere.jsx";
import Slingshot from "./components/Slingshot.jsx";
import MorphSlingshot from "./components/MorphSlingshot.jsx";
import ArcFan from "./components/ArcFan.jsx";
import MorphPasscode from "./components/MorphPasscode.jsx";
import MorphColorField from "./components/MorphColorField.jsx";
import MorphSegmented from "./components/MorphSegmented.jsx";
import MorphRangeField from "./components/MorphRangeField.jsx";
import MorphAiPrompt from "./components/MorphAiPrompt.jsx";
import MorphSelectionBox from "./components/MorphSelectionBox.jsx";
import MorphSpringPresets from "./components/MorphSpringPresets.jsx";
import MorphLayers from "./components/MorphLayers.jsx";
import MorphCommandPalette from "./components/MorphCommandPalette.jsx";
import PressButton from "./components/PressButton.jsx";
import SegmentedPill from "./components/SegmentedPill.jsx";
import Typewriter from "./components/Typewriter.jsx";
import Skeleton from "./components/Skeleton.jsx";
import SwipeToConfirm from "./components/SwipeToConfirm.jsx";
import TiltCard from "./components/TiltCard.jsx";
import NodeConnect from "./components/NodeConnect.jsx";
import MorphSpringCurve from "./components/MorphSpringCurve.jsx";
import MorphThemeSwitch from "./components/MorphThemeSwitch.jsx";
import MorphNumberField from "./components/MorphNumberField.jsx";
import MorphIconButtons from "./components/MorphIconButtons.jsx";
import nodeConnectSrc from "./components/NodeConnect.jsx?raw";
import cardStackSrc from "./components/CardStack.jsx?raw";
import contextMeterSrc from "./components/ContextMeter.jsx?raw";
import dotSphereSrc from "./components/DotSphere.jsx?raw";
import slingshotSrc from "./components/Slingshot.jsx?raw";
import morphSlingSrc from "./components/MorphSlingshot.jsx?raw";
import arcFanSrc from "./components/ArcFan.jsx?raw";
import passcodeSrc from "./components/MorphPasscode.jsx?raw";
import morphColorFieldSrc from "./components/MorphColorField.jsx?raw";
import morphSegmentedSrc from "./components/MorphSegmented.jsx?raw";
import morphRangeFieldSrc from "./components/MorphRangeField.jsx?raw";
import morphAiPromptSrc from "./components/MorphAiPrompt.jsx?raw";
import morphSelectionBoxSrc from "./components/MorphSelectionBox.jsx?raw";
import morphSpringPresetsSrc from "./components/MorphSpringPresets.jsx?raw";
import morphLayersSrc from "./components/MorphLayers.jsx?raw";
import morphCommandPaletteSrc from "./components/MorphCommandPalette.jsx?raw";
import pressButtonSrc from "./components/PressButton.jsx?raw";
import segmentedPillSrc from "./components/SegmentedPill.jsx?raw";
import typewriterSrc from "./components/Typewriter.jsx?raw";
import skeletonSrc from "./components/Skeleton.jsx?raw";
import swipeSrc from "./components/SwipeToConfirm.jsx?raw";
import tiltSrc from "./components/TiltCard.jsx?raw";
import springSrc from "./components/MorphSpringCurve.jsx?raw";
import themeSrc from "./components/MorphThemeSwitch.jsx?raw";
import numberSrc from "./components/MorphNumberField.jsx?raw";
import iconBtnSrc from "./components/MorphIconButtons.jsx?raw";

export const CATEGORIES = ["All", "Hover", "Press", "Drag", "Slide", "Swipe", "Type", "Select", "Loading", "Physics"];

const c = (key, label, min, max, step, value) => ({ key, label, min, max, step, value });

export const COMPONENTS = [
  { id: "card-stack", name: "Card stack", category: "Swipe", Component: CardStack, source: cardStackSrc, added: "2026-11-16", description: "A small stack of photos that fans out as you reach for it. Drag the top card away, let go, and it springs back under the pile.",
    controls: [c("cards", "Cards", 2, 6, 1, 4), c("spread", "Spread", 4, 40, 1, 18), c("corner", "Corner", 0, 32, 1, 14), c("bounce", "Bounce", 0, 10, 1, 5)] },
  { id: "context-meter", name: "Context meter", category: "Loading", Component: ContextMeter, source: contextMeterSrc, added: "2026-11-16", description: "A number that counts up and a segmented bar that fills in. Good for usage, storage and progress readouts.",
    controls: [c("used", "Used", 0, 200, 1, 175), c("total", "Total", 100, 400, 10, 200), c("compact", "Compact", 0, 1, 1, 0)] },
  { id: "dot-sphere", name: "Dot sphere", category: "Hover", Component: DotSphere, source: dotSphereSrc, added: "2026-11-16", description: "A ball made of dots, turning on its own. Move over it and it swirls toward your pointer while the dots jitter, hardest right under it.",
    controls: [c("density", "Density", 10, 34, 1, 22), c("speed", "Speed", 0, 20, 1, 6), c("size", "Size", 30, 100, 1, 70), c("jitter", "Jitter", 0, 14, 1, 5)] },
  { id: "slingshot", name: "Pull and release", category: "Drag", Component: Slingshot, source: slingshotSrc, added: "2026-11-16", description: "Pull the ball back, let go, and it flies off and returns with a bounce.",
    controls: [c("stretch", "Stretch", 30, 110, 1, 60), c("bounce", "Bounce", 0, 10, 1, 6)] },
  { id: "morph-slingshot", name: "Slingshot", category: "Drag", from: "MORPH", Component: MorphSlingshot, source: morphSlingSrc, added: "2026-11-18", description: "From MORPH. The full Slingshot interaction: pull the ball back in its elastic socket and let go. It flies on an arc, bounces off the walls and ceiling, settles and returns to the band, with sparks, a trembling strain and a turning arrow.",
    controls: [c("power", "Power %", 40, 220, 1, 145), c("bounce", "Bounce", 0, 100, 1, 55)] },
  { id: "arc-fan", name: "Arc fan", category: "Hover", Component: ArcFan, source: arcFanSrc, added: "2026-11-19", description: "A hand of cards that opens along a semicircle as it scrolls into view. The card under your pointer lifts out and gets a name tag.",
    controls: [c("cards", "Cards", 3, 9, 1, 7), c("radius", "Radius", 1.5, 4, 0.1, 2.7), c("span", "Span °", 60, 170, 1, 132), c("blur", "Edge blur", 0, 6, 0.1, 3.4)] },
  { id: "morph-passcode", name: "Passcode field", category: "Press", from: "MORPH", Component: MorphPasscode, source: passcodeSrc, added: "2026-11-19", description: "From MORPH. A protected value with a reveal and a copy button.",
    controls: [c("speed", "Reveal speed", 1, 10, 1, 5)] },
  { id: "morph-color-field", name: "Colour field", category: "Select", from: "MORPH", Component: MorphColorField, source: morphColorFieldSrc, added: "2026-11-19", description: "From MORPH. Swatch and hex box in one field. Type a hex and press Enter.",
    controls: [c("swatches", "Fields", 1, 3, 1, 3)] },
  { id: "morph-segmented", name: "Segmented control", category: "Select", from: "MORPH", Component: MorphSegmented, source: morphSegmentedSrc, added: "2026-11-19", description: "From MORPH. Radio buttons in a recessed track, and a quiet select.",
    controls: [c("weight", "Text weight", 300, 800, 100, 500)] },
  { id: "morph-range-field", name: "Range field", category: "Slide", from: "MORPH", Component: MorphRangeField, source: morphRangeFieldSrc, added: "2026-11-19", description: "From MORPH. Label, slider and mono value, driving a live layer.",
    controls: [c("max", "Opacity max", 20, 100, 1, 100)] },
  { id: "morph-ai-prompt", name: "AI prompt", category: "Type", from: "MORPH", Component: MorphAiPrompt, source: morphAiPromptSrc, added: "2026-11-19", description: "From MORPH. The floating prompt bar with the selection chip.",
    controls: [] },
  { id: "morph-selection-box", name: "Selection box", category: "Drag", from: "MORPH", Component: MorphSelectionBox, source: morphSelectionBoxSrc, added: "2026-11-19", description: "From MORPH. A layer with eight resize handles, a size badge and a hover outline.",
    controls: [c("minSize", "Min size", 8, 80, 1, 24)] },
  { id: "morph-spring-presets", name: "Spring feels", category: "Physics", from: "MORPH", Component: MorphSpringPresets, source: morphSpringPresetsSrc, added: "2026-11-19", description: "From MORPH. One-click feels: Gentle, Snappy, Bouncy and Stiff.",
    controls: [c("distance", "Travel", 30, 100, 1, 70)] },
  { id: "morph-layers", name: "Layers panel", category: "Select", from: "MORPH", Component: MorphLayers, source: morphLayersSrc, added: "2026-11-19", description: "From MORPH. The layers tree: collapse, select, rename, hide.",
    controls: [c("indent", "Indent", 8, 28, 1, 14)] },
  { id: "morph-command-palette", name: "Command palette", category: "Type", from: "MORPH", Component: MorphCommandPalette, source: morphCommandPaletteSrc, added: "2026-11-19", description: "From MORPH. Search every command; arrows move, Enter runs.",
    controls: [c("rows", "Visible rows", 3, 10, 1, 4)] },
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
  { id: "node-connect", name: "Node connect", category: "Drag", Component: NodeConnect, source: nodeConnectSrc, added: "2026-11-17", description: "Two nodes. Drag a wire from the first to the second: the second card starts to shiver as the wire gets close, jitters when it connects, then a solid tab forms between them. Tap the tab to disconnect.",
    controls: [c("shiver", "Shiver", 0, 10, 0.5, 4), c("duration", "Duration (s)", 0.2, 1.4, 0.05, 0.5), c("tab", "Tab size", 6, 26, 1, 14)] },
  { id: "morph-spring-curve", name: "Spring curve", category: "Physics", from: "MORPH", Component: MorphSpringCurve, source: springSrc, added: "2026-11-16", description: "From MORPH. The response curve of a damped spring, in a designer's terms: Response and Bounce. Click the plot to replay the motion.",
    controls: [c("response", "Response", 0.1, 1.2, 0.01, 0.45), c("bounce", "Bounce", 0, 0.9, 0.01, 0.25)] },
  { id: "morph-theme-switch", name: "Theme switch", category: "Select", from: "MORPH", Component: MorphThemeSwitch, source: themeSrc, added: "2026-11-16", description: "From MORPH. A three-way radio group (dark, light, split) in a recessed track.",
    controls: [c("size", "Size", 24, 44, 1, 28)] },
  { id: "morph-number-field", name: "Number field", category: "Type", from: "MORPH", Component: MorphNumberField, source: numberSrc, added: "2026-11-16", description: "From MORPH. A numeric field with a short prefix. Enter commits, Escape reverts, arrow keys step (Shift for ×10).",
    controls: [c("step", "Step", 1, 20, 1, 1)] },
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
