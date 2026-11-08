import React, { useEffect, useRef, useState } from "react";
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
import FlowRoute from "../../components/FlowRoute/FlowRoute";
import "./ProMoveCaseStudy.css";

const BASE = "/work/pro-move";

const FEATURES = [
  {
    video: `${BASE}/how.mp4`,
    title: "How it works",
    lead: "You perform. ",
    highlight: "Your character copies you.",
    caption:
      "pro-move is an add-on that lives inside Procreate, as one Rig tab in the Actions menu. Body and face are tracked right on the device: thirty-three body joints and your face (blinks, mouth, smile, brows, head tilt), smoothed so jitter disappears but fast moves stay sharp. Nothing goes to the cloud.",
  },
  {
    video: `${BASE}/capture.mp4`,
    title: "Capture",
    lead: "Two ways to capture: ",
    highlight: "one pose, or a whole move.",
    caption:
      "Pose gives you a three-second countdown, then keeps one drawing. Motion records up to ten seconds and keeps the drawings where you move the most. Every take lands in a filmstrip where you can reorder, add in-betweens and play it back with onion skin.",
  },
  {
    video: `${BASE}/limb.mp4`,
    title: "Refine",
    lead: "Tap a limb ",
    highlight: "to turn or stretch it.",
    caption:
      "Animate changes only the current drawing, Rig changes every drawing in the take. Where a joint tears, a local AI repaints only that spot, so every other pixel stays as the artist drew it.",
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

const FEEL_PRESETS = [
  ["Snappy", "Smoothing 20%, cloth bounce 15%, follow-through 10%", "Holds, then moves quickly. Reads as crisp and responsive."],
  ["Smooth", "Smoothing 55%, cloth bounce 40%, follow-through 35%", "One flowing line. The default."],
  ["Cinematic", "Smoothing 78%, cloth bounce 30%, follow-through 55%", "Slow, weighty and film-like, with limbs trailing their parents."],
  ["Bouncy", "Smoothing 50%, cloth bounce 85%, follow-through 50%", "Medium speed with a lively, swinging jacket and cuffs."],
];

/* the pipeline as a stack: each layer stands on the one below and hands its output up */
const STACK = [
  ["Render", "Export"],
  ["Mesh skinning", "Cloth"],
  ["Bone angles", "Springs"],
  ["Camera", "Jitter filter"],
];
function PipelineStack() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`pm-stack${on ? " on" : ""}`} ref={ref} role="img" aria-label="The pipeline as a stack, from the bottom: camera, jitter filter, bone angles, springs, mesh skinning, cloth, render, export">
      <span className="pm-stack-label">“THE PIPELINE”</span>
      <div className="pm-stack-rows">
        {STACK.map((row, r) => (
          <div key={r} className="pm-stack-row" style={{ "--w": `${42 + (3 - r) * 0 + (r) * 16}%`, "--d": `${(3 - r) * 0.28}s` }}>
            {row.map((t) => <span key={t} className={`pm-stack-cell${t === "Springs" ? " is-hot" : ""}`}>{t}</span>)}
          </div>
        ))}
      </div>
      <span className="pm-stack-note">Springs, tuned last</span>
    </div>
  );
}

const SHIFTS = [
  ["Does it move?", "How does it feel?", "We began by asking whether a drawing could follow a body. We ended up treating smoothness as the main design material."],
  ["Redraw it", "Repair it", "AI first repainted whole frames and drifted off-model. It now touches only the joints that break."],
  ["Fix what we see", "Measure first", "Instead of patching each artefact as it appeared, we planned a measuring step so every later fix is judged against numbers."],
  ["A tool", "A story", "The prototype grew its own screens so the idea could be shown, not just used."],
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
          {
            label: "Team",
            value: ["Lakshman: Design Engineer", "Kalyan: UX Designer"],
          },
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
          The finished concept in four steps, each a clip from the submission
          video.
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
        <CsPanel title="The red beanie, the character we animate throughout" wide>
          <CsImg
            src={`${BASE}/red-beanie.jpg`}
            alt="The red beanie character, as drawn, standing with open arms in the playground scene"
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
        id="promove-motion"
        label="Motion"
        title="The real problem: how smooth should it feel?"
      >
        <CsText>
          Getting a drawing to follow a body was only the first half. The harder
          question, and the one we kept coming back to, was how smooth the
          result should be. Raw tracking jitters. Smooth it too little and the
          character looks like a puppet on strings, smooth it too much and it
          lags behind you like a bad video call. So we treated smoothness as a
          design material with real physics behind it, not a single slider.
        </CsText>

        <CsH3>Three layers of smoothness</CsH3>
        <CsText>
          <strong>Clean the input.</strong> Every joint passes through a One
          Euro filter, which removes shaking but keeps fast moves sharp.
        </CsText>
        <CsText>
          <strong>Primary motion.</strong> Each bone rides on a critically
          damped spring, stepped at a fixed 120 Hz. It eases in and out and
          never overshoots. The smoothing control moves the spring from about
          7.5 Hz at its snappiest to about 1.8 Hz at its floatiest. Forearms,
          shins and the neck are sprung relative to their parent, so they trail
          a little behind it, while blinks and the jaw use a faster spring so
          they stay crisp.
        </CsText>
        <CsText>
          <strong>Secondary motion.</strong> Loose clothing gets its own
          springs. The jacket hem, the sleeve cuffs and the trouser cuffs swing
          around where the skeleton puts them, lag on fast moves and settle.
          The head, torso, upper arms, hands and shoes stay rigid. These
          springs pull toward the animated pose, never toward raw camera
          landmarks, so tracking noise can&apos;t turn into wobble.
        </CsText>

        <CsH3>Four feels, one arm lift</CsH3>
        <CsText>
          The settings are bundled into named feels. Here they are on the same
          move: the red beanie lifting and lowering both arms.
        </CsText>
        <CsPanel title="Snappy, Smooth, Cinematic and Bouncy, side by side" wide>
          <CsVideo
            src={`${BASE}/feels.mp4`}
            label="The red beanie character raising and lowering both arms four times at once, once for each motion feel"
          />
        </CsPanel>
        <CsText>
          We tuned in a fixed order, and it saved us from chasing the wrong
          bug: turn the springs and the cloth off, fix the deformation, and
          only then enable the secondary springs and tune their damping.
          Smoothing can hide a broken joint, so we made it prove itself last.
        </CsText>

        <CsH3>One rig, many uses</CsH3>
        <CsText>
          Once smoothness was a dial, the same character could do more than
          copy a performer. Two uses we explored:
        </CsText>
        <CsGrid3
          items={[
            {
              media: (
                <CsVideo
                  src={`${BASE}/loader-walk.mp4`}
                  label="The red beanie character walking in place in a loop"
                />
              ),
              caption:
                "A loading animation: a walk cycle is a loop that already eases in and out, so it can stand in for a spinner.",
            },
            {
              media: (
                <CsVideo
                  src={`${BASE}/face-live.mp4`}
                  label="Close-up of the red beanie character's face blinking and shifting its gaze"
                />
              ),
              caption:
                "Facial recognition feedback: eyelids, gaze, brows and mouth follow your face live, so the product can show it sees you.",
            },
          ]}
        />
        <CsText>
          A slower feel could suit a loader, where calm matters more than
          response. A snappier one could suit recognition, where lag between
          your blink and the character&apos;s would break the illusion.
        </CsText>
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

      </CsSection>

      <CsSection
        id="promove-thinking"
        label="Thinking"
        title="Thinking in systems, and how our design thinking shifted"
      >
        <CsH3>A character is a system, not a picture</CsH3>
        <CsText>
          Every stage hands its output to the next. A change in one place shows
          up everywhere downstream, which is why so many of our problems were
          really system problems.
        </CsText>
        <CsPanel title="User flow" padded>
          <FlowRoute
            node="pro-move"
            question="Add this frame?"
            yes={{ label: "YES", title: "Timeline", icon: "▦", idle: "EMPTY", active: "{n} FRAMES" }}
            no={{ label: "NO", title: "Live only", icon: "◔", idle: "NOTHING YET", active: "{n} PASSED" }}
            items={[
              { icon: "↑", title: "Raise an arm", sub: "Shoulder and elbow tracked", to: "yes" },
              { icon: "↔", title: "Shift weight", sub: "A pose between poses", to: "no" },
              { icon: "◐", title: "Turn the head", sub: "Add Frame keeps the pose", to: "yes" },
              { icon: "✋", title: "Wave", sub: "The character copies, live", to: "yes" },
              { icon: "~", title: "Hands drop", sub: "Smoothing hides the jitter", to: "no" },
            ]}
          />
        </CsPanel>
        <CsPanel title="The pipeline, from camera to export" padded>
          <PipelineStack />
        </CsPanel>
        <CsText>
          Smoothing could hide a broken joint, so we tuned the springs last.
          Blending that shrinks an elbow shrinks every pose that bends it.
          Weights depend only on where a point sits in the drawing, so pieces
          that overlap always deform the same way. And the rig check closes a
          loop: it finds where the mesh breaks, and the repair blends back in
          live. Even our research plan is a dependency map, since better
          weights alone don&apos;t fix volume loss and have to be paired with
          another method.
        </CsText>
        <CsText>
          One constraint ran through the whole system: everything stays on the
          device. It decided the tracking models, the renderer and the AI, and
          it is the reason repair beats redraw.
        </CsText>

        <CsH3>How our design thinking shifted</CsH3>
        <CsText>
          We started with the people the tool is for: doodle artists, not
          technical animators. That led to building inside Procreate, then
          prototyping, then testing against fixed poses and a real webcam.
          Along the way the questions themselves changed.
        </CsText>
      </CsSection>

      <CsSection
        id="promove-feedback"
        label="Feedback"
        title="Iterating with a product designer"
      >
        <CsText>
          Once the prototype could move a drawing, we put it in front of
          someone who designs products for a living. Naheel is a product
          designer at Google, and we walked him through the working prototype
          over a call, with the character on an iPad canvas and the live
          rig beside it.
        </CsText>
        <CsPanel title="Reviewing the prototype with Naheel" wide>
          <CsVideo
            src={`${BASE}/feedback-naheel.mp4`}
            label="A video call with Naheel, a product designer at Google, reviewing the pro-move prototype on an iPad"
          />
        </CsPanel>
        <CsH3>Design iteration</CsH3>
        <CsText>
          A fresh set of eyes showed us what we had stopped noticing. His
          feedback went straight back into the next round of design, from how
          the controls read to which parts of the motion felt right and which
          needed more work.
        </CsText>
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
          Smoothness turned out to be a design decision as much as a technical
          one. Keeping everything on the device shaped almost every other
          choice, from the tracking models to the AI that only repairs the
          broken spots.
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
