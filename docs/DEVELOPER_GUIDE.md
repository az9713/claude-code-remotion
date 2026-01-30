# Developer Guide

A comprehensive technical guide for developers who want to understand, modify, and extend this Remotion video project. Written for developers with C, C++, or Java backgrounds who are new to web development.

---

## Table of Contents

1. [For C/C++/Java Developers](#for-cc-java-developers)
2. [Technology Stack Deep Dive](#technology-stack-deep-dive)
3. [Project Architecture](#project-architecture)
4. [Understanding React & JSX](#understanding-react--jsx)
5. [Remotion Core Concepts](#remotion-core-concepts)
6. [Animation System](#animation-system)
7. [Creating New Compositions](#creating-new-compositions)
8. [TypeScript Essentials](#typescript-essentials)
9. [Debugging & Development](#debugging--development)
10. [Best Practices](#best-practices)
11. [Extending the Project](#extending-the-project)
12. [API Reference](#api-reference)

---

## For C/C++/Java Developers

### Conceptual Mapping

If you're coming from traditional programming languages, here's how concepts map:

| Your Experience | JavaScript/React Equivalent |
|-----------------|---------------------------|
| `class MyClass { ... }` | `function MyComponent() { ... }` or `const MyComponent = () => { ... }` |
| Constructor parameters | Props (properties passed to component) |
| Instance variables | State (using `useState` hook) or local variables |
| Method calls | Function calls |
| `#include` / `import` | `import { X } from "module"` |
| `new MyClass()` | `<MyComponent />` (JSX instantiation) |
| `main()` entry point | `registerRoot()` and `<Composition>` |
| Header files (.h) | TypeScript type definitions (.d.ts) |
| Makefile / CMakeLists | package.json + npm |
| Static linking | Bundle (webpack/esbuild) |

### Key Differences

1. **No explicit memory management**: JavaScript has garbage collection
2. **Dynamic typing** (but TypeScript adds static types)
3. **Asynchronous by nature**: Uses callbacks, Promises, async/await
4. **Prototype-based** (not class-based, though `class` syntax exists)
5. **First-class functions**: Functions can be passed as arguments

### Syntax Quick Reference

```tsx
// Variable declaration
const immutableVar = 10;        // Like "const int x = 10" - can't reassign
let mutableVar = 10;            // Like "int x = 10" - can reassign
mutableVar = 20;                // OK

// Functions
function add(a: number, b: number): number {
  return a + b;
}

// Arrow functions (lambdas)
const multiply = (a: number, b: number): number => a * b;

// Objects (like structs/maps)
const person = {
  name: "Alice",
  age: 30,
};

// Arrays
const numbers: number[] = [1, 2, 3, 4, 5];

// Destructuring (unpacking)
const { name, age } = person;           // Extract properties
const [first, second] = numbers;        // Extract array elements

// Template strings (like printf with interpolation)
const message = `Hello, ${name}! You are ${age} years old.`;

// Spread operator
const moreNumbers = [...numbers, 6, 7]; // [1,2,3,4,5,6,7]
```

---

## Technology Stack Deep Dive

### Node.js

**What it is**: JavaScript runtime built on Chrome's V8 engine. Lets you run JavaScript outside a browser.

**Why we use it**: Runs the build tools, development server, and rendering engine.

**Key concepts**:
- `npm` (Node Package Manager): Like apt-get, brew, or vcpkg for JavaScript
- `package.json`: Manifest file listing dependencies and scripts
- `node_modules/`: Folder containing all installed packages

### TypeScript

**What it is**: JavaScript with static type checking. Compiles to plain JavaScript.

**Why we use it**: Catches type errors at compile time, better IDE support, self-documenting code.

**Example**:
```typescript
// TypeScript (with types)
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Compiles to JavaScript (without types)
function greet(name) {
  return `Hello, ${name}`;
}
```

### React

**What it is**: A library for building user interfaces using components.

**Why we use it**: Remotion is built on React. Component model makes video scenes composable and reusable.

**Key concepts**:
- **Components**: Functions that return JSX (what to render)
- **Props**: Input data passed to components
- **State**: Internal data that can change over time
- **Hooks**: Functions that let you use React features

### Remotion

**What it is**: A framework for creating videos with React.

**Why we use it**: Programmatic video creation, preview in browser, exports to video files.

**How it works**:
1. You write React components that render based on current frame
2. Remotion captures each frame as an image
3. FFmpeg stitches images into a video

---

## Project Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Entry Point                            │
│                    src/index.ts                             │
│              registerRoot(RemotionRoot)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Root Component                           │
│                    src/Root.tsx                             │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  <Composition                                       │   │
│   │    id="ClaudeCodeIntro"                             │   │
│   │    component={ClaudeCodeIntro}                      │   │
│   │    durationInFrames={210}                           │   │
│   │    fps={30}                                         │   │
│   │    width={1920}                                     │   │
│   │    height={1080}                                    │   │
│   │  />                                                 │   │
│   └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               Composition Component                         │
│            src/ClaudeCodeIntro.tsx                          │
│                                                             │
│   ┌──────────────┐     ┌──────────────┐     ┌────────────┐  │
│   │  useFrame()  │     │ interpolate()│     │  spring()  │  │
│   │  Gets frame# │ ──▶ │ Maps values  │ ──▶ │ Physics    │  │
│   └──────────────┘     └──────────────┘     └────────────┘  │
│                                                             │
│   Returns JSX that renders visuals for current frame        │
└─────────────────────────────────────────────────────────────┘
```

### File Responsibilities

| File | Responsibility | Edit Frequency |
|------|----------------|----------------|
| `src/index.ts` | Bootstrap application | Rarely |
| `src/Root.tsx` | Register compositions, define video metadata | When adding videos |
| `src/ClaudeCodeIntro.tsx` | Render the intro animation | Frequently |
| `remotion.config.ts` | Render settings | Occasionally |
| `tsconfig.json` | TypeScript compiler options | Rarely |
| `package.json` | Dependencies, npm scripts | When adding libraries |

---

## Understanding React & JSX

### Components

A component is a function that returns JSX (what to display):

```tsx
// Simple component
const Greeting: React.FC = () => {
  return <h1>Hello World</h1>;
};

// Component with props
interface WelcomeProps {
  name: string;
  age: number;
}

const Welcome: React.FC<WelcomeProps> = ({ name, age }) => {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
};

// Usage
<Welcome name="Alice" age={30} />
```

### JSX Explained

JSX looks like HTML but compiles to function calls:

```tsx
// JSX
<div className="container">
  <h1>Title</h1>
  <p>Paragraph</p>
</div>

// Compiles to
React.createElement(
  "div",
  { className: "container" },
  React.createElement("h1", null, "Title"),
  React.createElement("p", null, "Paragraph")
);
```

**Key JSX Rules**:
1. Use `className` instead of `class` (class is reserved in JS)
2. Self-closing tags must end with `/>`: `<img src="..." />`
3. JavaScript expressions go in `{}`: `<p>Count: {count}</p>`
4. One root element per return (or use `<>...</>` fragments)

### Styling in React

Three ways to style:

```tsx
// 1. Inline styles (object, camelCase properties)
<div style={{ backgroundColor: "red", fontSize: 16 }}>Styled</div>

// 2. CSS classes (less common in Remotion)
<div className="my-class">Styled</div>

// 3. CSS-in-JS libraries (not used in this project)
```

**Inline style gotchas**:
- Use camelCase: `backgroundColor` not `background-color`
- Numbers default to pixels: `fontSize: 16` = `font-size: 16px`
- Strings for other units: `width: "50%"`

---

## Remotion Core Concepts

### The Frame-Based Model

Unlike real-time animation, Remotion renders one frame at a time:

```
Frame 0    Frame 1    Frame 2    ...    Frame 209
   │          │          │                  │
   ▼          ▼          ▼                  ▼
┌──────┐  ┌──────┐  ┌──────┐           ┌──────┐
│ Render│  │ Render│  │ Render│         │ Render│
│ @t=0 │  │ @t=33│  │ @t=66│           │@t=6966│
└──────┘  └──────┘  └──────┘           └──────┘
```

Your component receives the frame number and returns what to display.

### Essential Hooks

**useCurrentFrame()**
```tsx
const frame = useCurrentFrame();
// frame = 0 on first frame, 1 on second, etc.
```

**useVideoConfig()**
```tsx
const { fps, width, height, durationInFrames } = useVideoConfig();
// fps = 30
// width = 1920
// height = 1080
// durationInFrames = 210
```

### The Composition Component

Defines a video's metadata:

```tsx
<Composition
  id="MyVideo"                    // Unique identifier
  component={MyVideoComponent}    // What to render
  durationInFrames={300}          // Total frames
  fps={30}                        // Frames per second
  width={1920}                    // Width in pixels
  height={1080}                   // Height in pixels
  defaultProps={{                 // Optional default props
    title: "Default Title",
  }}
/>
```

### AbsoluteFill

A div that fills the entire video frame:

```tsx
<AbsoluteFill
  style={{
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  {/* Content centered in frame */}
</AbsoluteFill>
```

Equivalent to:
```tsx
<div
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  }}
>
```

---

## Animation System

### interpolate()

Maps a value from one range to another:

```tsx
import { interpolate } from "remotion";

// Syntax
interpolate(
  inputValue,      // The value to map (usually frame)
  inputRange,      // [start, end] of input
  outputRange,     // [start, end] of output
  options          // Optional configuration
);

// Example: Fade in over frames 0-30
const opacity = interpolate(frame, [0, 30], [0, 1]);
// frame=0  → opacity=0
// frame=15 → opacity=0.5
// frame=30 → opacity=1
// frame=45 → opacity=1.5 (extrapolated!)
```

**Options**:
```tsx
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",   // Values below 0 stay at 0
  extrapolateRight: "clamp",  // Values above 30 stay at 1
  easing: Easing.ease,        // Easing function
});
```

**Extrapolation modes**:
- `"extend"` (default): Continue the line beyond the range
- `"clamp"`: Stop at the boundary value
- `"wrap"`: Loop back to start
- `"identity"`: Return input value unchanged

### spring()

Physics-based spring animation:

```tsx
import { spring } from "remotion";

const scale = spring({
  frame,                    // Current frame
  fps,                      // Frames per second
  config: {
    damping: 10,            // Resistance (higher = less bounce)
    stiffness: 100,         // Spring tightness (higher = faster)
    mass: 1,                // Object weight
    overshootClamping: false, // Allow overshooting target
  },
  durationInFrames: 60,     // Optional: limit animation length
  from: 0,                  // Starting value (default: 0)
  to: 1,                    // Ending value (default: 1)
});
```

**Config presets**:
```tsx
// Bouncy
{ damping: 5, stiffness: 100, mass: 1 }

// Snappy
{ damping: 20, stiffness: 200, mass: 0.5 }

// Gentle
{ damping: 15, stiffness: 50, mass: 1.5 }
```

### Easing Functions

Modify the rate of change:

```tsx
import { Easing } from "remotion";

// Linear (constant speed)
Easing.linear

// Ease in (slow start)
Easing.in(Easing.quad)    // Quadratic
Easing.in(Easing.cubic)   // Cubic
Easing.in(Easing.exp)     // Exponential

// Ease out (slow end)
Easing.out(Easing.quad)

// Ease in-out (slow start and end)
Easing.inOut(Easing.cubic)

// Bezier curve
Easing.bezier(0.25, 0.1, 0.25, 1)
```

Usage:
```tsx
const x = interpolate(frame, [0, 30], [0, 500], {
  easing: Easing.out(Easing.cubic),
});
```

### Sequence and Timing

**Sequence**: Play animations one after another

```tsx
import { Sequence } from "remotion";

<AbsoluteFill>
  <Sequence from={0} durationInFrames={30}>
    <FadeIn />
  </Sequence>
  <Sequence from={30} durationInFrames={60}>
    <MainContent />
  </Sequence>
  <Sequence from={90}>
    <FadeOut />
  </Sequence>
</AbsoluteFill>
```

**Calculating timing**:
```tsx
// Delay before starting
const delayedOpacity = interpolate(
  frame,
  [30, 60],  // Start at frame 30, end at 60
  [0, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);

// Using Sequence (equivalent)
<Sequence from={30}>
  <ComponentThatFadesIn />
</Sequence>
```

---

## Creating New Compositions

### Step-by-Step Guide

**Step 1: Create the component file**

Create `src/MyNewVideo.tsx`:

```tsx
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const MyNewVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Animation logic
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#fff",
          fontSize: 80,
          opacity,
        }}
      >
        My New Video
      </h1>
    </AbsoluteFill>
  );
};
```

**Step 2: Register in Root.tsx**

```tsx
import { Composition } from "remotion";
import { ClaudeCodeIntro } from "./ClaudeCodeIntro";
import { MyNewVideo } from "./MyNewVideo";  // Add import

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
      {/* Add new composition */}
      <Composition
        id="MyNewVideo"
        component={MyNewVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
```

**Step 3: Preview and render**

```bash
# Preview
npm run dev
# Select "MyNewVideo" from dropdown

# Render
npx remotion render MyNewVideo out/my-new-video.mp4
```

### Using Props

Make compositions configurable:

```tsx
// Define props interface
interface TitleCardProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
}

// Component with props
export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle = "Default Subtitle",
  backgroundColor = "#000",
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </AbsoluteFill>
  );
};

// Register with default props
<Composition
  id="TitleCard"
  component={TitleCard}
  durationInFrames={90}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    title: "Welcome",
    subtitle: "To My Channel",
    backgroundColor: "#1a1a2e",
  }}
/>
```

---

## TypeScript Essentials

### Basic Types

```typescript
// Primitives
const count: number = 42;
const name: string = "Alice";
const isActive: boolean = true;

// Arrays
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ["Alice", "Bob"];

// Objects
interface Person {
  name: string;
  age: number;
  email?: string;  // Optional property
}

const person: Person = {
  name: "Alice",
  age: 30,
};

// Functions
const add = (a: number, b: number): number => {
  return a + b;
};
```

### React-Specific Types

```typescript
// Functional component
const MyComponent: React.FC = () => {
  return <div>Hello</div>;
};

// Component with props
interface Props {
  title: string;
  count: number;
}

const MyComponent: React.FC<Props> = ({ title, count }) => {
  return <div>{title}: {count}</div>;
};

// Event handlers
const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
  console.log("Clicked!", event.target);
};

// Style objects
const myStyle: React.CSSProperties = {
  backgroundColor: "red",
  fontSize: 16,
};
```

### Type Inference

TypeScript often infers types automatically:

```typescript
// Inferred as number
const count = 42;

// Inferred as string[]
const names = ["Alice", "Bob"];

// Inferred from Remotion
const frame = useCurrentFrame();  // number
const { fps } = useVideoConfig(); // number
```

---

## Debugging & Development

### Console Logging

```tsx
const MyComponent = () => {
  const frame = useCurrentFrame();

  // Logs every frame - use sparingly!
  console.log("Current frame:", frame);

  // Log only once
  if (frame === 0) {
    console.log("First frame rendered");
  }

  return <div>Frame: {frame}</div>;
};
```

View logs in browser DevTools (F12 → Console).

### Common Errors and Solutions

**"Cannot find module"**
```
Error: Cannot find module './MyComponent'
```
Solution: Check file path and export statement.

**"Property does not exist"**
```
Property 'foo' does not exist on type 'Props'
```
Solution: Add property to interface or fix typo.

**"Type 'X' is not assignable"**
```
Type 'string' is not assignable to type 'number'
```
Solution: Check variable types, use correct type.

### React DevTools

Install the React DevTools browser extension to inspect component hierarchy and props.

### Remotion-Specific Debugging

```tsx
// Check video config
const config = useVideoConfig();
console.log("Video config:", config);

// Render debug info on screen
return (
  <AbsoluteFill>
    <div style={{ position: "absolute", top: 10, left: 10, color: "white" }}>
      Frame: {frame} / FPS: {fps}
    </div>
    {/* Rest of video */}
  </AbsoluteFill>
);
```

---

## Best Practices

### Performance

1. **Avoid heavy calculations per frame**
   ```tsx
   // Bad: Recalculates every frame
   const data = heavyCalculation();

   // Good: Calculate once
   const data = useMemo(() => heavyCalculation(), []);
   ```

2. **Use `extrapolateRight: "clamp"`** to prevent animation overshoot

3. **Minimize DOM elements** for faster rendering

### Code Organization

1. **One component per file**
2. **Extract reusable animations to utilities**
3. **Use constants for colors, durations**:
   ```tsx
   // constants.ts
   export const COLORS = {
     primary: "#da7756",
     background: "#1a1a2e",
   };

   export const TIMING = {
     fadeInDuration: 30,
     mainDuration: 150,
   };
   ```

### Animation Patterns

1. **Always clamp extrapolation** unless you need it:
   ```tsx
   interpolate(frame, [0, 30], [0, 1], {
     extrapolateLeft: "clamp",
     extrapolateRight: "clamp",
   });
   ```

2. **Use springs for organic motion**, interpolate for linear

3. **Stagger animations** for visual interest:
   ```tsx
   items.map((item, i) => {
     const delay = i * 5; // 5 frames between each
     const opacity = interpolate(frame - delay, [0, 30], [0, 1], {
       extrapolateLeft: "clamp",
       extrapolateRight: "clamp",
     });
     return <Item key={i} opacity={opacity} />;
   });
   ```

---

## Extending the Project

### Adding Assets

Place images, fonts, etc. in a `public/` folder:

```
public/
  logo.png
  fonts/
    MyFont.woff2
```

Reference in components:
```tsx
<img src="/logo.png" alt="Logo" />
```

### Adding Dependencies

```bash
# Install a new package
npm install package-name

# Install development dependency
npm install --save-dev package-name
```

### Creating Reusable Components

```tsx
// src/components/AnimatedText.tsx
interface AnimatedTextProps {
  children: string;
  delay?: number;
  duration?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  delay = 0,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return <span style={{ opacity }}>{children}</span>;
};

// Usage
<AnimatedText delay={15}>Hello World</AnimatedText>
```

---

## API Reference

### Remotion Imports

```tsx
import {
  // Composition
  Composition,
  registerRoot,

  // Hooks
  useCurrentFrame,
  useVideoConfig,

  // Animation
  interpolate,
  spring,
  Easing,

  // Components
  AbsoluteFill,
  Sequence,
  Audio,
  Video,
  Img,

  // Utilities
  random,
  measureSpring,
} from "remotion";
```

### useCurrentFrame()

Returns the current frame number (0-indexed).

```tsx
const frame = useCurrentFrame();
// frame: number
```

### useVideoConfig()

Returns composition configuration.

```tsx
const {
  fps,              // number - frames per second
  width,            // number - video width in pixels
  height,           // number - video height in pixels
  durationInFrames, // number - total frame count
  id,               // string - composition ID
} = useVideoConfig();
```

### interpolate()

```tsx
interpolate(
  input: number,
  inputRange: [number, number, ...],
  outputRange: [number, number, ...],
  options?: {
    extrapolateLeft?: "clamp" | "extend" | "wrap" | "identity",
    extrapolateRight?: "clamp" | "extend" | "wrap" | "identity",
    easing?: (t: number) => number,
  }
): number
```

### spring()

```tsx
spring({
  frame: number,
  fps: number,
  config?: {
    damping?: number,    // default: 10
    stiffness?: number,  // default: 100
    mass?: number,       // default: 1
    overshootClamping?: boolean, // default: false
  },
  from?: number,         // default: 0
  to?: number,           // default: 1
  durationInFrames?: number,
  durationRestThreshold?: number,
}): number
```

### Easing

```tsx
Easing.linear
Easing.ease
Easing.quad
Easing.cubic
Easing.sin
Easing.exp
Easing.circle
Easing.bounce

Easing.in(easing)
Easing.out(easing)
Easing.inOut(easing)

Easing.bezier(x1, y1, x2, y2)
```

---

## Summary

You now have comprehensive knowledge to:

- ✅ Understand the technology stack
- ✅ Read and write React/TypeScript code
- ✅ Create animations with interpolate and spring
- ✅ Build new compositions from scratch
- ✅ Debug and troubleshoot issues
- ✅ Follow best practices
- ✅ Extend the project with new features

For hands-on practice, complete the [Quick Start Guide](QUICK_START.md) tutorials.
