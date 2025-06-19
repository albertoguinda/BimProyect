import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import { ProjectName } from "./ProjectName";
import * as FRAGS from "@thatopen/fragments";
import { Attributes } from "./Attributes";
import { DownloadFragmentsButton } from "./DownloadFragments";
import NPCLoad from "./NPC";
import Viewpoints from "./Viewpoints";
import { IOTtools } from "./IOTtools";
import { Structure } from "./Structure";
import { getAttributes } from "../../utils/loadIFCFromBytes";
import { PointCloud } from "./PointCloud";
import { PropertyValue } from "./PropertyValue";

type NameEntry = {
  localId: number;
  name: string;
};

// Función recursiva para extraer todos los localId
function extractLocalIds(node : any, result = []) {
  if (node.localId !== null && node.localId !== undefined) {
    // @ts-ignore
    result.push(node.localId);
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      extractLocalIds(child, result);
    }
  }

  return result;
}



export const TresCantosPanel = async (
  world: any, serializer : FRAGS.IfcImporter, fragments: FRAGS.FragmentsModels, categories :any, selector:any, fragmentBytes : any, model: FRAGS.FragmentsModel, components: OBC.Components, viewpoints? : any, savedViewpoints? : any, id? : any
) => {
  
  const tree = await model.getSpatialStructure();
  // console.log(tree)
  const allLocalIds = extractLocalIds(tree);

  // console.log("Todos los localId encontrados:", allLocalIds);
  const names: NameEntry[] = []; 
  for (const id of allLocalIds) {
    try {
      const attrs = await getAttributes(model, ["Name"], id);
      // @ts-ignore
      const name = attrs?.["Name"]?.value || "Sin nombre";
      // console.log(name);W
      
      names.push({
        localId: id,
        name: name
      });
    } catch (error) {
      console.error("Error obteniendo atributos para ID:", id, error);
    }
  }

  const pointCloudSection = await PointCloud(selector, world, fragments, model);
  

  return BUI.Component.create(() => {
    return BUI.html`
      <div id="panelBIM" class="absolute top-0 left-0 hidden sm:flex w-3/12 md:w-3/12 h-full bg-gray-900 backdrop-blur-md p-4 shadow-lg z-10 flex-col space-y-4 overflow-y-auto max-h-screen 
      scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-900 my-panel">
      <h1 class="text-xl font-semibold text-white select-none">ViviendaTresCantos</h2>
      ${id ? ProjectName(id) : console.log('No es un proyecto con nombre')}    
      ${NPCLoad(world)}
      ${Viewpoints(world, viewpoints, savedViewpoints, components)}
      ${Attributes(selector)}
      ${PropertyValue(model, fragments)}
      ${Structure(model,fragments, tree, names)}
      ${IOTtools(model, fragments)}
      ${pointCloudSection}
      ${DownloadFragmentsButton(fragmentBytes)}
      </div>
    `;
  });
};
