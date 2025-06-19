import { Card } from "./Card";
import * as BUI from "@thatopen/ui";
import { NewProjectButton } from "./NewProjectButton";
import { getProjects } from "../../utils/projectsStorage";

export const Main = BUI.Component.create(() => {
  const projects = getProjects();
  return BUI.html`
    <div class="flex flex-1 bg-gray-100">
      <div class="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
        <main
          class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,_auto)]"
        >
          ${Card(projects)}
          ${NewProjectButton}
        </main>
      </div>
    </div>
  `;
});

