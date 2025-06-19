export interface Project {
  id: number;
  title: string;
  ifcFile?: File;
}

const STORAGE_KEY = "projects";

// Guardar proyectos en localStorage
export const saveProject = (projects: any[]) => {
  localStorage.setItem("projects", JSON.stringify(projects));
};

// Obtener proyectos desde localStorage
export const getProjects = () => {
  const storedProjects = localStorage.getItem("projects");
  return storedProjects ? JSON.parse(storedProjects) : [];
};

export function setProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
