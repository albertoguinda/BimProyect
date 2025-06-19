import * as FRAGS from "@thatopen/fragments";
import { IFCPanel } from "../components/bimComponents/IFCPanel";
import { IfcSelector } from "../lib/IfcSelector";
import { ToolsPanel } from "../components/bimComponents/ToolsPanel";
import * as THREE from "three";
import { fetchLastSensorData } from "../services/influxService";
export let model: FRAGS.FragmentsModel | undefined = undefined;
export let selector : IfcSelector | null = null


// 1) Nosotros sabemos que model.getItemsData devuelve Promise<FRAGS.ItemData[]>
export async function getAttributes(model: FRAGS.FragmentsModel, attributes?: string[], localId?: number): Promise<FRAGS.ItemData | null> {
  if (localId == null) return null;

  // Obtenemos el array completo
  const result = await model.getItemsData([localId], {
    attributesDefault: !attributes,
    attributes,
  });
  // Devolvemos el primer elemento del array (o null si no hay)
  return result.length > 0 ? result[0] : null;
}



export async function loadIFCFromBytes(
    fragmentBytes: Uint8Array,
    world: any,
    serializer: FRAGS.IfcImporter,
    fragments: FRAGS.FragmentsModels,
    id : number,
    viewpoints : any,
    savedViewpoints : any
  ) {
    world.camera.controls.addEventListener("rest", () => fragments?.update(true));
    world.camera.controls.addEventListener("update", () => fragments?.update());
  
    const model = await fragments.load(fragmentBytes, { modelId: "id" });
    model.useCamera(world.camera.three);
    world.scene.three.add(model.object);
    await fragments.update(true);
  
    selector = new IfcSelector(model, world, fragments);
    
    selector.onItemSelected = async () => {
      const attrs = await selector?.getAttributes(["Name", "GlobalId"]);
      console.log("Atributos del seleccionado:", attrs);
    };


    const categories = await model.getCategories();
    const categoriesArray = categories.map((category) => category);
  
    document.querySelector<HTMLDivElement>("#panel")!.innerHTML = ``;
    const panel = await IFCPanel(world, serializer, fragments, categoriesArray, selector, fragmentBytes, model, viewpoints, savedViewpoints, id);
    document.querySelector<HTMLDivElement>("#panel")!.appendChild(panel);

    document.querySelector<HTMLDivElement>("#categoriesPanel")!.innerHTML = ``
    const categoriesPanel = await ToolsPanel(world, serializer, fragments, categoriesArray, selector, fragmentBytes, id)
    document.querySelector<HTMLDivElement>("#categoriesPanel")!.appendChild(categoriesPanel);    
  }
