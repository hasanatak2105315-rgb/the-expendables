import { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Color, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, PMREMGenerator, RingGeometry, Scene } from 'three'

// Ortam haritası: üç ışık şeridi ve arkada bir halka (tamamen yerel, internetten HDR indirmez).
// Her renderer için yalnızca bir kez üretilir ve tüm sahnelerde paylaşılır. Eskiden her ürün kartı
// kendi ortam haritasını üretiyordu; kategori değişince kartlar aynı anda üretince ekran takılıyordu.
const PANELS = [
  ['rect', 3, [0, 4, 3], [8, 2], '#ffffff'],
  ['rect', 4, [-5, 0, 0], [6, 2], '#2fd8e6'],
  ['rect', 2, [5, 1, -1], [6, 2], '#ffb86b'],
  ['ring', 2, [0, 0, -6], [4, 4], '#0e5a66']
]
const envs = new WeakMap()

function studioEnv(gl) {
  if (envs.has(gl)) return envs.get(gl)
  const scene = new Scene()
  for (const [form, intensity, position, [w, h], color] of PANELS) {
    const geometry = form === 'ring' ? new RingGeometry(0.5, 1, 64) : new PlaneGeometry(1, 1)
    const material = new MeshBasicMaterial({ color: new Color(color).multiplyScalar(intensity), side: DoubleSide, toneMapped: false })
    const mesh = new Mesh(geometry, material)
    mesh.position.set(...position)
    mesh.scale.set(w, h, 1)
    mesh.lookAt(0, 0, 0)
    scene.add(mesh)
  }
  const pmrem = new PMREMGenerator(gl)
  const texture = pmrem.fromScene(scene, 0, 0.1, 100).texture
  pmrem.dispose()
  scene.traverse((o) => o.isMesh && (o.geometry.dispose(), o.material.dispose()))
  envs.set(gl, texture)
  return texture
}

// Ortak sinematik ışık kurulumu: soğuk beyaz ana ışık + turkuaz kontur ışığı
export function Studio({ intensity = 1 }) {
  const gl = useThree((s) => s.gl)
  const env = useMemo(() => studioEnv(gl), [gl])
  return (
    <>
      <ambientLight intensity={0.25 * intensity} />
      <directionalLight position={[3, 4, 5]} intensity={2.2 * intensity} color="#ecfdff" />
      <spotLight position={[-4, 2, -3]} angle={0.6} penumbra={1} intensity={40 * intensity} color="#14b8c6" />
      <pointLight position={[2, -2, 2]} intensity={3 * intensity} color="#2fd8e6" />
      <Environment map={env} />
    </>
  )
}
