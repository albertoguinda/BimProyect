 import * as BUI from "@thatopen/ui";
import { SectionHeader } from "./SectionHeader";
import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";

export const PointCloud = async (selector: any, world: any, fragments: FRAGS.FragmentsModels, model : any) => {
    const response = await fetch("/nube_pisopiloto.xyz");
    const text = await response.text();
    const lines = text.split('\n');

    const positions: number[] = [];
    const colors: number[] = [];


    for (let line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 3) continue;

    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    const z = parseFloat(parts[2]);
    positions.push(x, y, z);

    if (parts.length >= 6) {
        const r = parseInt(parts[3]) / 255;
        const g = parseInt(parts[4]) / 255;
        const b = parseInt(parts[5]) / 255;
        colors.push(r, g, b);
    } else {
        colors.push(1, 1, 1); // blanco
    }
    }

    

  const visibleIds = await model.getItemsByVisibility(true);
  console.log(">>> Selector recibido en Attributes:", selector);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({ size: 0.02, vertexColors: true });
  const pointCloud = new THREE.Points(geometry, material);
  const pointCloudGroup = new THREE.Group();

  pointCloudGroup.add(pointCloud);

  pointCloudGroup.rotation.x = -Math.PI / 2;

  const addPointCloud = () => {
    
    world.scene.three.add(pointCloudGroup);
 
    pointCloudGroup.position.set(-12.2, -0.7, -4.7);
    const pointCloudButton = document.getElementById("pointCloudButton");
    pointCloudButton?.classList.add("hidden");
    const displayIFCButton = document.getElementById("displayIFCButton");
    displayIFCButton?.classList.remove("hidden");
    const goIFC = document.getElementById("goIFC");
    goIFC?.classList.remove("hidden");
    console.log(pointCloud)
  }

  const goIFC = async () => {
    // world.camera.controls.setLookAt(-60, 30, -20, 0, 0, -20);
    world.scene.three.remove(pointCloudGroup);
    const pointCloudButton = document.getElementById("pointCloudButton");
    pointCloudButton?.classList.remove("hidden");
    const goIFC = document.getElementById("goIFC");
    goIFC?.classList.add("hidden");
    const displayIFCButton = document.getElementById("displayIFCButton");
    displayIFCButton?.classList.add("hidden"); 
    const showIFCButton = document.getElementById("showIFCButton");
    showIFCButton?.classList.add("hidden");
    await model.setVisible(visibleIds, true);
    await fragments.update(true);
  }

  const displayIFC = async () => {
    await model.setVisible(visibleIds, false);
    await fragments.update(true);
    const displayIFCButton = document.getElementById("displayIFCButton");
    displayIFCButton?.classList.add("hidden");
    const showIFCButton = document.getElementById("showIFCButton");
    showIFCButton?.classList.remove("hidden");
    console.log(visibleIds)
  }

  const showIFC = async () => {
    await model.setVisible(visibleIds, true);
    await fragments.update(true);
    const displayIFCButton = document.getElementById("displayIFCButton");
    displayIFCButton?.classList.remove("hidden");
    const showIFCButton = document.getElementById("showIFCButton");
    showIFCButton?.classList.add("hidden");
  }

  return BUI.html`
  <section class="bimSection">
    ${SectionHeader("Nube de Puntos", true)}
    <div class="bimContent hidden space-y-4">
        <button
            id="pointCloudButton"
            class="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition w-1/2 cursor-pointer"
            @click=${addPointCloud}
        >
            Cargar Nube de puntos
        </button>
        <button
            id="goIFC"
            class="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700 transition w-1/2 cursor-pointer hidden"
            @click=${goIFC}
        >
            Quitar Nube de puntos
        </button>

        <button
            id="displayIFCButton"
            class="bg-purple-600 text-white text-xs px-2 py-1 rounded hover:bg-purple-700 transition w-1/2 cursor-pointer hidden"
            @click=${displayIFC}
        >
            Ocultar IFC
        </button>

        <button
            id="showIFCButton"
            class="bg-purple-600 text-white text-xs px-2 py-1 rounded hover:bg-purple-700 transition w-1/2 cursor-pointer hidden"
            @click=${showIFC}
        >
            Mostrar IFC
        </button>
        
    </div>
  </section>
`;
};
