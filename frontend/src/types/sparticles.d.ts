declare module 'sparticles' {
  export interface SparticlesOptions {
    composition?: string;
    count?: number;
    speed?: number;
    parallax?: number;
    direction?: number;
    xVariance?: number;
    yVariance?: number;
    rotate?: boolean;
    rotation?: number;
    alphaSpeed?: number;
    alphaVariance?: number;
    minAlpha?: number;
    maxAlpha?: number;
    minSize?: number;
    maxSize?: number;
    bounce?: boolean;
    drift?: number;
    glow?: number;
    twinkle?: boolean;
    style?: 'fill' | 'stroke' | 'both';
    shape?: string | string[];
    color?: string | string[];
    randomColor?: (index: number, total: number) => string;
    randomColorCount?: number;
    spawnFromCenter?: boolean;
    spawnArea?: number;
    staggerSpawn?: number;
    imageUrl?: string | string[];
  }

  export default class Sparticles {
    constructor(
      node?: HTMLElement,
      options?: SparticlesOptions,
      width?: number,
      height?: number
    );
    
    destroy(): void;
    setCanvasSize(width: number, height: number): void;
    resetSparticles(): void;
  }
}
