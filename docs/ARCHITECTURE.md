# Architecture Guide

A detailed explanation of the system architecture, design patterns, and technical decisions in this Remotion video project.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Build System](#build-system)
3. [Runtime Architecture](#runtime-architecture)
4. [Render Pipeline](#render-pipeline)
5. [Component Architecture](#component-architecture)
6. [Animation Architecture](#animation-architecture)
7. [File Structure Rationale](#file-structure-rationale)
8. [Design Decisions](#design-decisions)
9. [Scalability Considerations](#scalability-considerations)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Development Time                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │  TypeScript  │    │    React     │    │   Remotion   │              │
│  │    Source    │ ─▶ │  Components  │ ─▶ │    Studio    │              │
│  │    (.tsx)    │    │              │    │  (Preview)   │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            Render Time                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │   Remotion   │    │   Headless   │    │    FFmpeg    │              │
│  │    Bundle    │ ─▶ │   Chrome     │ ─▶ │   Encoder    │              │
│  │              │    │  (Capture)   │    │              │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│                                                 │                       │
│                                                 ▼                       │
│                                          ┌──────────────┐              │
│                                          │  Video File  │              │
│                                          │   (.mp4)     │              │
│                                          └──────────────┘              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Interactions

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         src/index.ts                                    │
│                    ┌──────────────────┐                                 │
│                    │  registerRoot()  │                                 │
│                    └────────┬─────────┘                                 │
│                             │                                           │
│                             ▼                                           │
│                   ┌─────────────────────┐                               │
│                   │     RemotionRoot    │                               │
│                   │    (src/Root.tsx)   │                               │
│                   └──────────┬──────────┘                               │
│                              │                                          │
│                   ┌──────────┴──────────┐                               │
│                   │                     │                               │
│                   ▼                     ▼                               │
│         ┌─────────────────┐   ┌─────────────────┐                       │
│         │   Composition   │   │   Composition   │                       │
│         │ "ClaudeCodeIntro" │ │   "OtherVideo"  │                       │
│         └────────┬────────┘   └─────────────────┘                       │
│                  │                                                      │
│                  ▼                                                      │
│         ┌─────────────────────┐                                         │
│         │  ClaudeCodeIntro    │                                         │
│         │  (Component)        │                                         │
│         │  ┌───────────────┐  │                                         │
│         │  │ useFrame()    │  │                                         │
│         │  │ interpolate() │  │                                         │
│         │  │ spring()      │  │                                         │
│         │  └───────────────┘  │                                         │
│         └─────────────────────┘                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Build System

### npm Scripts

```json
{
  "scripts": {
    "dev": "remotion studio",
    "build": "remotion render"
  }
}
```

### Dependency Management

**Production Dependencies** (required at runtime):
- `remotion` - Core Remotion functionality
- `@remotion/cli` - Command-line interface
- `@remotion/player` - Video player component
- `react` & `react-dom` - React library

**Development Dependencies**:
- `typescript` - TypeScript compiler
- `@types/react` - React type definitions
- `@types/react-dom` - ReactDOM type definitions

### TypeScript Compilation

```
tsconfig.json
     │
     ▼
┌──────────────────────────────────────────────────────────────┐
│  TypeScript Configuration                                    │
│                                                              │
│  - target: ES2020 (modern JavaScript)                        │
│  - module: ESNext (ES modules)                               │
│  - jsx: react-jsx (React 17+ JSX transform)                  │
│  - strict: true (strict type checking)                       │
│  - moduleResolution: bundler                                 │
│  - noEmit: true (esbuild handles output)                     │
└──────────────────────────────────────────────────────────────┘
```

### Bundle Process

When you run `npm run dev` or render:

1. **TypeScript Check**: Validates types
2. **esbuild Bundle**: Fast JavaScript bundler
3. **React Compilation**: JSX → JavaScript
4. **Output**: Single JavaScript bundle

---

## Runtime Architecture

### Preview Mode (Remotion Studio)

```
┌─────────────────────────────────────────────────────────────┐
│                    Remotion Studio                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  Dev Server                         │   │
│   │              localhost:3000                         │   │
│   └───────────────────────┬─────────────────────────────┘   │
│                           │                                 │
│   ┌───────────────────────┼─────────────────────────────┐   │
│   │                       ▼                             │   │
│   │  ┌─────────────────────────────────────────────┐    │   │
│   │  │              Hot Module Reload              │    │   │
│   │  │   (Watches files, updates on change)        │    │   │
│   │  └─────────────────────────────────────────────┘    │   │
│   │                                                     │   │
│   │  ┌─────────────────────────────────────────────┐    │   │
│   │  │           Browser Rendering                 │    │   │
│   │  │   - Renders current frame                   │    │   │
│   │  │   - Updates on frame change                 │    │   │
│   │  │   - Interactive timeline                    │    │   │
│   │  └─────────────────────────────────────────────┘    │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Render Mode

```
┌─────────────────────────────────────────────────────────────┐
│                    Render Pipeline                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐   ┌──────────────┐   ┌─────────────────┐   │
│  │  Bundle     │ → │  Headless    │ → │  Frame Capture  │   │
│  │  Code       │   │  Chrome      │   │  (Screenshots)  │   │
│  └─────────────┘   └──────────────┘   └─────────────────┘   │
│                                              │              │
│                                              ▼              │
│                                       ┌─────────────────┐   │
│                                       │  FFmpeg Encode  │   │
│                                       │  (Stitch to     │   │
│                                       │   video file)   │   │
│                                       └─────────────────┘   │
│                                              │              │
│                                              ▼              │
│                                       ┌─────────────────┐   │
│                                       │  Output File    │   │
│                                       │  (video.mp4)    │   │
│                                       └─────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Render Pipeline

### Frame-by-Frame Rendering

```
Frame 0          Frame 1          Frame 2          ...    Frame N
   │                │                │                       │
   ▼                ▼                ▼                       ▼
┌──────┐        ┌──────┐        ┌──────┐                ┌──────┐
│Render│        │Render│        │Render│                │Render│
│ React│        │ React│        │ React│                │ React│
│ Tree │        │ Tree │        │ Tree │                │ Tree │
└──┬───┘        └──┬───┘        └──┬───┘                └──┬───┘
   │               │               │                       │
   ▼               ▼               ▼                       ▼
┌──────┐        ┌──────┐        ┌──────┐                ┌──────┐
│Chrome│        │Chrome│        │Chrome│                │Chrome│
│Screen│        │Screen│        │Screen│                │Screen│
│ shot │        │ shot │        │ shot │                │ shot │
└──┬───┘        └──┬───┘        └──┬───┘                └──┬───┘
   │               │               │                       │
   ▼               ▼               ▼                       ▼
┌──────┐        ┌──────┐        ┌──────┐                ┌──────┐
│ JPEG │        │ JPEG │        │ JPEG │                │ JPEG │
│Image │        │Image │        │Image │                │Image │
└──────┘        └──────┘        └──────┘                └──────┘
   │               │               │                       │
   └───────────────┴───────────────┴───────────────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │   FFmpeg     │
                       │   Encode     │
                       └──────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │  video.mp4   │
                       └──────────────┘
```

### Concurrency Model

Remotion renders multiple frames in parallel:

```
┌─────────────────────────────────────────────────────────────┐
│              Parallel Rendering (6x concurrency)            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Worker 1: Frame 0  →  Frame 6  →  Frame 12 → ...          │
│  Worker 2: Frame 1  →  Frame 7  →  Frame 13 → ...          │
│  Worker 3: Frame 2  →  Frame 8  →  Frame 14 → ...          │
│  Worker 4: Frame 3  →  Frame 9  →  Frame 15 → ...          │
│  Worker 5: Frame 4  →  Frame 10 →  Frame 16 → ...          │
│  Worker 6: Frame 5  →  Frame 11 →  Frame 17 → ...          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Composition Pattern

```tsx
// Entry Point Pattern
// src/index.ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
```

```tsx
// Registry Pattern
// src/Root.tsx
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition ... />
      <Composition ... />
    </>
  );
};
```

```tsx
// Animation Component Pattern
// src/ClaudeCodeIntro.tsx
export const ClaudeCodeIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Derive all visual state from frame number
  const opacity = interpolate(frame, ...);
  const scale = spring({ frame, fps, ... });

  return (
    <AbsoluteFill>
      {/* Render based on derived state */}
    </AbsoluteFill>
  );
};
```

### Component Hierarchy

```
RemotionRoot
└── Composition (metadata wrapper)
    └── ClaudeCodeIntro (video content)
        └── AbsoluteFill (full-frame container)
            ├── Background layers
            ├── Animation elements
            └── Text elements
```

### State Management

Remotion videos are **stateless** - all visual state derives from the frame number:

```tsx
// CORRECT: Derive from frame
const opacity = interpolate(frame, [0, 30], [0, 1]);

// INCORRECT: Using React state
const [opacity, setOpacity] = useState(0);  // Don't do this!
```

Why stateless?
- **Reproducibility**: Same frame always renders same output
- **Seeking**: Can jump to any frame instantly
- **Parallelism**: Frames can render in any order

---

## Animation Architecture

### The Interpolation Model

All animations map frame numbers to visual properties:

```
         interpolate()
              │
Frame  ───────┼───────▶  Visual Property
(0-209)       │          (opacity, scale, x, y, etc.)
              │
       ┌──────┴──────┐
       │  Mapping    │
       │  Function   │
       └─────────────┘

Example:
Frame 0   → opacity 0.0
Frame 15  → opacity 0.5
Frame 30  → opacity 1.0
```

### Animation Composition

Multiple animations compose through property multiplication:

```tsx
// Compose fade + scale + position
const opacity = interpolate(frame, [0, 30], [0, 1]);
const scale = spring({ frame, fps, config: {...} });
const y = interpolate(frame, [0, 30], [50, 0]);

<div
  style={{
    opacity,
    transform: `scale(${scale}) translateY(${y}px)`,
  }}
>
```

### Timing Patterns

**Sequential** (one after another):
```tsx
const fade1 = interpolate(frame, [0, 30], [0, 1]);
const fade2 = interpolate(frame, [30, 60], [0, 1]);
const fade3 = interpolate(frame, [60, 90], [0, 1]);
```

**Staggered** (overlapping):
```tsx
items.map((item, i) => {
  const delay = i * 10;
  return interpolate(frame - delay, [0, 30], [0, 1]);
});
```

**Parallel** (simultaneous):
```tsx
const opacity = interpolate(frame, [0, 30], [0, 1]);
const scale = interpolate(frame, [0, 30], [0.5, 1]);
const rotation = interpolate(frame, [0, 30], [45, 0]);
```

---

## File Structure Rationale

### Why This Structure?

```
claude_remotion_me2/
├── src/                    # All source code
│   ├── index.ts            # Single entry point (Remotion requirement)
│   ├── Root.tsx            # Composition registry (standard pattern)
│   └── ClaudeCodeIntro.tsx # Feature-specific component
├── out/                    # Output (gitignored typically)
├── docs/                   # Documentation
├── package.json            # Project manifest
├── tsconfig.json           # TypeScript config
└── remotion.config.ts      # Remotion config
```

**Rationale**:

1. **Flat src/** - Simple projects don't need deep nesting
2. **Single entry point** - Required by Remotion's `registerRoot()`
3. **Separate Root.tsx** - Keeps composition registry clean
4. **One file per composition** - Easy to find and modify
5. **Config files at root** - Standard convention for Node projects

### Scaling Up

For larger projects:

```
src/
├── index.ts
├── Root.tsx
├── compositions/           # Video compositions
│   ├── Intro/
│   │   ├── index.tsx
│   │   └── components/
│   └── Outro/
│       ├── index.tsx
│       └── components/
├── components/             # Shared components
│   ├── AnimatedText.tsx
│   └── Background.tsx
├── utils/                  # Utilities
│   ├── animations.ts
│   └── colors.ts
└── constants/              # Constants
    └── index.ts
```

---

## Design Decisions

### Why React for Video?

| Benefit | Explanation |
|---------|-------------|
| Component Model | Reusable, composable video elements |
| Declarative | Describe what, not how |
| Ecosystem | npm packages, tooling, community |
| Familiar | Many developers know React |
| Hot Reload | Instant preview of changes |

### Why TypeScript?

| Benefit | Explanation |
|---------|-------------|
| Type Safety | Catch errors at compile time |
| IDE Support | Autocomplete, refactoring |
| Documentation | Types serve as documentation |
| Refactoring | Safe large-scale changes |

### Why Frame-Based (not Time-Based)?

```
Frame-Based (Remotion):
- Deterministic: Frame 50 is always the same
- Seekable: Jump to any frame instantly
- Parallel: Render frames in any order

Time-Based (Traditional):
- Non-deterministic: Depends on timing
- Sequential: Must play through
- Single-threaded: One frame at a time
```

### Design Trade-offs

| Decision | Pro | Con |
|----------|-----|-----|
| No state | Reproducible, parallelizable | Can't react to events |
| React | Familiar, componentized | Overhead for simple videos |
| TypeScript | Type safety | Learning curve |
| Frame-based | Deterministic | Must calculate everything from frame |

---

## Scalability Considerations

### Adding More Compositions

1. Create new component file
2. Import in Root.tsx
3. Add Composition element

No changes to build system needed.

### Sharing Code Between Compositions

Create shared components:

```tsx
// src/components/FadeIn.tsx
export const FadeIn: React.FC<{children: React.ReactNode; delay?: number}> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity }}>{children}</div>;
};
```

### Performance at Scale

For complex videos:

1. **Memoize expensive calculations**:
   ```tsx
   const data = useMemo(() => computeExpensiveData(), []);
   ```

2. **Reduce DOM elements**: Fewer elements = faster render

3. **Optimize images**: Pre-compress, correct resolution

4. **Increase concurrency**:
   ```bash
   npx remotion render Video out/video.mp4 --concurrency=12
   ```

### Multi-Video Projects

For many compositions:

```tsx
// src/compositions/index.ts
export * from './Intro';
export * from './Outro';
export * from './TitleCard';
export * from './Transition';

// src/Root.tsx
import * as Compositions from './compositions';

export const RemotionRoot = () => (
  <>
    <Composition id="Intro" component={Compositions.Intro} ... />
    <Composition id="Outro" component={Compositions.Outro} ... />
    {/* etc */}
  </>
);
```

---

## Summary

Key architectural principles:

1. **Frame-based rendering** - All state derives from frame number
2. **Component composition** - Build complex from simple
3. **Stateless components** - No React state, only derived values
4. **Parallel rendering** - Frames rendered concurrently
5. **Type safety** - TypeScript catches errors early
6. **Separation of concerns** - Registry, components, utilities separate

This architecture supports:
- ✅ Reproducible renders
- ✅ Fast iteration with hot reload
- ✅ Scalable to many compositions
- ✅ Maintainable codebase
- ✅ Team collaboration
