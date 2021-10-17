import * as THREE from 'three'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'

function Banana({ z }) {
  const ref = useRef();
  const { nodes, materials } = useGLTF('/banana-v1-transformed.glb')
  const { viewport, camera } = useThree()
  const { width, height } = viewport.getCurrentViewport(camera, [0,0,z])

  const [ data ] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI
  })

  useFrame(() => {
    ref.current.rotation.set((data.rX += 0.001), (data.rY += 0.001), (data.rZ += 0.001));
    ref.current.position.set(data.x * width, (data.y += 0.02), z);
    if (data.y > height) {
      data.y = -height;
    }
  })

  return(
    <group ref={ref} dispose={null}>
      <mesh geometry={nodes.banana.geometry} material={materials.skin} rotation={[-Math.PI / 2, 0, 0]} material-emissive="orange"/>
    </group>
  )
}

export default function App({ count = 100, depth = 80}) {
  return (
    <Canvas gl={{ alpha: false }} camera={{ near: 0.01, far: 110, fov: 30 }}>
      <color attach="background" args={["#ffbf40"]}/>
      <pointLight position={10} intensity={1} />
      <Suspense fallback={null}>
        {Array.from({ length: count }, (_ , i) => (
          <Banana key={i} z={-(i / count) * depth - 10}/>
        ))}
        <Environment preset="sunset" />
      </Suspense>
      <EffectComposer>
        <DepthOfField target={[0, 0, depth/2 ]} focalLength={0.5} bokehScale={11} height={700} />
      </EffectComposer>
    </Canvas>
  )
}
