import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { CylinderGeometry, DoubleSide, Vector3 } from 'three'
import { Tshirt, Sweatshirt, Hoodie, Joggers, Tracksuit } from './Apparel'

// Tüm ürünler kod ile oluşturulmuş 3D modellerdir (dış dosya gerekmez).
// Gerçek modeller (.glb) geldiğinde useGLTF ile değiştirilebilir.

const PI = Math.PI

// Malzemeler
const Silver = () => <meshStandardMaterial color="#dfe7e3" metalness={1} roughness={0.12} />
const Pla = ({ color = '#7de8f2', side }) => (
  <meshStandardMaterial color={color} metalness={0.05} roughness={0.55} flatShading side={side} />
)
const Silk = ({ color = '#2fd8e6' }) => <meshStandardMaterial color={color} metalness={0.55} roughness={0.28} />
const Dark = () => <meshStandardMaterial color="#08161a" metalness={0.3} roughness={0.6} />
const Glow = ({ intensity = 2.5, color = '#2fd8e6' }) => (
  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
)

// 3D baskı kıvrımlı vazo: silindirin köşeleri yükseklikle bükülür
function Vase(props) {
  const geo = useMemo(() => {
    const g = new CylinderGeometry(1, 1, 2.2, 10, 40, true)
    const p = g.attributes.position
    const v = new Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      const t = (v.y + 1.1) / 2.2
      const r = 0.42 + 0.3 * Math.sin(t * PI * 1.15 + 0.15)
      const a = t * PI * 0.9
      const x = v.x * r
      const z = v.z * r
      p.setXYZ(i, x * Math.cos(a) - z * Math.sin(a), v.y, x * Math.sin(a) + z * Math.cos(a))
    }
    g.computeVertexNormals()
    return g
  }, [])
  return (
    <group {...props}>
      <mesh geometry={geo}>
        <Pla color="#ffb86b" side={DoubleSide} />
      </mesh>
      <mesh position-y={-1.1} rotation-x={-PI / 2}>
        <circleGeometry args={[0.47, 10]} />
        <Pla color="#ffb86b" />
      </mesh>
    </group>
  )
}

function Lamp(props) {
  const shell = useRef()
  useFrame((_, dt) => (shell.current.rotation.y += dt * 0.2))
  return (
    <group {...props}>
      <group ref={shell} position-y={0.2}>
        <mesh>
          <icosahedronGeometry args={[0.92, 1]} />
          <meshStandardMaterial color="#cffafe" roughness={0.5} flatShading transparent opacity={0.35} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.93, 1]} />
          <meshBasicMaterial color="#2fd8e6" wireframe toneMapped={false} />
        </mesh>
      </group>
      <mesh position-y={0.2}>
        <sphereGeometry args={[0.38, 32, 16]} />
        <Glow intensity={3} color="#ffe4c4" />
      </mesh>
      <mesh position-y={-0.85}>
        <cylinderGeometry args={[0.35, 0.5, 0.3, 6]} />
        <Pla color="#0e5a66" />
      </mesh>
    </group>
  )
}

function Planter(props) {
  const leaves = 9
  return (
    <group {...props}>
      <mesh position-y={-0.4}>
        <cylinderGeometry args={[0.72, 0.5, 1, 6]} />
        <Pla color="#fff7ed" />
      </mesh>
      <mesh position-y={0.095} rotation-x={-PI / 2}>
        <circleGeometry args={[0.66, 6]} />
        <Dark />
      </mesh>
      {Array.from({ length: leaves }).map((_, i) => {
        const a = (i / leaves) * PI * 2
        const inner = i % 3 === 0
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * (inner ? 0.1 : 0.28), 0.35, Math.sin(a) * (inner ? 0.1 : 0.28)]}
            rotation={[Math.sin(a) * (inner ? 0.25 : 0.7), 0, -Math.cos(a) * (inner ? 0.25 : 0.7)]}
          >
            <coneGeometry args={[0.14, inner ? 0.75 : 0.6, 5]} />
            <Pla color={inner ? '#4ade80' : '#16a34a'} />
          </mesh>
        )
      })}
    </group>
  )
}

function Sculpture(props) {
  return (
    <group {...props}>
      <mesh position-y={0.25}>
        <torusKnotGeometry args={[0.55, 0.17, 220, 24, 2, 3]} />
        <Silk />
      </mesh>
      <mesh position-y={-0.85}>
        <cylinderGeometry args={[0.45, 0.5, 0.18, 48]} />
        <Dark />
      </mesh>
      <mesh position-y={-0.755} rotation-x={PI / 2}>
        <torusGeometry args={[0.45, 0.012, 8, 64]} />
        <Glow intensity={1.5} />
      </mesh>
    </group>
  )
}

function Keychain(props) {
  return (
    <group {...props}>
      <RoundedBox args={[1.3, 0.75, 0.14]} radius={0.12} smoothness={5}>
        <Pla color="#ffb86b" />
      </RoundedBox>
      <mesh position={[-0.42, 0, 0.075]}>
        <circleGeometry args={[0.09, 24]} />
        <Dark />
      </mesh>
      <mesh position={[0.18, 0.16, 0.08]}>
        <boxGeometry args={[0.6, 0.12, 0.04]} />
        <Pla color="#0e5a66" />
      </mesh>
      <mesh position={[0.18, -0.08, 0.08]}>
        <boxGeometry args={[0.13, 0.4, 0.04]} />
        <Pla color="#0e5a66" />
      </mesh>
      <mesh position={[-0.42, 0, 0]} rotation-y={PI / 2}>
        <torusGeometry args={[0.32, 0.03, 12, 48]} />
        <Silver />
      </mesh>
    </group>
  )
}

const MODELS = {
  tshirt: Tshirt,
  sweatshirt: Sweatshirt,
  hoodie: Hoodie,
  joggers: Joggers,
  tracksuit: Tracksuit,
  vase: Vase,
  lamp: Lamp,
  planter: Planter,
  sculpture: Sculpture,
  keychain: Keychain
}

// Her modelin kartta düzgün görünmesi için ölçek / açı ayarı
const FRAMING = {
  tshirt: { scale: 0.95, rotation: [0.05, 0, 0] },
  sweatshirt: { scale: 0.92, rotation: [0.05, 0, 0] },
  hoodie: { scale: 0.88, position: [0, -0.08, 0], rotation: [0.05, 0, 0] },
  joggers: { scale: 1.05, rotation: [0.05, 0, 0] },
  tracksuit: { scale: 1.05, rotation: [0.05, 0, 0] },
  vase: { scale: 0.85, rotation: [0.15, 0, 0] },
  lamp: { scale: 0.95, rotation: [0.15, 0, 0] },
  planter: { scale: 1, rotation: [0.3, 0, 0] },
  sculpture: { scale: 1, rotation: [0.1, 0, 0] },
  keychain: { scale: 1.05, rotation: [0.2, -0.4, 0.1] }
}

// Giyimde ürünün rengi ve baskı yazısı da modele geçer (color, color2, print)
export function Model({ type, color, color2, print, ...props }) {
  const Comp = MODELS[type] ?? Tshirt
  const frame = FRAMING[type] ?? {}
  const look = Object.fromEntries(Object.entries({ color, color2, print }).filter(([, v]) => v !== undefined))
  return (
    <group {...props}>
      <Comp scale={frame.scale} position={frame.position} rotation={frame.rotation} {...look} />
    </group>
  )
}

export { Vase, Keychain }
