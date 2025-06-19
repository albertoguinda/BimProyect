// components/appComponents/Header.ts
import * as BUI from "@thatopen/ui";
import { menu } from "../../views/menu";

export const Header = BUI.Component.create(() => {
  const menuRoute = "#menu";
  return BUI.html`
    <header>
      <nav class="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div class="text-2xl font-bold cursor-pointer">
          <a href="${menuRoute}">ITA BIM PROJECT</a>
        </div>
        <ul class="flex space-x-6">
          <li @click=${() => { window.location.hash = "#menu" }} class="hover:underline cursor-pointer">Inicio</a></li>
          <li><a href="./menu.html" class="hover:underline">Perfil</a></li>
          <li><a href="#" class="hover:underline">Configuración</a></li>
          <li><a href="#" class="hover:underline">Cerrar sesión</a></li>
        </ul>
      </nav>
    </header>
  `;
}); 

