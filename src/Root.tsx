import { Composition, Folder } from "remotion";
import { ClaudeCodeIntro } from "./ClaudeCodeIntro";
import { DataDashboard } from "./DataDashboard";
import { KineticTypography } from "./KineticTypography";
import { ProductShowcase } from "./ProductShowcase";
import { CountdownTimer } from "./CountdownTimer";
import { CodeWalkthrough } from "./CodeWalkthrough";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Original intro video */}
      <Composition
        id="ClaudeCodeIntro"
        component={ClaudeCodeIntro}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Showcase compositions */}
      <Folder name="Showcase">
        {/* 1. Animated Data Dashboard - 12 seconds */}
        <Composition
          id="DataDashboard"
          component={DataDashboard}
          durationInFrames={360}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* 2. Kinetic Typography - 14 seconds */}
        <Composition
          id="KineticTypography"
          component={KineticTypography}
          durationInFrames={420}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* 3. Product Feature Showcase - 15 seconds */}
        <Composition
          id="ProductShowcase"
          component={ProductShowcase}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* 4. Countdown Timer - 7 seconds */}
        <Composition
          id="CountdownTimer"
          component={CountdownTimer}
          durationInFrames={210}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* 5. Code Walkthrough - 16 seconds */}
        <Composition
          id="CodeWalkthrough"
          component={CodeWalkthrough}
          durationInFrames={480}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
