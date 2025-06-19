// @ts-nocheck
import * as BUI from "@thatopen/ui";
import { SectionHeader } from "./SectionHeader";
import * as FRAGS from "@thatopen/fragments";

type NameEntry = { localId: number; name: string; };
type StoreyData = { localId: number; name: string; childLocalIds: number[]; };

type StoreyMap = Record<number, number[]>;
const storeysMap: StoreyMap = {};

const renderTree = (
  model: any,
  names: NameEntry[],
  parentCategory = "",
  currentStoreyId: number | null = null
): string => {
  if (!model) return "";
  const category = model.category || parentCategory || 'Sin categoría';
  const children = Array.isArray(model.children) ? model.children : [];
  const hasChildren = children.length > 0;
  const localId = model.localId;

  if (category === "IFCBUILDINGSTOREY" && localId != null) {
    storeysMap[localId] = [];
    currentStoreyId = localId;
  }
  if (localId != null && category !== "IFCBUILDINGSTOREY" && currentStoreyId != null) {
    storeysMap[currentStoreyId].push(localId);
  }

  let html = ``;
  if (hasChildren) {
    html += `<ul class="ml-4 hidden">`;
    for (const child of children) html += renderTree(child, names, category, currentStoreyId);
    html += `</ul>`;
  }
  html += `</li>`;
  return html;
};

const getStoreysData = (names: NameEntry[]): StoreyData[] =>
  Object.entries(storeysMap).map(([id, children]) => ({
    localId: +id,
    name: names.find(e => e.localId === +id)?.name || 'Sin nombre',
    childLocalIds: children
  }));

export const Structure = (model: FRAGS.FragmentsModel, fragments: FRAGS.FragmentsModels, tree: any, names: NameEntry[]
) => {
  Object.keys(storeysMap).forEach(k => delete storeysMap[+k]);

  const treeHTML = `<ul>${renderTree(tree, names)}</ul>`;
  const storeys = getStoreysData(names);
  const selectedStoreys = new Set<number>();

  const applyVisibility = async () => {
    const allIds = Object.values(storeysMap).flat();
    const showIds = Array.from(selectedStoreys)
      .flatMap(id => storeysMap[id] || []);
    // Si no hay seleccionado, mostrar todas
    const idsToShow = showIds.length ? showIds : allIds;
    await model.setVisible(allIds, false);
    await model.setVisible(idsToShow, true);
    await fragments.update(true);
  };

  setTimeout(() => {
    const treeEl = document.getElementById('ifcTree');
    const btnEl = document.getElementById('storeyControls');

    if (treeEl) {
      treeEl.innerHTML = treeHTML;
      treeEl.addEventListener('click', e => {
        const target = (e.target as HTMLElement).closest('.toggle-model');
        if (!target) return;
        const ul = target.nextElementSibling as HTMLUListElement;
        const icon = target.querySelector('.toggle-icon');
        if (ul) {
          ul.classList.toggle('hidden');
          icon!.textContent = ul.classList.contains('hidden') ? '▶' : '▼';
        }
      });
    }

    if (btnEl) {
      btnEl.innerHTML = '';
      storeys.forEach(s => {
        const btn = document.createElement('button');
        const isSelected = selectedStoreys.has(s.localId);
        const hue = isSelected ? 'blue-500' : 'blue-200';
        btn.className = `bg-${hue} text-gray-800 px-1 py-0.5 rounded mb-1 mr-1 text-xs min-w-[4rem]`;
        btn.textContent = s.name;
        btn.addEventListener('click', async () => {
          if (selectedStoreys.has(s.localId)) selectedStoreys.delete(s.localId);
          else selectedStoreys.add(s.localId);
          // reaplicar visibilidad
          await applyVisibility();
          // actualizar todos los botones
          Array.from(btnEl.children).forEach((child, i) => {
            const b = child as HTMLButtonElement;
            const id = storeys[i].localId;
            const selected = selectedStoreys.has(id);
            const newHue = selected ? 'blue-500' : 'blue-200';
            b.className = `bg-${newHue} text-gray-800 px-1 py-0.5 rounded mb-1 mr-1 text-xs  min-w-[4rem]`;

          });
        });
        btnEl.appendChild(btn);
      });
    }

    // Inicial: mostrar todas
    applyVisibility();
    const loader = document.getElementById("loaderBIM");
    loader?.classList.add("hidden");
  });

  return BUI.html`
    <section class="bimSection">
      ${SectionHeader('Estructura IFC', true)}
      <div class="bimContent hidden">
        <p class="text-sm text-white mb-4">Mostrar diferentes plantas según la categoría IFCBUILDINGSTOREY.</p>
        <div id="storeyControls" class="mb-4"></div>
      </div>
    </section>
  `;
};