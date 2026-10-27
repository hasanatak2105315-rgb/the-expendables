import { Environment, Lightformer } from '@react-three/drei'

// Ortak sinematik ışık kurulumu: soğuk beyaz ana ışık + turkuaz kontur ışığı.
// Ortam haritası tamamen yerel (internetten HDR indirmez).
export function Studio({ intensity = 1 }) {
  return (
    <>
      <ambientLight intensity={0.25 * intensity} />
      <directionalLight position={[3, 4, 5]} intensity={2.2 * intensity} color="#ecfdff" />
      <spotLight position={[-4, 2, -3]} angle={0.6} penumbra={1} intensity={40 * intensity} color="#14b8c6" />
      <pointLight position={[2, -2, 2]} intensity={3 * intensity} color="#2fd8e6" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={4} position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#2fd8e6" />
        <Lightformer form="rect" intensity={2} position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#ffb86b" />
        <Lightformer form="ring" intensity={2} position={[0, 0, -6]} scale={4} color="#0e5a66" />
      </Environment>
    </>
  )
}
