import React, { useState } from 'react';
import { Technology } from '../types';
import { Plus, Edit2, Trash2, Save, X, Download, Upload, AlertCircle } from 'lucide-react';
import { addTechnology, updateTechnology, deleteTechnology, exportTechnologies, importTechnologies } from '../utils/technologyHelpers';

interface TechnologyManagerProps {
  technologies: Technology[];
  onTechnologiesChange: (technologies: Technology[]) => void;
}

const TechnologyManager: React.FC<TechnologyManagerProps> = ({
  technologies,
  onTechnologiesChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [importError, setImportError] = useState<string>('');
  const [formData, setFormData] = useState<Omit<Technology, 'id'>>({
    name: '',
    quadrant: 'Tools',
    ring: 'Assess',
    description: '',
    isNew: false,
    moved: 0
  });

  const quadrants: Technology['quadrant'][] = ['Techniques', 'Platforms', 'Tools', 'Languages & Frameworks'];
  const rings: Technology['ring'][] = ['Adopt', 'Trial', 'Assess', 'Hold'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTech) {
      const updatedTech: Technology = { ...formData, id: editingTech.id };
      onTechnologiesChange(updateTechnology(technologies, updatedTech));
    } else {
      onTechnologiesChange(addTechnology(technologies, formData));
    }
    
    resetForm();
  };

  const handleEdit = (tech: Technology) => {
    setEditingTech(tech);
    setFormData({
      name: tech.name,
      quadrant: tech.quadrant,
      ring: tech.ring,
      description: tech.description,
      isNew: tech.isNew,
      moved: tech.moved
    });
    setShowForm(true);
    setIsEditing(true);
  };

  const handleDelete = (techId: number) => {
    if (window.confirm('Are you sure you want to delete this technology?')) {
      onTechnologiesChange(deleteTechnology(technologies, techId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      quadrant: 'Tools',
      ring: 'Assess',
      description: '',
      isNew: false,
      moved: 0
    });
    setEditingTech(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleExport = () => {
    const dataStr = exportTechnologies(technologies);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'technologies.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const importedTechnologies = importTechnologies(jsonString);
        onTechnologiesChange(importedTechnologies);
        setImportError('');
      } catch (error) {
        setImportError('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

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

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Manage Technologies</h2>
            <p className="text-slate-600 mt-1">Add, edit, or remove technologies from your radar</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Technology
            </button>
            
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        {importError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-sm">{importError}</span>
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">
              {isEditing ? 'Edit Technology' : 'Add New Technology'}
            </h3>
            <button
              onClick={resetForm}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Technology Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., React, Docker, GraphQL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quadrant *
                </label>
                <select
                  value={formData.quadrant}
                  onChange={(e) => setFormData({ ...formData, quadrant: e.target.value as Technology['quadrant'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {quadrants.map(quadrant => (
                    <option key={quadrant} value={quadrant}>{quadrant}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ring *
                </label>
                <select
                  value={formData.ring}
                  onChange={(e) => setFormData({ ...formData, ring: e.target.value as Technology['ring'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {rings.map(ring => (
                    <option key={ring} value={ring}>{ring}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Movement
                </label>
                <select
                  value={formData.moved}
                  onChange={(e) => setFormData({ ...formData, moved: parseInt(e.target.value) as Technology['moved'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value={-1}>Moved Out (towards Hold)</option>
                  <option value={0}>No Change</option>
                  <option value={1}>Moved In (towards Adopt)</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Brief description of the technology and its use case..."
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isNew"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isNew" className="ml-2 text-sm text-slate-700">
                Mark as new technology (shows red indicator)
              </label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Technology' : 'Add Technology'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Technologies List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900">
            Current Technologies ({technologies.length})
          </h3>
        </div>
        
        <div className="space-y-3">
          {technologies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <Plus className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-slate-600">No technologies added yet</p>
              <p className="text-sm text-slate-500 mt-1">Click "Add Technology" to get started</p>
            </div>
          ) : (
            technologies.map((tech) => (
              <div
                key={tech.id}
                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900">{tech.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRingColor(tech.ring)}`}>
                        {tech.ring}
                      </span>
                      <span className={`text-sm font-medium ${getQuadrantColor(tech.quadrant)}`}>
                        {tech.quadrant}
                      </span>
                      {tech.isNew && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full border border-red-200">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{tech.description}</p>
                    <div className="text-xs text-slate-500">
                      Movement: {tech.moved === 1 ? 'Moved In' : tech.moved === -1 ? 'Moved Out' : 'No Change'}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(tech)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Edit technology"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tech.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete technology"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnologyManager;