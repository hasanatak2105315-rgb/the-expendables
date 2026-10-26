import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CatmullRomCurve3, LatheGeometry, MathUtils, Quaternion, Vector2, Vector3 } from 'three'
import { Model, Gold, Gem } from './Models'
import { getTryOn } from '../store/tryon'

// Kodla çizilmiş vitrin mankeni. Kartın üzerine gelinen ürün mankenin üstünde belirir:
// takılar takılır (kulak, boyun, parmak, bilek), 3D baskı ürünleri avuçta süzülür.

const PI = Math.PI
const UP = new Vector3(0, 1, 0)
const FWD = new Vector3(0, 0, 1)

const Skin = () => <meshPhysicalMaterial color="#22362c" roughness={0.38} metalness={0.15} clearcoat={1} clearcoatRoughness={0.25} />
const Stand = () => <meshStandardMaterial color="#0a110d" metalness={0.8} roughness={0.3} />

// Havada tutulan elin bilek noktası ve önkol yönü (yüzük, bileklik ve avuçtaki ürün buna göre yerleşir)
const ELBOW = new Vector3(-0.46, 0.32, 0.06)
const WRIST = new Vector3(-0.22, 0.42, 0.4)
const ARM_DIR = WRIST.clone().sub(ELBOW).normalize()
const HAND_QUAT = new Quaternion().setFromUnitVectors(FWD, ARM_DIR)
const PALM = WRIST.clone().addScaledVector(ARM_DIR, 0.07)

// Her ürün tipi için kameranın bakacağı yer
const FOCUS = {
  none: { target: [0, 0.2, 0], cam: [0, 0.55, 6.6] },
  earrings: { target: [0, 1.22, 0], cam: [1.0, 1.4, 1.75] },
  pendant: { target: [0, 0.78, 0.1], cam: [0.35, 1.05, 3.1] },
  ring: { target: [PALM.x, PALM.y + 0.02, PALM.z + 0.05], cam: [PALM.x + 0.4, PALM.y + 0.4, PALM.z + 0.95] },
  hand: { target: [PALM.x, PALM.y + 0.03, PALM.z], cam: [PALM.x + 0.7, PALM.y + 0.6, PALM.z + 1.75] },
  object: { target: [PALM.x, PALM.y + 0.14, PALM.z], cam: [PALM.x - 0.55, PALM.y + 0.55, PALM.z + 2.1] }
}
const focusOf = (model) => {
  if (!model) return FOCUS.none
  if (model === 'earrings' || model === 'pendant' || model === 'ring') return FOCUS[model]
  if (model === 'bracelet') return FOCUS.hand
  return FOCUS.object
}

// İki nokta arasında kapsül (kol parçaları)
function Limb({ from, to, r }) {
  const { pos, quat, len } = useMemo(() => {
    const a = new Vector3(...from)
    const b = new Vector3(...to)
    const dir = b.clone().sub(a)
    return {
      pos: a.add(b).multiplyScalar(0.5),
      quat: new Quaternion().setFromUnitVectors(UP, dir.clone().normalize()),
      len: dir.length()
    }
  }, [from, to])
  return (
    <mesh position={pos} quaternion={quat}>
      <capsuleGeometry args={[r, len, 8, 20]} />
      <Skin />
    </mesh>
  )
}

function Hand() {
  return (
    <group position={WRIST} quaternion={HAND_QUAT}>
      <mesh position-z={0.07} scale={[0.058, 0.022, 0.075]}>
        <sphereGeometry args={[1, 24, 16]} />
        <Skin />
      </mesh>
      {[-0.036, -0.012, 0.012, 0.036].map((x, i) => (
        <mesh key={x} position={[x, 0.004, 0.15 + (i === 1 || i === 2 ? 0.008 : 0)]} rotation-x={PI / 2 - 0.15}>
          <capsuleGeometry args={[0.011, i === 1 || i === 2 ? 0.07 : 0.055, 4, 10]} />
          <Skin />
        </mesh>
      ))}
      <mesh position={[0.06, 0.008, 0.07]} rotation={[PI / 2, 0, -0.7]}>
        <capsuleGeometry args={[0.012, 0.05, 4, 10]} />
        <Skin />
      </mesh>
    </group>
  )
}

function Body() {
  const torso = useMemo(() => {
    const pts = [
      [0.001, -0.3], [0.2, -0.29], [0.27, -0.18], [0.25, 0.02], [0.27, 0.22], [0.32, 0.44],
      [0.33, 0.6], [0.3, 0.74], [0.22, 0.84], [0.12, 0.9], [0.075, 0.93]
    ].map(([x, y]) => new Vector2(x, y))
    return new LatheGeometry(pts, 64)
  }, [])

  return (
    <group>
      <mesh geometry={torso} scale={[1.25, 1, 0.72]}>
        <Skin />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.37, 0.72, 0]} scale={[1, 0.85, 0.9]}>
          <sphereGeometry args={[0.11, 24, 16]} />
          <Skin />
        </mesh>
      ))}
      {/* boyun ve baş */}
      <mesh position-y={1.02} rotation-x={0.08}>
        <cylinderGeometry args={[0.068, 0.08, 0.24, 24]} />
        <Skin />
      </mesh>
      <mesh position={[0, 1.33, 0.01]} scale={[0.82, 1.05, 0.92]}>
        <sphereGeometry args={[0.2, 48, 32]} />
        <Skin />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.163, 1.31, -0.005]} scale={[0.35, 1, 0.6]}>
          <sphereGeometry args={[0.045, 16, 12]} />
          <Skin />
        </mesh>
      ))}
      {/* sarkan kol */}
      <Limb from={[0.4, 0.72, 0]} to={[0.47, 0.3, 0.02]} r={0.06} />
      <Limb from={[0.47, 0.3, 0.02]} to={[0.5, -0.08, 0.08]} r={0.05} />
      {/* havada tutulan kol */}
      <Limb from={[-0.4, 0.72, 0]} to={ELBOW.toArray()} r={0.06} />
      <Limb from={ELBOW.toArray()} to={WRIST.toArray()} r={0.045} />
      <Hand />
      {/* ayak */}
      <mesh position-y={-0.85}>
        <cylinderGeometry args={[0.022, 0.022, 1.1, 16]} />
        <Stand />
      </mesh>
      <mesh position-y={-1.4}>
        <cylinderGeometry args={[0.32, 0.36, 0.05, 48]} />
        <Stand />
      </mesh>
    </group>
  )
}

// Seçilen ürüne göre büyüyüp küçülerek beliren parça
function Piece({ show, position, quaternion, children }) {
  const ref = useRef()
  useFrame((state, dt) => {
    const model = getTryOn()?.model
    const on = Array.isArray(show) ? show.includes(model) : model === show
    const s = MathUtils.damp(ref.current.scale.x, on ? 1 : 0, on ? 6 : 10, dt)
    ref.current.scale.setScalar(s)
    ref.current.visible = s > 0.003
  })
  return (
    <group ref={ref} position={position} quaternion={quaternion} scale={0}>
      {children}
    </group>
  )
}

function Earring({ side }) {
  return (
    <group rotation-y={side * 0.7}>
      <mesh position-y={-0.004}>
        <torusGeometry args={[0.008, 0.0025, 8, 16, PI * 1.3]} />
        <Gold />
      </mesh>
      <mesh position-y={-0.05}>
        <torusGeometry args={[0.04, 0.0045, 12, 48]} />
        <Gold />
      </mesh>
      <mesh position-y={-0.1}>
        <icosahedronGeometry args={[0.011, 0]} />
        <Gem />
      </mesh>
    </group>
  )
}

const NECK_ANCHOR = new Vector3(0, 0.66, 0.25)

function Necklace() {
  const curve = useMemo(() => {
    const half = [[0, 0.95, -0.085], [0.1, 0.93, -0.035], [0.14, 0.86, 0.12], [0.1, 0.76, 0.225], [0.035, 0.69, 0.248]]
    const pts = [...half, ...half.slice(1).reverse().map(([x, y, z]) => [-x, y, z])]
    return new CatmullRomCurve3(pts.map((p) => new Vector3(...p).sub(NECK_ANCHOR)), true)
  }, [])
  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 160, 0.0035, 6, true]} />
        <Gold />
      </mesh>
      <mesh position={[0, -0.008, 0]}>
        <torusGeometry args={[0.009, 0.0028, 8, 16]} />
        <Gold />
      </mesh>
      <group position={[0, -0.05, 0.006]}>
        <mesh scale={[0.62, 1, 0.38]}>
          <octahedronGeometry args={[0.038, 0]} />
          <Gem />
        </mesh>
        <mesh scale={[0.62, 1, 1]}>
          <torusGeometry args={[0.038, 0.0025, 6, 4]} />
          <Gold />
        </mesh>
      </group>
    </>
  )
}

function FingerRing() {
  return (
    <>
      <mesh>
        <torusGeometry args={[0.016, 0.0055, 12, 32]} />
        <Gold />
      </mesh>
      <mesh position-y={0.026} scale={[1, 0.85, 1]}>
        <octahedronGeometry args={[0.016, 0]} />
        <Gem />
      </mesh>
    </>
  )
}

function WristBracelet() {
  const beads = 18
  return (
    <>
      {Array.from({ length: beads }).map((_, i) => {
        const a = (i / beads) * PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.056, Math.sin(a) * 0.05, 0]}>
            {i % 2 ? <sphereGeometry args={[0.011, 12, 8]} /> : <icosahedronGeometry args={[0.013, 0]} />}
            {i % 2 ? <Gold /> : <Gem color="#059669" />}
          </mesh>
        )
      })}
      <mesh position={[0, -0.075, 0]} rotation-x={PI / 2}>
        <cylinderGeometry args={[0.016, 0.016, 0.004, 24]} />
        <Gold />
      </mesh>
    </>
  )
}

// Avuçta süzülen 3D baskı ürünü
function Floating({ type }) {
  const ref = useRef()
  useFrame((state, dt) => {
    ref.current.rotation.y += dt * 0.8
    ref.current.position.y = 0.18 + Math.sin(state.clock.elapsedTime * 2) * 0.012
  })
  return (
    <group ref={ref}>
      <Model type={type} scale={0.1} />
    </group>
  )
}

const OBJECTS = ['vase', 'lamp', 'planter', 'sculpture', 'keychain']

export function Mannequin() {
  const root = useRef()
  const target = useRef(new Vector3(...FOCUS.none.target))
  const camPos = useMemo(() => new Vector3(), [])
  const look = useMemo(() => new Vector3(), [])
  const glow = useRef()

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const f = focusOf(getTryOn()?.model)
    // kamera seçilen bölgeye yumuşakça yaklaşır, hafifçe salınır
    camPos.set(f.cam[0] + Math.sin(t * 0.4) * 0.08, f.cam[1] + Math.sin(t * 0.3) * 0.03, f.cam[2])
    state.camera.position.lerp(camPos, 1 - Math.exp(-2.5 * dt))
    look.set(...f.target)
    target.current.lerp(look, 1 - Math.exp(-3 * dt))
    state.camera.lookAt(target.current)
    root.current.rotation.y = Math.sin(t * 0.25) * 0.06
    // avuçtaki ışık halkası yalnızca 3D baskı ürünlerinde
    const on = OBJECTS.includes(getTryOn()?.model)
    glow.current.material.opacity = MathUtils.damp(glow.current.material.opacity, on ? 0.9 : 0, 5, dt)
  })

  return (
    <group ref={root}>
      <Body />
      {[-1, 1].map((s) => (
        <Piece key={s} show="earrings" position={[s * 0.166, 1.27, 0.005]}>
          <Earring side={s} />
        </Piece>
      ))}
      <Piece show="pendant" position={NECK_ANCHOR}>
        <Necklace />
      </Piece>
      <group position={WRIST} quaternion={HAND_QUAT}>
        <Piece show="ring" position={[-0.012, 0.004, 0.135]}>
          <FingerRing />
        </Piece>
        <Piece show="bracelet" position={[0, 0, -0.01]}>
          <WristBracelet />
        </Piece>
      </group>
      <group position={PALM}>
        {OBJECTS.map((type) => (
          <Piece key={type} show={type}>
            <Floating type={type} />
          </Piece>
        ))}
        <mesh ref={glow} position-y={0.03} rotation-x={-PI / 2}>
          <ringGeometry args={[0.07, 0.085, 48]} />
          <meshBasicMaterial color="#6ee7b7" transparent opacity={0} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}
