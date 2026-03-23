import { useEffect, useRef } from 'react';
import Sparticles from 'sparticles';

interface ParticleBackgroundProps {
  theme?: 'light' | 'dark';
}

export function ParticleBackground({ theme = 'light' }: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparticlesRef = useRef<Sparticles | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Colores que combinan con el tema de la app
    const lightColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#f97316'];
    const darkColors = ['#60a5fa', '#a78bfa', '#22d3ee', '#fbbf24', '#f472b6', '#34d399', '#fb923c'];
    
    const colors = theme === 'dark' ? darkColors : lightColors;

    // Configuración de partículas con efecto de viento
    const options = {
      // Más partículas distribuidas por toda la pantalla
      count: 200,
      // Velocidad aumentada para efecto de viento
      speed: 2.5,
      parallax: 15,
      // Dirección del viento: 0 = derecha, 180 = izquierda
      direction: 15, // Ligero ángulo hacia abajo-derecha
      // Alta varianza para movimiento orgánico de viento
      xVariance: 8,
      yVariance: 4,
      rotate: true,
      rotation: 1,
      alphaSpeed: 5,
      alphaVariance: 3,
      minAlpha: 0.2,
      maxAlpha: 0.8,
      minSize: 2,
      maxSize: 12,
      bounce: false,
      // Drift alto para movimiento de viento
      drift: 5,
      glow: 10,
      twinkle: true,
      style: 'fill' as const,
      shape: ['circle', 'diamond', 'star', 'square'] as const,
      color: colors,
      // Desactivar spawn desde el centro - ahora desde todos lados
      spawnFromCenter: false,
      // Área de spawn grande para cubrir toda la pantalla
      spawnArea: 150,
      staggerSpawn: 1,
    };

    sparticlesRef.current = new Sparticles(containerRef.current, options);

    // Animación adicional de viento usando transform CSS
    let windOffset = 0;
    const animateWind = () => {
      windOffset += 0.02;
      if (containerRef.current) {
        // Efecto de oscilación de viento sutil
        const windX = Math.sin(windOffset) * 2;
        const windY = Math.cos(windOffset * 0.7) * 1;
        containerRef.current.style.transform = `translate(${windX}px, ${windY}px)`;
      }
      animationRef.current = requestAnimationFrame(animateWind);
    };
    animateWind();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (sparticlesRef.current) {
        sparticlesRef.current.destroy();
        sparticlesRef.current = null;
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        // Expande el área para que las partículas entren desde fuera de la pantalla
        width: '120%',
        height: '120%',
        left: '-10%',
        top: '-10%',
      }}
    />
  );
}

export default ParticleBackground;
