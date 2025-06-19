import * as BUI from "@thatopen/ui";
import { SectionHeader } from "./SectionHeader";
import { getProjects } from "../../utils/projectsStorage";

export const ProjectName = (id?:number) => {
const existingProjects = getProjects(); // Obtenemos los proyectos guardados
const project = existingProjects.find((p: {id : number })  => p.id === id)
const title = project.title
console.log(project)
  return BUI.html`
      ${SectionHeader(title)}
    `;
};
