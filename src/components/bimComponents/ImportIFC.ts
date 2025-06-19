import * as BUI from "@thatopen/ui";
import { loadIFC } from "../../utils/loadIFC";
import { SectionHeader } from "./SectionHeader";
import * as FRAGS from "@thatopen/fragments";
import { loadFragments } from "../../utils/loadFragments";

export const ImportIFC = (
  world: any,
  serializer: FRAGS.IfcImporter,
  fragments: FRAGS.FragmentsModels,
  viewpoins : any,
  savedViewpoints : any
) => {
  return BUI.html`
    <section class="bimSection">
      <!-- Creamos el ecnabezado y poner true, porque tenemos el contenido del bimContent en hidden para que sea vea bien -->
      ${SectionHeader("BIM", false)}
      <div class="bimContent">

        <!-- Botón Cargar IFC -->
        <button
          @click=${() => {
            const fileInput = document.getElementById(
              "ifc-file-input"
            ) as HTMLInputElement | null;
            fileInput?.click();
          }}
          class="w-fit bg-gray-200 text-black text-xs py-1.5 px-3 rounded-lg hover:bg-gray-400 transition-all duration-200 shadow-sm mb-4 cursor-pointer"
        >
          Cargar IFC
        </button>

        <input
          id="ifc-file-input"
          type="file"
          accept=".ifc"
          style="display: none"
          @change=${(e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              loadIFC(file, world, serializer, fragments, viewpoins, savedViewpoints);
            }
          }}
        />

        <div id="loader" class="hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white text-sm">
       <img src="/Spinner@1x-1.0s-200px-200px.gif" alt="Cargando..." class="w-12 h-12 mb-4" />
        <span class="text-base">Cargando modelo IFC...</span>
      </div>




        <div class="flex items-start gap-3 mb-4 text-white text-sm leading-snug">
          <p>
            Si has exportado anteriormente un archivo .ifc a .frag, te aconsejamos cargar un modelo en .frag para que el proceso de carga sea mucho más rápido y óptimo.
          </p>
        </div>

        <!-- Botón Cargar frag -->
        <div class="flex items-center gap-2">
          <button
            @click=${() => {
              const fileFrag = document.getElementById(
                "ifc-frag-input"
              ) as HTMLInputElement | null;
              fileFrag?.click();
            }}
            class="w-fit bg-green-200 text-black text-xs py-1.5 px-3 rounded-lg hover:bg-green-300 transition-all duration-200 shadow-sm cursor-pointer"
          >
            Cargar frag
          </button>

           <!-- Flecha apuntando a la izquierda y animada -->
            <div class="animate-[slide-left_1s_ease-in-out_infinite] text-green-400">
              <svg class="w-6 h-6 rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10.293 15.707a1 1 0 010-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

        </div>
        <input
          id="ifc-frag-input"
          type="file"
          accept=".frag"
          style="display: none"
          @change=${(e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              // @ts-ignore
              loadFragments(file, world, serializer, fragments, viewpoins, savedViewpoints);
            }
          }}
        />
      </div>
    </section>
    `;
};
