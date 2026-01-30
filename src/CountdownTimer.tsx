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

// Large countdown number component
const CountdownNumber: React.FC<{
  number: number;
  isActive: boolean;
}> = ({ number, isActive }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scale up then down
  const scale = isActive
    ? spring({
        frame,
        fps,
        config: { damping: 8, stiffness: 100 },
      })
    : interpolate(frame, [0, 15], [1, 0.3], {
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      });

  const opacity = isActive
    ? interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" })
    : interpolate(frame, [0, 15], [1, 0], { extrapolateRight: "clamp" });

  // Ring animation
  const ringScale = interpolate(frame, [0, 30], [0.8, 1.5], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const ringOpacity = interpolate(frame, [0, 30], [0.8, 0], {
    extrapolateRight: "clamp",
  });

  // Color based on number
  const colors: Record<number, string> = {
    3: "#ef4444",
    2: "#f59e0b",
    1: "#22c55e",
  };
  const color = colors[number] || "#ffffff";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Expanding ring effect */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: `4px solid ${color}`,
            transform: `scale(${ringScale})`,
            opacity: ringOpacity,
          }}
        />
      )}

      {/* Number */}
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 350,
          fontWeight: 900,
          color,
          opacity,
          transform: `scale(${scale})`,
          textShadow: `0 0 100px ${color}80`,
        }}
      >
        {number}
      </span>
    </div>
  );
};

// GO! text with explosion effect
const GoText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 6, stiffness: 120 },
  });

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Letter stagger
  const letters = "GO!".split("");

  // Particle explosion
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const speed = 5 + Math.random() * 10;
    const distance = frame * speed;
    const particleOpacity = interpolate(frame, [0, 60], [1, 0], {
      extrapolateRight: "clamp",
    });

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: particleOpacity,
      size: 10 + Math.random() * 20,
      color: ["#22c55e", "#4ade80", "#86efac"][Math.floor(Math.random() * 3)],
    };
  });

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            backgroundColor: particle.color,
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            opacity: particle.opacity,
            boxShadow: `0 0 10px ${particle.color}`,
          }}
        />
      ))}

      {/* GO! letters */}
      <div style={{ display: "flex", gap: 20, opacity }}>
        {letters.map((letter, i) => {
          const letterScale = spring({
            frame: frame - i * 5,
            fps,
            config: { damping: 8, stiffness: 150 },
          });

          return (
            <span
              key={i}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 250,
                fontWeight: 900,
                color: "#22c55e",
                transform: `scale(${letterScale})`,
                textShadow: "0 0 80px rgba(34, 197, 94, 0.8)",
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>

      {/* Burst lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const length = interpolate(frame, [0, 30], [0, 300], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const lineOpacity = interpolate(frame, [10, 40], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 4,
              height: length,
              backgroundColor: "#22c55e",
              transform: `rotate(${(angle * 180) / Math.PI}deg) translateY(-${length / 2 + 150}px)`,
              opacity: lineOpacity,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
};

// Pulsing circle background
const PulsingBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const rings = [0, 1, 2, 3].map((i) => {
    const delay = i * 20;
    const scale = interpolate((frame + delay) % 90, [0, 90], [0.5, 2], {
      extrapolateRight: "clamp",
    });
    const opacity = interpolate((frame + delay) % 90, [0, 90], [0.3, 0], {
      extrapolateRight: "clamp",
    });

    return { scale, opacity };
  });

  return (
    <>
      {rings.map((ring, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            transform: `scale(${ring.scale})`,
            opacity: ring.opacity,
          }}
        />
      ))}
    </>
  );
};

export const CountdownTimer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each number shows for 30 frames (1 second)
  const numberDuration = fps;

  // Fade out at end
  const fadeOut = interpolate(frame, [180, 210], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title animation
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 20], [-30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a0f 100%)",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Pulsing background circles */}
      <PulsingBackground />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 100,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            margin: 0,
          }}
        >
          Get Ready
        </h1>
      </div>

      {/* Countdown numbers */}
      <Sequence from={30} durationInFrames={numberDuration}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CountdownNumber number={3} isActive={true} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={30 + numberDuration} durationInFrames={numberDuration}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CountdownNumber number={2} isActive={true} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={30 + numberDuration * 2} durationInFrames={numberDuration}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CountdownNumber number={1} isActive={true} />
        </AbsoluteFill>
      </Sequence>

      {/* GO! */}
      <Sequence from={30 + numberDuration * 3}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GoText />
        </AbsoluteFill>
      </Sequence>

      {/* Bottom subtitle */}
      <Sequence from={150}>
        <div
          style={{
            position: "absolute",
            bottom: 100,
            opacity: interpolate(frame - 150, [0, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 32,
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
              letterSpacing: "0.1em",
            }}
          >
            Let's build something amazing
          </p>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
