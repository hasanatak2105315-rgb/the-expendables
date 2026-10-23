import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'

// Tüm ürünler kod ile oluşturulmuş 3D modellerdir (dış dosya gerekmez).
// Gerçek modeller (.glb) geldiğinde useGLTF ile değiştirilebilir.

const PI = Math.PI

const Gun = () => <meshStandardMaterial color="#1b221e" metalness={0.85} roughness={0.32} />
const Steel = () => <meshStandardMaterial color="#a7b3ac" metalness={1} roughness={0.2} />
const Olive = () => <meshStandardMaterial color="#3d4a2c" metalness={0.05} roughness={0.85} />
const OliveDark = () => <meshStandardMaterial color="#2c3720" metalness={0.05} roughness={0.9} />
const Dark = () => <meshStandardMaterial color="#0a110d" metalness={0.4} roughness={0.55} />
const Brass = () => <meshStandardMaterial color="#b79c5c" metalness={1} roughness={0.28} />
const Glow = ({ intensity = 2.5, color = '#34d399' }) => (
  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
)

function Watch(props) {
  const minute = useRef()
  const hour = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    minute.current.rotation.z = -t * 0.6
    hour.current.rotation.z = -t * 0.05
  })
  return (
    <group {...props}>
      <RoundedBox args={[0.62, 1.15, 0.12]} radius={0.05} position={[0, 1.08, -0.06]}>
        <Olive />
      </RoundedBox>
      <RoundedBox args={[0.62, 1.15, 0.12]} radius={0.05} position={[0, -1.08, -0.06]}>
        <Olive />
      </RoundedBox>
      {[1.2, -1.2].map((y) => (
        <mesh key={y} position={[0, y, 0.01]}>
          <boxGeometry args={[0.64, 0.05, 0.03]} />
          <Gun />
        </mesh>
      ))}
      <mesh rotation-x={PI / 2}>
        <cylinderGeometry args={[0.74, 0.74, 0.3, 64]} />
        <Gun />
      </mesh>
      <mesh position-z={0.16}>
        <torusGeometry args={[0.68, 0.065, 16, 72]} />
        <Steel />
      </mesh>
      <mesh position-z={0.152}>
        <circleGeometry args={[0.63, 64]} />
        <meshStandardMaterial color="#06100a" roughness={0.6} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * PI * 2
        const big = i % 3 === 0
        return (
          <mesh key={i} position={[Math.sin(a) * 0.5, Math.cos(a) * 0.5, 0.16]} rotation-z={-a}>
            <boxGeometry args={[big ? 0.05 : 0.025, big ? 0.14 : 0.08, 0.01]} />
            {big ? <Glow /> : <Steel />}
          </mesh>
        )
      })}
      <group ref={hour} position-z={0.17}>
        <mesh position-y={0.14}>
          <boxGeometry args={[0.05, 0.28, 0.012]} />
          <Steel />
        </mesh>
      </group>
      <group ref={minute} position-z={0.18}>
        <mesh position-y={0.2}>
          <boxGeometry args={[0.035, 0.42, 0.012]} />
          <Glow intensity={3} />
        </mesh>
      </group>
      <mesh position-z={0.19} rotation-x={PI / 2}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <Steel />
      </mesh>
      <mesh position-x={0.8} rotation-z={PI / 2}>
        <cylinderGeometry args={[0.08, 0.08, 0.14, 16]} />
        <Steel />
      </mesh>
      <mesh position-z={-0.152} rotation-y={PI}>
        <circleGeometry args={[0.6, 64]} />
        <Steel />
      </mesh>
      {[0.42, 0.3].map((r) => (
        <mesh key={r} position-z={-0.155}>
          <torusGeometry args={[r, 0.012, 8, 64]} />
          {r === 0.3 ? <Glow intensity={1.5} /> : <Gun />}
        </mesh>
      ))}
    </group>
  )
}

function DogTags(props) {
  const links = 34
  return (
    <group {...props}>
      <RoundedBox args={[0.9, 1.45, 0.05]} radius={0.22} smoothness={6} rotation-z={-0.14} position={[-0.18, -0.2, 0]}>
        <Steel />
      </RoundedBox>
      <RoundedBox args={[0.9, 1.45, 0.05]} radius={0.22} smoothness={6} rotation-z={0.16} position={[0.22, -0.32, -0.08]}>
        <Gun />
      </RoundedBox>
      {[0.25, 0.08, -0.09, -0.26].map((y, i) => (
        <mesh key={y} position={[-0.2 + y * 0.14, y - 0.2, 0.03]} rotation-z={-0.14}>
          <boxGeometry args={[i === 0 ? 0.55 : 0.42, 0.06, 0.01]} />
          {i === 0 ? <Glow intensity={2} /> : <meshStandardMaterial color="#5d6862" metalness={1} roughness={0.4} />}
        </mesh>
      ))}
      {Array.from({ length: links }).map((_, i) => {
        const a = (i / links) * PI * 2
        return (
          <mesh key={i} position={[Math.sin(a) * 0.75, 1.05 + Math.cos(a) * 0.55, -0.05]} rotation={[0, i % 2 ? PI / 2 : 0, -a]}>
            <torusGeometry args={[0.035, 0.012, 8, 16]} />
            <Steel />
          </mesh>
        )
      })}
    </group>
  )
}

function Glasses(props) {
  return (
    <group {...props}>
      {[-0.62, 0.62].map((x) => (
        <group key={x} position-x={x}>
          <mesh scale={[1, 0.85, 0.16]}>
            <sphereGeometry args={[0.55, 48, 32]} />
            <meshStandardMaterial color="#0d4a32" metalness={1} roughness={0.04} />
          </mesh>
          <mesh scale={[1, 0.85, 1]}>
            <torusGeometry args={[0.56, 0.03, 12, 64]} />
            <Brass />
          </mesh>
        </group>
      ))}
      <mesh position-y={0.18}>
        <torusGeometry args={[0.13, 0.025, 12, 32, PI]} />
        <Brass />
      </mesh>
      <mesh position={[0, 0.42, 0]} scale={[1, 1, 1]}>
        <boxGeometry args={[0.5, 0.025, 0.025]} />
        <Brass />
      </mesh>
      {[-1.17, 1.17].map((x) => (
        <mesh key={x} position={[x, 0.15, -0.65]}>
          <boxGeometry args={[0.035, 0.035, 1.3]} />
          <Brass />
        </mesh>
      ))}
    </group>
  )
}

function Flask(props) {
  return (
    <group {...props}>
      <mesh>
        <capsuleGeometry args={[0.6, 1.1, 16, 48]} />
        <Olive />
      </mesh>
      {[-0.25, 0.25].map((y) => (
        <mesh key={y} position-y={y} rotation-x={PI / 2}>
          <torusGeometry args={[0.605, 0.025, 12, 64]} />
          <Dark />
        </mesh>
      ))}
      <mesh rotation-x={PI / 2} position-y={0}>
        <torusGeometry args={[0.607, 0.012, 8, 64]} />
        <Glow />
      </mesh>
      <mesh position-y={1.2}>
        <cylinderGeometry args={[0.24, 0.3, 0.3, 32]} />
        <Steel />
      </mesh>
      <mesh position-y={1.42}>
        <cylinderGeometry args={[0.3, 0.3, 0.22, 32]} />
        <Gun />
      </mesh>
      <mesh position={[0.42, 1.42, 0]} rotation-x={PI / 2}>
        <torusGeometry args={[0.13, 0.03, 12, 24]} />
        <Steel />
      </mesh>
    </group>
  )
}

function Flashlight(props) {
  return (
    <group {...props}>
      <mesh>
        <cylinderGeometry args={[0.22, 0.22, 1.8, 32]} />
        <Gun />
      </mesh>
      {[-0.65, -0.5, -0.35, -0.2].map((y) => (
        <mesh key={y} position-y={y} rotation-x={PI / 2}>
          <torusGeometry args={[0.225, 0.022, 8, 32]} />
          <Dark />
        </mesh>
      ))}
      <mesh position-y={1.12}>
        <cylinderGeometry args={[0.36, 0.24, 0.5, 32]} />
        <Gun />
      </mesh>
      <mesh position-y={1.37} rotation-x={PI / 2}>
        <torusGeometry args={[0.34, 0.035, 12, 48]} />
        <Steel />
      </mesh>
      <mesh position-y={1.372} rotation-x={-PI / 2}>
        <circleGeometry args={[0.32, 48]} />
        <Glow intensity={4} color="#c8ffe4" />
      </mesh>
      <mesh position-y={-0.98}>
        <cylinderGeometry args={[0.24, 0.24, 0.16, 32]} />
        <Steel />
      </mesh>
      <mesh position={[0.22, 0.3, 0]}>
        <boxGeometry args={[0.06, 0.18, 0.12]} />
        <Glow intensity={1.5} />
      </mesh>
    </group>
  )
}

function Backpack(props) {
  return (
    <group {...props}>
      <RoundedBox args={[1.4, 1.8, 0.7]} radius={0.22} smoothness={5}>
        <Olive />
      </RoundedBox>
      <RoundedBox args={[1.1, 0.8, 0.28]} radius={0.1} position={[0, -0.38, 0.42]}>
        <OliveDark />
      </RoundedBox>
      <RoundedBox args={[1.14, 0.22, 0.32]} radius={0.06} position={[0, 0.06, 0.44]}>
        <Olive />
      </RoundedBox>
      {[0.42, 0.58, 0.74].map((y) => (
        <mesh key={y} position={[0, y, 0.36]}>
          <boxGeometry args={[1.2, 0.06, 0.02]} />
          <Dark />
        </mesh>
      ))}
      <mesh position={[0, -0.38, 0.57]}>
        <boxGeometry args={[0.36, 0.06, 0.01]} />
        <Glow />
      </mesh>
      <mesh position-y={0.92}>
        <torusGeometry args={[0.24, 0.05, 12, 32, PI]} />
        <Dark />
      </mesh>
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 0, -0.4]}>
          <boxGeometry args={[0.18, 1.6, 0.08]} />
          <Dark />
        </mesh>
      ))}
      {[-0.74, 0.74].map((x) => (
        <RoundedBox key={x} args={[0.16, 0.7, 0.5]} radius={0.06} position={[x, -0.45, 0]}>
          <OliveDark />
        </RoundedBox>
      ))}
    </group>
  )
}

function Lighter(props) {
  const flame = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    flame.current.scale.set(1, 1 + Math.sin(t * 12) * 0.08 + Math.sin(t * 7) * 0.05, 1)
  })
  return (
    <group {...props}>
      <RoundedBox args={[0.72, 1.05, 0.4]} radius={0.07} position-y={-0.3}>
        <Steel />
      </RoundedBox>
      <mesh position={[0, -0.3, 0.205]}>
        <boxGeometry args={[0.36, 0.04, 0.01]} />
        <Glow />
      </mesh>
      <group position={[0, 0.22, -0.2]} rotation-x={-1.95}>
        <RoundedBox args={[0.72, 0.42, 0.4]} radius={0.07} position={[0, 0.21, 0.2]}>
          <Steel />
        </RoundedBox>
      </group>
      <mesh position-y={0.42}>
        <boxGeometry args={[0.46, 0.4, 0.3]} />
        <meshStandardMaterial color="#c7cfca" metalness={1} roughness={0.35} />
      </mesh>
      {[-0.13, 0, 0.13].map((x) =>
        [0.34, 0.48].map((y) => (
          <mesh key={`${x}${y}`} position={[x, y, 0.151]}>
            <circleGeometry args={[0.035, 16]} />
            <Dark />
          </mesh>
        ))
      )}
      <mesh ref={flame} position-y={0.78}>
        <coneGeometry args={[0.1, 0.42, 24]} />
        <Glow intensity={4} color="#7cffb9" />
      </mesh>
    </group>
  )
}

function Compass(props) {
  const needle = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    needle.current.rotation.z = Math.sin(t * 0.9) * 0.35 + Math.sin(t * 2.3) * 0.08
  })
  return (
    <group {...props}>
      <mesh rotation-x={PI / 2}>
        <cylinderGeometry args={[0.82, 0.82, 0.24, 64]} />
        <Brass />
      </mesh>
      <mesh position-z={0.13}>
        <torusGeometry args={[0.78, 0.05, 16, 64]} />
        <Brass />
      </mesh>
      <mesh position-z={0.121}>
        <circleGeometry args={[0.74, 64]} />
        <meshStandardMaterial color="#06100a" roughness={0.7} />
      </mesh>
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * PI * 2
        const big = i % 6 === 0
        return (
          <mesh key={i} position={[Math.sin(a) * 0.62, Math.cos(a) * 0.62, 0.13]} rotation-z={-a}>
            <boxGeometry args={[big ? 0.05 : 0.02, big ? 0.14 : 0.07, 0.01]} />
            {big ? <Glow /> : <Brass />}
          </mesh>
        )
      })}
      <group ref={needle} position-z={0.15}>
        <mesh position-y={0.24}>
          <coneGeometry args={[0.07, 0.48, 4]} />
          <Glow intensity={3} />
        </mesh>
        <mesh position-y={-0.24} rotation-z={PI}>
          <coneGeometry args={[0.07, 0.48, 4]} />
          <Steel />
        </mesh>
      </group>
      <mesh position-z={0.16} rotation-x={PI / 2}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        <Brass />
      </mesh>
      <mesh position-z={-0.121} rotation-y={PI}>
        <circleGeometry args={[0.78, 64]} />
        <Brass />
      </mesh>
      <mesh position-z={-0.125}>
        <torusGeometry args={[0.45, 0.015, 8, 64]} />
        <Glow intensity={1.5} />
      </mesh>
      <mesh position-y={0.95} rotation-y={PI / 2}>
        <torusGeometry args={[0.14, 0.035, 12, 24]} />
        <Brass />
      </mesh>
    </group>
  )
}

function Headphones(props) {
  return (
    <group {...props}>
      <mesh position-y={-0.05}>
        <torusGeometry args={[0.95, 0.07, 16, 64, PI]} />
        <Gun />
      </mesh>
      <mesh position-y={-0.05} rotation-z={PI * 0.2}>
        <torusGeometry args={[0.88, 0.08, 16, 48, PI * 0.6]} />
        <OliveDark />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.98, -0.25, 0]}>
          <mesh rotation-z={PI / 2}>
            <cylinderGeometry args={[0.42, 0.42, 0.3, 48]} />
            <Gun />
          </mesh>
          <mesh position-x={-s * 0.19} rotation-y={PI / 2}>
            <torusGeometry args={[0.3, 0.11, 16, 48]} />
            <Dark />
          </mesh>
          <mesh position-x={s * 0.155} rotation-y={PI / 2}>
            <torusGeometry args={[0.3, 0.015, 8, 48]} />
            <Glow />
          </mesh>
          <mesh position-y={0.42}>
            <boxGeometry args={[0.08, 0.2, 0.1]} />
            <Steel />
          </mesh>
        </group>
      ))}
    </group>
  )
}

const MODELS = {
  watch: Watch,
  dogtags: DogTags,
  glasses: Glasses,
  flask: Flask,
  flashlight: Flashlight,
  backpack: Backpack,
  lighter: Lighter,
  compass: Compass,
  headphones: Headphones
}

// Her modelin kartta düzgün görünmesi için ölçek / açı ayarı
const FRAMING = {
  watch: { scale: 0.85, rotation: [0.15, -0.35, 0] },
  dogtags: { scale: 0.85, rotation: [0, 0.3, 0] },
  glasses: { scale: 0.95, rotation: [0.1, -0.5, 0] },
  flask: { scale: 0.75, rotation: [0.1, 0.4, 0] },
  flashlight: { scale: 0.8, rotation: [0.2, 0, -0.6] },
  backpack: { scale: 0.8, rotation: [0.1, -0.5, 0] },
  lighter: { scale: 1.05, rotation: [0.15, -0.5, 0] },
  compass: { scale: 0.9, rotation: [0.2, -0.3, 0] },
  headphones: { scale: 0.85, rotation: [0.15, -0.45, 0] }
}

export function Model({ type, ...props }) {
  const Comp = MODELS[type] ?? Watch
  const frame = FRAMING[type] ?? {}
  return (
    <group {...props}>
      <Comp scale={frame.scale} rotation={frame.rotation} />
    </group>
  )
}

export { Watch, DogTags, Compass }
