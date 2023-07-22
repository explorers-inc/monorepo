import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Grid, defineHex, rectangle } from 'honeycomb-grid';
import { useState } from 'react';
import { Field } from './field';
import { FieldCell } from './field-cell';

export default {
  component: Field,
};

const HexTile = defineHex();

export const Default = {
  render: () => {
    const [grid] = useState(
      new Grid(HexTile, rectangle({ width: 25, height: 15 }))
    );

    return (
      <Canvas
        camera={{ position: [0, 0, 50] }}
        style={{ background: '#eee', aspectRatio: '1' }}
      >
        {/* <MapControls /> */}
        <OrbitControls />
        <ambientLight />
        <pointLight />
        <Field grid={grid}>
          {Array.from(grid).map((hex) => {
            return (
              <FieldCell key={hex.toString()} tilePosition={[hex.q, hex.r]} />
            );
          })}
        </Field>
        {/* <OrthographicCamera
          makeDefault
          zoom={1}
          // todo update top, bot, left, right to put field in frame
          top={50}
          bottom={-50}
          left={50}
          right={-50}
          near={1}
          far={400}
          position={[0, 0, 100]}
          matrixWorldAutoUpdate={undefined}
          getObjectsByProperty={undefined}
        /> */}
      </Canvas>
    );
  },
};