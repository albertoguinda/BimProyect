import * as BUI from "@thatopen/ui";
import { SectionHeader } from "./SectionHeader";

export const DownloadFragmentsButton = (fragmentBytes: ArrayBuffer) => {
  let fileName = "";

  const showModal = () => {
    const modal = document.getElementById("download-modal");
    const buttonSection = document.getElementById("buttonSection");
    buttonSection?.classList.add("hidden");
    modal?.classList.remove("hidden");
    modal?.classList.add("flex");
  };

  const hideModal = () => {
    const modal = document.getElementById("download-modal");
    const buttonSection = document.getElementById("buttonSection");
    buttonSection?.classList.remove("hidden");
    modal?.classList.remove("flex");
    modal?.classList.add("hidden");
    fileName = "";
    const input = document.getElementById("frag-name") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const onInputChange = (e: Event) => {
    fileName = (e.target as HTMLInputElement).value.trim();
  };

  const onDownload = () => {
    if (!fragmentBytes) {
      console.error("No hay fragmentos para descargar.");
      return;
    }
    const name = fileName || 'edificio';
    const file = new File([fragmentBytes], `${name}.frag`, { type: "application/octet-stream" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(a.href);
    hideModal();
  };

  

  return BUI.html`
    <!-- Botón de descarga dentro de la sección -->
    <section class="bimSection">
      ${SectionHeader('Descargar Fragments', true)}
      <div id="buttonSection" class="bimContent hidden">
        <p class="text-xs text-white mb-4">
          Los Fragments o fragmentos son el modelo IFC ya procesado que permite visualizarlo en 3D.
        </p>
        <button
          @click=${showModal}
          class="w-2/5 bg-blue-500 hover:bg-blue-600 text-white py-2 px-1 rounded text-xs select-none">
          Descargar Fragments
        </button>
      </div>
      <!-- Modal independiente en nivel de raíz para asegurar position fixed real -->
    <div
      id="download-modal"
      class="hidden inset-0 bg-opacity-50 items-center justify-center"
    >
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 mx-auto">
        <h3 class="text-white text-sm font-medium mb-2">Nombre de archivo</h3>
        <input
          id="frag-name"
          type="text"
          placeholder="Introduce nombre..."
          class="w-full bg-gray-700 text-white text-xs px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          @input=${onInputChange}
        />
        <div class="mt-4 flex flex-col justify-end gap-2">
          <button
            @click=${hideModal}
            class="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded transition"
          >
            Cancelar
          </button>
          <button
            @click=${onDownload}
            class="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
    </section>
    
  `;
};
