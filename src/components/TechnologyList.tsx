import React from 'react';
import { Technology } from '../types';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';

interface TechnologyListProps {
  technologies: Technology[];
  selectedTechnology: Technology | null;
  onTechnologySelect: (technology: Technology | null) => void;
}

const TechnologyList: React.FC<TechnologyListProps> = ({
  technologies,
  selectedTechnology,
  onTechnologySelect
}) => {
  const getRingColor = (ring: string) => {
    switch (ring) {
      case 'Adopt': return 'bg-green-100 text-green-800 border-green-200';
      case 'Trial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Assess': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Hold': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'Techniques': return 'text-blue-600';
      case 'Platforms': return 'text-purple-600';
      case 'Tools': return 'text-cyan-600';
      case 'Languages & Frameworks': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getMoveIcon = (moved: number) => {
    if (moved > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (moved < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const groupedTechnologies = technologies.reduce((acc, tech) => {
    if (!acc[tech.quadrant]) {
      acc[tech.quadrant] = [];
    }
    acc[tech.quadrant].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Technologies ({technologies.length})
        </h2>
        
        {selectedTechnology && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                {selectedTechnology.name}
                {selectedTechnology.isNew && <Sparkles className="w-4 h-4 text-red-500" />}
                {getMoveIcon(selectedTechnology.moved)}
              </h3>
              <button
                onClick={() => onTechnologySelect(null)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRingColor(selectedTechnology.ring)}`}>
                {selectedTechnology.ring}
              </span>
              <span className={`text-sm font-medium ${getQuadrantColor(selectedTechnology.quadrant)}`}>
                {selectedTechnology.quadrant}
              </span>
            </div>
            <p className="text-sm text-slate-700">{selectedTechnology.description}</p>
          </div>
        )}

        <div className="space-y-4">
          {Object.entries(groupedTechnologies).map(([quadrant, techs]) => (
            <div key={quadrant} className="border border-slate-200 rounded-lg p-4">
              <h3 className={`font-semibold mb-3 ${getQuadrantColor(quadrant)}`}>
                {quadrant} ({techs.length})
              </h3>
              <div className="space-y-2">
                {techs.map((tech) => (
                  <div
                    key={tech.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedTechnology?.id === tech.id
                        ? 'bg-blue-50 border-blue-200 shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                    onClick={() => onTechnologySelect(tech)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{tech.name}</span>
                        {tech.isNew && <Sparkles className="w-4 h-4 text-red-500" />}
                        {getMoveIcon(tech.moved)}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRingColor(tech.ring)}`}>
                        {tech.ring}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Legend</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span className="text-sm text-slate-700">New technology</span>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-slate-700">Moved in (towards Adopt)</span>
          </div>
          <div className="flex items-center gap-3">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-sm text-slate-700">Moved out (towards Hold)</span>
          </div>
          <div className="flex items-center gap-3">
            <Minus className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-slate-700">No change</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyList;