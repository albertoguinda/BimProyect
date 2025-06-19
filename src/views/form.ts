import { Footer } from "../components/appComponents/Footer";
import { Header } from "../components/appComponents/Header";
import { ProjectForm } from "../components/appComponents/ProjectForm";

export function form() {
  document.querySelector<HTMLDivElement>(
    "#app"
  )!.innerHTML = `<div id="form" class="min-h-screen flex flex-col"></div>`;

  const form = document.querySelector<HTMLDivElement>("#form");

  form!.appendChild(Header)
  form!.appendChild(ProjectForm)
  form!.appendChild(Footer)

}
