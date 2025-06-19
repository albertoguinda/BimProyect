import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import * as THREE from "three";
import * as BUI from "@thatopen/ui";
import { SectionHeader } from "./SectionHeader";

export default function NPCLoad(world: any) {
  let npcObjects: THREE.Object3D[] = [];
  let isNPCActive = false;

  const humanRoutes = [
    new THREE.Vector3(-20, 0, 8),
    new THREE.Vector3(-2, 0, 5),
    new THREE.Vector3(-2, 0, 2.5),
    new THREE.Vector3(1, 0, 2),
    new THREE.Vector3(1, 5.6, -7),
    new THREE.Vector3(-2, 5.6, -7),
    new THREE.Vector3(-2, 8.4, -3),
    new THREE.Vector3(2, 8.4, 2),
    new THREE.Vector3(-2, 8.4, -3),
    new THREE.Vector3(-2, 5.6, -7),
    new THREE.Vector3(1, 5.6, -7),
    new THREE.Vector3(1, 0, 2),
    new THREE.Vector3(-2, 0, 2.5),
    new THREE.Vector3(-2, 0, 5),
    new THREE.Vector3(-4, 0, 6),
    new THREE.Vector3(-20, 0, 8),
  ];

  const newHumanRoutes = [
    new THREE.Vector3(-20, 0.17, -15),
    new THREE.Vector3(-8, 0.17, -17),
    new THREE.Vector3(-9, 0.17, -23),
    new THREE.Vector3(-4, 0.17, -23),
    new THREE.Vector3(-2.5, 0.17, -18),
    new THREE.Vector3(2.5, 0.17, -9),
    new THREE.Vector3(17, 0.17, -8),
    new THREE.Vector3(17, 0.17, -14),
  ];

  async function loadFBXModels(route: any, numberOfCharacters: number) {
    const loader = new FBXLoader();

    try {
      const fbx = await loader.loadAsync("/human.fbx");
      const humans: THREE.Object3D[] = [];

      const currentRoutePoints = Array.from({ length: numberOfCharacters }, () => 0);
      const moveSpeeds = Array.from({ length: numberOfCharacters }, () => 0.02 + Math.random() * 0.03);

      for (let i = 0; i < numberOfCharacters; i++) {
        const human = fbx.clone();
        human.scale.set(0.005, 0.005, 0.005);

        const minX = -60, maxX = -20;
        const minZ = -40, maxZ = 10;
        const initialY = route[0].y;

        const randomX = minX + Math.random() * (maxX - minX);
        const randomZ = minZ + Math.random() * (maxZ - minZ);

        human.position.set(randomX, initialY, randomZ);

        if (world.scene) world.scene.three.add(human);
        humans.push(human);
      }

      npcObjects.push(...humans);

      function animate() {
        for (let i = 0; i < humans.length; i++) {
          animateHuman(humans[i], i, route, currentRoutePoints, moveSpeeds);
        }
        requestAnimationFrame(animate);
      }

      animate();
    } catch (error) {
      console.error("Error al cargar el modelo FBX:", error);
    }
  }

  function animateHuman(
    human: THREE.Object3D,
    index: number,
    route: any,
    currentRoutePoints: any,
    moveSpeeds: any
  ) {
    const targetPoint = route[currentRoutePoints[index]];
    if (targetPoint) {
      const direction = new THREE.Vector3()
        .subVectors(targetPoint, human.position)
        .normalize();
      const moveVector = direction.multiplyScalar(moveSpeeds[index]);
      human.position.add(moveVector);
      const distance = human.position.distanceTo(targetPoint);
      if (distance < 0.2) {
        currentRoutePoints[index]++;
        if (currentRoutePoints[index] >= route.length) {
          currentRoutePoints[index] = 0;
        }
      }
      human.lookAt(targetPoint);
    }
  }

  

  function toggleNPCs() {
    const toggleBtn = document.getElementById("toggleNPC");
    const plus10NpcButton = document.getElementById("plus10");
    const takeOff10NpcButton = document.getElementById("takeOff10");
    if (isNPCActive) {
      removeAllNPCs();
      isNPCActive = false;
      if (toggleBtn) toggleBtn.textContent = "Añadir NPC";
      plus10NpcButton?.classList.add("hidden")
      takeOff10NpcButton?.classList.add("hidden")
    } else {
      loadFBXModels(humanRoutes, 10);
      loadFBXModels(newHumanRoutes, 15);
      isNPCActive = true;
      if (toggleBtn) {
        toggleBtn.textContent = "Quitar NPC";
        plus10NpcButton?.classList.remove("hidden")
        takeOff10NpcButton?.classList.remove("hidden")
      }
      
    }
  }
  

  function add10NPCs() {
    // Añadir 5 a cada ruta para distribuir
    loadFBXModels(humanRoutes, 5);
    loadFBXModels(newHumanRoutes, 5);
  }

  function remove10NPCs() {
    const toRemove = npcObjects.splice(-10, 10);
    console.log(npcObjects.length)
    const toggleBtn = document.getElementById("toggleNPC");
    const plus10NpcButton = document.getElementById("plus10");
    const takeOff10NpcButton = document.getElementById("takeOff10");
    if(npcObjects.length === 0) {
      isNPCActive = false;
      if (toggleBtn) toggleBtn.textContent = "Añadir NPC";
      plus10NpcButton?.classList.add("hidden")
      takeOff10NpcButton?.classList.add("hidden")
    }
    for (const npc of toRemove) {
      world.scene.three.remove(npc);
    }
  }

  function removeAllNPCs() {
    for (let i = 0; i < npcObjects.length; i++) {
      world.scene.three.remove(npcObjects[i]);
    }
    npcObjects = [];
  }

  return BUI.html`
  <section class="bimSection">
    ${SectionHeader("Bots", true)}
    <div class="bimContent hidden flex gap-2">
      <button
      id="toggleNPC"
      class="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 transition cursor-pointer select-none"
      @click=${() => toggleNPCs()}
      >
        Añadir NPC
      </button>
      <button id="plus10"
        class="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700 transition cursor-pointer hidden select-none"
        @click=${() => add10NPCs()}
      >
        + 10 NPC
      </button>
      <button id="takeOff10"
        class="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700 transition cursor-pointer hidden select-none"
        @click=${() => remove10NPCs()}
      >
        - 10 NPC
      </button>
    </div>
  </section>
`;

}
