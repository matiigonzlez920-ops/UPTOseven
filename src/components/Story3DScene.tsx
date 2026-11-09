import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Rotate3d, Loader2, Maximize2, Sparkles } from 'lucide-react';

export type ChapterArtifactType =
  | 'experiment_1929'
  | 'the_drink'
  | 'expansion_8bubbles'
  | 'evolution_spot'
  | 'fido_dido'
  | 'the_uncola'
  | 'today_2026';

interface Story3DSceneProps {
  activeChapterIdx: number;
  chapterProgress: number; // 0 to 1 within current chapter
  isInteractiveMode?: boolean;
  onToggleInteractive?: () => void;
  className?: string;
}

// Global cache for GLTF so it never reloads over the network
let cachedGltf: GLTF | null = null;
let gltfPromise: Promise<GLTF> | null = null;

function loadCanGLTF(): Promise<GLTF> {
  if (cachedGltf) return Promise.resolve(cachedGltf);
  if (gltfPromise) return gltfPromise;

  const loader = new GLTFLoader();
  const url = '/LATA%20CLASICA.glb';

  gltfPromise = new Promise<GLTF>((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        cachedGltf = gltf;
        resolve(gltf);
      },
      undefined,
      (err) => {
        console.warn('Failed loading GLTF with encoded url, retrying with raw path', err);
        loader.load(
          '/LATA CLASICA.glb',
          (gltf2) => {
            cachedGltf = gltf2;
            resolve(gltf2);
          },
          undefined,
          (err2) => {
            gltfPromise = null;
            reject(err2);
          }
        );
      }
    );
  });

  return gltfPromise;
}

export const Story3DScene: React.FC<Story3DSceneProps> = ({
  activeChapterIdx,
  chapterProgress,
  isInteractiveMode = false,
  onToggleInteractive,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modelLoaded, setModelLoaded] = useState<boolean>(!!cachedGltf);
  const [userIsDragging, setUserIsDragging] = useState<boolean>(false);

  // Store active props in refs for smooth Three.js requestAnimationFrame loop
  const chapterIdxRef = useRef<number>(activeChapterIdx);
  const progressRef = useRef<number>(chapterProgress);
  const interactiveRef = useRef<boolean>(isInteractiveMode);

  useEffect(() => {
    chapterIdxRef.current = activeChapterIdx;
  }, [activeChapterIdx]);

  useEffect(() => {
    progressRef.current = chapterProgress;
  }, [chapterProgress]);

  useEffect(() => {
    interactiveRef.current = isInteractiveMode;
  }, [isInteractiveMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let isDisposed = false;

    // Dimensions
    const getW = () => Math.max(container.clientWidth || 0, 300);
    const getH = () => Math.max(container.clientHeight || 0, 360);

    const width = getW();
    const height = getH();

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 4.3);

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL init failed:', err);
      return;
    }

    // Dynamic Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3.5, 4.5, 4.0);
    scene.add(keyLight);

    const limeLight = new THREE.DirectionalLight(0x7ed957, 1.6);
    limeLight.position.set(-4.0, 1.0, 2.5);
    scene.add(limeLight);

    const rimLight = new THREE.DirectionalLight(0xfff066, 1.8);
    rimLight.position.set(0, 4.0, -3.5);
    scene.add(rimLight);

    // Master Pivot & Chapter Groups
    const masterPivot = new THREE.Group();
    masterPivot.position.set(0, 0, 0);
    scene.add(masterPivot);

    const chapterGroups: THREE.Group[] = [];

    // ========================================================
    // CHAPTER 01 (1929): THE EXPERIMENT
    // Amber glass apothecary bottle with cork + Alembic glass flask
    // ========================================================
    const g1 = new THREE.Group();
    // Bottle Body
    const amberMat = new THREE.MeshStandardMaterial({
      color: 0xb86e18,
      roughness: 0.18,
      metalness: 0.35,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });
    const bottleGeom = new THREE.CylinderGeometry(0.52, 0.58, 2.0, 32);
    const bottleMesh = new THREE.Mesh(bottleGeom, amberMat);
    bottleMesh.position.y = 0;
    g1.add(bottleMesh);

    // Bottle Neck
    const neckGeom = new THREE.CylinderGeometry(0.24, 0.32, 0.65, 24);
    const neckMesh = new THREE.Mesh(neckGeom, amberMat);
    neckMesh.position.y = 1.25;
    g1.add(neckMesh);

    // Cork Stopper
    const corkMat = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.85,
      metalness: 0.05,
    });
    const corkGeom = new THREE.CylinderGeometry(0.22, 0.19, 0.35, 20);
    const corkMesh = new THREE.Mesh(corkGeom, corkMat);
    corkMesh.position.y = 1.65;
    g1.add(corkMesh);

    // Vintage Label
    const labelMat = new THREE.MeshStandardMaterial({
      color: 0xf5ebd7,
      roughness: 0.75,
      metalness: 0.05,
    });
    const labelGeom = new THREE.CylinderGeometry(0.53, 0.585, 1.1, 32, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
    const labelMesh = new THREE.Mesh(labelGeom, labelMat);
    labelMesh.position.y = 0.05;
    g1.add(labelMesh);

    // Laboratory Alembic Flask beside bottle
    const flaskMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.8,
    });
    const flaskGeom = new THREE.SphereGeometry(0.42, 24, 24);
    const flaskMesh = new THREE.Mesh(flaskGeom, flaskMat);
    flaskMesh.position.set(0.85, -0.6, 0.2);
    g1.add(flaskMesh);

    const flaskNeckGeom = new THREE.CylinderGeometry(0.12, 0.16, 0.6, 16);
    const flaskNeckMesh = new THREE.Mesh(flaskNeckGeom, flaskMat);
    flaskNeckMesh.position.set(0.85, -0.15, 0.2);
    g1.add(flaskNeckMesh);

    masterPivot.add(g1);
    chapterGroups.push(g1);

    // ========================================================
    // CHAPTER 02 (1936): THE DRINK — The Birth of 7UP
    // Emerald green soda bottle with 7 orbiting citrus orbs
    // ========================================================
    const g2 = new THREE.Group();
    const greenGlassMat = new THREE.MeshStandardMaterial({
      color: 0x056b27,
      roughness: 0.15,
      metalness: 0.4,
      transparent: true,
      opacity: 0.94,
      side: THREE.DoubleSide,
    });
    const bottle2Geom = new THREE.CylinderGeometry(0.5, 0.55, 1.9, 32);
    const bottle2Mesh = new THREE.Mesh(bottle2Geom, greenGlassMat);
    g2.add(bottle2Mesh);

    const shoulderGeom = new THREE.ConeGeometry(0.5, 0.6, 32, 1, true);
    const shoulderMesh = new THREE.Mesh(shoulderGeom, greenGlassMat);
    shoulderMesh.position.y = 1.15;
    g2.add(shoulderMesh);

    const neck2Geom = new THREE.CylinderGeometry(0.2, 0.22, 0.7, 24);
    const neck2Mesh = new THREE.Mesh(neck2Geom, greenGlassMat);
    neck2Mesh.position.y = 1.6;
    g2.add(neck2Mesh);

    // Crown Cap
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xd93829,
      roughness: 0.3,
      metalness: 0.8,
    });
    const capGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.1, 24);
    const capMesh = new THREE.Mesh(capGeom, capMat);
    capMesh.position.y = 1.98;
    g2.add(capMesh);

    // 7 Orbiting Citrus Orbs
    const orbitGroup = new THREE.Group();
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xa3e635,
      emissive: 0x65a30d,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.2,
    });
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const radius = 1.15;
      const orbGeom = new THREE.SphereGeometry(0.12, 16, 16);
      const orbMesh = new THREE.Mesh(orbGeom, orbMat);
      orbMesh.position.set(Math.cos(angle) * radius, Math.sin(angle * 2) * 0.35 + 0.1, Math.sin(angle) * radius);
      orbitGroup.add(orbMesh);
    }
    g2.add(orbitGroup);

    masterPivot.add(g2);
    chapterGroups.push(g2);

    // ========================================================
    // CHAPTER 03 (1930s–1940s): THE EXPANSION
    // The iconic embossed 8-Bubbles green bottle
    // ========================================================
    const g3 = new THREE.Group();
    const bottle3Geom = new THREE.CylinderGeometry(0.52, 0.54, 2.1, 32);
    const bottle3Mesh = new THREE.Mesh(bottle3Geom, greenGlassMat);
    g3.add(bottle3Mesh);

    const neck3Geom = new THREE.CylinderGeometry(0.22, 0.48, 0.9, 24);
    const neck3Mesh = new THREE.Mesh(neck3Geom, greenGlassMat);
    neck3Mesh.position.y = 1.45;
    g3.add(neck3Mesh);

    const cap3Mesh = new THREE.Mesh(capGeom, new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9, roughness: 0.2 }));
    cap3Mesh.position.y = 1.95;
    g3.add(cap3Mesh);

    // 8 Embossed glass bubbles in a vertical spiral on the waist
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0x7ed957,
      roughness: 0.1,
      metalness: 0.5,
      transparent: true,
      opacity: 0.95,
    });
    for (let i = 0; i < 8; i++) {
      const bGeom = new THREE.SphereGeometry(0.13, 16, 16);
      const bMesh = new THREE.Mesh(bGeom, bubbleMat);
      const theta = (i / 8) * Math.PI * 2;
      const yPos = -0.6 + i * 0.18;
      bMesh.position.set(Math.cos(theta) * 0.54, yPos, Math.sin(theta) * 0.54);
      g3.add(bMesh);
    }

    masterPivot.add(g3);
    chapterGroups.push(g3);

    // ========================================================
    // CHAPTER 04 (1960s–1970s): THE EVOLUTION
    // Aluminum can transition & Pulsating Red Spot
    // ========================================================
    const g4 = new THREE.Group();
    const canMat = new THREE.MeshStandardMaterial({
      color: 0x008b3e,
      roughness: 0.28,
      metalness: 0.65,
    });
    const canGeom = new THREE.CylinderGeometry(0.55, 0.55, 1.85, 32);
    const canMesh = new THREE.Mesh(canGeom, canMat);
    g4.add(canMesh);

    const canRimMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.2,
      metalness: 0.9,
    });
    const topRim = new THREE.Mesh(new THREE.CylinderGeometry(0.53, 0.53, 0.12, 32), canRimMat);
    topRim.position.y = 0.96;
    g4.add(topRim);

    const botRim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.12, 32), canRimMat);
    botRim.position.y = -0.96;
    g4.add(botRim);

    // Iconic Red Spot Sphere hovering in front
    const spotGeom = new THREE.SphereGeometry(0.42, 32, 32);
    const spotMat = new THREE.MeshStandardMaterial({
      color: 0xe51e2b,
      emissive: 0x990000,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.3,
    });
    const spotMesh = new THREE.Mesh(spotGeom, spotMat);
    spotMesh.position.set(0, 0.1, 0.58);
    g4.add(spotMesh);

    masterPivot.add(g4);
    chapterGroups.push(g4);

    // ========================================================
    // CHAPTER 05 (1980s–1990s): FIDO DIDO
    // Cool Spot 3D sphere with sunglasses + floating cartoon doodle
    // ========================================================
    const g5 = new THREE.Group();
    // Big Cool Spot Body
    const spotBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.72, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xe51e2b,
        roughness: 0.3,
        metalness: 0.2,
      })
    );
    g5.add(spotBody);

    // Cool Sunglasses (left lens, right lens, bridge)
    const shadesMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.05,
      metalness: 0.9,
    });
    const leftLens = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.12), shadesMat);
    leftLens.position.set(-0.25, 0.18, 0.68);
    leftLens.rotation.y = -0.2;
    g5.add(leftLens);

    const rightLens = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.12), shadesMat);
    rightLens.position.set(0.25, 0.18, 0.68);
    rightLens.rotation.y = 0.2;
    g5.add(rightLens);

    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.1), shadesMat);
    bridge.position.set(0, 0.2, 0.72);
    g5.add(bridge);

    // Fido Dido doodle panel floating on right
    const doodleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.1,
    });
    const doodlePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.4), doodleMat);
    doodlePlane.position.set(1.0, 0.3, -0.3);
    doodlePlane.rotation.y = -0.4;
    g5.add(doodlePlane);

    // Subtle cartoon black borders for doodle panel
    const borderMat = new THREE.MeshBasicMaterial({ color: 0x05421a });
    const doodleBorder = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 1.44), borderMat);
    doodleBorder.position.set(1.0, 0.3, -0.32);
    doodleBorder.rotation.y = -0.4;
    g5.add(doodleBorder);

    masterPivot.add(g5);
    chapterGroups.push(g5);

    // ========================================================
    // CHAPTER 06 (THE UNCOLA): BRAND IDENTITY
    // The famous Inverted Glass (upside-down glass!) with floating lime slice
    // ========================================================
    const g6 = new THREE.Group();
    // Glass inverted: narrow top, wide flared base at top
    const uncolaGlassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    // Inverted cup: top radius large (0.75), bottom radius narrow (0.35)
    const glassGeom = new THREE.CylinderGeometry(0.75, 0.35, 1.9, 32, 1, true);
    const glassMesh = new THREE.Mesh(glassGeom, uncolaGlassMat);
    g6.add(glassMesh);

    // Floating 3D Lime Wedge inside glass
    const limeMat = new THREE.MeshStandardMaterial({
      color: 0x84cc16,
      emissive: 0x4d7c0f,
      emissiveIntensity: 0.3,
      roughness: 0.35,
    });
    const limeWedge = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.14, 16, 1, false, 0, Math.PI), limeMat);
    limeWedge.rotation.x = Math.PI / 2;
    limeWedge.rotation.z = 0.4;
    limeWedge.position.set(0.05, 0.1, 0);
    g6.add(limeWedge);

    // Psychedelic Chromatic Ring surrounding the inverted glass
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 0.5,
      roughness: 0.2,
    });
    const ringGeom = new THREE.TorusGeometry(1.05, 0.04, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    g6.add(ringMesh);

    masterPivot.add(g6);
    chapterGroups.push(g6);

    // ========================================================
    // CHAPTER 07 (TODAY — 2026): LATA CLASICA.glb MODEL
    // The authentic 3D GLB model centered and scaled
    // ========================================================
    const g7 = new THREE.Group();
    masterPivot.add(g7);
    chapterGroups.push(g7);

    // Load authentic GLTF model
    loadCanGLTF()
      .then((gltf) => {
        if (isDisposed) return;
        const model = gltf.scene.clone(true);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.set(-center.x, -center.y, -center.z);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 1.75 / maxDim; // Safe scale factor to avoid any clipping

        const modelWrapper = new THREE.Group();
        modelWrapper.add(model);
        modelWrapper.scale.setScalar(scaleFactor);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((mat) => {
              if (mat) {
                mat.side = THREE.DoubleSide;
                if ((mat as THREE.MeshStandardMaterial).roughness !== undefined) {
                  const m = mat as THREE.MeshStandardMaterial;
                  m.roughness = Math.min(0.48, Math.max(0.18, m.roughness));
                  m.metalness = Math.max(0.38, m.metalness || 0.4);
                  m.needsUpdate = true;
                }
              }
            });
          }
        });

        g7.add(modelWrapper);
        setModelLoaded(true);
      })
      .catch((err) => {
        console.warn('Fallback: loading GLB into scene failed', err);
        // Fallback procedural modern can
        const fallbackCan = new THREE.Mesh(
          new THREE.CylinderGeometry(0.55, 0.55, 1.8, 32),
          new THREE.MeshStandardMaterial({ color: 0x008b3e, metalness: 0.7, roughness: 0.25 })
        );
        g7.add(fallbackCan);
        setModelLoaded(true);
      });

    // ========================================================
    // FIZZY CARBONATION PARTICLES (3D Points rising smoothly)
    // ========================================================
    const particleCount = 180;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 3.5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      particleSpeeds[i] = 0.5 + Math.random() * 1.2;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x7ed957,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Orbit / Drag Interaction State
    let targetRotationY = 0.2;
    let targetRotationX = 0.05;
    let currentRotationY = 0.2;
    let currentRotationX = 0.05;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setUserIsDragging(true);
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevX = cx;
      prevY = cy;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = cx - prevX;
      const dy = cy - prevY;

      targetRotationY += dx * 0.012;
      targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX + dy * 0.008));

      prevX = cx;
      prevY = cy;
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => {
        if (!isDisposed && !isDragging) {
          setUserIsDragging(false);
        }
      }, 1000);
    };

    const dom = renderer.domElement;
    dom.style.width = '100%';
    dom.style.height = '100%';
    dom.style.display = 'block';

    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Responsive Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (isDisposed || !container) return;
      const nw = getW();
      const nh = getH();
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    resizeObserver.observe(container);

    // Render loop
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (isDisposed) return;
      animationId = requestAnimationFrame(animate);

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const activeIdx = Math.max(0, Math.min(6, chapterIdxRef.current));

      // Continuous subtle idle rotation
      if (!isDragging) {
        targetRotationY += 0.008;
      }

      // Smooth interpolation for master pivot rotation
      currentRotationY += (targetRotationY - currentRotationY) * Math.min(1, dt * 6);
      currentRotationX += (targetRotationX - currentRotationX) * Math.min(1, dt * 6);

      masterPivot.rotation.y = currentRotationY;
      masterPivot.rotation.x = currentRotationX;

      // Cross-fade active chapter group vs inactive chapter groups
      chapterGroups.forEach((grp, idx) => {
        const isTarget = idx === activeIdx;
        const targetScale = isTarget ? 1.0 : 0.001;
        const targetVisible = isTarget || grp.scale.x > 0.02;

        grp.visible = targetVisible;
        grp.scale.x += (targetScale - grp.scale.x) * Math.min(1, dt * 8);
        grp.scale.y += (targetScale - grp.scale.y) * Math.min(1, dt * 8);
        grp.scale.z += (targetScale - grp.scale.z) * Math.min(1, dt * 8);

        // Special animations per chapter
        if (idx === 1 && isTarget) {
          // Chapter 2: Orbiting orbs
          orbitGroup.rotation.y += dt * 1.5;
        } else if (idx === 3 && isTarget) {
          // Chapter 4: Spot pulse
          const pulse = 1.0 + Math.sin(time * 0.005) * 0.08;
          spotMesh.scale.setScalar(pulse);
        } else if (idx === 5 && isTarget) {
          // Chapter 6: Psychedelic ring spin
          ringMesh.rotation.z += dt * 0.8;
        }
      });

      // Camera dynamic angle based on chapter
      const targetCamY = activeIdx === 0 ? 0.3 : activeIdx === 5 ? 0.45 : 0.15;
      const targetCamZ = activeIdx === 6 ? 4.2 : 4.0;
      camera.position.y += (targetCamY - camera.position.y) * Math.min(1, dt * 4);
      camera.position.z += (targetCamZ - camera.position.z) * Math.min(1, dt * 4);
      camera.lookAt(0, 0, 0);

      // Carbonation particle animation
      const posAttr = particleGeom.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        arr[i * 3 + 1] += particleSpeeds[i] * dt;
        if (arr[i * 3 + 1] > 2.2) {
          arr[i * 3 + 1] = -2.2;
          arr[i * 3 + 0] = (Math.random() - 0.5) * 3.5;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();

      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);

      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      scene.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const m = o as THREE.Mesh;
          m.geometry?.dispose();
        }
      });

      renderer.dispose();
      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
    };
  }, []);

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full min-h-[360px] sm:min-h-[440px]" />

      {/* Loading overlay */}
      {!modelLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs rounded-3xl z-20 pointer-events-none">
          <Loader2 className="w-8 h-8 text-[#A4D902] animate-spin mb-2" />
          <span className="text-xs font-mono font-bold tracking-widest text-white/90 uppercase">
            Iniciando Escenario 3D...
          </span>
        </div>
      )}

      {/* Interactive Orbit Hint */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-black tracking-wider uppercase text-white flex items-center gap-1.5 shadow-xl transition-all pointer-events-none ${
          userIsDragging ? 'opacity-90 scale-95' : 'opacity-70'
        }`}
      >
        <Rotate3d className="w-3.5 h-3.5 text-[#A4D902] animate-pulse" />
        <span>3D Interactivo • Arrastrá 360°</span>
      </div>
    </div>
  );
};
