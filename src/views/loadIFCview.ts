import Stats from "stats.js";
import * as OBC from "@thatopen/components";
import "../style.css";
import { Panel } from "../components/bimComponents/Panel";
import * as FRAGS from "@thatopen/fragments";
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
    OBC.SimpleCamera,
    OBC.SimpleRenderer
  >();

  world.scene = new OBC.SimpleScene(components);
  world.renderer = new OBC.SimpleRenderer(components, container);
  world.camera = new OBC.OrthoPerspectiveCamera(components);

  components.init();
  world.camera.controls.setLookAt(-60, 30, -20, 0, 0, -20);

  world.scene.setup();

  const grids = components.get(OBC.Grids);
  grids.create(world);



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

  // const viewpoint1 = viewpoints.create(world, { title: 'Punto1' });
  // viewpoint1.camera.direction.x = 0.09747741305744327;
  // viewpoint1.camera.direction.y = -0.36105581140192666;
  // viewpoint1.camera.direction.z = -0.9274356338833035;
  // viewpoint1.camera.position.x = 3.7559822353977896;
  // viewpoint1.camera.position.y = 23.107377272157485;
  // viewpoint1.camera.position.z = 54.19485071066424;
  // savedViewpoints.push({ title: 'Punto1', vp: viewpoint1 });

  const sotano = viewpoints.create(world, { title: 'sotano' });
  sotano.camera.direction.x =   0.9550957696793345;
  sotano.camera.direction.y = -0.05683093079209388;
  sotano.camera.direction.z =0.2907960041780907;
  sotano.camera.position.x =  -218.05482025449828;
  sotano.camera.position.y =-0.11833257854378143;
  sotano.camera.position.z = 20.897496275545727
  savedViewpoints.push({ title: 'Sotano', vp: sotano });

  const oficinaPlantaBaja = viewpoints.create(world, { title: 'oficinaPlantaBaja' });
  oficinaPlantaBaja.camera.direction.x =  0.9957333239820119;
  oficinaPlantaBaja.camera.direction.y = -0.02296127869151622;
  oficinaPlantaBaja.camera.direction.z = -0.08937520457366566;
  oficinaPlantaBaja.camera.position.x = -206.50292519795264;
  oficinaPlantaBaja.camera.position.y = 3.0860763399716187;
  oficinaPlantaBaja.camera.position.z = 23.660157690574614;
  savedViewpoints.push({ title: 'Oficina Planta Baja', vp: oficinaPlantaBaja });

  
  const comedorPlanta2 = viewpoints.create(world, { title: 'comedorPlanta2' });
  comedorPlanta2.camera.direction.x = -0.9986970633863199;
  comedorPlanta2.camera.direction.y = 0.04587741992118469;
  comedorPlanta2.camera.direction.z = -0.022348107859856192;
  comedorPlanta2.camera.position.x = -199.05300720702775;
  comedorPlanta2.camera.position.y = 10.131827565918657;
  comedorPlanta2.camera.position.z = 39.57050243866512;
  savedViewpoints.push({ title: 'Comedor Planta 2', vp: comedorPlanta2 });

  const planta3= viewpoints.create(world, { title: 'cocina planta 3' });
  planta3.camera.direction.x =  -0.8418443470926918;
  planta3.camera.direction.y = -0.13274142739518308;
  planta3.camera.direction.z = 0.523142245207906;
  planta3.camera.position.x = -202.1046866527882;
  planta3.camera.position.y =13.606982334423725;
  planta3.camera.position.z = 28.95760559089083
  savedViewpoints.push({ title: 'Tercera planta', vp: planta3});

  const piscina= viewpoints.create(world, { title: 'piscina' });
  piscina.camera.direction.x =  0.3533624819087293;
  piscina.camera.direction.y = -0.30055634227229816;
  piscina.camera.direction.z =-0.8858898585598551;
  piscina.camera.position.x =  -211.6844675727133;
  piscina.camera.position.y =3.7392577176299504;
  piscina.camera.position.z = 60.821053829179704
  savedViewpoints.push({ title: 'Piscina', vp: piscina});



  const myPanel = `<div id="panel"></div>`
  document.querySelector<HTMLDivElement>(
    "#container"
  )!.insertAdjacentHTML('beforeend', myPanel)
  const categoriesPanelanel = `<div id="categoriesPanel"></div>`
  
  document.querySelector<HTMLDivElement>("#container")!.insertAdjacentHTML('beforeend', categoriesPanelanel)
  const anotherPanel = document.getElementById('categoriesPanel');
  document.querySelector<HTMLDivElement>("#panel")!.appendChild(Panel(world, serializer, fragments, viewpoints, savedViewpoints))



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

