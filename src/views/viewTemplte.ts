import { Header } from "../components/appComponents/Header";
import { Footer } from "../components/appComponents/Footer";
import { Layout } from "../components/appComponents/Layout";

export function renderLayout(): HTMLDivElement {
  // 1) Limpiar y preparar el contenedor
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) throw new Error("No se encontró #app");
  app.innerHTML = `<div id="menu" class="min-h-screen flex flex-col"></div>`;

  // 2) Montar header, layout y footer
  const menuContainer = app.querySelector<HTMLDivElement>("#menu")!;
  menuContainer.appendChild(Header);   // ¡ojo, invocar el componente
  menuContainer.appendChild(Layout);
  menuContainer.appendChild(Footer);

  // 3) Devolver el #mainApp para que la vista lo pueble
  const mainApp = menuContainer.querySelector<HTMLDivElement>("#mainApp");
  if (!mainApp) throw new Error("Layout debe renderizar un contenedor #mainApp");
  return mainApp;
}
