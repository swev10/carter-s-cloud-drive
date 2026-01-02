import { useEffect, useRef } from 'react';

const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animationRef = useRef<number>();

  // New York coordinates (40.7128° N, 74.0060° W)
  const NYC_LAT = 40.7128;
  const NYC_LON = -74.006;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 80;

    const latLonToPoint = (lat: number, lon: number, rotation: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + rotation) * (Math.PI / 180);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      return {
        x: centerX + x,
        y: centerY - y,
        z: z,
        visible: z > 0,
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // Globe background with gradient
      const gradient = ctx.createRadialGradient(
        centerX - 20,
        centerY - 20,
        0,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, 'hsl(280, 25%, 20%)');
      gradient.addColorStop(1, 'hsl(280, 20%, 10%)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Globe border with glow
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'hsl(280, 85%, 60%)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw latitude lines
      ctx.strokeStyle = 'hsl(280, 40%, 30%)';
      ctx.lineWidth = 0.5;

      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 5) {
          const point = latLonToPoint(lat, lon, rotationRef.current);
          if (point.visible) {
            if (!started) {
              ctx.moveTo(point.x, point.y);
              started = true;
            } else {
              ctx.lineTo(point.x, point.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Draw longitude lines
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 5) {
          const point = latLonToPoint(lat, lon, rotationRef.current);
          if (point.visible) {
            if (!started) {
              ctx.moveTo(point.x, point.y);
              started = true;
            } else {
              ctx.lineTo(point.x, point.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Draw NYC marker
      const nyc = latLonToPoint(NYC_LAT, NYC_LON, rotationRef.current);
      if (nyc.visible) {
        // Glow effect
        const glowGradient = ctx.createRadialGradient(
          nyc.x,
          nyc.y,
          0,
          nyc.x,
          nyc.y,
          20
        );
        glowGradient.addColorStop(0, 'hsl(320, 80%, 60%)');
        glowGradient.addColorStop(0.3, 'hsl(320, 80%, 50% / 0.5)');
        glowGradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(nyc.x, nyc.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Main dot
        ctx.beginPath();
        ctx.arc(nyc.x, nyc.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(320, 80%, 60%)';
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(nyc.x - 1, nyc.y - 1, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(320, 80%, 80%)';
        ctx.fill();
      }

      // Rotate slowly
      rotationRef.current += 0.2;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="drop-shadow-lg"
        style={{ filter: 'drop-shadow(0 0 20px hsl(280, 85%, 60% / 0.3))' }}
      />
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span>New York, USA</span>
      </div>
    </div>
  );
};

export default Globe;
