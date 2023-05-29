import { isMainSceneFocusedStore } from '../state/layout';
import { useStore } from '@nanostores/react';
import { Box } from '@atoms/Box';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

export const HexMapScene = () => {
  const isMainSceneFocused = useStore(isMainSceneFocusedStore);

  return (
    <Box
      css={{
        background: 'paleturquoise',
        flexGrow: isMainSceneFocused ? 0 : 1,
        position: 'relative',
        transition: 'flex-grow 150ms',

        '@bp2': {
          flexGrow: 1,
          flexBasis: '70%',
        },
      }}
    >
      <Canvas camera={{ position: [0, 5, 20] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <HexagonalBoard />
      </Canvas>
    </Box>
  );
};

// Hexagon Shape
const Hexagon = (props: { position: THREE.Vector3; color: string }) => {
  const radius = 1;
  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, [radius]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} {...props}>
      <extrudeGeometry
        attach="geometry"
        args={[shape, { depth: 0.2, bevelEnabled: false }]}
      />
      <meshStandardMaterial attach="material" color={props.color} />
    </mesh>
  );
};

const Road = ({ color, ...props }: any) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} {...props}>
      <boxGeometry attach="geometry" args={[0.2, 0.2, 1]} />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  );
};

const House = ({ position, color }) => (
  <group position={position}>
    {/* Base of the house */}
    <mesh position={[0, 0.1, 0]}>
      <boxBufferGeometry args={[0.3, 0.2, 0.3]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* Roof of the house */}
    <mesh position={[0, 0.3, 0]}>
      <coneBufferGeometry args={[0.3, 0.2, 4]} />
      <meshStandardMaterial color={color} />
    </mesh>
    {/* Chimney */}
    <mesh position={[0.1, 0.3, 0]}>
      <boxBufferGeometry args={[0.1, 0.2, 0.1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  </group>
);

// Hexagonal Board Game Map
const HexagonalBoard = () => {
  const hexSize = 1;
  const width = 5;
  const height = 5;
  const spacingFactor = 1.05; // Adjust the spacing between hexagons
  const colors = ['green', 'orange'];
  const roadY = 0.2;

  const [hexagons, roads, houses] = useMemo(() => {
    const hexagons = [];
    const roads = [];
    const houses = [];

    // Positions and rotations for the six possible road locations per hexagon
    const roadPositions = [
      {
        position: [0, roadY, hexSize],
        rotation: [0, Math.PI / 2, 0],
      },
      {
        position: [0, roadY, -hexSize],
        rotation: [0, -Math.PI / 2, 0],
      },
      {
        position: [(hexSize * 3) / 4, roadY, hexSize / 2],
        rotation: [0, -Math.PI / 6, 0],
      },
      {
        position: [-(hexSize * 3) / 4, roadY, hexSize / 2],
        rotation: [0, Math.PI / 6, 0],
      },
      {
        position: [(hexSize * 3) / 4, roadY, -hexSize / 2],
        rotation: [0, Math.PI / 6, 0],
      },
      {
        position: [-(hexSize * 3) / 4, roadY, -hexSize / 2],
        rotation: [0, -Math.PI / 6, 0],
      },
    ];

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        // Add hexes
        const x = spacingFactor * ((col * 3) / 2) * hexSize;
        const z =
          spacingFactor *
          ((row * Math.sqrt(3) + (col % 2 ? Math.sqrt(3) / 2 : 0)) * hexSize);
        const color = colors[Math.floor(Math.random() * colors.length)]; // Randomly select a color for the hex
        hexagons.push({ position: [x, 0, z], key: `${row}-${col}`, color });

        // Randomly add roads
        const numRoads = Math.floor(Math.random() * 3); // Random number of roads from 0 to 2
        const roadIndices = Array.from({ length: numRoads }, () =>
          Math.floor(Math.random() * roadPositions.length)
        ); // Random indices for road positions
        const uniqueRoadIndices = [...new Set(roadIndices)]; // Remove duplicates

        for (const index of uniqueRoadIndices) {
          const {
            position: [rx, ry, rz],
            rotation,
          } = roadPositions[index];
          const roadColor = 'red';
          roads.push({
            position: [x + rx, ry, z + rz],
            rotation,
            key: `road-${row}-${col}-${index}`,
            color: roadColor,
          });
        }

        // Randomly add a house
        const houseProbability = 0.2;
        const addHouse = Math.random() < houseProbability;
        if (addHouse) {
          const houseColor = 'red';
          houses.push({
            position: [x, 0.2, z],
            key: `house-${row}-${col}`,
            color: houseColor,
          });
        }
      }
    }
    return [hexagons, roads, houses];
  }, [hexSize, width, height, spacingFactor, colors]);

  return (
    <group>
      {hexagons.map(({ position, key, color }) => (
        <Hexagon key={key} position={position} color={color} />
      ))}
      {roads.map(({ position, rotation, key, color }) => (
        <Road key={key} position={position} rotation={rotation} color={color} />
      ))}
      {houses.map(({ position, key, color }) => (
        <House key={key} position={position} color={color} />
      ))}
    </group>
  );
};
