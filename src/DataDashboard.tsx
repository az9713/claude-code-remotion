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

// Animated counter component
const AnimatedNumber: React.FC<{
  value: number;
  suffix?: string;
  prefix?: string;
  delay: number;
  color?: string;
}> = ({ value, suffix = "", prefix = "", delay, color = "#ffffff" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animatedValue = interpolate(
    frame - delay,
    [0, 2 * fps],
    [0, value],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <span
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: "inline-block",
        color,
      }}
    >
      {prefix}
      {Math.round(animatedValue).toLocaleString()}
      {suffix}
    </span>
  );
};

// Animated bar component
const AnimatedBar: React.FC<{
  label: string;
  value: number;
  maxValue: number;
  color: string;
  delay: number;
  index: number;
}> = ({ label, value, maxValue, color, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const width = interpolate(
    frame - delay,
    [0, 1.5 * fps],
    [0, (value / maxValue) * 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideIn = interpolate(frame - delay, [0, 20], [-50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        marginBottom: 25,
        opacity,
        transform: `translateX(${slideIn}px)`,
      }}
    >
      <div
        style={{
          width: 140,
          textAlign: "right",
          fontFamily: "'Inter', sans-serif",
          fontSize: 24,
          color: "#ffffff",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: 40,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: 8,
            boxShadow: `0 0 20px ${color}50`,
          }}
        />
      </div>
      <div
        style={{
          width: 60,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 20,
          color: color,
          fontWeight: 600,
        }}
      >
        {value}%
      </div>
    </div>
  );
};

// Stat card component
const StatCard: React.FC<{
  title: string;
  value: number;
  suffix: string;
  icon: string;
  color: string;
  delay: number;
}> = ({ title, value, suffix, icon, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 280,
        padding: 30,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 20,
        border: `2px solid ${color}30`,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontSize: 40,
          marginBottom: 15,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 48,
          fontWeight: 700,
          color: color,
          marginBottom: 10,
        }}
      >
        <AnimatedNumber value={value} suffix={suffix} delay={delay + 10} color={color} />
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 18,
          color: "rgba(255, 255, 255, 0.7)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {title}
      </div>
    </div>
  );
};

export const DataDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 30], [-30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Fade out at the end
  const fadeOut = interpolate(frame, [330, 360], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const languages = [
    { label: "TypeScript", value: 45, color: "#3178c6" },
    { label: "Python", value: 30, color: "#3776ab" },
    { label: "Rust", value: 15, color: "#dea584" },
    { label: "Go", value: 10, color: "#00add8" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0d1b2a 100%)",
        padding: 80,
        opacity: fadeOut,
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 60,
        }}
      >
        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
          }}
        >
          2024 Year in Review
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 28,
            color: "rgba(255, 255, 255, 0.5)",
            margin: 0,
            marginTop: 15,
          }}
        >
          Developer Activity Dashboard
        </p>
      </div>

      {/* Stats Cards Row */}
      <Sequence from={30} layout="none">
        <div
          style={{
            display: "flex",
            gap: 30,
            marginBottom: 60,
          }}
        >
          <StatCard
            title="Total Commits"
            value={2847}
            suffix=""
            icon="📝"
            color="#6366f1"
            delay={0}
          />
          <StatCard
            title="Pull Requests"
            value={156}
            suffix=""
            icon="🔀"
            color="#22c55e"
            delay={10}
          />
          <StatCard
            title="Issues Closed"
            value={342}
            suffix=""
            icon="✅"
            color="#f59e0b"
            delay={20}
          />
          <StatCard
            title="Code Reviews"
            value={489}
            suffix=""
            icon="👀"
            color="#ec4899"
            delay={30}
          />
        </div>
      </Sequence>

      {/* Languages Chart */}
      <Sequence from={120} layout="none">
        <div>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 36,
              fontWeight: 600,
              color: "#ffffff",
              margin: 0,
              marginBottom: 30,
              opacity: interpolate(frame - 120, [0, 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Languages Used
          </h2>
          <div style={{ maxWidth: 800 }}>
            {languages.map((lang, i) => (
              <AnimatedBar
                key={lang.label}
                label={lang.label}
                value={lang.value}
                maxValue={50}
                color={lang.color}
                delay={140 + i * 15}
                index={i}
              />
            ))}
          </div>
        </div>
      </Sequence>

      {/* Bottom tagline */}
      <Sequence from={250} layout="none">
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            opacity: interpolate(frame - 250, [0, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.5)",
              margin: 0,
            }}
          >
            Powered by Remotion
          </p>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
