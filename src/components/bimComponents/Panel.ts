import * as BUI from "@thatopen/ui";
import { ImportIFC } from "./ImportIFC";
import * as FRAGS from "@thatopen/fragments";

export const Panel = (
  world: any, serializer : FRAGS.IfcImporter, fragments: FRAGS.FragmentsModels, viewpoints : any, savedViewpoints : any
) => {
  return BUI.Component.create(() => {
    return BUI.html`
      <div class="absolute top-0 left-0 hidden sm:flex w-3/12 md:w-2/12 h-full bg-gray-900 backdrop-blur-md p-4 shadow-lg z-10 flex-col space-y-4 overflow-y-auto max-h-screen">
      <button
        @click=${() => {window.location.href = './index.html'}}
        class="sm:w-3/5 md:w-4/8 lg:w-2/5 xl:w-2/6 bg-blue-100 text-blue-700 text-xs font-medium py-1 px-3 mb-5 rounded-md hover:bg-blue-200 transition select-none"
      >
        Menú
      </button>
      
      ${ImportIFC(world, serializer, fragments, viewpoints, savedViewpoints)}
      </div>
    `;
  });
};
