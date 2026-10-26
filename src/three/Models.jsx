import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { CylinderGeometry, DoubleSide, Vector3 } from 'three'

// Tüm ürünler kod ile oluşturulmuş 3D modellerdir (dış dosya gerekmez).
// Gerçek modeller (.glb) geldiğinde useGLTF ile değiştirilebilir.

const PI = Math.PI

// Malzemeler
const Gold = () => <meshStandardMaterial color="#e3c16f" metalness={1} roughness={0.16} />
const Silver = () => <meshStandardMaterial color="#dfe7e3" metalness={1} roughness={0.12} />
const Gem = ({ color = '#10b981' }) => (
  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} metalness={0.2} roughness={0.02} flatShading />
)
const Pla = ({ color = '#6ee7b7', side }) => (
  <meshStandardMaterial color={color} metalness={0.05} roughness={0.55} flatShading side={side} />
)
const Silk = ({ color = '#34d399' }) => <meshStandardMaterial color={color} metalness={0.55} roughness={0.28} />
const Dark = () => <meshStandardMaterial color="#0a110d" metalness={0.3} roughness={0.6} />
const Glow = ({ intensity = 2.5, color = '#34d399' }) => (
  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
)

// Halka şeklinde zincir
function Chain({ rx = 0.75, ry = 0.55, y = 1.05, links = 34 }) {
  return Array.from({ length: links }).map((_, i) => {
    const a = (i / links) * PI * 2
    return (
      <mesh key={i} position={[Math.sin(a) * rx, y + Math.cos(a) * ry, 0]} rotation={[0, i % 2 ? PI / 2 : 0, -a]}>
        <torusGeometry args={[0.035, 0.012, 8, 16]} />
        <Gold />
      </mesh>
    )
  })
}

function Ring(props) {
  return (
    <group {...props}>
      <mesh>
        <torusGeometry args={[0.78, 0.12, 32, 96]} />
        <Gold />
      </mesh>
      <mesh position-y={0.94}>
        <cylinderGeometry args={[0.24, 0.14, 0.2, 8]} />
        <Gold />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * PI * 2 + PI / 4
        return (
          <mesh key={i} position={[Math.cos(a) * 0.22, 1.12, Math.sin(a) * 0.22]} rotation={[Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4]}>
            <cylinderGeometry args={[0.025, 0.03, 0.28, 8]} />
            <Gold />
          </mesh>
        )
      })}
      <mesh position-y={1.2} scale={[1, 0.85, 1]} rotation-y={PI / 8}>
        <octahedronGeometry args={[0.3, 0]} />
        <Gem />
      </mesh>
    </group>
  )
}

function Pendant(props) {
  return (
    <group {...props}>
      <Chain />
      <mesh position-y={0.38}>
        <torusGeometry args={[0.08, 0.025, 12, 24]} />
        <Gold />
      </mesh>
      <group position-y={-0.15}>
        <mesh scale={[0.62, 1, 0.38]}>
          <octahedronGeometry args={[0.5, 0]} />
          <Gem />
        </mesh>
        <mesh scale={[0.62, 1, 1]}>
          <torusGeometry args={[0.5, 0.03, 8, 4]} />
          <Gold />
        </mesh>
      </group>
    </group>
  )
}

function Earrings(props) {
  return (
    <group {...props}>
      {[-1, 1].map((s) => (
        <group key={s} position-x={s * 0.55} rotation={[0, s * 0.35, s * -0.08]}>
          <mesh position-y={0.85}>
            <torusGeometry args={[0.12, 0.022, 12, 32, PI * 1.3]} />
            <Gold />
          </mesh>
          <mesh>
            <torusGeometry args={[0.45, 0.045, 16, 64]} />
            <Gold />
          </mesh>
          <mesh position-y={-0.55}>
            <icosahedronGeometry args={[0.11, 0]} />
            <Gem />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Bracelet(props) {
  const beads = 22
  return (
    <group {...props}>
      {Array.from({ length: beads }).map((_, i) => {
        const a = (i / beads) * PI * 2
        const gem = i % 2 === 0
        return (
          <mesh key={i} position={[Math.cos(a) * 0.85, Math.sin(a) * 0.85, 0]}>
            {gem ? <icosahedronGeometry args={[0.11, 1]} /> : <sphereGeometry args={[0.09, 24, 16]} />}
            {gem ? <Gem color="#059669" /> : <Gold />}
          </mesh>
        )
      })}
      <mesh>
        <torusGeometry args={[0.85, 0.012, 8, 96]} />
        <Gold />
      </mesh>
      <group position={[0, -1.12, 0]}>
        <mesh position-y={0.1}>
          <torusGeometry args={[0.05, 0.015, 8, 16]} />
          <Gold />
        </mesh>
        <mesh rotation-x={PI / 2}>
          <cylinderGeometry args={[0.16, 0.16, 0.03, 32]} />
          <Gold />
        </mesh>
      </group>
    </group>
  )
}

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
        <Pla color="#6ee7b7" side={DoubleSide} />
      </mesh>
      <mesh position-y={-1.1} rotation-x={-PI / 2}>
        <circleGeometry args={[0.47, 10]} />
        <Pla color="#6ee7b7" />
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
          <meshStandardMaterial color="#d1fae5" roughness={0.5} flatShading transparent opacity={0.35} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.93, 1]} />
          <meshBasicMaterial color="#34d399" wireframe toneMapped={false} />
        </mesh>
      </group>
      <mesh position-y={0.2}>
        <sphereGeometry args={[0.38, 32, 16]} />
        <Glow intensity={3} color="#bbf7d0" />
      </mesh>
      <mesh position-y={-0.85}>
        <cylinderGeometry args={[0.35, 0.5, 0.3, 6]} />
        <Pla color="#14532d" />
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
        <Pla color="#f0fdf4" />
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
        <Pla color="#a3e635" />
      </RoundedBox>
      <mesh position={[-0.42, 0, 0.075]}>
        <circleGeometry args={[0.09, 24]} />
        <Dark />
      </mesh>
      <mesh position={[0.18, 0.16, 0.08]}>
        <boxGeometry args={[0.6, 0.12, 0.04]} />
        <Pla color="#14532d" />
      </mesh>
      <mesh position={[0.18, -0.08, 0.08]}>
        <boxGeometry args={[0.13, 0.4, 0.04]} />
        <Pla color="#14532d" />
      </mesh>
      <mesh position={[-0.42, 0, 0]} rotation-y={PI / 2}>
        <torusGeometry args={[0.32, 0.03, 12, 48]} />
        <Silver />
      </mesh>
    </group>
  )
}

const MODELS = {
  ring: Ring,
  pendant: Pendant,
  earrings: Earrings,
  bracelet: Bracelet,
  vase: Vase,
  lamp: Lamp,
  planter: Planter,
  sculpture: Sculpture,
  keychain: Keychain
}

// Her modelin kartta düzgün görünmesi için ölçek / açı ayarı
const FRAMING = {
  ring: { scale: 0.85, position: [0, -0.25, 0], rotation: [0.25, 0, 0] },
  pendant: { scale: 0.95, position: [0, -0.3, 0], rotation: [0, 0.3, 0] },
  earrings: { scale: 1.05, rotation: [0, 0, 0] },
  bracelet: { scale: 0.95, rotation: [0.5, 0, 0] },
  vase: { scale: 0.85, rotation: [0.15, 0, 0] },
  lamp: { scale: 0.95, rotation: [0.15, 0, 0] },
  planter: { scale: 1, rotation: [0.3, 0, 0] },
  sculpture: { scale: 1, rotation: [0.1, 0, 0] },
  keychain: { scale: 1.05, rotation: [0.2, -0.4, 0.1] }
}

export function Model({ type, ...props }) {
  const Comp = MODELS[type] ?? Ring
  const frame = FRAMING[type] ?? {}
  return (
    <group {...props}>
      <Comp scale={frame.scale} position={frame.position} rotation={frame.rotation} />
    </group>
  )
}

export { Ring, Pendant, Vase, Gold, Gem }
