import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";

export class IfcSelector {
  private localId: number | null = null;
  private hoveredId: number | null = null;
  private highlightMaterial: FRAGS.MaterialDefinition;
  private highlightMaterialHover: FRAGS.MaterialDefinition;
  private model: FRAGS.FragmentsModel;
  private world: any;
  private fragments: FRAGS.FragmentsModels;

  constructor(
    model: FRAGS.FragmentsModel,
    world: any,
    fragments: FRAGS.FragmentsModels
  ) {
    this.model = model;
    this.world = world;
    this.fragments = fragments;

    this.highlightMaterial = {
      color: new THREE.Color("skyblue"),
      renderedFaces: FRAGS.RenderedFaces.TWO,
      opacity: 0.6,
      transparent: true,
    };

    this.highlightMaterialHover = {
      color: new THREE.Color("skyblue"),
      renderedFaces: FRAGS.RenderedFaces.TWO,
      opacity: 1,
      transparent: true,
    };

    this.init();
  }

  private init() {
    const container = document.getElementById("container")!;
    const mouse = new THREE.Vector2();

    container.addEventListener("dblclick", async (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      const result = await this.model.raycast({
        camera: this.world.camera.three,
        mouse,
        dom: this.world.renderer!.three.domElement!,
      });

      if (result) {
        // console.log("Clicked object position:", result);
        // this.world.camera.controls.setPosition(
        // result.point.x - 1, result.point.y + 3 , result.point.z - 1, true)
        // result.fragments.object.visible = false
        // console.log(result.fragments.object)
        await this.resetHighlight();
        this.localId = result.localId;
        this.onItemSelected?.();
        await this.highlight();
        const props = await this.getItemPropertySetsFormatted();
        // const visibleIds = await this.model.getItemsByVisibility(true);
        // console.log(visibleIds)
        console.log("Propiedades:", props);

        if (props && props["Pset_IdentificacionNube_Si"]?.["IdentificacionNube"] === "Identificado") {
          console.log("Este elemento está identificado ✅");
          // Aquí podrías aplicar un color diferente, como verde
        }

      } else {
        await this.resetHighlight();
        this.localId = null;
        this.onItemDeselected?.();
      }

      await this.fragments.update(true);
    });

    // container.addEventListener("mousemove", async (event: MouseEvent) => {
    //   const panel = document.querySelector('.my-panel');
      
    //   // Si el mouse está sobre el panel, limpiar el highlight si hay algo seleccionado
    //   if (panel && panel.contains(event.target as Node)) {
    //     if (this.hoveredId !== null) {
    //       await this.resetHighlightHover();
    //       this.hoveredId = null;
    //       await this.fragments.update(true);
    //     }
    //     return;
    //   }
    
    //   mouse.x = event.clientX;
    //   mouse.y = event.clientY;
    
    //   const result = await this.model.raycast({
    //     camera: this.world.camera.three,
    //     mouse,
    //     dom: this.world.renderer!.three.domElement!,
    //   });
    
    //   if (result && result.localId !== this.localId && result.localId !== this.hoveredId) {
    //     await this.resetHighlightHover();
    //     this.hoveredId = result.localId;
    //     await this.highlightHover();
    //   }
    
    //   if (!result && this.hoveredId !== null) {
    //     await this.resetHighlightHover();
    //     this.hoveredId = null;
    //   }
    
    //   await this.fragments.update(true);
    // });
    
  }


  private async highlightHover() {
    if (this.hoveredId !== null && this.hoveredId !== this.localId) {
      await this.model.highlight([this.hoveredId], this.highlightMaterialHover);
    }
  }
  
  private async resetHighlightHover() {
    if (this.hoveredId !== null && this.hoveredId !== this.localId) {
      await this.model.resetHighlight([this.hoveredId]);
    }
  }

  private async highlight() {
    if (this.localId !== null) {
      await this.model.highlight([this.localId], this.highlightMaterial);
    }
  }

  private async resetHighlight() {
    if (this.localId !== null) {
      await this.model.resetHighlight([this.localId]);
    }
  }

  // Método para acceder a los atributos de un elemento
  async getAttributes(attributes?: string[]) {
    if (this.localId === null) return null;
    const [data] = await this.model.getItemsData([this.localId], {
      attributesDefault: !attributes,
      attributes,
    });
    return data;
  }

  async getItemPropertySetsFormatted() {
    if (this.localId === null) return null;

    const [data] = await this.model.getItemsData([this.localId], {
      attributesDefault: false,
      attributes: ["Name", "NominalValue"],
      relations: {
        IsDefinedBy: { attributes: true, relations: true },
        DefinesOcurrence: { attributes: false, relations: false },
      },
    });

    const rawPsets = Array.isArray(data?.IsDefinedBy) ? data.IsDefinedBy : [];
    return formatItemPsets(rawPsets);
  }


  // Método para acceder a los elementos de un IFC que pertenzcan a unan categoría concreta.
  async getNamesFromCategory(category: string, unique = false): Promise<string[]> {
    const items = await this.model.getItemsOfCategory(category);
  
    const localIds = (
      await Promise.all(items.map((item) => item.getLocalId()))
    ).filter((id): id is number => id !== null);
  
    const data = await this.model.getItemsData(localIds, {
      attributesDefault: false,
      attributes: ["Name"],
    });
  
    const names = data
      .map((d) => {
        const name = d?.Name;
        return name && !Array.isArray(name) ? name.value : null;
      })
      .filter((n): n is string => !!n);
  
    return unique ? [...new Set(names)] : names;
  }

  // Método para acceder al número de elementos visibles según una clase IFC.
  async getVisibilityByCategory(category: string) {
    const items = await this.model.getItemsOfCategory(category);
  
    const localIds = (
      await Promise.all(items.map((item) => item.getLocalId()))
    ).filter((id): id is number => id !== null);
  
    const result = await this.model.getVisible(localIds);
  
    const count = result?.reduce(
      (acc, isVisible) => {
        if (isVisible) {
          acc.visible++;
        } else {
          acc.hidden++;
        }
        return acc;
      },
      { visible: 0, hidden: 0 }
    );
  
    return count;
  }

  // Método para ocultar elementos del edificio IFC que pertenzcan a una categoría concreta
  async setCategoryVisibility(category: string, visible: boolean) {
    const items = await this.model.getItemsOfCategory(category);
  
    const localIds = (
      await Promise.all(items.map((item) => item.getLocalId()))
    ).filter((id): id is number => id !== null);
  
    await this.model.setVisible(localIds, visible);
    await this.fragments.update(true);
  }
  
  

  onItemSelected?: () => void;
  onItemDeselected?: () => void;
}


const formatItemPsets = (rawPsets: FRAGS.ItemData[]) => {
  const result: Record<string, Record<string, any>> = {};
  for (const [_, pset] of rawPsets.entries()) {
    const { Name: psetName, HasProperties } = pset;
    if (!("value" in psetName && Array.isArray(HasProperties))) continue;
    const props: Record<string, any> = {};
    for (const [_, prop] of HasProperties.entries()) {
      const { Name, NominalValue } = prop;
      if (!("value" in Name && "value" in NominalValue)) continue;
      const name = Name.value;
      const nominalValue = NominalValue.value;
      if (!(name && nominalValue !== undefined)) continue;
      props[name] = nominalValue;
    }
    result[psetName.value] = props;
  }
  return result;
};

