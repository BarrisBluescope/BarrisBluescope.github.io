import React, { useState, useMemo } from 'react';
import { Technology } from '../types';
import RadarChart from './RadarChart';
import TechnologyList from './TechnologyList';
import TechnologyManager from './TechnologyManager';
import SearchBar from './SearchBar';
import { Settings, Radar } from 'lucide-react';

interface TechnologyRadarProps {
  technologies: Technology[];
}

const TechnologyRadar: React.FC<TechnologyRadarProps> = ({ technologies: initialTechnologies }) => {
  const [technologies, setTechnologies] = useState<Technology[]>(initialTechnologies);
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('All');
  const [selectedRing, setSelectedRing] = useState<string>('All');
  const [currentView, setCurrentView] = useState<'radar' | 'manage'>('radar');

  const quadrants = ['All', 'Techniques', 'Platforms', 'Tools', 'Languages & Frameworks'];
  const rings = ['All', 'Adopt', 'Trial', 'Assess', 'Hold'];

  const filteredTechnologies = useMemo(() => {
    return technologies.filter(tech => {
      const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tech.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesQuadrant = selectedQuadrant === 'All' || tech.quadrant === selectedQuadrant;
      const matchesRing = selectedRing === 'All' || tech.ring === selectedRing;
      
      return matchesSearch && matchesQuadrant && matchesRing;
    });
  }, [technologies, searchTerm, selectedQuadrant, selectedRing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Technology Radar</h1>
              <p className="text-slate-600 mt-1">Track and assess technology adoption across BlueScope ASP</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* View Toggle */}
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('radar')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === 'radar'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Radar className="w-4 h-4" />
                  Radar View
                </button>
                <button
                  onClick={() => setCurrentView('manage')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === 'manage'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Manage
                </button>
              </div>

              {currentView === 'radar' && (
                <>
                  <SearchBar value={searchTerm} onChange={setSearchTerm} />
                  
                  <div className="flex gap-2">
                    <select
                      value={selectedQuadrant}
                      onChange={(e) => setSelectedQuadrant(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {quadrants.map(quadrant => (
                        <option key={quadrant} value={quadrant}>{quadrant}</option>
                      ))}
                    </select>
                    
                    <select
                      value={selectedRing}
                      onChange={(e) => setSelectedRing(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {rings.map(ring => (
                        <option key={ring} value={ring}>{ring}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'radar' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Radar Chart */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <RadarChart 
                  technologies={filteredTechnologies}
                  selectedTechnology={selectedTechnology}
                  onTechnologySelect={setSelectedTechnology}
                />
              </div>
            </div>
            
            {/* Technology List */}
            <div className="xl:col-span-1">
              <TechnologyList 
                technologies={filteredTechnologies}
                selectedTechnology={selectedTechnology}
                onTechnologySelect={setSelectedTechnology}
              />
            </div>
          </div>
        ) : (
          <TechnologyManager 
            technologies={technologies}
            onTechnologiesChange={setTechnologies}
          />
        )}
      </main>
    </div>
  );
};

export default TechnologyRadar;