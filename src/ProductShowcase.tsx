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

// Feature item component
const FeatureItem: React.FC<{
  icon: string;
  title: string;
  description: string;
  delay: number;
  index: number;
  accentColor: string;
}> = ({ icon, title, description, delay, index, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide in from right with stagger
  const slideX = interpolate(frame - delay, [0, 30], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Checkmark animation
  const checkScale = spring({
    frame: frame - delay - 20,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  const checkOpacity = interpolate(frame - delay - 20, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Icon bounce
  const iconScale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 30,
        opacity,
        transform: `translateX(${slideX}px)`,
        marginBottom: 40,
      }}
    >
      {/* Checkmark circle */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: `${accentColor}20`,
          border: `3px solid ${accentColor}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: checkOpacity,
          transform: `scale(${checkScale})`,
          flexShrink: 0,
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accentColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Icon */}
      <div
        style={{
          fontSize: 50,
          transform: `scale(${iconScale})`,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Text content */}
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 32,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            marginBottom: 8,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 20,
            color: "rgba(255, 255, 255, 0.6)",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

// Progress indicator
const ProgressIndicator: React.FC<{
  total: number;
  current: number;
  color: string;
}> = ({ total, current, color }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        justifyContent: "center",
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i <= current;
        const opacity = interpolate(
          frame,
          [i * 60 + 30, i * 60 + 50],
          [0.3, isActive ? 1 : 0.3],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <div
            key={i}
            style={{
              width: 40,
              height: 6,
              borderRadius: 3,
              backgroundColor: color,
              opacity,
              transition: "opacity 0.3s",
            }}
          />
        );
      })}
    </div>
  );
};

export const ProductShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Coding",
      description: "Intelligent code suggestions and auto-completion",
      color: "#8b5cf6",
    },
    {
      icon: "📁",
      title: "Multi-File Editing",
      description: "Edit multiple files simultaneously with context awareness",
      color: "#22c55e",
    },
    {
      icon: "🔀",
      title: "Git Integration",
      description: "Seamless version control with smart commit messages",
      color: "#f59e0b",
    },
    {
      icon: "🔍",
      title: "Codebase Search",
      description: "Find anything in your project instantly",
      color: "#ec4899",
    },
    {
      icon: "🧪",
      title: "Test Generation",
      description: "Automatically generate tests for your code",
      color: "#06b6d4",
    },
  ];

  // Title animation
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtitle animation
  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [20, 50], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Calculate which feature is currently active
  const currentFeature = Math.min(
    Math.floor((frame - 60) / 60),
    features.length - 1
  );

  // Fade out
  const fadeOut = interpolate(frame, [420, 450], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background glow position
  const glowY = interpolate(frame, [0, 450], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)",
        opacity: fadeOut,
      }}
    >
      {/* Animated background glow */}
      <div
        style={{
          position: "absolute",
          top: `${30 + glowY * 0.3}%`,
          left: "50%",
          width: 800,
          height: 400,
          background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
        }}
      />

      {/* Content container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "60px 100px",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              opacity: titleOpacity,
              transform: `scale(${titleScale})`,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 28,
                fontWeight: 600,
                color: "#8b5cf6",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Introducing
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 80,
              fontWeight: 800,
              color: "#ffffff",
              margin: 0,
              opacity: titleOpacity,
              transform: `scale(${titleScale})`,
            }}
          >
            Claude{" "}
            <span style={{ color: "#8b5cf6" }}>Code</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 28,
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
              marginTop: 20,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
            }}
          >
            The AI-powered development environment
          </p>
        </div>

        {/* Features list */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: 900,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {features.map((feature, i) => (
            <FeatureItem
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={60 + i * 60}
              index={i}
              accentColor={feature.color}
            />
          ))}
        </div>

        {/* Progress indicator */}
        <Sequence from={60} layout="none">
          <div style={{ marginTop: 40 }}>
            <ProgressIndicator
              total={features.length}
              current={currentFeature}
              color="#8b5cf6"
            />
          </div>
        </Sequence>

        {/* CTA */}
        <Sequence from={380} layout="none">
          <div
            style={{
              textAlign: "center",
              marginTop: 40,
              opacity: interpolate(frame - 380, [0, 30], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "20px 50px",
                backgroundColor: "#8b5cf6",
                borderRadius: 50,
                fontFamily: "'Inter', sans-serif",
                fontSize: 24,
                fontWeight: 600,
                color: "#ffffff",
                transform: `scale(${spring({
                  frame: frame - 380,
                  fps,
                  config: { damping: 10, stiffness: 100 },
                })})`,
              }}
            >
              Get Started Free →
            </div>
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
