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

// Animated word component with various effects
const AnimatedWord: React.FC<{
  word: string;
  delay: number;
  effect: "fadeUp" | "scaleIn" | "slideRight" | "rotateIn" | "bounceIn";
  color?: string;
  fontSize?: number;
  fontWeight?: number;
}> = ({
  word,
  delay,
  effect,
  color = "#ffffff",
  fontSize = 100,
  fontWeight = 700,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let opacity = 1;
  let transform = "";

  switch (effect) {
    case "fadeUp":
      opacity = interpolate(frame - delay, [0, 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const y = interpolate(frame - delay, [0, 20], [50, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      transform = `translateY(${y}px)`;
      break;

    case "scaleIn":
      opacity = interpolate(frame - delay, [0, 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const scale = spring({
        frame: frame - delay,
        fps,
        config: { damping: 10, stiffness: 100 },
      });
      transform = `scale(${scale})`;
      break;

    case "slideRight":
      opacity = interpolate(frame - delay, [0, 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const x = interpolate(frame - delay, [0, 25], [-200, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      transform = `translateX(${x}px)`;
      break;

    case "rotateIn":
      opacity = interpolate(frame - delay, [0, 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const rotation = interpolate(frame - delay, [0, 25], [-90, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.back(1.5)),
      });
      const rotateScale = interpolate(frame - delay, [0, 25], [0.5, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      transform = `rotate(${rotation}deg) scale(${rotateScale})`;
      break;

    case "bounceIn":
      opacity = interpolate(frame - delay, [0, 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const bounceScale = spring({
        frame: frame - delay,
        fps,
        config: { damping: 8, stiffness: 150 },
      });
      transform = `scale(${bounceScale})`;
      break;
  }

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform,
        color,
        fontSize,
        fontWeight,
        fontFamily: "'Inter', sans-serif",
        marginRight: fontSize * 0.3,
      }}
    >
      {word}
    </span>
  );
};

// Character-by-character animation
const CharacterReveal: React.FC<{
  text: string;
  startDelay: number;
  charDelay?: number;
  color?: string;
  fontSize?: number;
}> = ({ text, startDelay, charDelay = 2, color = "#ffffff", fontSize = 80 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {text.split("").map((char, i) => {
        const delay = startDelay + i * charDelay;
        const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(frame - delay, [0, 10], [30, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${y}px)`,
              color,
              fontSize,
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              minWidth: char === " " ? fontSize * 0.3 : "auto",
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export const KineticTypography: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background pulse
  const pulse = interpolate(
    frame % 60,
    [0, 30, 60],
    [0.02, 0.05, 0.02],
    { extrapolateRight: "clamp" }
  );

  // Fade out
  const fadeOut = interpolate(frame, [390, 420], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#000000",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Animated background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(139, 92, 246, ${pulse}) 0%, transparent 50%)`,
        }}
      />

      {/* Quote Section 1: "Talk is cheap" */}
      <Sequence from={0} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            <AnimatedWord word="Talk" delay={0} effect="slideRight" color="#8b5cf6" fontSize={120} />
            <AnimatedWord word="is" delay={15} effect="fadeUp" color="#ffffff" fontSize={120} />
            <AnimatedWord word="cheap." delay={30} effect="bounceIn" color="#f59e0b" fontSize={120} />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Quote Section 2: "Show me" */}
      <Sequence from={100} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            <AnimatedWord word="Show" delay={0} effect="rotateIn" color="#22c55e" fontSize={140} />
            <AnimatedWord word="me" delay={20} effect="scaleIn" color="#ffffff" fontSize={140} />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Quote Section 3: "the CODE" */}
      <Sequence from={200} durationInFrames={140}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <AnimatedWord word="the" delay={0} effect="fadeUp" color="#6b7280" fontSize={80} />
            <CharacterReveal
              text="CODE"
              startDelay={20}
              charDelay={5}
              color="#ec4899"
              fontSize={180}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Attribution */}
      <Sequence from={320} durationInFrames={100}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 30,
            }}
          >
            <div
              style={{
                width: 100,
                height: 2,
                backgroundColor: "#4b5563",
                opacity: interpolate(frame - 320, [0, 30], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `scaleX(${interpolate(frame - 320, [0, 30], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })})`,
              }}
            />
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 36,
                color: "#9ca3af",
                fontStyle: "italic",
                margin: 0,
                opacity: interpolate(frame - 340, [0, 20], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `translateY(${interpolate(frame - 340, [0, 20], [20, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}px)`,
              }}
            >
              — Linus Torvalds
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Floating code symbols in background */}
      {["{", "}", "<", ">", "/", ";", "=", "(", ")"].map((symbol, i) => {
        const angle = (i / 9) * Math.PI * 2;
        const radius = 350 + (i % 3) * 50;
        const rotationSpeed = 0.005 * (i % 2 === 0 ? 1 : -1);
        const currentAngle = angle + frame * rotationSpeed;

        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${Math.cos(currentAngle) * radius}px)`,
              top: `calc(50% + ${Math.sin(currentAngle) * radius}px)`,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 40 + (i % 3) * 20,
              color: `rgba(139, 92, 246, ${0.1 + (i % 3) * 0.05})`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {symbol}
          </span>
        );
      })}
    </AbsoluteFill>
  );
};
