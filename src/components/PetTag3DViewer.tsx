import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Loader2, Sparkles, Move3d } from 'lucide-react';

interface PetTag3DViewerProps {
  className?: string;
  modelUrl?: string;
}

export function PetTag3DViewer({
  className = '',
  modelUrl = '/pet_tag.glb',
}: PetTag3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Target rotation and position driven by scroll + mouse
  const mouseTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const scrollOffsetRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 4. Lighting setup for metallic and glossy materials
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb3b3b3, 2.5);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xe0e0e0, 2.0, 15);
    fillLight.position.set(0, -3, 3);
    scene.add(fillLight);

    // 5. Model Container Pivot
    const modelPivot = new THREE.Group();
    scene.add(modelPivot);

    let isDisposed = false;

    // 6. Load GLB Model
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        // Auto center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.85 / (maxDim || 1);

        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        // Enhance metallic textures
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat.roughness !== undefined) {
                mat.roughness = Math.max(0.2, mat.roughness * 0.85);
              }
              if (mat.metalness !== undefined) {
                mat.metalness = Math.min(0.9, mat.metalness * 1.15);
              }
            }
          }
        });

        modelPivot.add(model);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.warn('Failed to load 3D tag model:', err);
        setLoadError(true);
        setLoading(false);
      }
    );

    // 7. Mouse Interactivity for 3D Tilt
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTargetRef.current = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
    };

    const handleMouseLeave = () => {
      mouseTargetRef.current = { x: 0, y: 0 };
    };

    // 8. Parallax Scroll Listener
    const handleScroll = () => {
      // Normalized scroll progression
      const scrollY = window.scrollY;
      scrollOffsetRef.current = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 9. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w && h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    // 10. Smooth Animation Loop with LERP interpolation
    let animationFrameId: number;
    let clock = new THREE.Clock();

    let curRotX = 0.12;
    let curRotY = -0.3;
    let curRotZ = 0;
    let curPosY = 0.25;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Gentle floating oscillation
      const floatY = Math.sin(elapsed * 1.6) * 0.06;
      const floatTilt = Math.cos(elapsed * 1.3) * 0.03;

      // Scroll physics calculation:
      // When scrolling down, scrollOffset increases:
      // 1) It descends (moves downwards from posY +0.3 down to -0.9)
      // 2) It spins around Y axis continuously with a smooth tumbling roll
      const scrollY = scrollOffsetRef.current;
      const scrollFactor = Math.min(1.8, scrollY * 0.0016);

      // Downward descent driven by scrolling
      const targetPosY = (0.2 + floatY) - (scrollFactor * 0.95);

      // Dynamic 3D spin on scroll (rotates 360+ degrees as you scroll down)
      const targetRotY = (elapsed * 0.25) + (scrollY * 0.0065) + (mouseTargetRef.current.x * 0.5);
      const targetRotX = floatTilt + (scrollFactor * 0.45) + (-mouseTargetRef.current.y * 0.35);
      const targetRotZ = (mouseTargetRef.current.x * 0.2) + Math.sin(scrollY * 0.003) * 0.2;

      // Smooth interpolation (LERP) for liquid physics
      const lerpSpeed = Math.min(1, delta * 4.8);
      curRotX += (targetRotX - curRotX) * lerpSpeed;
      curRotY += (targetRotY - curRotY) * lerpSpeed;
      curRotZ += (targetRotZ - curRotZ) * lerpSpeed;
      curPosY += (targetPosY - curPosY) * lerpSpeed;

      modelPivot.rotation.x = curRotX;
      modelPivot.rotation.y = curRotY;
      modelPivot.rotation.z = curRotZ;
      modelPivot.position.y = curPosY;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ touchAction: 'pan-y' }}
      title="Hover and scroll to interact with the 3D Petziq Smart Tag"
    >
      {/* Loading Spinner */}
      {loading && !loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-3xl bg-ink-950/60 backdrop-blur-sm z-20">
          <Loader2 className="h-8 w-8 text-brand-300 animate-spin" />
          <span className="text-xs text-ink-300 font-mono tracking-wider">
            Loading 3D Hardware Model...
          </span>
        </div>
      )}

      {/* Floating 3D Badge Indicator */}
      {!loading && !loadError && (
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full border border-white/10 bg-ink-950/80 px-2.5 py-1 text-[10px] font-medium text-ink-300 backdrop-blur-md pointer-events-none shadow-sm">
          <Move3d className="h-3 w-3 text-brand-300 animate-pulse" />
          <span>3D Parallax Active</span>
        </div>
      )}

      {/* Fallback in case WebGL or loading fails */}
      {loadError && (
        <div className="p-6 text-center text-xs text-ink-400">
          <p>Interactive 3D preview mode</p>
        </div>
      )}
    </div>
  );
}

