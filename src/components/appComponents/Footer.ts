// components/appComponents/Footer.ts
import * as BUI from "@thatopen/ui";

export const Footer = BUI.Component.create(() => {
  return BUI.html`
    <footer class="bg-blue-900 text-white text-center py-3">
      &copy; 2025 ITA BIM PROJECT. Todos los derechos reservados.
    </footer>
  `;
});
