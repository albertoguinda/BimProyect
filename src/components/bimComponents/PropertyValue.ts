import * as BUI from "@thatopen/ui";
import { SectionHeader } from "./SectionHeader";
import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";
/**
 * Toma un array de FRAGS.ItemData (rawPsets) y devuelve un objeto:
 *   { [nombrePset]: { [propiedad]: valor, … }, … }
 */
const formatItemPsets = (
  rawPsets: FRAGS.ItemData[]
): Record<string, Record<string, any>> => {
  const result: Record<string, Record<string, any>> = {};

  for (const pset of rawPsets) {
    const psetName = pset?.Name;
    const hasProperties = pset?.HasProperties;

    if (!psetName || typeof psetName !== "object" || !("value" in psetName))
      continue;
    if (!Array.isArray(hasProperties)) continue;

    const props: Record<string, any> = {};

    for (const prop of hasProperties) {
      const name = prop?.Name;
      const nominalValue = prop?.NominalValue;

      if (
        !name ||
        !nominalValue ||
        typeof name !== "object" ||
        typeof nominalValue !== "object" ||
        !("value" in name) ||
        !("value" in nominalValue)
      ) {
        continue;
      }

      const propName = name.value;
      const value = nominalValue.value;

      if (propName && value !== undefined) {
        props[propName] = value;
      }
    }

    result[psetName.value] = props;
  }

  return result;
};

/**
 * Dado un modelo (FragmentsModel) y un localId, devuelve el objeto formateado
 * de todos los Psets de ese elemento (o null si no hay localId).
 */
const getItemPropertySetsFormatted = async (
  model: FRAGS.FragmentsModel,
  itemId: number
): Promise<Record<string, Record<string, any>> | null> => {
  if (itemId === null || itemId === undefined) return null;

  const [data] = await model.getItemsData([itemId], {
    attributesDefault: false,
    attributes: ["Name", "NominalValue"],
    relations: {
      IsDefinedBy: { attributes: true, relations: true },
      DefinesOcurrence: { attributes: false, relations: false },
    },
  });

  const rawPsets = Array.isArray(data?.IsDefinedBy) ? data.IsDefinedBy : [];
  return formatItemPsets(rawPsets);
};

/**
 * Componente que recibe el modelo (FragmentsModel) por parámetro.
 * Cuando se pulsa el botón, recorre todos los elementos visibles,
 * comprueba su Pset “Pset_IdentificacionNube_Si” > “IdentificacionNube”,
 * y muestra en consola los IDs que cumplan “Identificado”.
 */
export const PropertyValue = (model: FRAGS.FragmentsModel, fragments: FRAGS.FragmentsModels) => {
  
  let visibleIds: number[] = [];
  let identifiedIds: number[] = [];
  let isLoading = false;
  let isColor = false;


  const init = async () => {
    visibleIds = await model.getItemsByVisibility(true);
    const total = visibleIds.length;
    console.log("Visible IDs precargados:", visibleIds);
    const progressEl = document.getElementById("progressProperty");
    for (let i = 0; i < total; i++) {
      const id = visibleIds[i];
      const psets = await getItemPropertySetsFormatted(model, id);
      console.log('Recorriendo')
      if (
        psets &&
        psets["Pset_IdentificacionNube_Si"]?.["IdentificacionNube"] ===
          "Identificado"
      ) {
        identifiedIds.push(id);
      }
      const percent = Math.round(((i + 1) / total) * 100);
      if (progressEl) {
        progressEl.innerText = `${percent}%`;
      }
    }
    isLoading = true;
    const divLoader = document.getElementById("loaderProperty");
    console.log(divLoader)
    const divContent = document.getElementById("contentProperty");

    if (isLoading) {
      isLoading = false;
      divContent?.classList.remove("hidden");
      divLoader?.classList.add("hidden");
    }
    
  };

  init();
  const checkAllItemsAndHighlight = async () => {
    console.log("IDs con Pset_IdentificacionNube_Si > IdentificacionNube = 'Identificado':", identifiedIds);

    const dynamicMaterial: FRAGS.MaterialDefinition = {
      color: new THREE.Color("green"),
      renderedFaces: FRAGS.RenderedFaces.TWO,
      opacity: 0.6,
      transparent: true,
    };

    const identifiedButton = document.getElementById("identificacionNube");

    if(!isColor) {
      await model.highlight(identifiedIds, dynamicMaterial);
      await fragments.update(true);
      isColor = true
      if (identifiedButton) identifiedButton.textContent = 'Quitar Filtro'
      return;
    }

    if(isColor) {
      await model.resetHighlight(identifiedIds);
      await fragments.update(true);
      isColor = false;
      if (identifiedButton) identifiedButton.textContent = 'Identificación Nube'
    }    
  };

  return BUI.html`
    <section class="bimSection">
      ${SectionHeader("Visualizar elementos identificados", true)}
      <div class="bimContent hidden">
      <div id="loaderProperty" class="inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-60 text-white text-sm">
        <img src="/Spinner@1x-1.0s-200px-200px.gif" alt="Cargando..." class="w-12 h-12 mb-4" />
        <span class="text-xs">Identificando elementos</span>
        <span id="progressProperty" class="mt-2 text-xs">0%</span>
        </div>
      <div id="contentProperty" class="hidden">
        <p class="text-sm text-white mb-4">
          Pulsa el botón para recorrer todos los elementos visibles y mostrar los que tienen “Pset_IdentificacionNube_Si > IdentificacionNube = 'Identificado'”.
        </p>
        <button
          id="identificacionNube"
          class="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600 transition text-xs"
          @click=${checkAllItemsAndHighlight}
        >
          Identificación Nube
        </button>
      </div>
      </div>
    </section>
  `;
};
