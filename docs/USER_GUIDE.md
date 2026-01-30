# User Guide

A complete guide to using the Claude Code Intro video project. This guide assumes no prior experience with video programming or web development.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Understanding the Project](#understanding-the-project)
4. [Using Remotion Studio](#using-remotion-studio)
5. [Rendering Videos](#rendering-videos)
6. [Customizing the Video](#customizing-the-video)
7. [Common Tasks](#common-tasks)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Glossary](#glossary)

---

## Introduction

### What is This Project?

This project creates videos using code instead of traditional video editing software like Adobe Premiere or Final Cut Pro. The main benefits are:

- **Reproducible**: Run the same code, get the same video
- **Programmable**: Use loops, conditions, and variables in your animations
- **Version controlled**: Track changes with Git
- **Customizable**: Change any aspect with code

### What is Remotion?

Remotion is a framework that lets you create videos using React (a popular JavaScript library). Instead of dragging clips on a timeline, you write components that describe what should appear on screen at any given moment.

### Who is This For?

- Content creators who want programmatic video intros
- Developers learning video programming
- Teams needing consistent, branded video assets
- Anyone curious about code-based video creation

---

## Installation

### Prerequisites

Before starting, you need:

1. **Node.js version 18 or higher**
   - Check if installed: Open terminal, run `node --version`
   - If not installed or version is lower: Download from [nodejs.org](https://nodejs.org/)
   - Choose the "LTS" (Long Term Support) version

2. **A code editor** (optional but recommended)
   - [Visual Studio Code](https://code.visualstudio.com/) - Free, excellent for this project
   - Any text editor works (Notepad++, Sublime Text, etc.)

### Step-by-Step Installation

**Step 1: Open a Terminal**

- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type "Terminal", press Enter
- **Linux**: Press `Ctrl + Alt + T`

**Step 2: Navigate to the Project Folder**

```bash
cd C:\Users\simon\Downloads\claude_remotion\claude_remotion_me2
```

Replace the path with wherever you saved the project.

**Step 3: Install Dependencies**

```bash
npm install
```

This downloads all required libraries. Wait for it to complete (may take 1-2 minutes).

**Step 4: Verify Installation**

```bash
npm run dev
```

If successful, you'll see:
```
Server ready - Local: http://localhost:3000
```

Open http://localhost:3000 in your browser. You should see Remotion Studio.

**Step 5: Stop the Server**

Press `Ctrl + C` in the terminal to stop the server when done.

---

## Understanding the Project

### File Structure Explained

```
claude_remotion_me2/
│
├── src/                      # Source code folder
│   ├── index.ts              # Entry point (rarely need to edit)
│   ├── Root.tsx              # Registers all video compositions
│   └── ClaudeCodeIntro.tsx   # The actual video animation code
│
├── out/                      # Output folder for rendered videos
│
├── docs/                     # Documentation (you're reading this)
│
├── node_modules/             # Dependencies (don't edit)
│
├── package.json              # Project configuration
├── tsconfig.json             # TypeScript settings
├── remotion.config.ts        # Remotion settings
└── README.md                 # Project overview
```

### Key Files You'll Edit

| File | Purpose | When to Edit |
|------|---------|--------------|
| `src/ClaudeCodeIntro.tsx` | Main video animation | Changing visuals, animations, text |
| `src/Root.tsx` | Video registration | Adding new videos, changing duration/size |

### Understanding a Composition

A "composition" in Remotion is like a video project. It has:

- **ID**: A unique name (e.g., "ClaudeCodeIntro")
- **Component**: The React component that renders the video
- **Duration**: Length in frames
- **FPS**: Frames per second (how smooth the video is)
- **Width/Height**: Resolution in pixels

Example from `Root.tsx`:
```tsx
<Composition
  id="ClaudeCodeIntro"      // Name of the video
  component={ClaudeCodeIntro} // What to render
  durationInFrames={210}    // 210 frames
  fps={30}                  // 30 frames per second
  width={1920}              // 1920 pixels wide
  height={1080}             // 1080 pixels tall
/>
```

**Math**: 210 frames ÷ 30 fps = 7 seconds

---

## Using Remotion Studio

### Starting the Studio

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Interface Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Composition Selector ▼    │         Controls              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│                     VIDEO PREVIEW                           │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ◀◀  ◀  ▶  ▶▶  │  Frame: 000 / 209  │  Time: 0:00 / 0:07  │
├─────────────────────────────────────────────────────────────┤
│  ════════════════════●══════════════════════════════════   │
│  0    30    60    90    120    150    180    209            │
└─────────────────────────────────────────────────────────────┘
```

### Controls Explained

| Control | Function |
|---------|----------|
| Composition Selector | Choose which video to preview |
| ◀◀ | Go to beginning (frame 0) |
| ◀ | Go back one frame |
| ▶ (Play/Pause) | Play or pause the video |
| ▶▶ | Go to end |
| Timeline slider | Drag to scrub through video |
| Frame counter | Current frame / total frames |

### Previewing Your Video

1. **Play**: Click ▶ or press `Space`
2. **Pause**: Click ▶ again or press `Space`
3. **Scrub**: Click and drag on the timeline
4. **Jump to frame**: Click the frame number, type a new number, press Enter

### Hot Reload

When you edit source files and save:
- The preview updates automatically
- No need to restart the server
- Changes appear within 1-2 seconds

---

## Rendering Videos

### Basic Render

To create a video file:

```bash
npx remotion render ClaudeCodeIntro out/my-video.mp4
```

This creates `out/my-video.mp4`.

### Render Options

**Different filename**:
```bash
npx remotion render ClaudeCodeIntro out/intro-final.mp4
```

**Different format**:
```bash
# WebM (smaller file)
npx remotion render ClaudeCodeIntro out/video.webm --codec vp8

# GIF (for social media)
npx remotion render ClaudeCodeIntro out/video.gif --codec gif

# High-quality ProRes (for editing)
npx remotion render ClaudeCodeIntro out/video.mov --codec prores
```

**Different quality** (CRF: 0-51, lower = better):
```bash
# High quality
npx remotion render ClaudeCodeIntro out/video-hq.mp4 --crf 15

# Lower quality (smaller file)
npx remotion render ClaudeCodeIntro out/video-small.mp4 --crf 28
```

**Different resolution**:
```bash
# 720p (67% of 1080p)
npx remotion render ClaudeCodeIntro out/video-720p.mp4 --scale=0.67

# 480p (44% of 1080p)
npx remotion render ClaudeCodeIntro out/video-480p.mp4 --scale=0.44
```

**Render specific frames**:
```bash
# Frames 30 to 90 only
npx remotion render ClaudeCodeIntro out/clip.mp4 --frames=30-90
```

### Understanding Render Output

During render, you'll see:
```
Composition          ClaudeCodeIntro
Codec                h264
Output               out/my-video.mp4
Concurrency          6x
Rendered 105/210     (progress indicator)
```

The process:
1. **Bundling**: Compiles your TypeScript code
2. **Rendering**: Creates each frame as an image
3. **Encoding**: Combines frames into video
4. **Complete**: Shows file location and size

---

## Customizing the Video

### Changing Text

Open `src/ClaudeCodeIntro.tsx` and find the text elements:

```tsx
// Main title (around line 120)
>
  Claude
</h1>

// Second part of title (around line 133)
>
  Code
</h1>

// Subtitle (around line 155)
>
  AI-Powered Development
</p>
```

Change the text between the `>` and `<` tags, then save.

### Changing Colors

Colors use hexadecimal format: `#RRGGBB`

| Color | Hex Code | Usage |
|-------|----------|-------|
| Background Dark | `#1a1a2e` | Gradient start |
| Background Darker | `#0f0f23` | Gradient middle |
| Claude Orange | `#da7756` | Primary accent |
| Warm Orange | `#f4a261` | Secondary accent |
| White | `#ffffff` | Main text |

To change a color, use Find & Replace (Ctrl+H) in your editor:
1. Find: `#da7756`
2. Replace: `#5677da` (blue)
3. Replace All

### Changing Duration

In `src/Root.tsx`:

```tsx
durationInFrames={210}  // Change this number
```

**Duration calculator**:
| Seconds | Frames (at 30fps) |
|---------|-------------------|
| 3 | 90 |
| 5 | 150 |
| 7 | 210 |
| 10 | 300 |
| 15 | 450 |
| 30 | 900 |

### Changing Animation Timing

Animations in `ClaudeCodeIntro.tsx` use `interpolate()`:

```tsx
const textOpacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: "clamp",
});
```

This means:
- `frame`: Current frame number
- `[0, 30]`: From frame 0 to frame 30
- `[0, 1]`: Opacity goes from 0 (invisible) to 1 (visible)
- `extrapolateRight: "clamp"`: After frame 30, stay at 1

To make it slower:
```tsx
const textOpacity = interpolate(frame, [0, 60], [0, 1], {
```
(Now takes 60 frames = 2 seconds instead of 1 second)

### Changing Spring Physics

Spring animations simulate real physics:

```tsx
const textScale = spring({
  frame,
  fps,
  config: {
    damping: 12,     // How quickly bouncing stops
    stiffness: 100,  // How snappy/fast
    mass: 0.8,       // Weight of the object
  },
  durationInFrames: 60,
});
```

| Parameter | Lower Value | Higher Value |
|-----------|-------------|--------------|
| damping | More bouncy | Less bouncy |
| stiffness | Slower, softer | Faster, snappier |
| mass | Less momentum | More momentum |

---

## Common Tasks

### Task: Change the Channel Name

1. Open `src/ClaudeCodeIntro.tsx`
2. Find "Claude" (around line 121), change to your name
3. Find "Code" (around line 134), change to your show name
4. Save and preview

### Task: Change the Subtitle

1. Open `src/ClaudeCodeIntro.tsx`
2. Find "AI-Powered Development" (around line 168)
3. Change to your tagline
4. Save and preview

### Task: Make Video Shorter (5 seconds)

1. Open `src/Root.tsx`
2. Change `durationInFrames={210}` to `durationInFrames={150}`
3. Open `src/ClaudeCodeIntro.tsx`
4. Find `[180, 210]` (fade out timing)
5. Change to `[120, 150]`
6. Save both files

### Task: Remove the Blinking Cursor

1. Open `src/ClaudeCodeIntro.tsx`
2. Find the cursor block (around line 143-153)
3. Delete or comment out:
   ```tsx
   {/*
   <div
     style={{
       width: 8,
       height: 100,
       ...
     }}
   />
   */}
   ```
4. Save

### Task: Export for YouTube

```bash
# 1080p, good quality for YouTube
npx remotion render ClaudeCodeIntro out/youtube-intro.mp4 --codec h264 --crf 18
```

### Task: Export for Twitter/X

```bash
# Shorter, smaller file
npx remotion render ClaudeCodeIntro out/twitter-intro.mp4 --crf 23 --scale=0.67
```

---

## Keyboard Shortcuts

### Remotion Studio

| Shortcut | Action |
|----------|--------|
| `Space` | Play / Pause |
| `←` | Previous frame |
| `→` | Next frame |
| `Home` | Go to start |
| `End` | Go to end |
| `J` | Play backwards |
| `K` | Pause |
| `L` | Play forwards |
| `1-9` | Set playback speed |

### VS Code Editor

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save file |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+F` | Find |
| `Ctrl+H` | Find and Replace |
| `Ctrl+/` | Comment line |

---

## Glossary

### Technical Terms

| Term | Definition |
|------|------------|
| **Composition** | A single video project with defined duration, size, and content |
| **Frame** | A single still image in a video; 30 frames = 1 second at 30fps |
| **FPS** | Frames Per Second; how many images per second (30 is standard) |
| **Interpolate** | Calculate values between two points (e.g., opacity from 0 to 1) |
| **Spring** | Physics-based animation that simulates real-world bounce |
| **Render** | Convert code into a playable video file |
| **Hot Reload** | Automatic update of preview when code changes |
| **JSX** | JavaScript syntax extension that looks like HTML |
| **Component** | A reusable piece of UI (like a function that returns visuals) |
| **Props** | Properties passed to components (like function parameters) |
| **Hook** | Functions like `useCurrentFrame()` that provide data |

### File Extensions

| Extension | Type | Purpose |
|-----------|------|---------|
| `.tsx` | TypeScript + JSX | React components with types |
| `.ts` | TypeScript | Plain TypeScript code |
| `.json` | JSON | Configuration files |
| `.mp4` | Video | Standard video format |
| `.webm` | Video | Web-optimized video |
| `.gif` | Image | Animated image format |

### Color Codes

| Format | Example | Description |
|--------|---------|-------------|
| Hex | `#ff6b6b` | #RRGGBB (red, green, blue) |
| RGB | `rgb(255, 107, 107)` | Same as hex but decimal |
| RGBA | `rgba(255, 107, 107, 0.5)` | RGB with alpha (transparency) |

---

## Getting Help

1. **Check this guide** for common tasks and explanations
2. **Review the [Quick Start](QUICK_START.md)** for step-by-step tutorials
3. **Read [Troubleshooting](TROUBLESHOOTING.md)** for error solutions
4. **Visit [Remotion Docs](https://www.remotion.dev/docs)** for advanced topics

---

## Summary

You now know how to:

- ✅ Install and run the project
- ✅ Use Remotion Studio to preview videos
- ✅ Render videos in different formats
- ✅ Customize text, colors, and timing
- ✅ Understand the project structure
- ✅ Use keyboard shortcuts efficiently

Next: Try the hands-on [Quick Start Guide](QUICK_START.md) for practical exercises.
