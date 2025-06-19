
import * as THREE from "three";

export function createCube(world : any, color = "#6528D7", opacity = 0.2) {
    const material = new THREE.MeshLambertMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
    });
    const geometry = new THREE.BoxGeometry();
    const cube = new THREE.Mesh(geometry, material);
  
    const position = {
      x: (Math.random() - 0.5) * 10, // entre -5 y 5
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 10,
    };
    
    cube.position.set(position.x, position.y, position.z);
    world.scene.three.add(cube);
  
    cube.rotation.x += Math.PI / 4.2;
    cube.rotation.y += Math.PI / 4.2;
    cube.rotation.z += Math.PI / 4.2;
    cube.updateMatrixWorld();
  
    return cube;
  }
  