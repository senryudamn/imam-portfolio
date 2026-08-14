import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import lanyard from './lanyard.svg';

extend({ MeshLineGeometry, MeshLineMaterial });
const BLANK_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export default function Lanyard({ position = [0, 0, 20], gravity = [0, -40, 0], fov = 20, frontImage = null, backImage = null }) {
  return (
    <Canvas camera={{ position: position, fov: fov }} gl={{ alpha: true }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
      <ambientLight intensity={Math.PI} />
      <Physics gravity={gravity} timeStep={1/60}>
        <Band frontImage={frontImage} backImage={backImage} />
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

function Band({ maxSpeed = 50, minSpeed = 10, frontImage = null, backImage = null }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };

  const texture = useTexture(lanyard);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  const createCoverTexture = (baseTex) => {
    if (!baseTex || !baseTex.image) return baseTex;
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 720;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 512, 720);
    const img = baseTex.image;
    const scale = Math.max(512 / img.width, 720 / img.height);
    const dw = img.width * scale; const dh = img.height * scale;
    const dx = (512 - dw) / 2; const dy = (720 - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace; return tex;
  };

  const frontMap = useMemo(() => createCoverTexture(frontTex), [frontTex]);
  const backMap = useMemo(() => createCoverTexture(backTex), [backTex]);
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  
  // FIX MUTLAK TALI PUTUS: Disambung tepat di koordinat Y: 1.35
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.35, 0]]);

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
    if (fixed.current && card.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });

      // Menautkan pangkal visual tali dengan matematika rotasi yang presisi
      const cardPos = card.current.translation();
      const cardRot = card.current.rotation();
      const offset = new THREE.Vector3(0, 1.35, 0).applyQuaternion(new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w));
      
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
        <CuboidCollider args={[0.8, 1.125, 0.02]} />
        <group
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
          onPointerDown={(e) => (
            e.target.setPointerCapture(e.pointerId),
            drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
          )}
        >
          <mesh>
            <boxGeometry args={[1.6, 2.25, 0.04]} />
            <meshStandardMaterial attach="material-0" color="#e2e8f0" />
            <meshStandardMaterial attach="material-1" color="#e2e8f0" />
            <meshStandardMaterial attach="material-2" color="#e2e8f0" />
            <meshStandardMaterial attach="material-3" color="#e2e8f0" />
            <meshPhysicalMaterial attach="material-4" map={frontMap} clearcoat={1} clearcoatRoughness={0.15} roughness={0.8} metalness={0.2} />
            <meshPhysicalMaterial attach="material-5" map={backMap} clearcoat={1} clearcoatRoughness={0.15} roughness={0.8} metalness={0.2} />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.4]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#64748b" metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.35, 0]}>
            <torusGeometry args={[0.1, 0.04, 16, 32]} />
            <meshStandardMaterial color="#64748b" metalness={1} roughness={0.2} />
          </mesh>
        </group>
      </RigidBody>
      <mesh ref={band} frustumCulled={false}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={[2000, 2000]} useMap map={texture} repeat={[-4, 1]} lineWidth={2.5} />
      </mesh>
    </group>
  );
}