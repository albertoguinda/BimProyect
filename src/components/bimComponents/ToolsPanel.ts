import * as BUI from "@thatopen/ui";
import { ProjectName } from "./ProjectName";
import * as FRAGS from "@thatopen/fragments";
import { Attributes } from "./Attributes";
import { DownloadFragmentsButton } from "./DownloadFragments";
import { SectionHeader } from "./SectionHeader";

export const ToolsPanel = async (
  world: any, serializer : FRAGS.IfcImporter, fragments: FRAGS.FragmentsModels, categories :string[], selector:any, fragmentBytes : any, id? : number
) => {
  return BUI.Component.create(() => {
    async function handleCheckboxChange(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const category = checkbox.value;
        
        // Ocultar solo los seleccionados
        await selector.setCategoryVisibility(category, checkbox.checked);
      }
    
    async function hideAll(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        if(checkbox.checked) {
            categories.forEach(category => {
                selector.setCategoryVisibility(category, false);
            });
            const checkboxes = document.querySelectorAll<HTMLInputElement>(
                '#checkbox-container input[type="checkbox"]'
              );
              checkboxes.forEach(checkbox => {
                checkbox.checked = false;
              });
        } else {
            categories.forEach(category => {
                selector.setCategoryVisibility(category, true);
            });
            const checkboxes = document.querySelectorAll<HTMLInputElement>(
                '#checkbox-container input[type="checkbox"]'
              );
              checkboxes.forEach(checkbox => {
                checkbox.checked = true;
              });
        }
        
    }
    return BUI.html`
      <div class="bimSection absolute top-15 right-2 sm:flex w-3/12 md:w-2/12 bg-black backdrop-blur-md p-4 shadow-lg z-10 flex flex-col gap-y-4 overflow-y-auto max-h-[calc(100vh-100px)] rounded-2xl
      scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-black">
      ${SectionHeader('Categorías IFC', true)} 

        <!-- Checkbox "Ocultar todo" -->
        <div class="bimContent hidden">
          <label class="flex items-center space-x-2 text-white text-xs">
            <input
              type="checkbox"
              name="category"
              class="form-checkbox h-8 w-3 accent-teal-400"
              @change=${hideAll}
            />
            <span id="checkBoxOcultarTodo" class="select-none">Ocultar Todo</span>
          </label>

          <div id="checkbox-container" class="space-y-1 transition-all">
            ${categories.map(
              (cat) => BUI.html`
                <label class="flex items-center space-x-2 text-white text-xs">
                  <input
                    type="checkbox"
                    name="category"
                    value=${cat}
                    class="form-checkbox h-8 w-3 accent-green-400"
                    @change=${handleCheckboxChange}
                    checked
                  />
                  <span class="select-none">${cat}</span>
                </label>
              `
            )}
          </div>
        </div>
      </div>
    `;
  });
};
