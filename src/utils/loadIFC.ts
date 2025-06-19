import * as FRAGS from "@thatopen/fragments";
import { IFCPanel } from "../components/bimComponents/IFCPanel";
import { IfcSelector } from "../lib/IfcSelector";
import { ToolsPanel } from "../components/bimComponents/ToolsPanel";


export let model: FRAGS.FragmentsModel | undefined = undefined;
export let selector : IfcSelector | null = null


export async function loadIFC(file: File, world: any, serializer : FRAGS.IfcImporter, fragments: FRAGS.FragmentsModels, viewpoints? : any, savedViewpoints? : any) {
  const loader = document.getElementById("loader");
  loader?.classList.remove("hidden");


  try {
    const fileBuffer = await file.arrayBuffer();
    const ifcBytes = new Uint8Array(fileBuffer);
    const fragmentBytes = await serializer.process({ bytes: ifcBytes })

    world.camera.controls.addEventListener("rest", () => fragments?.update(true));
    world.camera.controls.addEventListener("update", () => fragments?.update());

    model = await fragments.load(fragmentBytes, { modelId: "id" });
    model.useCamera(world.camera.three);
    world.scene.three.add(model.object);
    await fragments.update(true);

    selector = new IfcSelector(model!, world, fragments);

    selector.onItemSelected = async () => {
      const attrs = await selector?.getAttributes(["Name", "GlobalId"]);
      console.log("Atributos del seleccionado:", attrs);
    };

    const categories = await model.getCategories();
    const categoriesArray = categories.map((category) => category);

    document.querySelector<HTMLDivElement>("#panel")!.innerHTML = ``;
    const panel = await IFCPanel(world, serializer, fragments, categoriesArray, selector, fragmentBytes, model, viewpoints, savedViewpoints, null);
    document.querySelector<HTMLDivElement>("#panel")!.appendChild(panel);

    document.querySelector<HTMLDivElement>("#categoriesPanel")!.innerHTML = ``;
    const categoriesPanel = await ToolsPanel(world, serializer, fragments, categoriesArray, selector, fragmentBytes);
    document.querySelector<HTMLDivElement>("#categoriesPanel")!.appendChild(categoriesPanel);
  } 
   finally {
    loader?.classList.add("hidden");
  }
}