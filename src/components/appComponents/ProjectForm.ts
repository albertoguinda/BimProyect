import * as BUI from "@thatopen/ui";
import * as FRAGS from "@thatopen/fragments";
import { getProjects, saveProject } from "../../utils/projectsStorage";
import { convertIFCtoFragmentsBase64 } from "../../utils/fragmentStorage";

export const ProjectForm = BUI.Component.create(() => {
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
  
    const form = e.target as HTMLFormElement;
    const nameInput = form.querySelector<HTMLInputElement>("#projectName");
    const fileInput = form.querySelector<HTMLInputElement>("#ifcFile");
  
    const title = nameInput?.value.trim();
    const file = fileInput?.files?.[0];
  
    if (!title || !file) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const maxSizeMB = 10;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`❗El tamaño máximo permitido es de ${maxSizeMB} MB al no tener aún una base de datos aún. Utiliza el visualizador del menú.`);
      return;
    }
    
    const serializer = new FRAGS.IfcImporter();
    serializer.wasm = {
      absolute: true,
      path: "https://unpkg.com/web-ifc@0.0.68/",
    };

    const loader = document.getElementById("loader");
    loader?.classList.remove("hidden");
  
    try {
      const base64Fragments = await convertIFCtoFragmentsBase64(file, serializer);
  
      const newProject = {
        id: Date.now(),
        title,
        fragments: base64Fragments,
      };
  
      const existingProjects = getProjects();
      existingProjects.push(newProject);
  
      // Intenta guardar y atrapa el error si falla
      saveProject(existingProjects);
  
      console.log(existingProjects);
      window.location.href = "/viewer.html";
    } catch (error: any) {
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        alert("❗ Este proyecto es demasiado grande para ser guardado localmente. Intenta con un archivo más pequeño.");
        window.location.href = "/index.html";
      } else {
        console.error("Error al guardar el proyecto:", error);
        alert("Ocurrió un error al guardar el proyecto. Revisa la consola para más detalles.");
      }
    }
  };
  

  return BUI.html`
    <div class="flex flex-1 items-center justify-center bg-gray-100 min-h-[calc(100vh-120px)]">
      <div class="w-full max-w-xl bg-white p-8 rounded-xl shadow-md space-y-6">
        <h2 class="text-2xl font-bold text-gray-800 text-center">Nuevo Proyecto</h2>

        <form class="space-y-4 w-full" @submit=${handleSubmit}>
          <!-- Nombre del Proyecto -->
          <div>
            <label for="projectName" class="block text-sm font-medium text-gray-700 mb-1">Nombre del Proyecto</label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              placeholder="Introduce el nombre"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <!-- Subir archivo IFC -->
          <div>
            <label for="ifcFile" class="block text-sm font-medium text-gray-700 mb-1">Archivo IFC</label>
            <input
              type="file"
              id="ifcFile"
              name="ifcFile"
              accept=".ifc"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>

          <!-- Botón de Crear -->
          <div class="pt-4">
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
      <div id="loader" class="hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white text-sm">
       <img src="/Spinner@1x-1.0s-200px-200px.gif" alt="Cargando..." class="w-12 h-12 mb-4" />
        <span class="text-base">Cargando modelo IFC...</span>
      </div>

    
  `;
});
