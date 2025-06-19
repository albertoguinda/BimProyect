import * as BUI from "@thatopen/ui";

export const SectionHeader = (title: string, hidden?: boolean, icon?: ReturnType<typeof BUI.html>) => {
  const toggleHidden = (event: Event) => {
    if (hidden === undefined) return;
    hidden = !hidden;
    // console.log(hidden);
    const container = event.currentTarget as HTMLElement;
    const hideButton = container.querySelector(".hiddenButton") as HTMLButtonElement;
    const bimSection = hideButton?.closest(".bimSection")
    const contentDinamic = bimSection?.querySelector(".bimContent") as HTMLDivElement | null;
    // console.log(bimSection);
    if (hideButton) {
      hideButton.innerText = hidden ? "⯆" : "⯅";
      hidden
        ? contentDinamic?.classList.add("hidden")
        : contentDinamic?.classList.remove("hidden");
    }
  };
  return BUI.html`
    <div class="border-t border-gray-600 mb-2"></div>
    <div class="flex items-center justify-between mb-3 group cursor-pointer" @click=${toggleHidden}>
      <h2 class="flex flex-row gap-3 text-md font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 select-none">
        ${title}
        ${icon ? icon : ''}
      </h2>
      ${
        hidden !== undefined
          ? BUI.html`
            <button
              class="text-white text-xs focus:outline-none cursor-pointer group-hover:text-blue-400 transition-colors duration-300 select-none hiddenButton"
            >
              ${hidden ? "⯆" : "⯅"}
            </button>
          `
          : null
      }
    </div>
  `;
};
