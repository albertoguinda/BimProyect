import { Aside } from "../components/appComponents/Aside.ts";
import { Main } from "../components/appComponents/Main.ts";
// src/views/menu.ts
import { renderLayout } from "./viewTemplte.ts";


export function menu() {
  const mainApp = renderLayout();
  mainApp.innerHTML = "";          // limpiar solo el interior de #mainApp
  mainApp.appendChild(Aside);    // invocando el componente
  mainApp.appendChild(Main);
 
}
