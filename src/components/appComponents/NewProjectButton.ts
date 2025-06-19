import * as BUI from "@thatopen/ui";

export const NewProjectButton = BUI.Component.create(() => {
  return BUI.html`
    <button
    class="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-2xl text-gray-500 hover:bg-gray-200 transition-all cursor-pointer py-10 w-full h-full focus:outline-none"
    title="Crear nuevo proyecto"
    @click=${() => { window.location.hash = "#form" }}
    >
    <div class="text-5xl mb-2">+</div>
    <div class="text-sm font-medium text-gray-600">Nuevo proyecto</div>
    </button>
      `;
});
