import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Sequence,
} from "remotion";

// Syntax highlighting colors
const syntaxColors = {
  keyword: "#c678dd",
  function: "#61afef",
  string: "#98c379",
  number: "#d19a66",
  comment: "#5c6370",
  variable: "#e06c75",
  type: "#e5c07b",
  operator: "#56b6c2",
  plain: "#abb2bf",
  bracket: "#abb2bf",
};

// Token type for syntax highlighting
interface Token {
  text: string;
  type: keyof typeof syntaxColors;
}

// Code line component with syntax highlighting
const CodeLine: React.FC<{
  tokens: Token[];
  lineNumber: number;
  delay: number;
  highlighted?: boolean;
}> = ({ tokens, lineNumber, delay, highlighted = false }) => {
  const frame = useCurrentFrame();

  // Typewriter effect - reveal characters over time
  const totalChars = tokens.reduce((sum, t) => sum + t.text.length, 0);

  // Handle empty lines (no characters to show)
  const charsToShow = totalChars === 0
    ? 0
    : Math.floor(
        interpolate(frame - delay, [0, Math.max(1, totalChars * 2)], [0, totalChars], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      );

  // Line fade in
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Highlight animation
  const highlightOpacity = highlighted
    ? interpolate(
        (frame - delay) % 60,
        [0, 30, 60],
        [0.1, 0.2, 0.1],
        { extrapolateRight: "clamp" }
      )
    : 0;

  let charCount = 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 24,
        lineHeight: 1.8,
        opacity,
        position: "relative",
      }}
    >
      {/* Highlight background */}
      {highlighted && (
        <div
          style={{
            position: "absolute",
            left: -20,
            right: -20,
            top: 0,
            bottom: 0,
            backgroundColor: `rgba(97, 175, 239, ${highlightOpacity})`,
            borderLeft: "3px solid #61afef",
            marginLeft: -3,
          }}
        />
      )}

      {/* Line number */}
      <span
        style={{
          width: 50,
          color: syntaxColors.comment,
          textAlign: "right",
          marginRight: 30,
          userSelect: "none",
        }}
      >
        {lineNumber}
      </span>

      {/* Code tokens */}
      <span style={{ position: "relative" }}>
        {tokens.map((token, i) => {
          const tokenStart = charCount;
          charCount += token.text.length;

          // How much of this token to show
          const visibleChars = Math.max(
            0,
            Math.min(token.text.length, charsToShow - tokenStart)
          );
          const visibleText = token.text.slice(0, visibleChars);

          return (
            <span
              key={i}
              style={{
                color: syntaxColors[token.type],
              }}
            >
              {visibleText}
            </span>
          );
        })}

        {/* Blinking cursor */}
        {charsToShow < totalChars && charsToShow > 0 && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 24,
              backgroundColor: "#528bff",
              marginLeft: 2,
              opacity: Math.floor((frame - delay) / 15) % 2 === 0 ? 1 : 0,
              verticalAlign: "middle",
            }}
          />
        )}
      </span>
    </div>
  );
};

// Annotation callout component
const Annotation: React.FC<{
  text: string;
  delay: number;
  position: "right" | "bottom";
  color?: string;
}> = ({ text, delay, position, color = "#61afef" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideIn = interpolate(frame - delay, [0, 20], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const arrowLength = interpolate(frame - delay, [0, 15], [0, 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity,
        transform:
          position === "right"
            ? `translateX(${slideIn}px)`
            : `translateY(${slideIn}px)`,
      }}
    >
      {/* Arrow */}
      <div
        style={{
          width: arrowLength,
          height: 2,
          backgroundColor: color,
        }}
      />

      {/* Text bubble */}
      <div
        style={{
          backgroundColor: `${color}20`,
          border: `2px solid ${color}`,
          borderRadius: 8,
          padding: "10px 20px",
          transform: `scale(${scale})`,
          transformOrigin: "left center",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 18,
            color: color,
            fontWeight: 500,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

// Terminal output component
const TerminalOutput: React.FC<{
  lines: string[];
  delay: number;
}> = ({ lines, delay }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        borderRadius: 8,
        padding: 20,
        marginTop: 20,
        opacity,
        border: "1px solid #333",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 15,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f56" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#27ca40" }} />
      </div>

      {lines.map((line, i) => {
        const lineDelay = delay + 20 + i * 15;
        const lineOpacity = interpolate(frame - lineDelay, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 18,
              color: line.startsWith("$") ? "#27ca40" : "#abb2bf",
              opacity: lineOpacity,
              marginBottom: 5,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

export const CodeWalkthrough: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 30], [-20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Fade out
  const fadeOut = interpolate(frame, [450, 480], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Code lines with syntax tokens
  const codeLines: { tokens: Token[]; highlight?: boolean }[] = [
    {
      tokens: [
        { text: "import", type: "keyword" },
        { text: " { ", type: "bracket" },
        { text: "useCurrentFrame", type: "function" },
        { text: " } ", type: "bracket" },
        { text: "from", type: "keyword" },
        { text: " ", type: "plain" },
        { text: '"remotion"', type: "string" },
        { text: ";", type: "plain" },
      ],
    },
    { tokens: [] }, // Empty line
    {
      tokens: [
        { text: "export", type: "keyword" },
        { text: " ", type: "plain" },
        { text: "const", type: "keyword" },
        { text: " ", type: "plain" },
        { text: "MyVideo", type: "function" },
        { text: " = () ", type: "operator" },
        { text: "=> {", type: "bracket" },
      ],
    },
    {
      tokens: [
        { text: "  ", type: "plain" },
        { text: "// Get the current frame number", type: "comment" },
      ],
    },
    {
      tokens: [
        { text: "  ", type: "plain" },
        { text: "const", type: "keyword" },
        { text: " ", type: "plain" },
        { text: "frame", type: "variable" },
        { text: " = ", type: "operator" },
        { text: "useCurrentFrame", type: "function" },
        { text: "();", type: "bracket" },
      ],
      highlight: true,
    },
    { tokens: [] },
    {
      tokens: [
        { text: "  ", type: "plain" },
        { text: "// Calculate opacity based on frame", type: "comment" },
      ],
    },
    {
      tokens: [
        { text: "  ", type: "plain" },
        { text: "const", type: "keyword" },
        { text: " ", type: "plain" },
        { text: "opacity", type: "variable" },
        { text: " = ", type: "operator" },
        { text: "frame", type: "variable" },
        { text: " / ", type: "operator" },
        { text: "30", type: "number" },
        { text: ";", type: "plain" },
      ],
      highlight: true,
    },
    { tokens: [] },
    {
      tokens: [
        { text: "  ", type: "plain" },
        { text: "return", type: "keyword" },
        { text: " ", type: "plain" },
        { text: "<", type: "bracket" },
        { text: "div", type: "type" },
        { text: " ", type: "plain" },
        { text: "style", type: "variable" },
        { text: "={{ ", type: "bracket" },
        { text: "opacity", type: "variable" },
        { text: " }}>", type: "bracket" },
      ],
    },
    {
      tokens: [
        { text: "    Hello Remotion!", type: "plain" },
      ],
    },
    {
      tokens: [
        { text: "  </", type: "bracket" },
        { text: "div", type: "type" },
        { text: ">", type: "bracket" },
      ],
    },
    {
      tokens: [
        { text: "}", type: "bracket" },
      ],
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "#282c34",
        padding: 60,
        opacity: fadeOut,
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 48,
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
            }}
          >
            How Remotion Works
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 24,
              color: syntaxColors.comment,
              margin: 0,
              marginTop: 10,
            }}
          >
            Frame-based video programming
          </p>
        </div>

        {/* File tab */}
        <div
          style={{
            backgroundColor: "#21252b",
            padding: "10px 20px",
            borderRadius: "8px 8px 0 0",
            borderBottom: "2px solid #61afef",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 16,
              color: "#abb2bf",
            }}
          >
            MyVideo.tsx
          </span>
        </div>
      </div>

      {/* Code editor area */}
      <div
        style={{
          display: "flex",
          gap: 40,
        }}
      >
        {/* Code panel */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#21252b",
            borderRadius: 12,
            padding: 30,
            border: "1px solid #333",
          }}
        >
          {codeLines.map((line, i) => (
            <CodeLine
              key={i}
              tokens={line.tokens}
              lineNumber={i + 1}
              delay={30 + i * 20}
              highlighted={line.highlight && frame > 200}
            />
          ))}
        </div>

        {/* Annotations panel */}
        <div
          style={{
            width: 350,
            display: "flex",
            flexDirection: "column",
            gap: 30,
            paddingTop: 100,
          }}
        >
          <Sequence from={150} layout="none">
            <Annotation
              text="Gets the current frame (0, 1, 2...)"
              delay={0}
              position="right"
              color="#61afef"
            />
          </Sequence>

          <Sequence from={220} layout="none">
            <Annotation
              text="Opacity changes every frame!"
              delay={0}
              position="right"
              color="#98c379"
            />
          </Sequence>

          <Sequence from={280} layout="none">
            <Annotation
              text="At frame 30, opacity = 1.0"
              delay={0}
              position="right"
              color="#e5c07b"
            />
          </Sequence>
        </div>
      </div>

      {/* Terminal output */}
      <Sequence from={340} layout="none">
        <div style={{ marginTop: 30 }}>
          <TerminalOutput
            lines={[
              "$ npx remotion render MyVideo output.mp4",
              "Rendering frames...",
              "Frame 0/30 → opacity: 0.00",
              "Frame 15/30 → opacity: 0.50",
              "Frame 30/30 → opacity: 1.00",
              "✓ Video rendered successfully!",
            ]}
            delay={0}
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
