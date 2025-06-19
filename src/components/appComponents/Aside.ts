import * as BUI from "@thatopen/ui";
import { loadIFCview } from "../../views/loadIFCview";

export const Aside = BUI.Component.create(() => {
  const clearStorage = () => {
    localStorage.removeItem("projects");
    window.location.href = './index.html'
  };

  const dashboardRoute = "#dashboard";

  return BUI.html`
    <aside class="w-64 bg-white shadow-md p-4 flex flex-col justify-between">
      <div>
        <h2 class="text-xl font-semibold mb-4">Menú</h2>
        <ul class="space-y-2">
          <li><a href="${dashboardRoute}" class="block p-2 rounded hover:bg-gray-200">Dashboard</a></li>
            <li class="px-2 text-sm text-gray-600 italic">
        ¿No tiene un modelo .IFC? Descargue este para probar:
      </li>

      <!-- Botón de descarga -->
      <li>
        <a 
          href="/DIC_IFC_v.1.0.ifc" 
          download 
          class=" p-2 rounded hover:bg-blue-100 text-blue-700 font-medium flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
          </svg>
          <span>Descargar DIC.IFC</span>
        </a>
      </li>

          <!--
          <li><a href="#" class="block p-2 rounded hover:bg-gray-200">Usuarios</a></li>
          <li><a href="#" class="block p-2 rounded hover:bg-gray-200">Reportes</a></li>
          <li><a href="#" class="block p-2 rounded hover:bg-gray-200">Ajustes</a></li>
          -->
        </ul>

        <hr class="my-4" />

        <!-- Botón de limpieza -->
        <button
          @click=${clearStorage}
          class="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded transition cursor-pointer"
        >
          Borrar Todos los Proyectos Guardados
        </button>

        <hr class="my-4" />

        <!-- Mini Panel Info con letra 'i' -->
        <div class="bg-yellow-100 border border-yellow-300 rounded p-2 text-sm text-yellow-800 mb-3 relative">
          <!-- Botón de Información con letra 'i' en la esquina superior derecha -->
          <button @click=${() =>
            (document
              .getElementById("infoDialog") as HTMLDialogElement)
              ?.showModal()} class="absolute top-2 right-2 text-xl text-blue-500 rounded-full bg-blue-200 w-6 h-6 flex items-center justify-center cursor-pointer">
            <span class="text-white font-semibold">i</span> <!-- Letra 'i' para Información -->
          </button>

          <p><strong>¿Tu IFC es muy pesado?</strong></p>
          <p>De momento no lo podrás guardar como proyecto pero</p>
          <p>trabaja con él directamente aquí.</p>
          <div class="text-center mt-2 animate-bounce text-lg">⬇⬇⬇⬇</div>
          <button
            @click=${loadIFCview}
            class="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-1.5 px-3 rounded text-sm transition cursor-pointer"
          >
            Visualizar ahora
          </button>
        </div>
      </div>

      <!-- Dialog Modal -->
      <dialog id="infoDialog" class="p-6 bg-white rounded shadow-lg max-w-md w-full fixed inset-0 m-auto" closedby="any">
        <form method="dialog">
          <section>
            <h3 class="text-xl font-semibold mb-4">¿Por qué?</h3>
            <p>Al guardar de momento los datos relacionados a los proyectos en localStorage, los ifc pesados, aun convertidos a frgaments, pesan demasiado para los 5mb que se pueden guardar.</p>
            <p>Cuando guardemos en una BBDD, ya no tendremos este problema. :).</p>
          </section>
          <menu class="flex justify-end space-x-2 mt-4">
            <button type="submit" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition">Entendido</button>
          </menu>
        </form>
      </dialog>

    </aside>
  `;
});
