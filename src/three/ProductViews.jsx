import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { View, PerspectiveCamera, Float, ContactShadows, OrbitControls, Sparkles } from '@react-three/drei'
import { Model } from './Models'
import { Studio } from './Studio'
import { Mannequin } from './Mannequin'
import { useTryOn } from '../store/tryon'

// Ürün kartlarındaki küçük 3D sahne. Hepsi tek bir ortak Canvas üzerinde çizilir (performans için).
// hovered bir ref'tir: kartın üzerine gelmek React'te yeniden çizim yaptırmaz (takılmayı önler)
function Spinner({ hovered, children }) {
  const ref = useRef()
  useFrame((_, dt) => {
    const on = hovered.current
    const speed = on ? 1.6 : 0.35
    ref.current.rotation.y += dt * speed
    const s = on ? 1.12 : 1
    ref.current.scale.lerp({ x: s, y: s, z: s }, 1 - Math.exp(-8 * dt))
  })
  return <group ref={ref}>{children}</group>
}

// product: ürün kaydı (model tipi, giyimde renk ve baskı yazısı)
const look = (p) => ({ type: p.model, color: p.color, color2: p.color2, print: p.print })

export function CardView({ product, hovered, className }) {
  return (
    <View className={className}>
      <PerspectiveCamera makeDefault position={[0, 0.2, 5]} fov={32} />
      <Studio intensity={0.9} />
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Spinner hovered={hovered}>
          <Model {...look(product)} />
        </Spinner>
      </Float>
      {/* gölge bir kez çizilir; her karede çizmek tüm kartlarda sayfayı yavaşlatıyordu */}
      <ContactShadows frames={1} position={[0, -1.25, 0]} opacity={0.6} scale={5} blur={2.5} far={2} color="#000" />
    </View>
  )
}

// Koleksiyonun yanındaki sanal prova sahnesi (manken)
export function MannequinView({ className }) {
  const product = useTryOn()
  return (
    <View className={className}>
      <PerspectiveCamera makeDefault position={[0, 0.55, 6.6]} fov={30} />
      <Studio intensity={0.8} />
      <spotLight position={[0.5, 3.5, 2]} angle={0.5} penumbra={1} intensity={30} color="#ecfdff" />
      <Suspense fallback={null}>
        <Mannequin product={product} />
      </Suspense>
      <Sparkles count={40} scale={[2.4, 3, 1.6]} position-y={0.4} size={1.6} speed={0.25} opacity={0.5} color="#7de8f2" />
      <ContactShadows position={[0, -1.44, 0]} opacity={0.6} scale={3} blur={2.5} far={1.5} resolution={256} color="#000" />
    </View>
  )
}

export function ViewsCanvas() {
  return (
    <Canvas
      className="views-canvas"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
    >
      <View.Port />
    </Canvas>
  )
}

// Ürün detay penceresindeki büyük, döndürülebilir 3D görünüm
export function ProductStage({ product }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.3, 4.6], fov: 35 }}>
      <Studio />
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
        <Model {...look(product)} scale={1.15} />
      </Float>
      <ContactShadows position={[0, -1.4, 0]} opacity={0.7} scale={6} blur={2.4} far={2.5} color="#000" />
      <OrbitControls autoRotate autoRotateSpeed={1.2} enablePan={false} enableZoom={false} minPolarAngle={0.9} maxPolarAngle={2} />
    </Canvas>
  )
}
