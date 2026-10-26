import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { AnimationMixer, CatmullRomCurve3, Euler, MathUtils, MeshPhysicalMaterial, Quaternion, Vector3 } from 'three'
import { Model, Gold, Gem } from './Models'
import { getTryOn } from '../store/tryon'

// Vitrin mankeni: gerçek insan oranlarında hazır model (public/models/mannequin.glb).
// Kaynak: three.js örneklerindeki "Xbot" (Adobe Mixamo). Yalnızca duruş animasyonu bırakıldı, sıkıştırıldı.
// Kartın üzerine gelinen ürün mankende belirir: takılar kemiklere bağlıdır (kulak, boyun, parmak, bilek),
// 3D baskı ürünleri avuçta süzülür.

const URL = '/models/mannequin.glb'
const PI = Math.PI
const SCALE = 1.7
const FLOOR = -1.45

// Duruş animasyonunun üstüne eklenen açı: sağ kol öne kalkar, avuç yukarı bakar
const POSE = {
  mixamorigRightForeArm: [0, 1.9, 0],
  mixamorigRightHand: [-2.0, 0, 0]
}

const surface = new MeshPhysicalMaterial({ color: '#22362c', roughness: 0.38, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.25 })
const joints = new MeshPhysicalMaterial({ color: '#0c1611', roughness: 0.3, metalness: 0.6, clearcoat: 1, clearcoatRoughness: 0.2 })

// Kemiğe bağlı noktalar: [kemik, kemiğe göre kaydırma, dik dursun mu]
// Kol ve el kemiklerinde -X parmak ucuna, -Y avuç içine bakar
const ANCHORS = {
  head: ['mixamorigHead', [0, 0, 0]],
  neck: ['mixamorigNeck', [0, 0, 0]],
  finger: ['mixamorigRightHandMiddle1', [-0.022, 0, 0]],
  wrist: ['mixamorigRightHand', [0.02, 0, 0]],
  palm: ['mixamorigRightHand', [-0.07, -0.04, 0], true]
}

// Her ürün tipi için kameranın baktığı nokta ve kameranın o noktaya göre konumu
const FOCUS = {
  earrings: { anchor: 'head', lift: [0, 0.06, 0], cam: [0.75, 0.15, 2.0] },
  pendant: { anchor: 'neck', lift: [0, -0.15, 0.05], cam: [0.35, 0.25, 3.4] },
  ring: { anchor: 'finger', lift: [0, 0, 0], cam: [-0.45, 0.6, 1.6] },
  bracelet: { anchor: 'wrist', lift: [0, 0, 0], cam: [-0.6, 0.65, 2.2] },
  object: { anchor: 'palm', lift: [0, 0.12, 0], cam: [-0.75, 0.6, 2.9] }
}
const OVERVIEW = { target: [0, 0.1, 0], cam: [0, 0.35, 6.8] }
const OBJECTS = ['vase', 'lamp', 'planter', 'sculpture', 'keychain']
const focusOf = (model) => (!model ? null : FOCUS[model] ?? FOCUS.object)

// Seçilen ürüne göre büyüyüp küçülerek beliren parça
function Piece({ show, children, ...props }) {
  const ref = useRef()
  useFrame((state, dt) => {
    const on = getTryOn()?.model === show
    const s = MathUtils.damp(ref.current.scale.x, on ? 1 : 0, on ? 6 : 10, dt)
    ref.current.scale.setScalar(s)
    ref.current.visible = s > 0.003
  })
  return (
    <group ref={ref} scale={0} {...props}>
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

// Boyna dolanan ince zincir ve önde damla taş (noktalar boyun kemiğine göre)
const CHAIN = [[0, 0.03, -0.12], [0.1, 0.01, -0.08], [0.15, -0.06, 0.04], [0.12, -0.17, 0.17], [0.045, -0.24, 0.215]]
const DROP = [0, -0.262, 0.222]

function Necklace() {
  const curve = useMemo(() => {
    const pts = [...CHAIN, ...CHAIN.slice(1).reverse().map(([x, y, z]) => [-x, y, z])]
    return new CatmullRomCurve3(pts.map((p) => new Vector3(...p)), true)
  }, [])
  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 160, 0.0035, 6, true]} />
        <Gold />
      </mesh>
      <group position={DROP}>
        <mesh>
          <torusGeometry args={[0.009, 0.0028, 8, 16]} />
          <Gold />
        </mesh>
        <group position={[0, -0.042, 0.004]}>
          <mesh scale={[0.62, 1, 0.38]}>
            <octahedronGeometry args={[0.038, 0]} />
            <Gem />
          </mesh>
          <mesh scale={[0.62, 1, 1]}>
            <torusGeometry args={[0.038, 0.0025, 6, 4]} />
            <Gold />
          </mesh>
        </group>
      </group>
    </>
  )
}

// Yüzük ve bileklik kemik eksenine (X) dik durur, taş avuç tarafında (yukarıda) görünür
function FingerRing() {
  return (
    <>
      <mesh rotation-y={PI / 2}>
        <torusGeometry args={[0.022, 0.0075, 12, 32]} />
        <Gold />
      </mesh>
      <mesh position-y={-0.03} scale={[0.85, 1, 0.85]}>
        <octahedronGeometry args={[0.016, 0]} />
        <Gem />
      </mesh>
    </>
  )
}

function WristBracelet() {
  const beads = 18
  return (
    <group rotation-y={PI / 2}>
      {Array.from({ length: beads }).map((_, i) => {
        const a = (i / beads) * PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.056, Math.sin(a) * 0.05, 0]}>
            {i % 2 ? <sphereGeometry args={[0.011, 12, 8]} /> : <icosahedronGeometry args={[0.013, 0]} />}
            {i % 2 ? <Gold /> : <Gem color="#059669" />}
          </mesh>
        )
      })}
    </group>
  )
}

// Avuçta süzülen 3D baskı ürünü
function Floating({ type }) {
  const ref = useRef()
  useFrame((state, dt) => {
    ref.current.rotation.y += dt * 0.8
    ref.current.position.y = 0.21 + Math.sin(state.clock.elapsedTime * 2) * 0.012
  })
  return (
    <group ref={ref}>
      <Model type={type} scale={0.12} />
    </group>
  )
}

const tmpV = new Vector3()
const tmpQ = new Quaternion()
const tmpE = new Euler()

export function Mannequin() {
  const { scene, animations } = useGLTF(URL)
  const anchors = useRef({})
  const glow = useRef()
  const lamp = useRef()
  const target = useRef(new Vector3(...OVERVIEW.target))
  const camPos = useMemo(() => new Vector3(), [])
  const look = useMemo(() => new Vector3(), [])

  const { mixer, bones } = useMemo(() => {
    scene.traverse((o) => {
      if (o.isSkinnedMesh) {
        o.material = o.name.includes('Joints') ? joints : surface
        o.frustumCulled = false
      }
    })
    const mixer = new AnimationMixer(scene)
    const bones = {}
    scene.traverse((o) => o.isBone && (bones[o.name] = o))
    return { mixer, bones }
  }, [scene, animations])

  useEffect(() => {
    const idle = animations.find((a) => a.name === 'idle')
    if (idle) mixer.clipAction(idle).reset().play()
    return () => mixer.stopAllAction()
  }, [mixer, animations])

  useFrame((state, dt) => {
    mixer.update(dt)
    for (const name in POSE) {
      const bone = bones[name]
      if (bone) bone.quaternion.multiply(tmpQ.setFromEuler(tmpE.set(...POSE[name])))
    }
    scene.updateMatrixWorld(true)

    for (const key in ANCHORS) {
      const group = anchors.current[key]
      const [boneName, offset, upright] = ANCHORS[key]
      const bone = bones[boneName]
      if (!group || !bone) continue
      bone.getWorldQuaternion(group.quaternion)
      tmpV.set(...offset).applyQuaternion(group.quaternion)
      bone.getWorldPosition(group.position).add(tmpV)
      if (upright) group.quaternion.identity()
    }

    // kamera seçilen bölgeye yumuşakça yaklaşır, hafifçe salınır
    const t = state.clock.elapsedTime
    const f = focusOf(getTryOn()?.model)
    if (f) {
      look.copy(anchors.current[f.anchor].position).add(tmpV.set(...f.lift))
      camPos.copy(look).add(tmpV.set(...f.cam))
    } else {
      look.set(...OVERVIEW.target)
      camPos.set(...OVERVIEW.cam)
    }
    camPos.x += Math.sin(t * 0.4) * 0.08
    camPos.y += Math.sin(t * 0.3) * 0.03
    state.camera.position.lerp(camPos, 1 - Math.exp(-2.5 * dt))
    target.current.lerp(look, 1 - Math.exp(-3 * dt))
    state.camera.lookAt(target.current)

    const on = OBJECTS.includes(getTryOn()?.model)
    glow.current.material.opacity = MathUtils.damp(glow.current.material.opacity, on ? 0.9 : 0, 5, dt)
    lamp.current.intensity = MathUtils.damp(lamp.current.intensity, on ? 1.5 : 0, 5, dt)
  })

  const anchor = (key) => (el) => (anchors.current[key] = el)

  return (
    <group>
      <primitive object={scene} scale={SCALE} position-y={FLOOR} />
      <group ref={anchor('head')}>
        {[-1, 1].map((s) => (
          <Piece key={s} show="earrings" position={[s * 0.14, 0.09, 0.0]}>
            <Earring side={s} />
          </Piece>
        ))}
      </group>
      <group ref={anchor('neck')}>
        <Piece show="pendant">
          <Necklace />
        </Piece>
      </group>
      <group ref={anchor('finger')}>
        <Piece show="ring">
          <FingerRing />
        </Piece>
      </group>
      <group ref={anchor('wrist')}>
        <Piece show="bracelet">
          <WristBracelet />
        </Piece>
      </group>
      <group ref={anchor('palm')}>
        {OBJECTS.map((type) => (
          <Piece key={type} show={type}>
            <Floating type={type} />
          </Piece>
        ))}
        <mesh ref={glow} position-y={0.03} rotation-x={-PI / 2}>
          <ringGeometry args={[0.07, 0.085, 48]} />
          <meshBasicMaterial color="#6ee7b7" transparent opacity={0} toneMapped={false} />
        </mesh>
        <pointLight ref={lamp} position={[-0.15, 0.4, 0.35]} intensity={0} distance={1.5} color="#eafff3" />
      </group>
    </group>
  )
}
