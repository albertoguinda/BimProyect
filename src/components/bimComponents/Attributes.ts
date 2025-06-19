import * as BUI from "@thatopen/ui";
import { SectionHeader } from "./SectionHeader";

export const Attributes = (selector: any) => {
  console.log(">>> Selector recibido en Attributes:", selector);
  // Este es el elemento que contendrá el contenido
  let attrName: HTMLDivElement | null = null;
  let attrType: HTMLDivElement | null = null;
  let attrCategory: HTMLDivElement | null = null;
  let attrGuid: HTMLDivElement | null = null;
  let attrLocalId: HTMLDivElement | null = null;

  // Función para actualizar los atributos en los elementos
  const updateAttributes = async () => {
    const attrs = await selector?.getAttributes(["Name", "GlobalId"]);
    console.log("Atributos de otro seleccionado:", attrs);
    if (attrName) attrName.textContent = attrs["Name"]["value"];
    if (attrType) attrType.textContent = attrs['Name']['type'];
    if (attrCategory) attrCategory.textContent = attrs["_category"]["value"];
    if (attrGuid) attrGuid.textContent = attrs["_guid"]["value"];
    if (attrLocalId) attrLocalId.textContent = attrs["_localId"]["value"];
    // const names = await selector.getNamesFromCategory("IFCSTAIR", true);
    // console.log("Nombres únicos de IfcWall:", names);

  };

  selector.onItemSelected = async () => {
      attrName = document.querySelector<HTMLDivElement>("#attr-name");
      attrType = document.querySelector<HTMLDivElement>("#attr-type");
      attrCategory = document.querySelector<HTMLDivElement>("#attr-category");
      attrGuid = document.querySelector<HTMLDivElement>("#attr-guid");
      attrLocalId = document.querySelector<HTMLDivElement>("#attr-localid");

      // Llamamos a la función para actualizar los valores
      updateAttributes();
  };

  return BUI.html`
  <section class="bimSection">
    ${SectionHeader("Atributos del elemento seleccionado", true)}
    <div class="bimContent hidden space-y-4">
      <p class="text-sm text-white mb-2">Haz doble click en un elemento para ver sus atributos</p>

      <div class="grid grid-cols-2 gap-2 text-white text-sm">
        <div class="font-semibold">Nombre</div>
        <div id="attr-name">--</div>

        <div class="font-semibold">Type</div>
        <div id="attr-type">--</div>

        <div class="font-semibold">Categoría</div>
        <div id="attr-category" class="break-words">--</div>

        <div class="font-semibold">GUID</div>
        <div id="attr-guid" class="break-words">--</div>

        <div class="font-semibold">Local ID</div>
        <div id="attr-localid">--</div>
      </div>
    </div>
  </section>
`;
};
