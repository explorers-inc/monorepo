import { Canvas } from '@react-three/fiber';
import { SplashScene } from './splash-scene';

export default {
  component: SplashScene,
};

export const Default = {
  render: () => {
    return (
      <Canvas style={{ background: '#eee', aspectRatio: '1' }}>
        <SplashScene />
      </Canvas>
    );
  },
};
