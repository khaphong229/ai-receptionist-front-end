"use client";

import { useEffect, useRef } from "react";
import Snowfall from "react-snowfall";

const VoiceWaveAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set fixed dimensions for the canvas
    canvas.width = 300;
    canvas.height = 150;

    const bars = 9; // Number of bars to match the image
    const barWidth = 12;
    const barRadius = 6; // Radius for rounded ends
    const gap = (canvas.width - bars * barWidth) / (bars + 1);

    let animationFrameId: number;

    const drawRoundedBar = (x: number, height: number) => {
      const y = (canvas.height - height) / 2;

      ctx.beginPath();
      // Draw the main rectangle
      ctx.roundRect(x, y, barWidth, height, barRadius);
      ctx.fill();
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";

      for (let i = 0; i < bars; i++) {
        // Create a wave effect with different phases for each bar
        const height =
          40 + // Base height
          Math.sin(time * 0.003 + i * 0.5) * // Wave motion
            30; // Amplitude

        const x = gap + i * (barWidth + gap);
        drawRoundedBar(x, height);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full">
      <div className="bg-background rounded-xl p-8 shadow-2xl">
        <canvas ref={canvasRef} className="w-[300px] h-[150px]" />
      </div>
    </div>
  );
};

export default VoiceWaveAnimation;
