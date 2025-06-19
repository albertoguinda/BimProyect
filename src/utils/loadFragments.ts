import * as FRAGS from "@thatopen/fragments";
import { IFCPanel } from "../components/bimComponents/IFCPanel";
import { IfcSelector } from "../lib/IfcSelector";
import { ToolsPanel } from "../components/bimComponents/ToolsPanel";
import { TresCantosPanel } from "../components/bimComponents/TresCantosPanel";
import * as OBC from "@thatopen/components";

export let model: FRAGS.FragmentsModel | undefined = undefined;
export let selector : IfcSelector | null = null


export async function loadFragments(fragmentBytes : any, world: any, serializer : FRAGS.IfcImporter, fragments: FRAGS.FragmentsModels,
  viewpoints : any,
  savedViewpoints : any, components: OBC.Components) {
  world.camera.controls.addEventListener("rest", () => fragments?.update(true));
  world.camera.controls.addEventListener("update", () => fragments?.update());

  const buffer = await fragmentBytes.arrayBuffer();
  const model = await fragments.load(buffer, { modelId: "example" });
  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);
  await fragments.update(true);
  //const tree = await model.getSpatialStructure()
  selector = new IfcSelector(model!, world, fragments);
  
  selector.onItemSelected = async () => {
    const attrs = await selector?.getAttributes(["Name", "GlobalId"]);
    console.log("Atributos del seleccionado:", attrs);
  };
  
  // await selector.setCategoryVisibility("IFCDOOR", false); // ocultar
  // await selector.setCategoryVisibility("IFCROOF", true);  // mostrar

  const categories = await model.getCategories();
  const categoriesArray = categories.map((category) => category);

//    const items = await model.getItemsOfCategory('IFCPROPERTYSET');
//   const localIds = (
//     await Promise.all(items.map((item) => item.getLocalId()))
//   ).filter((localId) => localId !== null) as number[];

//   const data = await model.getItemsData(localIds, {
//     attributesDefault: false,
//     attributes: ["Name"],
//   });

// const names = data
//   .map((d) => {
//     const { Name } = d;
//     if (!(Name && !Array.isArray(Name))) return null;
//     return Name.value;
//   })
//   .filter((name): name is string => Boolean(name)); // Filtramos null/undefined


// console.log(items);


  const id = null
  document.querySelector<HTMLDivElement>("#panel")!.innerHTML = ``
  //const panel = await IFCPanel(world, serializer, fragments, categoriesArray, selector, fragmentBytes, model, viewpoints, savedViewpoints, id);
  const panel = await TresCantosPanel(world, serializer, fragments, categoriesArray, selector, fragmentBytes, model, components, viewpoints, savedViewpoints, id);
  document.querySelector<HTMLDivElement>("#panel")!.appendChild(panel);

  document.querySelector<HTMLDivElement>("#categoriesPanel")!.innerHTML = ``
  const categoriesPanel = await ToolsPanel(world, serializer, fragments, categoriesArray, selector, fragmentBytes)
  document.querySelector<HTMLDivElement>("#categoriesPanel")!.appendChild(categoriesPanel);


}
