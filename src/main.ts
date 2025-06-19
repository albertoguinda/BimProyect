import { menu } from "./views/menu";
import { dashboard } from "./views/dashboardView";
import { form } from "./views/form";
import { loadIFCview } from "./views/bimViewTresCantos";
import "./style.css";

function router() {
  const route = window.location.hash;
  console.log("ruteando a", route);

  switch (route) {
    case "#dashboard":
      dashboard();
      break;

    case "#form":
      form();
      break;

    default:
      // menu();
      loadIFCview();
      break;
  }
}

window.addEventListener("load",  router);
window.addEventListener("hashchange", router);
