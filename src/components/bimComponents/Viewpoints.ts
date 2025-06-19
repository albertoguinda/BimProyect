import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import { SectionHeader } from "./SectionHeader";

export default function Viewpoints(
  world: any,
  viewpoints: any,
  savedViewpoints: any,
  components: OBC.Components
) {
  const showModal = () => {
    const modal = document.createElement("div");
    modal.id = "vp-modal";
    modal.className = `
            fixed inset-0 flex items-center justify-center z-50
        `;

    const backdrop = document.createElement("div");
    backdrop.className = `
            absolute inset-0 bg-black opacity-75 backdrop-blur-sm
        `;

    // Crear el contenedor del contenido del modal
    const modalContent = document.createElement("div");
    modalContent.className = `
            bg-gray-900 text-white p-6 rounded-xl w-80 space-y-4 shadow-2xl relative z-10
        `;
    modalContent.innerHTML = `
            <h2 class="text-lg font-bold">Crear Viewpoint</h2>
            <input
            id="vp-name-input"
            type="text"
            placeholder="Nombre del viewpoint"
            class="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            />
            <div class="flex justify-end space-x-2">
            <button id="vp-cancel" class="px-4 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600">Cancelar</button>
            <button id="vp-create" class="px-4 py-1 text-sm rounded bg-blue-600 hover:bg-blue-500">Crear</button>
            </div>
        `;
    modal.appendChild(backdrop);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    // Lógica de botones
    const input = modal.querySelector("#vp-name-input") as HTMLInputElement;
    modal.querySelector("#vp-cancel")?.addEventListener("click", () => {
      modal.remove();
    });

    modal.querySelector("#vp-create")?.addEventListener("click", () => {
      const name = input.value.trim();
      if (name) {
        createViewpoint(name);
        modal.remove();
      }
    });
  };

  // Lógica para crear un viewpoint con nombre
  const createViewpoint = (name: string) => {
    const viewpoint = viewpoints.create(world, { title: name });
    viewpoint.updateCamera();
    savedViewpoints.push({ title: name, vp: viewpoint });
    updateViewpointList();
  };

  const goToViewpoint = async (vp: OBC.Viewpoint) => {
    // Asegurar proyección en perspectiva
    world.camera.projection.set("Perspective");

    // Intentar aplicar el modo FirstPerson
    try {
      await world.camera.set("FirstPerson" as OBC.NavModeID);

      // Forzar posición y dirección
      const { position, direction } = vp.camera;
      await world.camera.controls.setLookAt(
        position.x,
        position.y,
        position.z,
        position.x + direction.x,
        position.y + direction.y,
        position.z + direction.z
      );
    } catch (err) {
      console.warn("No se pudo activar el modo FirstPerson", err);
    }

    console.log("Modo después del viewpoint:", world.camera.mode.id);
  };

  const updateViewpointList = () => {
    const container = document.getElementById("viewpoint-buttons");
    if (!container) return;

    container.innerHTML = "";

    for (const { title, vp } of savedViewpoints) {
      const button = document.createElement("button");
      button.textContent = title;
      button.className =
        "bg-gray-800 text-white text-xs px-2 py-1 rounded w-1/2 mb-1 hover:bg-gray-700 transition";
      button.onclick = () => goToViewpoint(vp);
      container.appendChild(button);
    }
    console.log(savedViewpoints);
  };

  return BUI.html`
        <section class="bimSection">
          ${SectionHeader("ViewPoints", true)}
          <div class="bimContent hidden space-y-2">
            <button
              class="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition w-1/2 cursor-pointer"
              @click=${showModal}
            >
              Crear Viewpoint
            </button>
    
            <div id="viewpoint-buttons" class="flex flex-col space-y-1">
               ${savedViewpoints.map(
                 ({
                   title,
                   vp,
                 }: {
                   title: string;
                   vp: OBC.Viewpoint;
                 }) => BUI.html`
                <button
                  class="bg-gray-700 text-white text-xs px-2 py-1 rounded w-1/2 mb-1 hover:bg-blue-900 transition"
                  @click=${() => goToViewpoint(vp)}
                >
                  ${title}
                </button>
              `
               )}
            </div>
          </div>
        </section>
      `;
}
