export interface Technology {
  id: number;
  name: string;
  quadrant: 'Techniques' | 'Platforms' | 'Tools' | 'Languages & Frameworks';
  ring: 'Adopt' | 'Trial' | 'Assess' | 'Hold';
  description: string;
  isNew: boolean;
  moved: -1 | 0 | 1; // -1: moved out, 0: no change, 1: moved in
}

export interface RadarConfig {
  width: number;
  height: number;
  rings: string[];
  quadrants: string[];
  colors: {
    background: string;
    grid: string;
    inactive: string;
    rings: string[];
    quadrants: string[];
  };
}