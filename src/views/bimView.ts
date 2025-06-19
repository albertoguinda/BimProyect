import Stats from "stats.js";
import * as OBC from "@thatopen/components";
import "../style.css";
import * as FRAGS from "@thatopen/fragments";
import { getProjects } from "../utils/projectsStorage";
import { base64ToUint8Array } from "../utils/base64ToUint8Array.ts";
import { loadIFCFromBytes } from "../utils/loadIFCFromBytes"
import * as OBCF from "@thatopen/components-front";

export async function bimView(id : number) {
  const existingProjects = getProjects(); // Obtenemos los proyectos guardados
  console.log('Proyecjots desde bimView');
  console.log(existingProjects); // Para verificar que se guarda
  console.log(existingProjects.find((p: {id : number })  => p.id === 1745232692325))
  const lastProject = existingProjects[existingProjects.length - 1]; // por ejemplo
  console.log('Ultimo proyecto')
  console.log(lastProject.id)
  if (!lastProject || !lastProject.fragments) {
    console.log("No hay ningún proyecto guardado para mostrar.");
    window.location.href = './index.html'
  }
  else{
    console.log('Existe')
  }
  const project = existingProjects.find((p: {id : number })  => p.id === id)
  const fragmentBytes = base64ToUint8Array(project.fragments);
  document.querySelector<HTMLDivElement>(
    "#app"
  )!.innerHTML = `<div id="container" class="full-screen w-8/12"></div>`;

  const container = document.getElementById("container")!;

  const components = new OBC.Components();

  const worlds = components.get(OBC.Worlds);
  const world = worlds.create<
    OBC.SimpleScene,
    OBC.OrthoPerspectiveCamera,
    OBC.SimpleRenderer
  >();

  world.scene = new OBC.SimpleScene(components);
  world.renderer = new OBC.SimpleRenderer(components, container);
  world.camera = new OBC.OrthoPerspectiveCamera(components);

  components.init();

  world.camera.controls.setLookAt(-60, 30, -20, 0, 0, -20);
  // world.camera.fit
  world.scene.setup();

  const grids = components.get(OBC.Grids);
  grids.create(world);


  const highlighter = components.get(OBCF.Highlighter);
  highlighter.setup({ world });
  highlighter.zoomToSelection = true;

  const serializer = new FRAGS.IfcImporter();
  serializer.wasm = {
    absolute: true,
    path: "https://unpkg.com/web-ifc@0.0.68/",
  };

  const workerUrl = "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
  const fetchedWorker = await fetch(workerUrl);
  const workerText = await fetchedWorker.text();
  const workerFile = new File([new Blob([workerText])], "worker.mjs", {
    type: "text/javascript",
  });

  
  const workerBlobUrl = URL.createObjectURL(workerFile);
  const fragments = new FRAGS.FragmentsModels(workerBlobUrl);

  const viewpoints = components.get(OBC.Viewpoints);

  const savedViewpoints: { title: string, vp: OBC.Viewpoint }[] = [];

  const viewpoint1 = viewpoints.create(world, { title: 'Punto1' });
  viewpoint1.camera.direction.x = 0.09747741305744327;
  viewpoint1.camera.direction.y = -0.36105581140192666;
  viewpoint1.camera.direction.z = -0.9274356338833035;
  viewpoint1.camera.position.x = 3.7559822353977896;
  viewpoint1.camera.position.y = 23.107377272157485;
  viewpoint1.camera.position.z = 54.19485071066424;
  savedViewpoints.push({ title: 'Punto1', vp: viewpoint1 });

  

  const sotano = viewpoints.create(world, { title: 'sotano' });
  sotano.camera.direction.x =  -0.587608267531116;
  sotano.camera.direction.y = -0.37825081812135225;
  sotano.camera.direction.z = -0.7152921378846604;
  sotano.camera.position.x = -192.98523255471758;
  sotano.camera.position.y = 5.777596428881964;
  sotano.camera.position.z = 46.4908421790484
  savedViewpoints.push({ title: 'sotano', vp: sotano });

  const oficinaPlantaBaja = viewpoints.create(world, { title: 'oficinaPlantaBaja' });
  oficinaPlantaBaja.camera.direction.x =  0.9957333239820119;
  oficinaPlantaBaja.camera.direction.y = -0.02296127869151622;
  oficinaPlantaBaja.camera.direction.z = -0.08937520457366566;
  oficinaPlantaBaja.camera.position.x = -206.50292519795264;
  oficinaPlantaBaja.camera.position.y = 3.0860763399716187;
  oficinaPlantaBaja.camera.position.z = 23.660157690574614;
  savedViewpoints.push({ title: 'oficinaPlantaBaja', vp: oficinaPlantaBaja });

    const comedorPlanta2 = viewpoints.create(world, { title: 'comedorPlanta2' });
  comedorPlanta2.camera.direction.x = -0.9986970633863199;
  comedorPlanta2.camera.direction.y = 0.04587741992118469;
  comedorPlanta2.camera.direction.z = -0.022348107859856192;
  comedorPlanta2.camera.position.x = -199.05300720702775;
  comedorPlanta2.camera.position.y = 10.131827565918657;
  comedorPlanta2.camera.position.z = 39.57050243866512;
  savedViewpoints.push({ title: 'Comedor Planta 2', vp: comedorPlanta2 });
  

  const myPanel = `<div id="panel"></div>`
  
  document.querySelector<HTMLDivElement>(
    "#container"
  )!.insertAdjacentHTML('beforeend', myPanel)

  const categoriesPanelanel = `<div id="categoriesPanel"></div>`
  
  document.querySelector<HTMLDivElement>("#container")!.insertAdjacentHTML('beforeend', categoriesPanelanel)
  const anotherPanel = document.getElementById('categoriesPanel');
  // anotherPanel?.classList.add('hidden')
  
  await loadIFCFromBytes(fragmentBytes, world, serializer, fragments, id, viewpoints, savedViewpoints);
  

  const stats = new Stats();
  stats.showPanel(2);
  document
    .querySelector<HTMLDivElement>("#app")!
    .insertAdjacentElement("beforeend", stats.dom);
  stats.dom.style.left = "calc(100vw - 80px)";
  stats.dom.style.zIndex = "unset";
  world.renderer.onBeforeUpdate.add(() => stats.begin());
  world.renderer.onAfterUpdate.add(() => stats.end());
}

bimView(1746487774592)

