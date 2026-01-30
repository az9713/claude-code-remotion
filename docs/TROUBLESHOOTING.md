# Troubleshooting Guide

Solutions to common problems you may encounter when working with this Remotion video project.

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Development Server Issues](#development-server-issues)
3. [Rendering Issues](#rendering-issues)
4. [Code Errors](#code-errors)
5. [Animation Problems](#animation-problems)
6. [Performance Issues](#performance-issues)
7. [Output File Issues](#output-file-issues)
8. [Platform-Specific Issues](#platform-specific-issues)

---

## Installation Issues

### Problem: `npm install` fails with permission error

**Symptoms**:
```
EACCES: permission denied
```

**Solutions**:

**Windows**:
1. Run Command Prompt as Administrator
2. Navigate to project folder
3. Run `npm install`

**Mac/Linux**:
```bash
sudo npm install
```

Or fix npm permissions:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

---

### Problem: `npm install` fails with network error

**Symptoms**:
```
ETIMEDOUT
ENOTFOUND
network request failed
```

**Solutions**:

1. Check internet connection
2. Try again (sometimes temporary)
3. Use different registry:
   ```bash
   npm install --registry https://registry.npmmirror.com
   ```
4. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```

---

### Problem: Node.js version too old

**Symptoms**:
```
Node.js version X is not supported. Please use Node.js 18 or higher.
```

**Solution**:

1. Check current version:
   ```bash
   node --version
   ```

2. Download Node.js 18+ from [nodejs.org](https://nodejs.org/)

3. Install and restart terminal

4. Verify:
   ```bash
   node --version
   # Should show v18.x.x or higher
   ```

---

### Problem: Missing dependencies after install

**Symptoms**:
```
Cannot find module 'remotion'
Cannot find module 'react'
```

**Solution**:

1. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. If still failing, delete package-lock.json too:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## Development Server Issues

### Problem: `npm run dev` shows "address already in use"

**Symptoms**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions**:

1. **Kill the process using port 3000**:

   **Windows**:
   ```bash
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   ```

   **Mac/Linux**:
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. **Or use a different port**:
   ```bash
   npx remotion studio --port 3001
   ```

---

### Problem: Browser shows blank page

**Symptoms**:
- http://localhost:3000 loads but shows nothing
- No errors in terminal

**Solutions**:

1. **Hard refresh** the browser:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear browser cache**:
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

3. **Check browser console** (F12 → Console tab) for errors

4. **Try a different browser** (Chrome recommended)

---

### Problem: Changes not appearing in preview

**Symptoms**:
- You save a file but preview doesn't update
- Hot reload not working

**Solutions**:

1. **Check file is saved** (look for dot on tab in VS Code)

2. **Restart dev server**:
   - Press `Ctrl + C` in terminal
   - Run `npm run dev` again

3. **Check for syntax errors**:
   - Look at terminal output for errors
   - Look at browser console (F12)

4. **Check file path**:
   - Make sure you're editing the correct file
   - Verify imports in Root.tsx point to your file

---

### Problem: "Module not found" error in browser

**Symptoms**:
```
Module not found: Can't resolve './MyComponent'
```

**Solutions**:

1. **Check file exists** at the path specified

2. **Check spelling** (case-sensitive on Mac/Linux):
   ```tsx
   // Wrong
   import { MyComponent } from './mycomponent';

   // Correct
   import { MyComponent } from './MyComponent';
   ```

3. **Check export**:
   ```tsx
   // In MyComponent.tsx, must have:
   export const MyComponent = ...
   // or
   export default MyComponent;
   ```

---

## Rendering Issues

### Problem: Render fails immediately

**Symptoms**:
```
Error: No composition found
```

**Solution**:

Check composition ID matches exactly:
```bash
# List available compositions
npx remotion compositions

# Use exact ID
npx remotion render ClaudeCodeIntro out/video.mp4
```

---

### Problem: Render hangs at "Getting Chrome"

**Symptoms**:
- Stuck at "Downloading Chrome Headless Shell"
- Progress never completes

**Solutions**:

1. **Check internet connection**

2. **Wait** - first render downloads Chrome (~100MB)

3. **If stuck, cancel and retry**:
   - Press `Ctrl + C`
   - Run render command again

4. **Manual Chrome installation**:
   ```bash
   npx remotion browser ensure
   ```

---

### Problem: Render fails with "out of memory"

**Symptoms**:
```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

**Solutions**:

1. **Increase Node memory**:
   ```bash
   NODE_OPTIONS=--max-old-space-size=8192 npx remotion render ClaudeCodeIntro out/video.mp4
   ```

2. **Reduce concurrency**:
   ```bash
   npx remotion render ClaudeCodeIntro out/video.mp4 --concurrency=2
   ```

3. **Render in segments**:
   ```bash
   npx remotion render ClaudeCodeIntro out/part1.mp4 --frames=0-100
   npx remotion render ClaudeCodeIntro out/part2.mp4 --frames=101-210
   ```

---

### Problem: Render is very slow

**Causes & Solutions**:

1. **Too many DOM elements**:
   - Simplify your composition
   - Remove unnecessary elements

2. **Heavy calculations per frame**:
   ```tsx
   // Bad: Recalculates every frame
   const data = expensiveCalculation();

   // Good: Calculate once
   const data = useMemo(() => expensiveCalculation(), []);
   ```

3. **High resolution**:
   - Test at lower resolution first
   ```bash
   npx remotion render ClaudeCodeIntro out/test.mp4 --scale=0.5
   ```

4. **Increase concurrency** (if you have more CPU cores):
   ```bash
   npx remotion render ClaudeCodeIntro out/video.mp4 --concurrency=8
   ```

---

## Code Errors

### Problem: TypeScript error - "Property does not exist"

**Symptoms**:
```
Property 'myProp' does not exist on type 'X'
```

**Solution**:

Add the property to the interface:
```tsx
interface MyProps {
  existingProp: string;
  myProp: string;  // Add this
}
```

---

### Problem: TypeScript error - "Type 'X' is not assignable"

**Symptoms**:
```
Type 'string' is not assignable to type 'number'
```

**Solutions**:

1. **Check the expected type** and provide correct value

2. **Convert types** if needed:
   ```tsx
   const num = parseInt(stringValue, 10);
   const str = numberValue.toString();
   ```

3. **Type assertion** (use carefully):
   ```tsx
   const value = someValue as number;
   ```

---

### Problem: "React is not defined"

**Symptoms**:
```
'React' is not defined
```

**Solution**:

This project uses the new JSX transform, so you don't need to import React. But if you use `React.FC`, add:

```tsx
import React from "react";
```

Or use this pattern instead:
```tsx
export const MyComponent = (): JSX.Element => {
  return <div>Hello</div>;
};
```

---

### Problem: "Cannot use import statement outside a module"

**Symptoms**:
```
SyntaxError: Cannot use import statement outside a module
```

**Solution**:

Make sure you're running through Remotion, not Node directly:
```bash
# Wrong
node src/index.ts

# Correct
npm run dev
```

---

## Animation Problems

### Problem: Animation overshoots or goes negative

**Symptoms**:
- Opacity goes above 1 or below 0
- Scale becomes negative
- Elements move beyond expected range

**Solution**:

Add clamping:
```tsx
// Before (can overshoot)
const opacity = interpolate(frame, [0, 30], [0, 1]);

// After (clamped)
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

---

### Problem: Animation happens at wrong time

**Symptoms**:
- Animation plays too early or too late
- Timing doesn't match expectations

**Solution**:

Check your frame ranges:
```tsx
// Animation from frame 30 to 60 (1-2 seconds at 30fps)
const opacity = interpolate(frame, [30, 60], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

**Frame/Time Reference** (30fps):
| Time | Frame |
|------|-------|
| 0.0s | 0 |
| 0.5s | 15 |
| 1.0s | 30 |
| 2.0s | 60 |
| 5.0s | 150 |

---

### Problem: Spring animation looks wrong

**Symptoms**:
- Too bouncy or not bouncy enough
- Animation too fast or slow

**Solution**:

Adjust spring config:
```tsx
const scale = spring({
  frame,
  fps,
  config: {
    damping: 10,    // Higher = less bounce
    stiffness: 100, // Higher = faster
    mass: 1,        // Higher = more momentum
  },
});
```

**Presets**:
```tsx
// Very bouncy
{ damping: 5, stiffness: 100, mass: 1 }

// Snappy, no bounce
{ damping: 20, stiffness: 200, mass: 0.5 }

// Slow and gentle
{ damping: 15, stiffness: 30, mass: 2 }
```

---

### Problem: Elements appear in wrong position

**Symptoms**:
- Elements not centered
- Positioning looks off

**Solutions**:

1. **Use AbsoluteFill for centering**:
   ```tsx
   <AbsoluteFill
     style={{
       justifyContent: "center",
       alignItems: "center",
     }}
   >
     <div>Centered content</div>
   </AbsoluteFill>
   ```

2. **Check transform origin**:
   ```tsx
   <div
     style={{
       transformOrigin: "center center",
       transform: `scale(${scale})`,
     }}
   >
   ```

3. **Use position: absolute** for precise positioning:
   ```tsx
   <div
     style={{
       position: "absolute",
       top: 100,
       left: 200,
     }}
   >
   ```

---

## Performance Issues

### Problem: Preview is laggy/stuttering

**Solutions**:

1. **Lower preview quality**:
   - In Remotion Studio, reduce scale (e.g., 50%)

2. **Simplify composition** temporarily while developing

3. **Close other applications** to free up resources

4. **Check for infinite loops** in your code

---

### Problem: Large output file size

**Solutions**:

1. **Increase CRF** (lower quality, smaller file):
   ```bash
   npx remotion render ClaudeCodeIntro out/video.mp4 --crf 28
   ```

2. **Lower resolution**:
   ```bash
   npx remotion render ClaudeCodeIntro out/video.mp4 --scale=0.67
   ```

3. **Use WebM format**:
   ```bash
   npx remotion render ClaudeCodeIntro out/video.webm --codec vp8
   ```

---

## Output File Issues

### Problem: Video won't play

**Symptoms**:
- Video file created but won't open
- "Codec not supported" error

**Solutions**:

1. **Use VLC player** (plays everything): [videolan.org](https://www.videolan.org/)

2. **Re-render with H.264**:
   ```bash
   npx remotion render ClaudeCodeIntro out/video.mp4 --codec h264
   ```

3. **Check file isn't corrupted**:
   - File size should be > 0 bytes
   - If tiny, rendering likely failed

---

### Problem: Video has wrong colors

**Symptoms**:
- Colors look washed out
- Different from preview

**Solution**:

This can be a color space issue. Try:
```bash
npx remotion render ClaudeCodeIntro out/video.mp4 --color-space bt709
```

---

### Problem: Output folder doesn't exist

**Symptoms**:
```
Error: ENOENT: no such file or directory
```

**Solution**:

Create the output folder first:
```bash
mkdir out
npx remotion render ClaudeCodeIntro out/video.mp4
```

---

## Platform-Specific Issues

### Windows

**Problem: "Command not found: npx"**

Solution: Reinstall Node.js and make sure to check "Add to PATH" during installation.

**Problem: Path too long errors**

Solution: Enable long paths in Windows:
1. Run `regedit`
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
3. Set `LongPathsEnabled` to `1`

---

### macOS

**Problem: "Permission denied" on Chromium**

Solution:
```bash
xattr -cr ~/Library/Caches/remotion
```

**Problem: "Developer cannot be verified"**

Solution:
1. System Preferences → Security & Privacy
2. Click "Allow Anyway" for the blocked application

---

### Linux

**Problem: Chrome sandbox errors**

Solution:
```bash
npx remotion render ClaudeCodeIntro out/video.mp4 --disable-web-security
```

Or run with `--no-sandbox`:
```bash
REMOTION_CHROME_NO_SANDBOX=true npx remotion render ClaudeCodeIntro out/video.mp4
```

---

## Still Stuck?

If you've tried the solutions above and still have issues:

1. **Check the error message carefully** - it often contains the solution

2. **Search the error message** online

3. **Check Remotion documentation**: [remotion.dev/docs](https://www.remotion.dev/docs)

4. **Check Remotion GitHub issues**: [github.com/remotion-dev/remotion/issues](https://github.com/remotion-dev/remotion/issues)

5. **Create minimal reproduction**:
   - Simplify your code until error disappears
   - The last change reveals the problem

---

## Quick Reference: Common Commands

```bash
# Check Node version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules && npm install

# Start dev server
npm run dev

# Start on different port
npx remotion studio --port 3001

# List compositions
npx remotion compositions

# Render video
npx remotion render ClaudeCodeIntro out/video.mp4

# Render with options
npx remotion render ClaudeCodeIntro out/video.mp4 --crf 18 --concurrency 4
```
