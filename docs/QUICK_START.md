# Quick Start Guide - 10 Hands-On Tutorials

This guide provides 10 step-by-step tutorials to help you understand and modify the video project. Each tutorial builds on the previous one, giving you practical skills while explaining the concepts.

---

## Before You Begin

### What You Need
- Node.js 18+ installed ([download](https://nodejs.org/))
- A text editor (VS Code recommended)
- Basic understanding of any programming language

### Setup (One-Time)

Open a terminal/command prompt and run:

```bash
# Navigate to the project
cd C:\Users\simon\Downloads\claude_remotion\claude_remotion_me2

# Install dependencies
npm install
```

### Start the Preview Server

For all tutorials, keep this running in a terminal:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

---

## Tutorial 1: Preview Your First Video

**Goal**: Learn to use Remotion Studio to preview videos.

**Time**: 2 minutes

### Steps

1. **Start the server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open the browser** to http://localhost:3000

3. **Explore the interface**:
   - **Left panel**: List of compositions (videos)
   - **Center**: Video preview
   - **Bottom**: Timeline with frame numbers
   - **Right panel**: Properties

4. **Play the video**:
   - Click the **Play** button (▶) or press `Space`
   - The video will play from start to finish

5. **Scrub through frames**:
   - Click and drag on the timeline
   - Notice the frame number changes (0 to 209)

6. **Jump to specific frame**:
   - Click on the frame number in the timeline
   - Type a number like `100` and press Enter

**What You Learned**: Remotion Studio lets you preview videos in real-time, scrub through frames, and see changes instantly.

---

## Tutorial 2: Render Your First Video File

**Goal**: Export the video as an MP4 file you can share.

**Time**: 3 minutes

### Steps

1. **Open a NEW terminal** (keep the dev server running in the first one)

2. **Navigate to the project**:
   ```bash
   cd C:\Users\simon\Downloads\claude_remotion\claude_remotion_me2
   ```

3. **Run the render command**:
   ```bash
   npx remotion render ClaudeCodeIntro out/my-first-video.mp4
   ```

4. **Wait for rendering**:
   - You'll see progress: "Rendered 1/210", "Rendered 2/210", etc.
   - Takes about 1-2 minutes depending on your computer

5. **Find your video**:
   - Open the `out` folder in File Explorer
   - Double-click `my-first-video.mp4` to play it

**What You Learned**: The `remotion render` command converts your React code into a real video file.

**Explanation for C/C++/Java Developers**: This is like compiling your code, but instead of an executable, you get a video file. Remotion renders each frame as an image, then stitches them together.

---

## Tutorial 3: Change the Video Text

**Goal**: Modify the main title text in the video.

**Time**: 5 minutes

### Steps

1. **Open the composition file**:
   - Open `src/ClaudeCodeIntro.tsx` in your editor

2. **Find the title text** (around line 120):
   ```tsx
   <h1
     style={{
       fontFamily: "'Inter', 'SF Pro Display', ...",
       fontSize: 140,
       ...
     }}
   >
     Claude
   </h1>
   ```

3. **Change "Claude" to your name**:
   ```tsx
   >
     Simon
   </h1>
   ```

4. **Save the file** (Ctrl+S or Cmd+S)

5. **Check the preview**:
   - Go back to http://localhost:3000
   - The video automatically updates (hot reload)
   - You should see "Simon Code" instead of "Claude Code"

6. **Change "Code" too** (around line 133):
   ```tsx
   >
     Studio
   </h1>
   ```

7. **Save and preview** - You now have "Simon Studio"!

**What You Learned**: React hot reload means changes appear instantly in the preview. The text inside JSX tags (like `<h1>`) becomes the visible content.

---

## Tutorial 4: Change the Colors

**Goal**: Customize the color scheme of the video.

**Time**: 5 minutes

### Steps

1. **Open** `src/ClaudeCodeIntro.tsx`

2. **Find the background gradient** (around line 60):
   ```tsx
   background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f23 50%, #16213e 100%)",
   ```

3. **Change to a blue theme**:
   ```tsx
   background: "linear-gradient(135deg, #1a1a3e 0%, #0a1628 50%, #162850 100%)",
   ```

4. **Find the orange accent color** - Search for `#da7756` (Claude Orange)

5. **Replace with blue** (use Find & Replace):
   - Find: `#da7756`
   - Replace with: `#5677da`
   - Replace All

6. **Also replace the secondary orange** `#f4a261`:
   - Find: `#f4a261`
   - Replace with: `#61a2f4`

7. **Save and preview**

**Color Reference**:
| Original | Blue Theme | What It Affects |
|----------|------------|-----------------|
| `#da7756` | `#5677da` | Primary accents, glow, "Code" text |
| `#f4a261` | `#61a2f4` | Secondary accents, brackets |
| `#1a1a2e` | `#1a1a3e` | Background gradient start |

**What You Learned**: Colors in CSS use hexadecimal codes (#RRGGBB). Changing these values instantly updates the visual appearance.

---

## Tutorial 5: Adjust the Animation Speed

**Goal**: Make the title animation faster or slower.

**Time**: 5 minutes

### Steps

1. **Open** `src/ClaudeCodeIntro.tsx`

2. **Find the spring animation** (around line 15):
   ```tsx
   const textScale = spring({
     frame,
     fps,
     config: {
       damping: 12,
       stiffness: 100,
       mass: 0.8,
     },
     durationInFrames: 60,
   });
   ```

3. **Understand the parameters**:
   - `damping`: How quickly bouncing stops (higher = less bounce)
   - `stiffness`: How snappy the animation is (higher = faster)
   - `mass`: Weight of the object (higher = more momentum)
   - `durationInFrames`: Total animation length

4. **Make it bouncier** - Lower damping:
   ```tsx
   damping: 6,
   ```
   Save and preview - notice more bounce!

5. **Make it snappier** - Higher stiffness:
   ```tsx
   stiffness: 200,
   ```
   Save and preview - notice faster spring.

6. **Reset to original** or experiment with your own values:
   ```tsx
   config: {
     damping: 12,
     stiffness: 100,
     mass: 0.8,
   },
   ```

**What You Learned**: Spring animations simulate real physics. Adjusting damping, stiffness, and mass creates different feels - from snappy to bouncy.

---

## Tutorial 6: Change the Video Duration

**Goal**: Make the video longer or shorter.

**Time**: 5 minutes

### Steps

1. **Open** `src/Root.tsx`

2. **Find the composition definition**:
   ```tsx
   <Composition
     id="ClaudeCodeIntro"
     component={ClaudeCodeIntro}
     durationInFrames={210}
     fps={30}
     width={1920}
     height={1080}
   />
   ```

3. **Calculate frames**:
   - Current: 210 frames ÷ 30 fps = 7 seconds
   - For 10 seconds: 10 × 30 = 300 frames
   - For 5 seconds: 5 × 30 = 150 frames

4. **Change to 10 seconds**:
   ```tsx
   durationInFrames={300}
   ```

5. **Save and preview**:
   - The timeline now shows frames 0-299
   - The video is longer, but animations still end at the same time

6. **Adjust fade-out timing** in `src/ClaudeCodeIntro.tsx`:
   Find (around line 55):
   ```tsx
   const fadeOut = interpolate(frame, [180, 210], [1, 0], {
   ```
   Change to:
   ```tsx
   const fadeOut = interpolate(frame, [270, 300], [1, 0], {
   ```

**Frame/Time Reference** (at 30 fps):
| Seconds | Frames |
|---------|--------|
| 1 | 30 |
| 5 | 150 |
| 7 | 210 |
| 10 | 300 |
| 30 | 900 |
| 60 | 1800 |

**What You Learned**: Video duration is controlled by `durationInFrames` in the Composition. At 30fps, multiply seconds by 30 to get frames.

---

## Tutorial 7: Add a New Text Element

**Goal**: Add a subtitle or additional text to the video.

**Time**: 10 minutes

### Steps

1. **Open** `src/ClaudeCodeIntro.tsx`

2. **Find the subtitle section** (around line 155):
   ```tsx
   {/* Subtitle */}
   <p
     style={{
       fontFamily: "'Inter', ...",
       fontSize: 36,
       ...
     }}
   >
     AI-Powered Development
   </p>
   ```

3. **Add a new text element AFTER the subtitle** (inside the same parent div):
   ```tsx
   </p>

   {/* New tagline */}
   <p
     style={{
       fontFamily: "'JetBrains Mono', monospace",
       fontSize: 24,
       fontWeight: 400,
       color: "rgba(218, 119, 86, 0.8)",
       margin: 0,
       marginTop: 20,
       letterSpacing: "0.05em",
       opacity: interpolate(frame, [75, 105], [0, 1], {
         extrapolateRight: "clamp",
       }),
     }}
   >
     {"<"} Build the Future {"/>"}
   </p>
   ```

4. **Save and preview**
   - The new tagline fades in after the subtitle
   - It uses the orange accent color

5. **Experiment with timing**:
   - Change `[75, 105]` to `[90, 120]` for later appearance
   - The first number is start frame, second is end frame

**What You Learned**: You can add new JSX elements with their own styles and animations. The `interpolate` function creates the fade-in effect.

---

## Tutorial 8: Create a Simple New Composition

**Goal**: Create a completely new video from scratch.

**Time**: 15 minutes

### Steps

1. **Create a new file** `src/SimpleIntro.tsx`:
   ```tsx
   import React from "react";
   import {
     AbsoluteFill,
     interpolate,
     useCurrentFrame,
   } from "remotion";

   export const SimpleIntro: React.FC = () => {
     const frame = useCurrentFrame();

     // Fade in over 30 frames (1 second)
     const opacity = interpolate(frame, [0, 30], [0, 1], {
       extrapolateRight: "clamp",
     });

     // Scale from 0.5 to 1 over 30 frames
     const scale = interpolate(frame, [0, 30], [0.5, 1], {
       extrapolateRight: "clamp",
     });

     return (
       <AbsoluteFill
         style={{
           backgroundColor: "#000000",
           justifyContent: "center",
           alignItems: "center",
         }}
       >
         <h1
           style={{
             color: "#ffffff",
             fontSize: 100,
             fontFamily: "Arial, sans-serif",
             opacity: opacity,
             transform: `scale(${scale})`,
           }}
         >
           Hello World!
         </h1>
       </AbsoluteFill>
     );
   };
   ```

2. **Register in Root.tsx**:
   ```tsx
   import { Composition } from "remotion";
   import { ClaudeCodeIntro } from "./ClaudeCodeIntro";
   import { SimpleIntro } from "./SimpleIntro";  // Add this

   export const RemotionRoot: React.FC = () => {
     return (
       <>
         <Composition
           id="ClaudeCodeIntro"
           component={ClaudeCodeIntro}
           durationInFrames={210}
           fps={30}
           width={1920}
           height={1080}
         />
         {/* Add this new composition */}
         <Composition
           id="SimpleIntro"
           component={SimpleIntro}
           durationInFrames={90}
           fps={30}
           width={1920}
           height={1080}
         />
       </>
     );
   };
   ```

3. **Save both files**

4. **Preview**:
   - In Remotion Studio, use the dropdown to select "SimpleIntro"
   - You should see "Hello World!" fading in and scaling up

5. **Render it**:
   ```bash
   npx remotion render SimpleIntro out/simple-intro.mp4
   ```

**What You Learned**: Each video is a separate composition. You create a React component, register it in Root.tsx, and can render it independently.

---

## Tutorial 9: Add a Moving Element

**Goal**: Create an element that moves across the screen.

**Time**: 10 minutes

### Steps

1. **Edit** `src/SimpleIntro.tsx` to add a moving circle:
   ```tsx
   import React from "react";
   import {
     AbsoluteFill,
     interpolate,
     useCurrentFrame,
     useVideoConfig,
   } from "remotion";

   export const SimpleIntro: React.FC = () => {
     const frame = useCurrentFrame();
     const { width } = useVideoConfig();

     // Text animation (same as before)
     const opacity = interpolate(frame, [0, 30], [0, 1], {
       extrapolateRight: "clamp",
     });
     const scale = interpolate(frame, [0, 30], [0.5, 1], {
       extrapolateRight: "clamp",
     });

     // Circle moves from left to right
     const circleX = interpolate(frame, [0, 90], [-100, width + 100], {
       extrapolateRight: "clamp",
     });

     return (
       <AbsoluteFill
         style={{
           backgroundColor: "#000000",
           justifyContent: "center",
           alignItems: "center",
         }}
       >
         {/* Moving circle */}
         <div
           style={{
             position: "absolute",
             top: "50%",
             left: circleX,
             width: 50,
             height: 50,
             borderRadius: "50%",
             backgroundColor: "#ff6b6b",
             transform: "translateY(-50%)",
           }}
         />

         {/* Text */}
         <h1
           style={{
             color: "#ffffff",
             fontSize: 100,
             fontFamily: "Arial, sans-serif",
             opacity: opacity,
             transform: `scale(${scale})`,
             zIndex: 1,
           }}
         >
           Hello World!
         </h1>
       </AbsoluteFill>
     );
   };
   ```

2. **Save and preview**
   - The red circle moves across the screen
   - The text fades in on top

3. **Make it more interesting** - Add easing:
   ```tsx
   import { Easing } from "remotion";  // Add to imports

   const circleX = interpolate(frame, [0, 90], [-100, width + 100], {
     extrapolateRight: "clamp",
     easing: Easing.inOut(Easing.cubic),
   });
   ```

4. **Preview** - The movement is now smooth (slow-fast-slow)

**What You Learned**: Animate any CSS property by making its value depend on the frame number. Easing functions make motion feel natural.

---

## Tutorial 10: Export in Different Formats

**Goal**: Learn to render videos in different formats and qualities.

**Time**: 5 minutes

### Steps

1. **Render as MP4 (default)**:
   ```bash
   npx remotion render ClaudeCodeIntro out/video.mp4
   ```

2. **Render as WebM** (smaller file, web-friendly):
   ```bash
   npx remotion render ClaudeCodeIntro out/video.webm --codec vp8
   ```

3. **Render as GIF** (for social media):
   ```bash
   npx remotion render ClaudeCodeIntro out/video.gif --codec gif
   ```

4. **Render high quality** (larger file, better for editing):
   ```bash
   npx remotion render ClaudeCodeIntro out/video-hq.mp4 --crf 15
   ```
   (Lower CRF = higher quality. Default is 18. Range: 0-51)

5. **Render just a portion** (frames 30 to 90):
   ```bash
   npx remotion render ClaudeCodeIntro out/clip.mp4 --frames=30-90
   ```

6. **Render at different resolution** (720p):
   ```bash
   npx remotion render ClaudeCodeIntro out/video-720p.mp4 --scale=0.67
   ```

**Format Comparison**:
| Format | Best For | Typical Size |
|--------|----------|--------------|
| MP4 (H.264) | General use, YouTube | Medium |
| WebM (VP8) | Web embedding | Small |
| GIF | Social media, previews | Large |
| ProRes | Video editing | Very large |

**What You Learned**: Remotion can export to multiple formats. Use `--codec`, `--crf`, `--frames`, and `--scale` to customize output.

---

## Next Steps

Congratulations! You've completed all 10 tutorials. You now know how to:

1. ✅ Preview videos in Remotion Studio
2. ✅ Render video files
3. ✅ Change text content
4. ✅ Customize colors
5. ✅ Adjust animation physics
6. ✅ Change video duration
7. ✅ Add new elements
8. ✅ Create new compositions
9. ✅ Animate movement
10. ✅ Export in different formats

### Recommended Next Reading

1. [User Guide](USER_GUIDE.md) - Complete reference
2. [Developer Guide](DEVELOPER_GUIDE.md) - Deep technical understanding
3. [Remotion Documentation](https://www.remotion.dev/docs) - Official docs

### Practice Ideas

- Change the intro to use your own channel name
- Create a 5-second outro with "Subscribe" text
- Make a countdown timer (3, 2, 1, GO!)
- Animate a logo bouncing into frame
