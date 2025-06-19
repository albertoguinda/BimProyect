import Stats from "stats.js";
import * as OBC from "@thatopen/components";
import "../style.css";
import { Panel } from "../components/bimComponents/Panel";
import * as FRAGS from "@thatopen/fragments";
import { loadFragments } from "../utils/loadFragments";

export async function loadIFCview() {
  // const existingProjects = getProjects(); // Obtenemos los proyectos guardados
  // console.log(existingProjects); // Para verificar que se guarda
        
  document.querySelector<HTMLDivElement>(
    "#app"
  )!.innerHTML = `<div id="container" class="full-screen"></div>`;

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
  

  
  world.camera.controls.setLookAt(-14.08, -0.5427, -15.210, 0.57509, 0.03030, 0.8175);
  const selected = 'FirstPerson' as OBC.NavModeID;
  world.camera.projection.set('Perspective');
  world.camera.set(selected)
  world.scene.setup();

  components.init();
  

  const grids = components.get(OBC.Grids);
  grids.create(world);


  console.log(world.camera.mode)



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
  
  const exterior = viewpoints.create(world, { title: 'exterior' });
  exterior.camera.direction.x = 0.755574022747261;
  exterior.camera.direction.y = -0.0852557623708942;
  exterior.camera.direction.z = 0.6494916097472537;
  exterior.camera.position.x = -18.003427783944055;
  exterior.camera.position.y = 2.9212327925403323;
  exterior.camera.position.z = -16.786555412428925;
  savedViewpoints.push({ title: 'Exterior', vp: exterior });
  console.log('Exterior', exterior)


  const Habitacion= viewpoints.create(world, { title: 'Habitacion' });

  Habitacion.camera.direction.x =  0.7963690736538349;
  Habitacion.camera.direction.y = 0.05842830761735612;
  Habitacion.camera.direction.z = -0.6019820856111124;
  Habitacion.camera.position.x = -6.8945693710198706;
  Habitacion.camera.position.y = -1.482872529347566;
  Habitacion.camera.position.z = 6.611478996834341;
  savedViewpoints.push({ title: 'Habitacion', vp: Habitacion});


  const salon= viewpoints.create(world, { title: 'Salon' });

  salon.camera.direction.x =  -0.9262417851878839;
  salon.camera.direction.y = -0.09622095823063305;
  salon.camera.direction.z = 0.3644416037846677;
  salon.camera.position.x = 5.374919707029091;
  salon.camera.position.y = -0.9591402002298026;
  salon.camera.position.z = 3.802573676001492;
  savedViewpoints.push({ title: 'Salon', vp: salon});


  const escalerasNubePuntos= viewpoints.create(world, { title: 'EscalerasNubePuntos' });

  escalerasNubePuntos.camera.direction.x =  0.5907475081567704;
  escalerasNubePuntos.camera.direction.y = 0.05105189852238504;
  escalerasNubePuntos.camera.direction.z = -0.8052397688041908;
  escalerasNubePuntos.camera.position.x = -8.082789548069458;
  escalerasNubePuntos.camera.position.y = -1.7336721443184877;
  escalerasNubePuntos.camera.position.z = 2.4949906291993287;
  savedViewpoints.push({ title: 'EscalerasNubePuntos', vp: escalerasNubePuntos});


  const myPanel = `<div id="panel"></div>`
  document.querySelector<HTMLDivElement>(
    "#container"
  )!.insertAdjacentHTML('beforeend', myPanel)
  const categoriesPanelanel = `<div id="categoriesPanel"></div>`
  const loaderBIM = `
  <div id="loaderBIM" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white text-sm">
    <img src="/Spinner@1x-1.0s-200px-200px.gif" alt="Cargando..." class="w-12 h-12 mb-4" />
    <span class="text-base">Cargando estructura...</span>
  </div>
`;

document.querySelector<HTMLDivElement>("#container")!.insertAdjacentHTML("beforeend", loaderBIM);

  document.querySelector<HTMLDivElement>("#container")!.insertAdjacentHTML('beforeend', categoriesPanelanel)
  //document.querySelector<HTMLDivElement>("#panel")!.appendChild(Panel(world, serializer, fragments, viewpoints, savedViewpoints)) ;
  const fragmentUrl = './108 Viviendas Tres Cantos Piso Piloto_modificado_v2.frag';
  // const fragmentUrl = './108ViviendasTresCantosPisoPiloto.frag';
  const response = await fetch(fragmentUrl);
  const fragmentFile = await response.blob();
  loadFragments(fragmentFile, world, serializer, fragments, viewpoints, savedViewpoints, components);

  const stats = new Stats();
  stats.showPanel(2);
  document.querySelector<HTMLDivElement>("#app")!.insertAdjacentElement("beforeend", stats.dom);
  stats.dom.style.left = "calc(100vw - 80px)";
  stats.dom.style.zIndex = "unset";
  world.renderer.onBeforeUpdate.add(() => stats.begin());
  world.renderer.onAfterUpdate.add(() => stats.end());
}

