import * as BUI from "@thatopen/ui";
import { SectionHeader } from "./SectionHeader";

export const Extra = () => {
  return BUI.html`
    <section class="bimSection">

      <!-- Creamos el ecnabezado y poner true, porque tenemos el contenido del bimContent en hidden para que sea vea bien -->
      ${SectionHeader('(Nombre del proyecto)', true)}
      <div class="bimContent hidden">
      <p class="text-sm text-white mb-4">Aquí aparecerán detalles sobre el proyecto seleccionado.</p>
  
    </section>
    `;
};
