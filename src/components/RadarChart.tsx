import React, { useRef, useEffect, useState } from 'react';
import { Technology } from '../types';

interface RadarChartProps {
  technologies: Technology[];
  selectedTechnology: Technology | null;
  onTechnologySelect: (technology: Technology | null) => void;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  technologies, 
  selectedTechnology, 
  onTechnologySelect 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredTech, setHoveredTech] = useState<Technology | null>(null);
  
  const config = {
    width: 700,
    height: 700,
    center: { x: 350, y: 350 },
    radiusStep: 70,
    rings: ['Adopt', 'Trial', 'Assess', 'Hold'],
    quadrants: ['Techniques', 'Platforms', 'Tools', 'Languages & Frameworks'],
    colors: {
      rings: ['#10b981', '#f59e0b', '#f97316', '#ef4444'],
      quadrants: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
      grid: '#e2e8f0',
      text: '#475569',
      background: '#fefefe'
    }
  };

  const getQuadrantAngle = (quadrant: string) => {
    const index = config.quadrants.indexOf(quadrant);
    return (index * 90) - 45; // Start from top-right, go clockwise
  };

  const getRingRadius = (ring: string) => {
    const index = config.rings.indexOf(ring);
    return (index + 1) * config.radiusStep;
  };

  const getRandomPosition = (quadrant: string, ring: string) => {
    const angle = getQuadrantAngle(quadrant);
    const radius = getRingRadius(ring);
    const innerRadius = ring === 'Adopt' ? 20 : getRingRadius(config.rings[config.rings.indexOf(ring) - 1]);
    
    // Add some randomness within the ring and quadrant
    const randomRadius = innerRadius + (radius - innerRadius) * (0.25 + Math.random() * 0.5);
    const randomAngle = angle + (Math.random() - 0.5) * 75; // ±37.5 degrees variation
    
    const x = config.center.x + randomRadius * Math.cos((randomAngle * Math.PI) / 180);
    const y = config.center.y + randomRadius * Math.sin((randomAngle * Math.PI) / 180);
    
    return { x, y };
  };

  // Memoize positions to prevent re-rendering
  const [techPositions] = useState(() => {
    const positions = new Map();
    technologies.forEach(tech => {
      positions.set(tech.id, getRandomPosition(tech.quadrant, tech.ring));
    });
    return positions;
  });

  const renderGrid = () => {
    const elements = [];
    
    // Background circle
    elements.push(
      <circle
        key="background"
        cx={config.center.x}
        cy={config.center.y}
        r={config.radiusStep * 4}
        fill={config.colors.background}
        stroke={config.colors.grid}
        strokeWidth="2"
      />
    );
    
    // Concentric circles for rings
    config.rings.forEach((ring, index) => {
      const radius = (index + 1) * config.radiusStep;
      elements.push(
        <circle
          key={`ring-${index}`}
          cx={config.center.x}
          cy={config.center.y}
          r={radius}
          fill="none"
          stroke={config.colors.grid}
          strokeWidth="1.5"
          opacity="0.7"
        />
      );
    });

    // Quadrant lines
    for (let i = 0; i < 4; i++) {
      const angle = i * 90 - 45;
      const x2 = config.center.x + config.radiusStep * 4 * Math.cos((angle * Math.PI) / 180);
      const y2 = config.center.y + config.radiusStep * 4 * Math.sin((angle * Math.PI) / 180);
      
      elements.push(
        <line
          key={`quadrant-line-${i}`}
          x1={config.center.x}
          y1={config.center.y}
          x2={x2}
          y2={y2}
          stroke={config.colors.grid}
          strokeWidth="1.5"
          opacity="0.7"
        />
      );
    }

    return elements;
  };

  const renderLabels = () => {
    const elements = [];
    
    // Ring labels - positioned better with background
    config.rings.forEach((ring, index) => {
      const radius = (index + 1) * config.radiusStep;
      const x = config.center.x + 15;
      const y = config.center.y - radius + 8;
      
      elements.push(
        <g key={`ring-label-${index}`}>
          <rect
            x={x - 5}
            y={y - 12}
            width={ring.length * 7 + 10}
            height={18}
            fill="white"
            stroke={config.colors.rings[index]}
            strokeWidth="1"
            rx="3"
            opacity="0.95"
          />
          <text
            x={x}
            y={y}
            fill={config.colors.rings[index]}
            fontSize="13"
            fontWeight="700"
            className="pointer-events-none"
          >
            {ring}
          </text>
        </g>
      );
    });

    // Quadrant labels - better positioning and styling
    const quadrantPositions = [
      { angle: -45, x: 0.85, y: 0.85 }, // Techniques (top-right)
      { angle: 45, x: 0.85, y: 1.15 },  // Platforms (bottom-right)
      { angle: 135, x: 1.15, y: 1.15 }, // Tools (bottom-left)
      { angle: 225, x: 1.15, y: 0.85 }  // Languages & Frameworks (top-left)
    ];

    config.quadrants.forEach((quadrant, index) => {
      const pos = quadrantPositions[index];
      const labelRadius = config.radiusStep * 4.2;
      const x = config.center.x + labelRadius * Math.cos((pos.angle * Math.PI) / 180);
      const y = config.center.y + labelRadius * Math.sin((pos.angle * Math.PI) / 180);
      
      // Split long quadrant names into multiple lines
      const words = quadrant.split(' ');
      const lines = words.length > 2 ? [words.slice(0, 2).join(' '), words.slice(2).join(' ')] : [quadrant];
      
      elements.push(
        <g key={`quadrant-label-${index}`}>
          <rect
            x={x - 60}
            y={y - (lines.length * 8) - 5}
            width="120"
            height={lines.length * 16 + 10}
            fill="white"
            stroke={config.colors.quadrants[index]}
            strokeWidth="2"
            rx="8"
            opacity="0.95"
          />
          {lines.map((line, lineIndex) => (
            <text
              key={lineIndex}
              x={x}
              y={y - (lines.length - 1 - lineIndex) * 14}
              fill={config.colors.quadrants[index]}
              fontSize="14"
              fontWeight="800"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none"
            >
              {line}
            </text>
          ))}
        </g>
      );
    });

    return elements;
  };

  const renderTechnologies = () => {
    return technologies.map((tech) => {
      const position = techPositions.get(tech.id) || getRandomPosition(tech.quadrant, tech.ring);
      const quadrantIndex = config.quadrants.indexOf(tech.quadrant);
      const ringIndex = config.rings.indexOf(tech.ring);
      const isSelected = selectedTechnology?.id === tech.id;
      const isHovered = hoveredTech?.id === tech.id;
      
      return (
        <g key={tech.id}>
          {/* Technology dot with enhanced styling */}
          <circle
            cx={position.x}
            cy={position.y}
            r={isSelected || isHovered ? 10 : 7}
            fill={config.colors.quadrants[quadrantIndex]}
            stroke="white"
            strokeWidth="3"
            opacity={isSelected || isHovered ? 1 : 0.85}
            className="cursor-pointer transition-all duration-300 hover:opacity-100 drop-shadow-sm"
            onClick={() => onTechnologySelect(tech)}
            onMouseEnter={() => setHoveredTech(tech)}
            onMouseLeave={() => setHoveredTech(null)}
            style={{
              filter: isSelected || isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
          
          {/* New technology indicator */}
          {tech.isNew && (
            <circle
              cx={position.x + 10}
              cy={position.y - 10}
              r="5"
              fill="#ef4444"
              stroke="white"
              strokeWidth="2"
              className="pointer-events-none drop-shadow-sm"
            />
          )}
          
          {/* Movement indicator */}
          {tech.moved !== 0 && (
            <polygon
              points={`${position.x + 12},${position.y - 8} ${position.x + 12},${position.y + 8} ${position.x + 20},${position.y}`}
              fill={tech.moved > 0 ? '#10b981' : '#ef4444'}
              stroke="white"
              strokeWidth="1"
              className="pointer-events-none drop-shadow-sm"
            />
          )}
          
          {/* Technology name label */}
          {(isSelected || isHovered) && (
            <g>
              <rect
                x={position.x - tech.name.length * 4}
                y={position.y - 25}
                width={tech.name.length * 8}
                height={18}
                fill="white"
                stroke={config.colors.quadrants[quadrantIndex]}
                strokeWidth="1"
                rx="4"
                opacity="0.95"
                className="pointer-events-none drop-shadow-md"
              />
              <text
                x={position.x}
                y={position.y - 15}
                fill={config.colors.quadrants[quadrantIndex]}
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                className="pointer-events-none"
              >
                {tech.name}
              </text>
            </g>
          )}
        </g>
      );
    });
  };

  return (
    <div className="w-full flex justify-center bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4">
      <svg
        ref={svgRef}
        width={config.width}
        height={config.height}
        viewBox={`0 0 ${config.width} ${config.height}`}
        className="max-w-full h-auto drop-shadow-lg"
        style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        {renderGrid()}
        {renderLabels()}
        {renderTechnologies()}
      </svg>
    </div>
  );
};

export default RadarChart;