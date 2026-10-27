import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import {
  AnimationMixer,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Euler,
  MathUtils,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Quaternion,
  SkinnedMesh,
  Vector3
} from 'three'
import { Model } from './Models'
import { Print } from './Apparel'
import { getTryOn } from '../store/tryon'
import { FIELDS, getBody } from '../store/body'

// Vitrin mankeni: gerçek insan oranlarında hazır model (public/models/mannequin.glb).
// Kaynak: three.js örneklerindeki "Xbot" (Adobe Mixamo). Yalnızca duruş animasyonu bırakıldı, sıkıştırıldı.
// Kartın üzerine gelinen ürün mankende belirir: giyim ürünleri mankenin üstüne giydirilir,
// 3D baskı ürünleri avuçta süzülür. Ziyaretçi ölçülerini girerse manken o ölçülere göre şekillenir.

const URL = '/models/mannequin.glb'
const PI = Math.PI
const SCALE = 1.7
const FLOOR = -1.45

// Duruş animasyonunun üstüne eklenen açı: sağ kol öne kalkar, avuç yukarı bakar
const POSE = {
  mixamorigRightForeArm: [0, 1.9, 0],
  mixamorigRightHand: [-2.0, 0, 0]
}

const surface = new MeshPhysicalMaterial({ color: '#1d3a42', roughness: 0.38, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.25 })
const joints = new MeshPhysicalMaterial({ color: '#0a1a1f', roughness: 0.3, metalness: 0.6, clearcoat: 1, clearcoatRoughness: 0.2 })

// Kemiğe bağlı noktalar: [kemik, kemiğe göre kaydırma, dik dursun mu]
// Kol ve el kemiklerinde -X parmak ucuna, -Y avuç içine bakar
const ANCHORS = {
  neck: ['mixamorigNeck', [0, 0, 0]],
  chest: ['mixamorigSpine2', [0, 0, 0]],
  hips: ['mixamorigHips', [0, 0, 0]],
  palm: ['mixamorigRightHand', [-0.07, -0.04, 0], true]
}

// Her ürün tipi için kameranın baktığı nokta ve kameranın o noktaya göre konumu
const TOP = { anchor: 'chest', lift: [0, 0.02, 0], cam: [0.7, 0.3, 3.6] }
const FOCUS = {
  tshirt: TOP,
  sweatshirt: TOP,
  hoodie: { ...TOP, lift: [0, 0.08, 0] },
  joggers: { anchor: 'hips', lift: [0, -0.55, 0], cam: [0.6, 0.25, 4.8] },
  tracksuit: { anchor: 'hips', lift: [0, 0.3, 0], cam: [0.5, 0.3, 6.2] },
  object: { anchor: 'palm', lift: [0, 0.12, 0], cam: [-0.75, 0.6, 2.9] }
}
// Tam boy görünüm. Kamera 190 cm'ye kadar sabit durur ki kısa ve uzun boy farkı görünsün,
// daha uzun boylarda geri çekilir (h: boy oranı)
const overview = (h, look, cam) => {
  const k = Math.max(h, 1.12)
  look.set(0, FLOOR + 1.55 * k, 0)
  cam.set(0, look.y + 0.25, 6.8 * (0.3 + 0.7 * k))
}
const OBJECTS = ['vase', 'lamp', 'planter', 'sculpture', 'keychain']
const focusOf = (model) => (!model ? null : FOCUS[model] ?? FOCUS.object)

// Hangi ürün mankende hangi kıyafet parçalarını giydirir: [parça, ürünün renk alanı]
const OUTFITS = {
  tshirt: [['tee', 'color']],
  sweatshirt: [['sweat', 'color']],
  hoodie: [['sweat', 'color'], ['hood', 'color']],
  joggers: [['pants', 'color']],
  tracksuit: [['sweat', 'color'], ['pants', 'color2']]
}

/* ---------------- Kıyafet üretimi ---------------- */

const bare = (name) => name.replace('mixamorig', '')

// Kemiklerin mankenin yerel koordinatlarındaki konumları (kıyafet, T duruşundayken üretilir)
function bonePositions(mesh) {
  const out = {}
  mesh.skeleton.bones.forEach((bone) => {
    out[bare(bone.name)] = mesh.worldToLocal(bone.getWorldPosition(new Vector3()))
  })
  return out
}

// v noktasının A→B kemik doğrusundaki yeri (0 = A, 1 = B)
const along = (v, a, b) => {
  const ab = b.clone().sub(a)
  return v.clone().sub(a).dot(ab) / ab.lengthSq()
}

// Bölge kuralları: vertex'in en çok bağlı olduğu kemiğe ve konumuna göre kıyafete dahil mi?
const TORSO = ['Spine', 'Spine1', 'Spine2', 'LeftShoulder', 'RightShoulder']
const REGIONS = {
  tee: {
    inflate: 0.0045,
    test: (bone, v, B, side) =>
      TORSO.includes(bone) ||
      (bone === side + 'Arm' && along(v, B[side + 'Arm'], B[side + 'ForeArm']) < 0.5) ||
      (bone === 'Hips' && v.y > B.Hips.y + 0.015 * B.height)
  },
  sweat: {
    inflate: 0.006,
    test: (bone, v, B, side) =>
      TORSO.includes(bone) ||
      bone === side + 'Arm' ||
      (bone === side + 'ForeArm' && along(v, B[side + 'ForeArm'], B[side + 'Hand']) < 0.92) ||
      (bone === 'Hips' && v.y > B.Hips.y - 0.005 * B.height)
  },
  pants: {
    inflate: 0.005,
    test: (bone, v, B, side) =>
      bone === 'Hips' || bone === side + 'UpLeg' || (bone === side + 'Leg' && along(v, B[side + 'Leg'], B[side + 'Foot']) < 0.93)
  }
}

// Yüzey sıkıştırılmış (-1…1) olduğu için bölge seçimi iskeletin hesapladığı gerçek konumla yapılır,
// şişirme ise sıkıştırılmış koordinatta, yüzeyin boyuna oranla uygulanır
function buildGarment(mesh, region, material) {
  const g = mesh.geometry
  const pos = g.attributes.position
  const nrm = g.attributes.normal
  const si = g.attributes.skinIndex
  const sw = g.attributes.skinWeight
  const names = mesh.skeleton.bones.map((b) => bare(b.name))
  mesh.skeleton.update()
  const B = bonePositions(mesh)
  B.height = (B.HeadTop_End ?? B.Head).y - B.LeftToe_End.y
  g.computeBoundingBox()
  const size = g.boundingBox.getSize(new Vector3())

  const n = pos.count
  const keep = new Uint8Array(n)
  const out = new Float32Array(n * 3)
  const outN = new Float32Array(n * 3)
  const v = new Vector3()
  // eklem katmanı yüzeyden zaten taşkın olduğu için daha az şişirilir
  const push = REGIONS[region].inflate * Math.max(size.x, size.y, size.z) * (mesh.name.includes('Joints') ? 0.6 : 1)
  for (let i = 0; i < n; i++) {
    let best = 0
    let w = -1
    for (let k = 0; k < 4; k++) {
      const wk = sw.getComponent(i, k)
      if (wk > w) (w = wk), (best = si.getComponent(i, k))
    }
    const bone = names[best]
    mesh.getVertexPosition(i, v)
    const side = bone.startsWith('Left') ? 'Left' : 'Right'
    keep[i] = REGIONS[region].test(bone, v, B, side) ? 1 : 0
    const nx = nrm.getX(i)
    const ny = nrm.getY(i)
    const nz = nrm.getZ(i)
    out.set([pos.getX(i) + nx * push, pos.getY(i) + ny * push, pos.getZ(i) + nz * push], i * 3)
    outN.set([nx, ny, nz], i * 3)
  }

  const idx = g.index
  const tris = []
  for (let t = 0; t < idx.count; t += 3) {
    const a = idx.getX(t)
    const b = idx.getX(t + 1)
    const c = idx.getX(t + 2)
    if (keep[a] && keep[b] && keep[c]) tris.push(a, b, c)
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(out, 3))
  geo.setAttribute('normal', new BufferAttribute(outN, 3))
  geo.setAttribute('skinIndex', si)
  geo.setAttribute('skinWeight', sw)
  geo.setIndex(tris)

  const garment = new SkinnedMesh(geo, material)
  garment.bind(mesh.skeleton, mesh.bindMatrix)
  garment.position.copy(mesh.position)
  garment.quaternion.copy(mesh.quaternion)
  garment.scale.copy(mesh.scale)
  garment.frustumCulled = false
  return garment
}

const fabric = () =>
  new MeshStandardMaterial({ roughness: 0.9, metalness: 0, side: DoubleSide, transparent: true, opacity: 0, depthWrite: false, visible: false })

/* ---------------- Beden ölçüleri ---------------- */

// Mankenin kendi ölçüleri (store/body.js içindeki varsayılanlar)
const BASE = Object.fromEntries(FIELDS.map((f) => [f.key, f.base]))
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

// Ölçülerden kemiklerin enine (x) ve derinliğine (z) ölçeği. Gövde ve bacak kemikleri
// T duruşunda aynı doğrultuda olduğu için ölçek çocuk kemiklerde geri alınarak yalnızca o bölge şekillenir
function shapeOf(b, out) {
  const c = b.chest / BASE.chest
  const w = b.waist / BASE.waist
  const hp = b.hip / BASE.hip
  const bmi = b.weight / (b.height / 100) ** 2
  const g = clamp(Math.sqrt(bmi / (BASE.weight / (BASE.height / 100) ** 2)), 0.8, 1.35)
  out.height = b.height / BASE.height
  out.Hips = hp
  out.Spine = w
  out.Spine1 = (c + w) / 2
  out.Spine2 = c
  out.Neck = 0.6 + 0.4 * g
  out.LeftUpLeg = out.RightUpLeg = clamp(0.5 * g + 0.5 * hp, 0.8, 1.4)
  out.LeftLeg = out.RightLeg = 0.3 + 0.7 * g
  return out
}

// Her kemiğin ölçeği = kendi ölçeği / ebeveyninin ölçeği (ebeveynden gelen genişleme geri alınır)
function applyShape(list, shape) {
  for (const [bone, name, parent] of list) {
    const own = shape[name] ?? 1
    const up = shape[parent] ?? 1
    const k = own / up
    bone.scale.set(k, 1, k)
  }
}

/* ---------------- Parçalar ---------------- */

// Seçilen ürüne göre büyüyüp küçülerek beliren parça (avuçtaki 3D baskı ürünleri)
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

// Göğüsteki baskı: ürünün baskı yazısıyla, kıyafet görünürken belirir
function ChestPrint() {
  const ref = useRef()
  const product = getTryOn()
  useFrame((state, dt) => {
    const p = getTryOn()
    const on = !!p?.print && ['tshirt', 'sweatshirt', 'hoodie', 'tracksuit'].includes(p.model)
    const s = MathUtils.damp(ref.current.scale.x, on ? 1 : 0, on ? 5 : 12, dt)
    ref.current.scale.setScalar(s)
    ref.current.visible = s > 0.01
  })
  const light = product?.color && new Color(product.color).getHSL({}).l > 0.55
  const small = product?.model === 'tracksuit'
  return (
    <group ref={ref} scale={0}>
      {product?.print && (
        <Print
          key={product.id}
          text={product.print}
          ink={light ? '#0b3b44' : '#ffd7a8'}
          width={small ? 0.16 : 0.34}
          position={small ? [-0.1, 0.12, 0.235] : [0, 0.1, 0.24]}
        />
      )}
    </group>
  )
}

const tmpV = new Vector3()
const tmpQ = new Quaternion()
const tmpE = new Euler()

export function Mannequin({ product }) {
  const { scene, animations } = useGLTF(URL)
  const anchors = useRef({})
  const glow = useRef()
  const lamp = useRef()
  const hood = useRef()
  const model = useRef()
  const target = useRef(new Vector3(0, 0.1, 0))
  const body = useRef({ ...getBody() })
  const shape = useMemo(() => ({}), [])
  const camPos = useMemo(() => new Vector3(), [])
  const look = useMemo(() => new Vector3(), [])

  const { mixer, bones, boneList, outfit } = useMemo(() => {
    const skins = []
    scene.traverse((o) => {
      if (o.isSkinnedMesh && !o.userData.garment) {
        o.material = o.name.includes('Joints') ? joints : surface
        o.frustumCulled = false
        skins.push(o)
      }
    })
    // Her kıyafet parçası, mankenin yüzey ve eklem katmanlarından ayrı ayrı üretilir (bir kez, T duruşunda)
    scene.updateMatrixWorld(true)
    const outfit = scene.userData.outfit ?? {}
    if (!scene.userData.outfit) for (const region of Object.keys(REGIONS)) {
      const material = fabric()
      skins.forEach((mesh) => {
        const garment = buildGarment(mesh, region, material)
        garment.userData.garment = true
        mesh.parent.add(garment)
      })
      outfit[region] = material
    }
    scene.userData.outfit = outfit
    const mixer = new AnimationMixer(scene)
    const bones = {}
    const boneList = []
    scene.traverse((o) => {
      if (!o.isBone) return
      bones[o.name] = o
      boneList.push([o, bare(o.name), o.parent?.isBone ? bare(o.parent.name) : null])
    })
    return { mixer, bones, boneList, outfit }
  }, [scene])

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
    // ölçüler değişince manken yumuşakça yeni şekline geçer
    const goal = getBody()
    for (const { key } of FIELDS) body.current[key] = MathUtils.damp(body.current[key], goal[key], 6, dt)
    shapeOf(body.current, shape)
    applyShape(boneList, shape)
    model.current.scale.setScalar(SCALE * shape.height)
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
      // baskı ve kapüşon, boy ve göğüs/boyun genişliğiyle birlikte büyür
      const wide = key === 'chest' ? shape.Spine2 : key === 'neck' ? shape.Neck : 1
      group.scale.set(shape.height * wide, shape.height, shape.height * wide)
    }

    // kıyafetler: seçili ürünün parçaları rengini alıp belirir, diğerleri kaybolur
    const p = getTryOn()
    const parts = OUTFITS[p?.model] ?? []
    for (const region in outfit) {
      const m = outfit[region]
      const part = parts.find(([r]) => r === region)
      if (part) m.color.set(p[part[1]] ?? p.color)
      m.opacity = MathUtils.damp(m.opacity, part ? 1 : 0, part ? 5 : 9, dt)
      m.visible = m.opacity > 0.01
      m.depthWrite = m.opacity > 0.95
    }
    const wantHood = parts.some(([r]) => r === 'hood')
    const hm = hood.current.material
    if (wantHood) hm.color.set(p.color).multiplyScalar(0.85)
    hm.opacity = MathUtils.damp(hm.opacity, wantHood ? 1 : 0, 6, dt)
    hood.current.visible = hm.opacity > 0.01

    // kamera seçilen bölgeye yumuşakça yaklaşır, hafifçe salınır
    const t = state.clock.elapsedTime
    // ölçü paneli açıkken manken tam boy gösterilir
    const f = goal.open ? null : focusOf(p?.model)
    if (f) {
      look.copy(anchors.current[f.anchor].position).add(tmpV.set(...f.lift))
      camPos.copy(look).add(tmpV.set(...f.cam))
    } else {
      overview(shape.height, look, camPos)
    }
    camPos.x += Math.sin(t * 0.4) * 0.08
    camPos.y += Math.sin(t * 0.3) * 0.03
    state.camera.position.lerp(camPos, 1 - Math.exp(-2.5 * dt))
    target.current.lerp(look, 1 - Math.exp(-3 * dt))
    state.camera.lookAt(target.current)

    const on = OBJECTS.includes(p?.model)
    glow.current.material.opacity = MathUtils.damp(glow.current.material.opacity, on ? 0.9 : 0, 5, dt)
    lamp.current.intensity = MathUtils.damp(lamp.current.intensity, on ? 1.5 : 0, 5, dt)
  })

  const anchor = (key) => (el) => (anchors.current[key] = el)

  return (
    <group>
      <primitive ref={model} object={scene} scale={SCALE} position-y={FLOOR} />
      <group ref={anchor('neck')}>
        {/* kapüşon ensede toplanmış durur */}
        <mesh ref={hood} position={[0, 0.06, -0.13]} scale={[0.2, 0.15, 0.12]} visible={false}>
          <sphereGeometry args={[1, 32, 20]} />
          <meshStandardMaterial roughness={0.9} transparent opacity={0} />
        </mesh>
      </group>
      <group ref={anchor('chest')}>
        <ChestPrint key={product?.id ?? 'none'} />
      </group>
      <group ref={anchor('hips')} />
      <group ref={anchor('palm')}>
        {OBJECTS.map((type) => (
          <Piece key={type} show={type}>
            <Floating type={type} />
          </Piece>
        ))}
        <mesh ref={glow} position-y={0.03} rotation-x={-PI / 2}>
          <ringGeometry args={[0.07, 0.085, 48]} />
          <meshBasicMaterial color="#7de8f2" transparent opacity={0} toneMapped={false} />
        </mesh>
        <pointLight ref={lamp} position={[-0.15, 0.4, 0.35]} intensity={0} distance={1.5} color="#ecfdff" />
      </group>
    </group>
  )
}
