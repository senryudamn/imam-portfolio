import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer, Center } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

import umbrellaGLB from './umbrella.glb';
import lanyard from './lanyard.svg';

extend({ MeshLineGeometry, MeshLineMaterial });
const BLANK_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export default function Lanyard({ position = [0, 0, 25], gravity = [0, -40, 0], fov = 25, frontImage = null }) {
  return (
    <Canvas camera={{ position: position, fov: fov }} gl={{ alpha: true }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
      <ambientLight intensity={Math.PI} />
      <Physics gravity={gravity} timeStep={1/60}>
        <Band frontImage={frontImage} />
      </Physics>
      <Environment blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}

function Band({ maxSpeed = 50, minSpeed = 10, frontImage = null }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  
  // FIX: canSleep=false agar kartu tidak freeze saat diam/ditarik
  const segmentProps = { type: 'dynamic', canSleep: false, colliders: false, angularDamping: 0.8, linearDamping: 1.5 };

  const { scene } = useGLTF(umbrellaGLB);
  const texture = useTexture(lanyard);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);

  // Menyesuaikan rasio foto agar pas menjadi kotak ID
  const createStickerTexture = (baseTex) => {
    if (!baseTex || !baseTex.image) return baseTex;
    const canvas = document.createElement('canvas');
    canvas.width = 400; canvas.height = 500;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 400, 500);
    const img = baseTex.image;
    const scale = Math.max(400 / img.width, 500 / img.height);
    const dw = img.width * scale; const dh = img.height * scale;
    const dx = (400 - dw) / 2; const dy = (500 - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace; return tex;
  };

  const frontMap = useMemo(() => createStickerTexture(frontTex), [frontTex]);
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  // Fisika Tali
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  
  // FIX POSISI TALI KIRI/TENGAH:
  // Angka [0, 2.2, 0] artinya tali menempel di X=0 (Tengah), Y=2.2 (Atas).
  // Jika Anda ingin talinya benar-benar bergeser ke kiri kartu, ubah angka pertama menjadi minus, contoh: [-0.8, 2.2, 0]
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 2.2, 0]]);

  useEffect(() => {
    if (hovered) { document.body.style.cursor = dragged ? 'grabbing' : 'grab'; return () => void (document.body.style.cursor = 'auto'); }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && card.current && j3.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });

      // Offset pangkal tali harus sama dengan useSphericalJoint di atas
      const cardPos = card.current.translation();
      const cardRot = card.current.rotation();
      const offset = new THREE.Vector3(0, 2.2, 0).applyQuaternion(new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w));
      
      curve.points[0].copy(new THREE.Vector3(cardPos.x, cardPos.y, cardPos.z).add(offset));
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      
      ang.copy(card.current.angvel()); rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <group position={[0, 4, 0]}>
      <RigidBody ref={fixed} {...segmentProps} type="fixed" />
      <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
      <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
      <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>

      <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
        <CuboidCollider args={[1.2, 2, 0.1]} />
        <group
          position={[0, -1, 0]}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
          onPointerDown={(e) => (
            e.target.setPointerCapture(e.pointerId),
            drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
          )}
        >
          <Center>
            {/* MODEL UMBRELLA ASLI */}
            <primitive object={scene} scale={2.5} />
            
            {/* STIKER FOTO PROFIL */}
            {/* position: [Kiri/Kanan, Atas/Bawah, Maju/Mundur] */}
            {/* args: [Lebar, Tinggi] */}
            <mesh position={[0, -0.6, 0.18]} rotation={[0, 0, 0]}>
               <planeGeometry args={[1.55, 1.95]} /> 
               <meshPhysicalMaterial map={frontMap} roughness={0.5} clearcoat={1} clearcoatRoughness={0.1} />
            </mesh>
          </Center>
        </group>
      </RigidBody>
      
      {/* FIX: Tali tebal & Anti-hilang */}
      <mesh ref={band} frustumCulled={false}>
        <meshLineGeometry />
        <meshLineMaterial color="#cbd5e1" depthTest={false} resolution={[2000, 2000]} useMap map={texture} repeat={[-4, 1]} lineWidth={3} />
      </mesh>
    </group>
  );
}