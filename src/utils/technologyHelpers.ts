import { Technology } from '../types';

export const generateTechnologyId = (technologies: Technology[]): number => {
  return Math.max(...technologies.map(t => t.id), 0) + 1;
};

export const addTechnology = (
  technologies: Technology[],
  newTech: Omit<Technology, 'id'>
): Technology[] => {
  const technology: Technology = {
    ...newTech,
    id: generateTechnologyId(technologies)
  };
  
  return [...technologies, technology];
};

export const updateTechnology = (
  technologies: Technology[],
  updatedTech: Technology
): Technology[] => {
  return technologies.map(tech => 
    tech.id === updatedTech.id ? updatedTech : tech
  );
};

export const deleteTechnology = (
  technologies: Technology[],
  techId: number
): Technology[] => {
  return technologies.filter(tech => tech.id !== techId);
};

export const exportTechnologies = (technologies: Technology[]): string => {
  return JSON.stringify({ technologies }, null, 2);
};

export const importTechnologies = (jsonString: string): Technology[] => {
  try {
    const data = JSON.parse(jsonString);
    return data.technologies || [];
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};