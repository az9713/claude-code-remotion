# CLAUDE.md - Instructions for Claude Code

## Project Overview

This is a **Remotion** video generation project that creates programmatic videos using React and TypeScript. The main output is an animated intro video for the "Claude Code" tech channel.

## Tech Stack

- **Remotion 4.x** - React-based video creation framework
- **React 19** - UI component library
- **TypeScript 5** - Type-safe JavaScript
- **Node.js 18+** - JavaScript runtime

## Project Structure

```
claude_remotion_me2/
├── src/
│   ├── index.ts              # Entry point - registers root component
│   ├── Root.tsx              # Composition registry - defines all videos
│   └── ClaudeCodeIntro.tsx   # Main intro animation component
├── out/                      # Rendered video output directory
├── docs/                     # Documentation
├── .agents/skills/           # Remotion skills for Claude Code
├── remotion.config.ts        # Remotion configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## Key Commands

```bash
# Start Remotion Studio (development/preview)
npm run dev

# Render video to file
npx remotion render ClaudeCodeIntro out/claude-code-intro.mp4

# Render with custom settings
npx remotion render ClaudeCodeIntro out/video.mp4 --codec h264 --crf 18
```

## Creating New Compositions

1. Create a new component in `src/` (e.g., `src/MyVideo.tsx`)
2. Register it in `src/Root.tsx` using `<Composition>`
3. Preview in Remotion Studio with `npm run dev`

## Animation Patterns Used

- `useCurrentFrame()` - Get current frame number
- `useVideoConfig()` - Get fps, width, height, duration
- `interpolate()` - Map frame ranges to value ranges
- `spring()` - Physics-based spring animations
- `Easing` - Easing functions for smooth transitions

## Video Specifications

- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 210 frames (7 seconds)
- **Codec**: H.264 (MP4)

## Color Palette

- Background Dark: `#1a1a2e`, `#0f0f23`
- Claude Orange (Primary): `#da7756`
- Warm Orange (Accent): `#f4a261`
- Text: `#ffffff`

## Common Tasks

### Add a new video composition
```tsx
// In src/Root.tsx, add inside RemotionRoot:
<Composition
  id="MyNewVideo"
  component={MyNewVideo}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
/>
```

### Change video duration
Edit `durationInFrames` in `src/Root.tsx`. At 30fps:
- 5 seconds = 150 frames
- 10 seconds = 300 frames

### Export different format
```bash
# WebM
npx remotion render ClaudeCodeIntro out/video.webm --codec vp8

# GIF
npx remotion render ClaudeCodeIntro out/video.gif --codec gif

# ProRes (high quality)
npx remotion render ClaudeCodeIntro out/video.mov --codec prores
```

## Testing Changes

1. Run `npm run dev` to start Remotion Studio
2. Open http://localhost:3000 in browser
3. Use timeline to scrub through video
4. Make changes to source files - hot reload updates preview

## Dependencies

All dependencies are pinned in package.json. Do not upgrade Remotion major versions without testing.

## Notes for Claude

- When modifying animations, preserve existing animation patterns
- Test all frame ranges to ensure no visual glitches
- Keep interpolate() extrapolation set to "clamp" to prevent overshoot
- Spring configs: higher damping = less bounce, higher stiffness = faster
