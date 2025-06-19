import * as BUI from "@thatopen/ui";
import { bimView } from "../../views/bimView";

interface CardData {
  title: string;
  id: number;
}

export const Card = (cardsData: CardData[]) => {
  return BUI.html`${cardsData.map(card => BUI.html`
    <div id="proycetoBIM-${card.id}" class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col  justify-between relative">
      <div class="flex-1 flex items-center justify-center">
        <h3 class="text-2xl font-bold text-center">${card.title}</h3>
      </div>
      <div class="flex justify-end space-x-2">
        <button
          @click=${() => bimView(card.id)}
          id="agregar-${card.id}"
          type="button"
          class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-1"
        >
          Editar
        </button>
        <button
          @click=${() => alert('Este botón debería borrar un proyecto concreto, de momento tienes disponible el poder borrar todos solo')}
          type="button"
          class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-1"
        >
          Eliminar
        </button>
      </div>
    </div>
  `)}`;
};

