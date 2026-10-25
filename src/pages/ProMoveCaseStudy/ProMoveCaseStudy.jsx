import React from "react";
import useScrollReset from "../../hooks/useScrollReset";
import {
  CsPage,
  CsBreadcrumb,
  CsHero,
  CsIntro,
  CsSection,
  CsH3,
  CsText,
  CsCallout,
  CsPanel,
  CsGrid3,
  CsSide,
  CsStats,
  CsChips,
  CsHmw,
  CsImg,
  CsVideo,
  CsSeeNext,
} from "../../components/CsKit/CsKit";
import "./ProMoveCaseStudy.css";

const BASE = "/work/pro-move";

const FEATURES = [
  {
    video: `${BASE}/how.mp4`,
    title: "How it works",
    lead: "You perform. ",
    highlight: "Your character copies you.",
    caption:
      "Body and face are tracked right on the device. Thirty-three body joints (shoulders, elbows, wrists, hips, knees) and your face (blinks, mouth, smile, brows, head tilt) drive the drawing, and a One Euro filter removes jitter while keeping fast moves sharp. Nothing goes to the cloud.",
  },
  {
    video: `${BASE}/addon.mp4`,
    title: "Inside Procreate",
    lead: "An add-on that lives ",
    highlight: "inside Procreate.",
    caption:
      "pro-move adds one Rig tab to the Actions menu. The rest of Procreate stays exactly as it is, so an artist never has to leave the tool they already draw in.",
  },
  {
    video: `${BASE}/live.mp4`,
    title: "Live capture",
    lead: "Tap the camera, ",
    highlight: "and your character follows you live.",
    caption:
      "No camera handy? A demo performer moves for you, so the whole flow can be tried without a webcam.",
  },
  {
    video: `${BASE}/capture.mp4`,
    title: "Pose or Motion",
    lead: "Two ways to capture: ",
    highlight: "one pose, or a whole move.",
    caption:
      "Pose gives you a three-second countdown to get into position, then keeps one drawing. Motion records up to ten seconds and keeps the drawings where you move the most.",
  },
  {
    video: `${BASE}/filmstrip.mp4`,
    title: "The filmstrip",
    lead: "Every take lands ",
    highlight: "in the filmstrip.",
    caption:
      "Reorder drawings, add in-betweens where the pose jumps, and play it back with onion skin. A jump note appears when two frames that weren't neighbours end up side by side.",
  },
  {
    video: `${BASE}/limb.mp4`,
    title: "Turn or stretch",
    lead: "Tap a limb ",
    highlight: "to turn or stretch it.",
    caption:
      "Animate changes only the current drawing. Rig changes every drawing in the take, like making a forearm longer for the whole animation.",
  },
  {
    video: `${BASE}/feel.mp4`,
    title: "Motion feel",
    lead: "Pick how the motion ",
    highlight: "feels.",
    caption:
      "Snappy holds, then moves quickly. Smooth is one flowing line. Floaty trails a little behind, then settles.",
  },
  {
    video: `${BASE}/rigcheck.mp4`,
    title: "Rig check",
    lead: "Where the drawing tears, ",
    highlight: "local AI patches it.",
    caption:
      "Six test poses find the joints that break. Only those spots are repainted, so every other pixel stays exactly as the artist drew it.",
  },
  {
    video: `${BASE}/export.mp4`,
    title: "Take it back",
    lead: "Take it back to Procreate, ",
    highlight: "or anywhere else.",
    caption:
      "Frames go back as PSD layers that Procreate's Animation Assist plays directly. Layered SVG and PSD open in After Effects, Rive and Figma, and there's a sprite sheet, a video and an AI pack for redrawing in your own style.",
  },
];

const BUILD_LOG = [
  ["Tracking first", "A local server, webcam tracking for body and face with MediaPipe, a 2D rig and a demo performer."],
  ["Procreate, faithfully", "The interface rebuilt from reference screenshots, with Rig added as one extra tab in the Actions menu, inside an iPad Pro mockup."],
  ["Cut-outs, then a mesh", "The first character was a cut-out puppet. We replaced it with mesh skinning, a One Euro jitter filter, a WebGL2 renderer and ink on hidden edges."],
  ["Out of the prototype, into Procreate", "Layered SVG and PSD export and import, a joint editor for any drawing, and an Animation Assist timeline."],
  ["Local AI", "ComfyUI with Stable Diffusion 1.5, ControlNet OpenPose and Lineart, then an AI pack export, hold-a-pose capture and save-to-folder."],
  ["Repair, not redraw", "Gap-only inpainting, the rig check, and joint fixes that blend in live."],
  ["A real character", "The red beanie, built from an SVG turnaround, with flat-colour support, a better automatic cut and an open-arms front view."],
];

const PAPERS = [
  ["As-Rigid-As-Possible shape manipulation", "2005", "Keeps neck, collar and knee patches from kinking where bones blend."],
  ["Bounded Biharmonic Weights", "2011", "Computes smooth joint weights from the drawing's shape, replacing hand-tuned bands."],
  ["Direct Delta Mush", "2019", "Restores the volume that blending loses at the neck, elbows and hips."],
  ["Pose Space Deformation", "2000", "Sculpted corrections that replace raster patches and their ghosting."],
  ["ToonCrafter", "2024", "Offline cartoon in-betweens for exports. Blocked until a GPU works."],
];

const ProMoveCaseStudy = () => {
  useScrollReset();

  return (
    <CsPage project="pro-move" accent="#2F6BDE" tint="#EFE8DF">
      <CsBreadcrumb current="pro-move" />
      <CsHero>
        <img
          src={`${BASE}/hero.jpg`}
          alt="pro-move: what if your drawing could move the moment you do?"
        />
      </CsHero>

      <CsIntro
        title="pro-move by Procreate: A Motion Capture Concept"
        lead="An add-on concept for Procreate where you perform in front of the camera and the character you drew copies your body and your face."
        meta={[
          { label: "Competition", value: "SVSD Design Competition" },
          { label: "Timeline", value: "Oct 2026" },
          { label: "Tools", value: ["MediaPipe", "WebGL2", "ComfyUI"] },
          {
            label: "Scope",
            value: ["Interaction Design", "Prototyping", "AI Prototyping"],
          },
        ]}
      />

      <CsSection
        id="promove-context"
        label="Context"
        title="Why drawings don't move on their own"
      >
        <CsText>
          To make a character move, artists redraw it frame after frame. A
          second of animation is twenty-four drawings. Rigging tools help, but
          they&apos;re built for technical animators, not doodle artists.
        </CsText>
        <CsPanel title="The problem, in one slide">
          <CsVideo
            src={`${BASE}/problem.mp4`}
            label="Twenty-four drawings fill in one at a time to make one second of animation"
          />
        </CsPanel>
        <CsCallout>
          What if your drawing could{" "}
          <span className="cs-accent">move the moment you do?</span>
        </CsCallout>
        <CsText>
          pro-move answers with the thing every artist already has: their own
          body. Step in front of the camera, and the character you drew copies
          your joints and your face, with frames you can keep, refine with a
          local AI and send straight back to Procreate. Everything runs on the
          device, so a drawing never leaves it.
        </CsText>
        <CsStats
          items={[
            { value: "24", label: "drawings for one second of animation" },
            { value: "33", label: "body joints tracked from the camera" },
            { value: "0", label: "drawings sent to the cloud" },
          ]}
        />
      </CsSection>

      <CsSection
        id="solution-section"
        label="Final product"
        title="Perform, capture, refine, take it back"
      >
        <CsText>
          The submission video walks through the finished concept in nine
          steps. Each one below is a clip from it.
        </CsText>
        {FEATURES.map((f) => (
          <CsSide
            key={f.title}
            panelTitle={f.title}
            media={<CsVideo src={f.video} label={f.title} />}
            title={
              <>
                {f.lead}
                <span className="cs-accent">{f.highlight}</span>
              </>
            }
          >
            {f.caption}
          </CsSide>
        ))}
      </CsSection>

      <CsSection
        id="promove-process"
        label="Process"
        title="Key Design Moments"
      >
        <CsH3>Start in the artist&apos;s own tool</CsH3>
        <CsText>
          We didn&apos;t want a new app to learn, so the first real design
          decision was to live inside Procreate. We rebuilt its interface from
          reference screenshots (the dark top bar, the Size and Opacity sidebar,
          the Actions menu with its tabs) and a working paint canvas under it.
          Motion Rig is added as one extra Rig tab in Actions, the character
          appears as its own layer, and the camera lives in the Reference
          window, where Procreate already puts reference material.
        </CsText>
        <CsPanel title="The prototype, shown inside an iPad Pro mockup" wide>
          <CsImg
            src={`${BASE}/procreate-ui.jpg`}
            alt="The pro-move prototype: a Procreate-style screen with the red beanie character standing in a playground scene"
          />
        </CsPanel>

        <CsH3>How the build unfolded</CsH3>
        <CsText>
          The build ran as a sequence of small bets, each one building on the
          last.
        </CsText>
        <CsPanel title="From tracking to a rigged character" padded>
          <ol className="pm-log">
            {BUILD_LOG.map(([title, text], i) => (
              <li key={title} className="pm-log-item">
                <span className="pm-log-num">{i + 1}</span>
                <div>
                  <p className="pm-log-title">{title}</p>
                  <p className="pm-log-text">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </CsPanel>

        <CsH3>Cut the drawing, then let it bend</CsH3>
        <CsText>
          The biggest early call was how a flat drawing should move. Cut-out
          pieces were quick but split apart at elbows and knees. So each part of
          the drawing is now covered by a fine mesh, and near every joint the
          mesh blends between the two bones, so limbs bend instead of breaking.
          Edges that were hidden under another part get an ink line (or a
          darker shade for flat-colour art), so the body keeps its outline when
          a limb swings away.
        </CsText>
        <CsChips
          items={[
            "One Euro filter",
            "Mesh skinning",
            "WebGL2 with canvas fallback",
            "Hidden-edge ink",
            "Automatic part cut",
          ]}
        />

        <CsH3>Prototyping the story itself</CsH3>
        <CsText>
          The promo video needed a stage, so we prototyped one. A separate
          prototype screen wraps the same app in a panel where scenes (ready,
          open the camera, a demo performer, record a walk, the arrival sheet,
          rig mode, walk in, pose and say hi) can be reordered and tuned, then
          played once from start to finish. A second screen focuses on the
          face, where a calibrated neutral face, a One Euro filter and a spring
          drive eyelids, gaze, brows and mouth from a webcam, a recorded clip or
          a scripted performance.
        </CsText>
        <CsGrid3
          items={[
            {
              media: (
                <CsImg
                  src={`${BASE}/prototype-panel.jpg`}
                  alt="The prototype screen with its Sequence panel listing scenes in order"
                />
              ),
              caption: "Sequence panel: choose scenes, order and pace",
            },
            {
              media: (
                <CsImg
                  src={`${BASE}/face-prototype.jpg`}
                  alt="The face prototype screen with a draggable camera card"
                />
              ),
              caption: "Face screen: webcam, recorded clip or scripted face",
            },
          ]}
        />

        <CsHmw
          items={[
            {
              question:
                "How might we let a doodle artist animate without learning to rig?",
              solution:
                "Perform on camera. The rig is built from the drawing, and the artist only taps a limb to turn or stretch it.",
            },
            {
              question:
                "How might we keep the artist's own drawing intact when it moves?",
              solution:
                "Blend meshes at joints, and let local AI repaint only the spots that break, leaving every other pixel as drawn.",
            },
            {
              question:
                "How might we make it feel like part of Procreate, not another app?",
              solution:
                "One Rig tab in Actions, takes as layers, and exports that open in Animation Assist.",
            },
          ]}
        />
      </CsSection>

      <CsSection
        id="promove-problems"
        label="Problems"
        title="What broke, and what we did about it"
      >
        <CsText>
          Plenty went wrong. These are the problems that shaped the product the
          most.
        </CsText>

        <CsH3>Joints that shrink, flatten and tear</CsH3>
        <CsText>
          Blending two bone rotations linearly loses volume in the middle of a
          bend. By the maths of that blend, a 45° head tilt narrows the neck by
          about 8%, a 90° elbow loses about 29% of its width, and a deep knee
          bend can fold the inside of the leg into a corner. Crossed arms also flatten into the jacket,
          because the draw order of the arms was fixed instead of following
          which wrist is nearer the camera.
        </CsText>
        <CsStats
          items={[
            { value: "−8%", label: "neck width at a 45° head tilt" },
            { value: "−29%", label: "elbow width at a 90° bend" },
            { value: "−50%", label: "inner knee width past 120°" },
          ]}
        />
        <CsGrid3
          items={[
            {
              media: (
                <CsImg
                  src={`${BASE}/poses/squat.jpg`}
                  alt="The red beanie character in a deep squat"
                />
              ),
              caption: "Deep squat",
            },
            {
              media: (
                <CsImg
                  src={`${BASE}/poses/armsup.jpg`}
                  alt="The red beanie character with both arms raised"
                />
              ),
              caption: "Arms up",
            },
            {
              media: (
                <CsImg
                  src={`${BASE}/poses/cross.jpg`}
                  alt="The red beanie character with elbows crossed, forearms flat against the jacket"
                />
              ),
              caption: "Elbows crossed",
            },
          ]}
        />
        <CsText>
          We built a Rig Lab with fixed test poses (squat, arms up, crossed
          elbows, head tilts) so every fix could be checked against the same
          extremes. The rig check goes further: it walks you through six poses,
          finds where the drawing chops, has local AI repaint only those spots,
          and saves each repair as a joint fix that fades in live when that
          joint bends near the tested angle.
        </CsText>

        <CsH3>AI that redraws too much</CsH3>
        <CsText>
          Our first AI step repainted whole frames. It cleaned the lines, but it
          could drift off-model and, at half resolution, lose small details
          like the character&apos;s glasses. So we flipped the idea: instead of
          redrawing, <strong>fix gaps</strong> finds the bent joints and
          inpaints only those spots in a small crop with a soft mask. Redraw
          stays available, tuned down to a strength of 0.35.
        </CsText>

        <CsH3>A graphics card that wasn&apos;t there</CsH3>
        <CsText>
          The laptop&apos;s GPU turned out to be reporting a Windows Code 43
          error, which meant no program could use it. On the processor
          alone, one AI frame took about an hour. We added a fast mode with
          half resolution and an LCM-LoRA that needs six steps, which brought
          a frame down to about a minute and a half, and kept going.
        </CsText>
        <CsStats
          items={[
            { value: "~1 hr", label: "per AI frame on the processor, standard mode" },
            { value: "~1.5 min", label: "per AI frame in fast mode" },
          ]}
        />

        <CsH3>Small things that turned out big</CsH3>
        <CsText>
          The camera only works on localhost or HTTPS, so testing on an iPad
          needed a local certificate. Joint fixes and captured frames live in
          the browser&apos;s storage, which they quickly outgrow, so they
          aren&apos;t in the shareable build yet. And the red beanie&apos;s
          front view is now an open-arms pose, because open arms keep the
          sleeves and hands clear of the body and the automatic cut comes out
          clean.
        </CsText>
      </CsSection>

      <CsSection
        id="promove-research"
        label="Research"
        title="What we read to fix it next"
      >
        <CsText>
          To plan the next round, we read five character-deformation papers in
          full and mapped each one onto the code. This was research and
          planning only, and no code was changed yet. A measuring step comes
          first, so every later fix is judged against numbers, followed by the
          head and neck, then the shoulders and arms, then the squat and knees.
        </CsText>
        <CsPanel title="Five papers, five artefacts" padded>
          <ul className="pm-papers">
            {PAPERS.map(([name, year, text]) => (
              <li key={name} className="pm-paper">
                <p className="pm-paper-name">
                  {name} <span className="pm-paper-year">{year}</span>
                </p>
                <p className="pm-paper-text">{text}</p>
              </li>
            ))}
          </ul>
        </CsPanel>
      </CsSection>

      <CsSection
        id="promove-takeaways"
        label="Reflections"
        title="Measure first, then make it move."
      >
        <CsText>
          The biggest lesson was that a drawing is not a 3D model. Every trick
          for making it bend came with a visible cost, and the only way to
          choose between them was to test the same extreme poses over and over.
          Keeping everything on the device shaped almost every decision, from
          the tracking models to the AI that only repairs the broken spots.
        </CsText>
        <CsText>
          Next up are a working GPU, the side, back and three-quarter views for
          when the performer turns, Lottie export for motion tools, and a real
          iPad companion app.
        </CsText>
      </CsSection>

      <CsSeeNext
        id="promove-see-next"
        items={[
          {
            to: "/hiku",
            video: "/work/Hiku/hiku-promo.mp4",
            title: "Hiku: A Mobile Application for Hiking Enthusiasts",
            description:
              "Connecting hikers around shared trails and making it easy to buy or rent gear.",
          },
          {
            to: "/time-management",
            video: "/work/time-management/summer-launch.mp4",
            title: "Summer: A Productivity Tracking Web App",
            description:
              "Helping a company track employee productivity through an intuitive time management dashboard.",
          },
        ]}
      />
    </CsPage>
  );
};

export default ProMoveCaseStudy;
