import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

export const ClaudeCodeIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for the main text
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

  // Fade in for the main text
  const textOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Glow pulse animation
  const glowIntensity = interpolate(
    frame,
    [30, 60, 90, 120, 150],
    [0, 1, 0.6, 1, 0.8],
    {
      extrapolateRight: "clamp",
    }
  );

  // Subtitle fade in (delayed)
  const subtitleOpacity = interpolate(frame, [45, 75], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [45, 75], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Code brackets animation
  const bracketSpread = interpolate(frame, [20, 50], [0, 60], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const bracketOpacity = interpolate(frame, [20, 40], [0, 0.6], {
    extrapolateRight: "clamp",
  });

  // Particles animation
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const delay = i * 3;
    const radius = interpolate(frame - delay, [0, 60], [50, 200], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const particleOpacity = interpolate(
      frame - delay,
      [0, 20, 60],
      [0, 0.8, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      opacity: particleOpacity,
      size: 4 + (i % 3) * 2,
    };
  });

  // Cursor blink for terminal effect
  const cursorOpacity = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

  // Fade out at the end
  const fadeOut = interpolate(frame, [180, 210], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f23 50%, #16213e 100%)",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Background grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(218, 119, 86, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(218, 119, 86, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Animated particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            backgroundColor: "#da7756",
            transform: `translate(calc(-50% + ${particle.x}px), calc(-50% + ${particle.y}px))`,
            opacity: particle.opacity,
            boxShadow: "0 0 10px #da7756",
          }}
        />
      ))}

      {/* Glow effect behind text */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 200,
          background: `radial-gradient(ellipse at center, rgba(218, 119, 86, ${0.3 * glowIntensity}) 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Code brackets */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          gap: 400 + bracketSpread * 2,
          opacity: bracketOpacity,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 120,
            color: "#f4a261",
            fontWeight: 300,
          }}
        >
          {"<"}
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 120,
            color: "#f4a261",
            fontWeight: 300,
          }}
        >
          {"/>"}
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${textScale})`,
          opacity: textOpacity,
        }}
      >
        {/* Main title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <h1
            style={{
              fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 140,
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-0.02em",
              textShadow: `0 0 ${30 * glowIntensity}px rgba(218, 119, 86, ${0.5 * glowIntensity})`,
            }}
          >
            Claude
          </h1>
          <h1
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 140,
              fontWeight: 600,
              color: "#da7756",
              margin: 0,
              textShadow: `0 0 ${40 * glowIntensity}px rgba(218, 119, 86, ${0.6 * glowIntensity})`,
            }}
          >
            Code
          </h1>
          {/* Terminal cursor */}
          <div
            style={{
              width: 8,
              height: 100,
              backgroundColor: "#da7756",
              opacity: cursorOpacity,
              marginLeft: -10,
              boxShadow: "0 0 15px #da7756",
            }}
          />
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.7)",
            margin: 0,
            marginTop: 30,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          AI-Powered Development
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          width: interpolate(frame, [60, 100], [0, 400], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }),
          height: 3,
          background: "linear-gradient(90deg, transparent, #da7756, #f4a261, #da7756, transparent)",
          borderRadius: 2,
        }}
      />

      {/* Corner accents */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          width: 60,
          height: 60,
          borderLeft: "3px solid rgba(218, 119, 86, 0.4)",
          borderTop: "3px solid rgba(218, 119, 86, 0.4)",
          opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 60,
          width: 60,
          height: 60,
          borderRight: "3px solid rgba(218, 119, 86, 0.4)",
          borderTop: "3px solid rgba(218, 119, 86, 0.4)",
          opacity: interpolate(frame, [35, 55], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 60,
          width: 60,
          height: 60,
          borderLeft: "3px solid rgba(218, 119, 86, 0.4)",
          borderBottom: "3px solid rgba(218, 119, 86, 0.4)",
          opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 60,
          width: 60,
          height: 60,
          borderRight: "3px solid rgba(218, 119, 86, 0.4)",
          borderBottom: "3px solid rgba(218, 119, 86, 0.4)",
          opacity: interpolate(frame, [45, 65], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />
    </AbsoluteFill>
  );
};
