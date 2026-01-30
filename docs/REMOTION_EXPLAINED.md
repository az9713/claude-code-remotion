# Remotion Explained: How AI Creates Videos with Code

A comprehensive guide explaining what Remotion is, how it works, and how Claude Code uses skills to generate professional videos programmatically.

---

## Table of Contents

1. [What is Remotion?](#what-is-remotion)
2. [The Big Picture: Code → Video](#the-big-picture-code--video)
3. [How Remotion Works (Under the Hood)](#how-remotion-works-under-the-hood)
4. [The Role of Claude Code Skills](#the-role-of-claude-code-skills)
5. [Anatomy of a Remotion Project](#anatomy-of-a-remotion-project)
6. [The Animation System Explained](#the-animation-system-explained)
7. [From React Component to Video File](#from-react-component-to-video-file)
8. [Real Example: ClaudeCodeIntro Breakdown](#real-example-claudecodeintro-breakdown)
9. [How Skills Guide Claude Code](#how-skills-guide-claude-code)
10. [The Complete Workflow](#the-complete-workflow)

---

## What is Remotion?

### The Simple Explanation

**Remotion is a framework that turns React code into videos.**

Instead of using video editing software like Adobe Premiere or Final Cut Pro, you write code that describes what should appear on screen at any moment in time. Remotion then "renders" this code into a real video file (MP4, WebM, etc.).

### Analogy: Programming a Flipbook

Remember flipbooks? You draw slightly different pictures on each page, and when you flip through them fast, you see animation. Remotion works the same way:

```
Traditional Flipbook:
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│  ○  │ │  ○  │ │  ○  │ │  ○  │ │  ○  │
│     │ │  │  │ │  │  │ │  │  │ │ /│\ │
│ /│\ │ │ /│\ │ │ /│\ │ │ /│\ │ │  │  │
│ / \ │ │ / \ │ │ / \ │ │ / \ │ │ / \ │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘
Page 1   Page 2   Page 3   Page 4   Page 5
   ↓        ↓        ↓        ↓        ↓
   Flip through quickly = Animation!

Remotion:
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│React│ │React│ │React│ │React│ │React│
│frame│ │frame│ │frame│ │frame│ │frame│
│ =0  │ │ =1  │ │ =2  │ │ =3  │ │ =4  │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘
   ↓        ↓        ↓        ↓        ↓
   Screenshots combined = Video file!
```

### Why Use Code for Videos?

| Traditional Video Editing | Remotion (Code-Based) |
|--------------------------|----------------------|
| Click, drag, manual work | Automated, scriptable |
| Hard to reproduce exactly | 100% reproducible |
| Can't version control | Git-friendly |
| Manual repetition | Loops, variables, templates |
| Limited to UI capabilities | Full programming power |

---

## The Big Picture: Code → Video

### The Transformation Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           YOUR CODE                                     │
│                                                                         │
│   src/ClaudeCodeIntro.tsx                                               │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  export const ClaudeCodeIntro = () => {                         │   │
│   │    const frame = useCurrentFrame();  // 0, 1, 2, ... 209       │   │
│   │    const opacity = interpolate(frame, [0,30], [0,1]);          │   │
│   │    return <div style={{opacity}}>Hello</div>;                   │   │
│   │  }                                                              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         REMOTION ENGINE                                 │
│                                                                         │
│   For each frame (0 to 209):                                            │
│   1. Set frame number                                                   │
│   2. Render React component                                             │
│   3. Take screenshot with headless Chrome                               │
│   4. Save as image                                                      │
│                                                                         │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         ┌──────┐                  │
│   │ f=0  │ │ f=1  │ │ f=2  │ │ f=3  │  ...    │f=209 │                  │
│   │ o=0  │ │o=0.03│ │o=0.07│ │o=0.1 │         │ o=1  │                  │
│   └──────┘ └──────┘ └──────┘ └──────┘         └──────┘                  │
│      ↓        ↓        ↓        ↓                ↓                      │
│   [IMG 0] [IMG 1]  [IMG 2]  [IMG 3]  ...    [IMG 209]                   │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           FFMPEG ENCODER                                │
│                                                                         │
│   Stitch 210 images together at 30 frames per second                    │
│   Apply H.264 compression                                               │
│   Output: video.mp4 (7 seconds)                                         │
│                                                                         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │   video.mp4      │
                           │   1920x1080      │
                           │   7 seconds      │
                           │   ~1 MB          │
                           └──────────────────┘
```

### The Key Insight

**Everything in a Remotion video is a function of the frame number.**

```tsx
// The frame number is the ONLY input that changes
const frame = useCurrentFrame();  // 0, 1, 2, 3, ... 209

// ALL visual properties derive from this single number
const opacity = interpolate(frame, [0, 30], [0, 1]);
const scale = spring({ frame, fps });
const position = interpolate(frame, [0, 60], [-100, 0]);
```

This is fundamentally different from traditional animation where you might set timers, use CSS transitions, or respond to events. In Remotion, you describe what every frame looks like, and Remotion renders them all.

---

## How Remotion Works (Under the Hood)

### Phase 1: Development (Preview)

When you run `npm run dev`:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Remotion Studio                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  Development Server                     │    │
│  │                  localhost:3000                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Hot Module Replacement                     │    │
│  │        (Edit code → See changes instantly)              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           Browser Preview (Real-Time)                   │    │
│  │                                                         │    │
│  │   • Scrub through timeline                              │    │
│  │   • Jump to any frame                                   │    │
│  │   • See instant feedback                                │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

The preview runs in your browser. Remotion simply renders your React component for the currently selected frame, letting you scrub through like a video timeline.

### Phase 2: Rendering (Export)

When you run `npx remotion render`:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Render Pipeline                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: BUNDLING                                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  TypeScript → JavaScript bundle                         │    │
│  │  (Fast compilation with esbuild)                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                     │
│                           ▼                                     │
│  Step 2: PARALLEL RENDERING (6 workers default)                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Worker 1: frame 0 → 6 → 12 → 18 → ...                  │    │
│  │  Worker 2: frame 1 → 7 → 13 → 19 → ...                  │    │
│  │  Worker 3: frame 2 → 8 → 14 → 20 → ...                  │    │
│  │  Worker 4: frame 3 → 9 → 15 → 21 → ...                  │    │
│  │  Worker 5: frame 4 → 10 → 16 → 22 → ...                 │    │
│  │  Worker 6: frame 5 → 11 → 17 → 23 → ...                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                     │
│                           ▼                                     │
│  Step 3: SCREENSHOT CAPTURE                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Each worker runs headless Chrome                       │    │
│  │  Renders React → Takes screenshot → Saves JPEG          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                           │                                     │
│                           ▼                                     │
│  Step 4: VIDEO ENCODING                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  FFmpeg stitches all frames together                    │    │
│  │  Applies codec (H.264, VP8, etc.)                       │    │
│  │  Outputs final video file                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key point**: Frames can be rendered in any order and in parallel because each frame is independent - it only depends on the frame number, not on any previous frame.

---

## The Role of Claude Code Skills

### What are Skills?

Skills are knowledge files that teach Claude Code how to use specific technologies correctly. They're like "cheat sheets" that Claude references when writing code.

### How Skills Work

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Request                                    │
│                 "Create a video intro for my channel"                   │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Claude Code                                     │
│                                                                         │
│   1. Recognizes this involves Remotion                                  │
│   2. Loads relevant skills from .agents/skills/                         │
│   3. Follows best practices from skill files                            │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    Skill Files Loaded                           │   │
│   │                                                                 │   │
│   │   animations.md → "Use useCurrentFrame(), not CSS transitions"  │   │
│   │   timing.md → "Use interpolate() with clamp for smooth motion"  │   │
│   │   compositions.md → "Register in Root.tsx with Composition"     │   │
│   │   sequencing.md → "Use Sequence for timed elements"             │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   4. Generates code that follows all these patterns                     │
│                                                                         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Generated Code                                  │
│                                                                         │
│   // Correct: Uses useCurrentFrame (from animations.md)                 │
│   const frame = useCurrentFrame();                                      │
│                                                                         │
│   // Correct: Uses interpolate with clamp (from timing.md)              │
│   const opacity = interpolate(frame, [0, 30], [0, 1], {                 │
│     extrapolateRight: "clamp"                                           │
│   });                                                                   │
│                                                                         │
│   // Correct: Uses spring for natural motion (from timing.md)           │
│   const scale = spring({ frame, fps, config: { damping: 200 } });       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### The Skill File Structure

```
.agents/skills/remotion-best-practices/
├── SKILL.md                    # Main skill definition
└── rules/
    ├── animations.md           # How to animate
    ├── timing.md               # interpolate, spring, easing
    ├── compositions.md         # Setting up videos
    ├── sequencing.md           # Timing multiple elements
    ├── text-animations.md      # Text effects
    ├── audio.md                # Sound handling
    ├── images.md               # Image embedding
    ├── videos.md               # Video embedding
    ├── fonts.md                # Custom fonts
    ├── transitions.md          # Scene changes
    └── ... (30+ rule files)
```

### What Skills Prevent

Without skills, Claude might make common mistakes:

| Mistake | What Skill Teaches |
|---------|-------------------|
| Using CSS `transition` | "CSS transitions are FORBIDDEN - use interpolate()" |
| Forgetting to clamp | "Always use extrapolateRight: 'clamp'" |
| Wrong spring config | "Use damping: 200 for smooth motion without bounce" |
| Missing fps reference | "Get fps from useVideoConfig()" |
| Time-based animation | "Write animations in frames, multiply by fps" |

---

## Anatomy of a Remotion Project

### File Structure Explained

```
claude_remotion_me2/
│
├── src/                          # Source code
│   │
│   ├── index.ts                  # ENTRY POINT
│   │   │
│   │   │  ┌────────────────────────────────────────────────┐
│   │   │  │ import { registerRoot } from "remotion";       │
│   │   │  │ import { RemotionRoot } from "./Root";         │
│   │   │  │                                                │
│   │   │  │ registerRoot(RemotionRoot);                    │
│   │   │  │ // Tells Remotion where to find compositions   │
│   │   │  └────────────────────────────────────────────────┘
│   │   │
│   │
│   ├── Root.tsx                  # COMPOSITION REGISTRY
│   │   │
│   │   │  ┌────────────────────────────────────────────────┐
│   │   │  │ <Composition                                   │
│   │   │  │   id="ClaudeCodeIntro"     // Video name       │
│   │   │  │   component={ClaudeCodeIntro}  // What to show │
│   │   │  │   durationInFrames={210}   // 7 seconds        │
│   │   │  │   fps={30}                 // 30 frames/sec    │
│   │   │  │   width={1920}             // Full HD          │
│   │   │  │   height={1080}                                │
│   │   │  │ />                                             │
│   │   │  └────────────────────────────────────────────────┘
│   │   │
│   │
│   └── ClaudeCodeIntro.tsx       # THE ACTUAL VIDEO
│       │
│       │  ┌────────────────────────────────────────────────┐
│       │  │ export const ClaudeCodeIntro = () => {         │
│       │  │   const frame = useCurrentFrame();             │
│       │  │   // All animation logic here                  │
│       │  │   return (                                     │
│       │  │     <AbsoluteFill>                             │
│       │  │       {/* Visual elements */}                  │
│       │  │     </AbsoluteFill>                            │
│       │  │   );                                           │
│       │  │ }                                              │
│       │  └────────────────────────────────────────────────┘
│
├── .agents/skills/               # CLAUDE CODE SKILLS
│   └── remotion-best-practices/
│       ├── SKILL.md              # Skill manifest
│       └── rules/                # Individual guidelines
│           ├── animations.md
│           ├── timing.md
│           └── ...
│
├── out/                          # Rendered videos go here
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── remotion.config.ts            # Remotion settings
```

### The Three Essential Files

**1. index.ts** - The Bootstrap
```typescript
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);  // Remotion starts here
```

**2. Root.tsx** - The Registry
```tsx
import { Composition } from "remotion";
import { ClaudeCodeIntro } from "./ClaudeCodeIntro";

export const RemotionRoot = () => {
  return (
    <Composition
      id="ClaudeCodeIntro"      // Name for CLI commands
      component={ClaudeCodeIntro}  // What to render
      durationInFrames={210}    // Total frames
      fps={30}                  // Frames per second
      width={1920}              // Video width
      height={1080}             // Video height
    />
  );
};
```

**3. ClaudeCodeIntro.tsx** - The Content
```tsx
export const ClaudeCodeIntro = () => {
  const frame = useCurrentFrame();       // Current frame (0-209)
  const { fps } = useVideoConfig();      // Video settings

  // Derive all visuals from frame number
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Video content */}
    </AbsoluteFill>
  );
};
```

---

## The Animation System Explained

### The Core Concept: Frame → Value

Every animation in Remotion maps frame numbers to visual values:

```
Frame Number → Mapping Function → Visual Property
     0        →    interpolate   →    opacity: 0
    15        →    interpolate   →    opacity: 0.5
    30        →    interpolate   →    opacity: 1.0
```

### interpolate(): The Workhorse

The `interpolate` function is the foundation of all Remotion animations:

```tsx
interpolate(
  input,        // The frame number
  inputRange,   // What frames to animate between
  outputRange,  // What values to produce
  options       // How to handle edge cases
)
```

**Example: Fade In Over 1 Second**

```tsx
const frame = useCurrentFrame();  // 0, 1, 2, ... 29, 30, 31, ...

const opacity = interpolate(
  frame,           // Input: current frame
  [0, 30],         // From frame 0 to frame 30
  [0, 1],          // Map to opacity 0 to 1
  {
    extrapolateRight: "clamp"  // After frame 30, stay at 1
  }
);

// Result:
// Frame 0  → opacity 0.0
// Frame 15 → opacity 0.5
// Frame 30 → opacity 1.0
// Frame 45 → opacity 1.0 (clamped)
```

**Visual Timeline:**

```
Frame:    0    10    20    30    40    50    60
          │     │     │     │     │     │     │
Opacity:  0   0.33  0.67   1     1     1     1
          ├─────────────────┤
          │   Animating     │  Clamped at 1
```

### spring(): Natural Motion

Springs simulate physics for natural-feeling animations:

```tsx
const scale = spring({
  frame,         // Current frame
  fps,           // Frames per second
  config: {
    damping: 12,    // Resistance (higher = less bounce)
    stiffness: 100, // Speed (higher = faster)
    mass: 0.8,      // Weight (higher = more momentum)
  }
});

// Result: Smooth 0 → 1 transition with natural bounce
```

**Visual Comparison:**

```
Linear interpolate:        Spring animation:
│                          │
1├─────────────────────    1├───────●───●──●─●──
│                     │    │      ╱  ╲ ╱╲╱
│                   ╱      │     ╱
│                 ╱        │    ╱
│               ╱          │   ╱
│             ╱            │  ╱
│           ╱              │ ╱
│         ╱                │╱
│       ╱                  │
│     ╱                    │
│   ╱                      │
│ ╱                        │
0├─────────────────────    0├─────────────────────
 Frame →                    Frame →

Robotic, mechanical feel   Natural, bouncy feel
```

### Easing: Shaping Motion

Easing modifies *how* values change over time:

```tsx
const y = interpolate(
  frame,
  [0, 30],
  [100, 0],
  {
    easing: Easing.out(Easing.cubic),  // Start fast, end slow
    extrapolateRight: "clamp"
  }
);
```

**Easing Types:**

```
Easing.linear:           Easing.in(cubic):        Easing.out(cubic):
│                        │                        │
1├───────────────╱       1├───────────────╱       1├───────────╱────
│              ╱         │             ╱          │         ╱
│            ╱           │           ╱            │       ╱
│          ╱             │         ╱              │     ╱
│        ╱               │       ╱                │   ╱
│      ╱                 │     ╱                  │  ╱
│    ╱                   │   ╱                    │ ╱
│  ╱                     │  ╱                     │╱
│╱                       │ ╱                      │
0├───────────────────    0├───────────────────    0├───────────────────
 Frame →                  Frame →                  Frame →

Constant speed           Starts slow              Ends slow
```

---

## From React Component to Video File

### The Complete Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 1: You write a React component                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   export const MyVideo = () => {                                        │
│     const frame = useCurrentFrame();                                    │
│     const opacity = interpolate(frame, [0, 30], [0, 1]);                │
│     return <h1 style={{ opacity }}>Hello</h1>;                          │
│   };                                                                    │
│                                                                         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Remotion renders frame 0                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   frame = 0                                                             │
│   opacity = interpolate(0, [0, 30], [0, 1]) = 0                         │
│                                                                         │
│   React renders: <h1 style={{ opacity: 0 }}>Hello</h1>                  │
│                                                                         │
│   Headless Chrome takes screenshot → image_000.jpeg                     │
│                                                                         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Remotion renders frame 15                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   frame = 15                                                            │
│   opacity = interpolate(15, [0, 30], [0, 1]) = 0.5                      │
│                                                                         │
│   React renders: <h1 style={{ opacity: 0.5 }}>Hello</h1>                │
│                                                                         │
│   Headless Chrome takes screenshot → image_015.jpeg                     │
│                                                                         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Remotion renders frame 30                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   frame = 30                                                            │
│   opacity = interpolate(30, [0, 30], [0, 1]) = 1                        │
│                                                                         │
│   React renders: <h1 style={{ opacity: 1 }}>Hello</h1>                  │
│                                                                         │
│   Headless Chrome takes screenshot → image_030.jpeg                     │
│                                                                         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 5: ... repeat for ALL frames (0 to durationInFrames-1) ...         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 6: FFmpeg combines all images                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ffmpeg -i image_%03d.jpeg -c:v libx264 -r 30 output.mp4               │
│                                                                         │
│   Result: 30 images per second = smooth video                           │
│                                                                         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │                  │
                           │   output.mp4     │
                           │                  │
                           │   ▶ Hello        │
                           │     (fades in)   │
                           │                  │
                           └──────────────────┘
```

---

## Real Example: ClaudeCodeIntro Breakdown

Let's trace through how the actual `ClaudeCodeIntro.tsx` creates the video.

### The Animation Variables

```tsx
// Get the current frame (0-209) and video settings
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// ANIMATION 1: Main text scales in with spring physics
const textScale = spring({
  frame,
  fps,
  config: { damping: 12, stiffness: 100, mass: 0.8 },
  durationInFrames: 60,  // 2 seconds
});
// Frame 0: scale = 0, Frame 60+: scale ≈ 1 (with bounce)

// ANIMATION 2: Main text fades in
const textOpacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: "clamp",
});
// Frame 0: 0%, Frame 30: 100%

// ANIMATION 3: Glow pulses over time
const glowIntensity = interpolate(
  frame,
  [30, 60, 90, 120, 150],
  [0, 1, 0.6, 1, 0.8]
);
// Creates a pulsing glow effect

// ANIMATION 4: Subtitle fades in later
const subtitleOpacity = interpolate(frame, [45, 75], [0, 1]);
// Starts at frame 45, fully visible at frame 75

// ANIMATION 5: Whole video fades out at end
const fadeOut = interpolate(frame, [180, 210], [1, 0]);
// Last 1 second fades to black
```

### Timeline Visualization

```
Frame:      0        30        60        90       120       150       180       210
            │         │         │         │         │         │         │         │
            ▼         ▼         ▼         ▼         ▼         ▼         ▼         ▼

textScale   ├─────────●─────────┤ (spring: bouncy entrance)
            0         ↗         1

textOpacity ├─────────┤
            0         1

glow        ────────┤├──────┤├──────┤├──────┤├──────┤
                    0  1   0.6 1   0.8

subtitleOp  ─────────────┤├──────────────────────────────────────────────────────
                        0   1

fadeOut     ─────────────────────────────────────────────────────────────┤├──────┤
                                                                         1       0

RESULT:     ┌─────────────────────────────────────────────────────────────────────┐
            │ Text zooms in   │ Glow pulses │ Subtitle appears │ Everything fades │
            └─────────────────────────────────────────────────────────────────────┘
```

### The Render Tree

```tsx
<AbsoluteFill>                    // Full-screen container
  │
  ├── <div> Grid pattern          // Static background
  │
  ├── {particles.map()}           // 12 animated particles
  │   │                           // Each with staggered timing
  │   └── <div> circle            // Position & opacity animated
  │
  ├── <div> Glow                  // Radial gradient
  │                               // Opacity tied to glowIntensity
  │
  ├── <div> Brackets              // < and />
  │   │                           // Spread apart over time
  │   ├── <span> {"<"}
  │   └── <span> {"/>"}
  │
  ├── <div> Main content          // Scaled & faded together
  │   │
  │   ├── <h1> "Claude"           // White, with glow shadow
  │   ├── <h1> "Code"             // Orange, monospace
  │   ├── <div> Cursor            // Blinks every 15 frames
  │   └── <p> Subtitle            // Delayed fade in
  │
  ├── <div> Bottom line           // Grows from center
  │
  └── <div> Corner accents (×4)   // Staggered appearance
```

---

## How Skills Guide Claude Code

### The Learning Process

When Claude Code encounters a Remotion task, it references the installed skills:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        User's Request                                   │
│              "Create an animated intro for my channel"                  │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Claude Code's Thought Process                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. "This is a Remotion video task"                                     │
│     → Load remotion-best-practices skill                                │
│                                                                         │
│  2. "I need animations"                                                 │
│     → Read rules/animations.md                                          │
│     → Learn: "Use useCurrentFrame(), not CSS transitions"               │
│                                                                         │
│  3. "I need smooth motion"                                              │
│     → Read rules/timing.md                                              │
│     → Learn: "Use spring() with damping: 200 for no bounce"             │
│     → Learn: "Always clamp interpolation"                               │
│                                                                         │
│  4. "I need to set up the video"                                        │
│     → Read rules/compositions.md                                        │
│     → Learn: "Use <Composition> in Root.tsx"                            │
│                                                                         │
│  5. "I need timed sequences"                                            │
│     → Read rules/sequencing.md                                          │
│     → Learn: "Use <Sequence from={...}> for delays"                     │
│                                                                         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Generated Code Follows Skills                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   // ✓ Uses useCurrentFrame (from animations.md)                        │
│   const frame = useCurrentFrame();                                      │
│                                                                         │
│   // ✓ Uses spring with proper config (from timing.md)                  │
│   const scale = spring({ frame, fps, config: { damping: 200 } });       │
│                                                                         │
│   // ✓ Uses interpolate with clamp (from timing.md)                     │
│   const opacity = interpolate(frame, [0, 30], [0, 1], {                 │
│     extrapolateRight: "clamp"                                           │
│   });                                                                   │
│                                                                         │
│   // ✓ Registers properly (from compositions.md)                        │
│   <Composition id="MyVideo" ... />                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Rules from Skills

**From `animations.md`:**
> "All animations MUST be driven by the `useCurrentFrame()` hook."
> "CSS transitions or animations are FORBIDDEN - they will not render correctly."

**From `timing.md`:**
> "By default, values are not clamped... Here is how they can be clamped:"
> "The recommended configuration for natural motion without bounce is: `{ damping: 200 }`"

**From `compositions.md`:**
> "A `<Composition>` defines the component, width, height, fps and duration"
> "It normally is placed in the `src/Root.tsx` file"

**From `sequencing.md`:**
> "Use `<Sequence>` to delay when an element appears in the timeline"
> "Always premount any `<Sequence>`!"

---

## The Complete Workflow

### From Idea to Video

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. USER REQUEST                                                         │
│    "Create a 7-second intro video for Claude Code"                      │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. CLAUDE CODE PLANS                                                    │
│    - Load Remotion skills                                               │
│    - Design animations (spring, interpolate)                            │
│    - Plan timing (210 frames @ 30fps = 7 seconds)                       │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. CLAUDE CODE GENERATES FILES                                          │
│    - src/index.ts (entry point)                                         │
│    - src/Root.tsx (composition registry)                                │
│    - src/ClaudeCodeIntro.tsx (animation component)                      │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. DEVELOPMENT                                                          │
│    $ npm run dev                                                        │
│    → Remotion Studio opens at localhost:3000                            │
│    → Preview, scrub, iterate                                            │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. RENDERING                                                            │
│    $ npx remotion render ClaudeCodeIntro out/video.mp4                  │
│                                                                         │
│    For each of 210 frames:                                              │
│      → Render React component                                           │
│      → Screenshot with headless Chrome                                  │
│    Then:                                                                │
│      → FFmpeg encodes to MP4                                            │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 6. OUTPUT                                                               │
│    out/video.mp4                                                        │
│    - 1920×1080 resolution                                               │
│    - 7 seconds duration                                                 │
│    - ~1 MB file size                                                    │
│    - Ready to upload/share                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

### What Remotion Is

Remotion is a **React-based video creation framework** that transforms code into video files. Instead of timeline-based editing, you write components that describe what each frame should look like.

### How It Works

1. **You write React components** that use `useCurrentFrame()` to know the current time
2. **Remotion renders each frame** by setting the frame number and taking a screenshot
3. **FFmpeg combines frames** into a video file

### Why Skills Matter

Claude Code skills provide **domain-specific knowledge** that ensures:
- Correct API usage (`useCurrentFrame`, not CSS transitions)
- Proper animation patterns (`interpolate` with clamping)
- Best practices (spring configs, premounting sequences)
- Avoid common mistakes

### The Magic

The key insight is that **everything derives from the frame number**:

```tsx
const frame = useCurrentFrame();

// This single number drives ALL animations
const opacity = interpolate(frame, ...);
const scale = spring({ frame, ... });
const position = interpolate(frame, ...);
const color = interpolate(frame, ...);

// The component is just a pure function: frame → visuals
return <div style={{ opacity, scale, position, color }}>...</div>;
```

This makes videos:
- **Deterministic**: Same code = same video
- **Parallelizable**: Frames can render in any order
- **Seekable**: Jump to any frame instantly
- **Debuggable**: Just check what a frame number produces

---

*This document accompanies the Claude Code Intro Remotion project and explains how AI-assisted video generation works under the hood.*
