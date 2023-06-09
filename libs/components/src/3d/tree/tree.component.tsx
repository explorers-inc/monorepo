/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Plane: THREE.Mesh;
    Icosphere: THREE.Mesh;
    Icosphere001: THREE.Mesh;
    Icosphere002: THREE.Mesh;
    Icosphere003: THREE.Mesh;
    Icosphere004: THREE.Mesh;
  };
  materials: {
    brown: THREE.MeshStandardMaterial;
    green: THREE.MeshStandardMaterial;
  };
};

export function TreeModel(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(
    './assets/tree.glb'
  ) as unknown as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
        material={materials.brown}
        position={[-1, -2, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere.geometry}
        material={materials.green}
        position={[4.28, 5.28, 2.18]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere001.geometry}
        material={materials.green}
        position={[2.17, 3.08, 6.28]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere002.geometry}
        material={materials.green}
        position={[-4.16, 4.94, 1.95]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere003.geometry}
        material={materials.green}
        position={[1.79, 4.77, -1.42]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere004.geometry}
        material={materials.green}
        position={[-1.23, 4.86, -1.72]}
      />
    </group>
  );
}

useGLTF.preload('./assets/tree.glb');
