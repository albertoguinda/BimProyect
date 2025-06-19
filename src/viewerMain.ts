import "./style.css";
import { getProjects } from "./utils/projectsStorage";
import { bimView } from "./views/bimView";
const existingProjects = getProjects(); // Obtenemos los proyectos guardados
const lastProject = existingProjects[existingProjects.length - 1]; // por ejemplo
console.log('Ultimo id desde viewMian')
console.log(lastProject.id)
bimView(lastProject.id);