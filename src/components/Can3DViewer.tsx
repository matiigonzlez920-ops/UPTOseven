import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Rotate3d, Loader2 } from 'lucide-react';

interface Can3DViewerProps {
  modelUrl?: string;
  fallbackImage?: string;
  className?: string;
  autoRotate?: boolean;
  interactive?: boolean;
  scale?: number;
}

// Global cache for loaded GLTF so we never reload or re-parse from network
let cachedGltf: GLTF | null = null;
let gltfLoadingPromise: Promise<GLTF> | null = null;

function loadGLTFModel(url: string): Promise<GLTF> {
  if (cachedGltf) {
    return Promise.resolve(cachedGltf);
  }
  if (gltfLoadingPromise) {
    return gltfLoadingPromise;
  }

  const loader = new GLTFLoader();
  gltfLoadingPromise = new Promise<GLTF>((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        cachedGltf = gltf;
        resolve(gltf);
      },
      undefined,
      (err) => {
        console.warn(`Failed to load GLTF model from ${url}`, err);
        // Retry with unencoded path if needed
        if (url.includes('%20')) {
          loader.load(
            url.replace(/%20/g, ' '),
            (gltf2) => {
              cachedGltf = gltf2;
              resolve(gltf2);
            },
            undefined,
            (err2) => {
              gltfLoadingPromise = null;
              reject(err2);
            }
          );
        } else {
          gltfLoadingPromise = null;
          reject(err);
        }
      }
    );
  });

  return gltfLoadingPromise;
}

export const Can3DViewer: React.FC<Can3DViewerProps> = ({
  modelUrl = '/LATA%20CLASICA.glb',
  fallbackImage = '/7up.png',
  className = '',
  autoRotate = true,
  interactive = true,
  scale = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(!cachedGltf);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // Store mutable state in refs so prop changes don't destroy and re-create WebGL context
  const autoRotateRef = useRef<boolean>(autoRotate);
  const interactiveRef = useRef<boolean>(interactive);
  const isDraggingRef = useRef<boolean>(false);
  const wrapperRef = useRef<THREE.Group | null>(null);
  const baseScaleFactorRef = useRef<number>(1);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    interactiveRef.current = interactive;
  }, [interactive]);

  useEffect(() => {
    if (wrapperRef.current && baseScaleFactorRef.current > 0) {
      wrapperRef.current.scale.setScalar(baseScaleFactorRef.current * scale);
    }
  }, [scale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isDisposed = false;

    // Dimensions
    const getWidth = () => Math.max(container.clientWidth || 0, 260);
    const getHeight = () => Math.max(container.clientHeight || 0, 360);

    const width = getWidth();
    const height = getHeight();

    // Scene
    const scene = new THREE.Scene();

    // Camera: positioned with ample breathing space so the can is never clipped
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.3);
    camera.lookAt(0, 0, 0);

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
      renderer.toneMappingExposure = 1.3;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL initialization failed', err);
      setHasError(true);
      setLoading(false);
      return;
    }

    // Studio Lighting for Refreshing Aluminum Can
    // 1. Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    // 2. Main Key Light (White, crisp front-top-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    // 3. Fill Light (Fresh lime/citrus green tint from left)
    const limeFill = new THREE.DirectionalLight(0x7ed957, 1.6);
    limeFill.position.set(-4, 0, 3);
    scene.add(limeFill);

    // 4. Rim Backlight (Warm lemon yellow highlight on can edges)
    const yellowRim = new THREE.DirectionalLight(0xfff066, 1.8);
    yellowRim.position.set(0, 4, -4);
    scene.add(yellowRim);

    // 5. Bottom subtle bounce
    const bottomLight = new THREE.DirectionalLight(0x008b3e, 0.7);
    bottomLight.position.set(0, -3, 2);
    scene.add(bottomLight);

    // Pivot group: sits strictly at (0, 0, 0) and rotates around its own vertical axis
    const pivotGroup = new THREE.Group();
    pivotGroup.position.set(0, 0, 0);
    scene.add(pivotGroup);

    // Rotation tracking variables
    let targetRotationY = 0.3; // start slightly angled to see logo & depth
    let targetRotationX = 0.08;
    let currentRotationY = 0.3;
    let currentRotationX = 0.08;
    let prevMouseX = 0;
    let prevMouseY = 0;

    // Setup Model inside pivotGroup with mathematically verified centering
    const setupModel = (gltf: GLTF) => {
      if (isDisposed) return;

      // Clone scene to avoid conflicts
      const modelRoot = gltf.scene.clone(true);

      // Measure raw geometry bounding box
      const box = new THREE.Box3().setFromObject(modelRoot);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Offset modelRoot so its geometrical center is strictly at (0, 0, 0)
      modelRoot.position.set(-center.x, -center.y, -center.z);

      // Wrapper group for clean scaling centered at origin
      const wrapper = new THREE.Group();
      wrapper.position.set(0, 0, 0);
      wrapper.add(modelRoot);

      // Scale to fit comfortably in view with safe margins
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const baseTargetHeight = 1.72; // reduced from 2.35 so top tab and bottom rim never clip
        const baseFactor = baseTargetHeight / maxDim;
        baseScaleFactorRef.current = baseFactor;
        wrapper.scale.setScalar(baseFactor * scale);
      }
      wrapperRef.current = wrapper;

      // Ensure all materials render double sided and preserve aluminum sheen
      modelRoot.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if (mat) {
              mat.side = THREE.DoubleSide;
              if ((mat as THREE.MeshStandardMaterial).roughness !== undefined) {
                const stdMat = mat as THREE.MeshStandardMaterial;
                stdMat.roughness = Math.min(0.5, Math.max(0.18, stdMat.roughness));
                stdMat.metalness = Math.max(0.35, stdMat.metalness || 0.4);
                stdMat.needsUpdate = true;
              }
            }
          });
        }
      });

      pivotGroup.clear();
      pivotGroup.add(wrapper);
      setLoading(false);
    };

    // Load or use cached model
    loadGLTFModel(modelUrl)
      .then((gltf) => {
        setupModel(gltf);
      })
      .catch((err) => {
        console.error('Error loading 3D can model:', err);
        setHasError(true);
        setLoading(false);
      });

    // Pointer event handlers
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactiveRef.current) return;
      isDraggingRef.current = true;
      setIsInteracting(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !interactiveRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      targetRotationY += deltaX * 0.012;
      // Clamp vertical tilt to [-35 deg, +35 deg]
      targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX + deltaY * 0.008));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setTimeout(() => {
        if (!isDisposed && !isDraggingRef.current) {
          setIsInteracting(false);
        }
      }, 1500);
    };

    const dom = renderer.domElement;
    dom.style.width = '100%';
    dom.style.height = '100%';
    dom.style.display = 'block';

    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Responsive Canvas Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || isDisposed) return;
      const newW = getWidth();
      const newH = getHeight();
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // Render loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Auto rotation: continuous 360 degree spin around Y axis
      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationY += 0.01;
      }

      // Smooth damping interpolation
      currentRotationY += (targetRotationY - currentRotationY) * Math.min(1, delta * 7);
      currentRotationX += (targetRotationX - currentRotationX) * Math.min(1, delta * 7);

      pivotGroup.rotation.y = currentRotationY;
      pivotGroup.rotation.x = currentRotationX;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);

      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
        }
      });

      renderer.dispose();
      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
    };
  }, [modelUrl]);

  if (hasError) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <img
          src={fallbackImage}
          alt="7UP Clásica"
          className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,139,62,0.45)]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full min-w-[240px] min-h-[320px]" />

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-xs rounded-3xl z-20 pointer-events-none">
          <Loader2 className="w-8 h-8 text-[#A4D902] animate-spin mb-2" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-white/90 font-bold">
            Cargando Lata 3D...
          </span>
        </div>
      )}

      {/* Interactive Drag Hint */}
      {!loading && (
        <div
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-black tracking-wider uppercase text-white flex items-center gap-1.5 shadow-lg transition-all pointer-events-none ${
            isInteracting ? 'opacity-90 scale-95' : 'opacity-70 hover:opacity-100'
          }`}
        >
          <Rotate3d className="w-3.5 h-3.5 text-[#A4D902] animate-pulse" />
          <span>3D • Arrastrá para girar</span>
        </div>
      )}
    </div>
  );
};
