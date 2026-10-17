import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { ArrowRight, Tag, Shield, CheckCircle2, Sparkles, Droplets, SunMedium } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AntigravityHeroProps {
  onNavigate: (path: string) => void;
  onOrderTag: () => void;
  activeMode?: 'pets' | 'plants';
  onToggleMode?: (mode: 'pets' | 'plants') => void;
}

export function AntigravityHero({
  onNavigate,
  onOrderTag,
  activeMode = 'pets',
  onToggleMode,
}: AntigravityHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Dynamic card border highlight refs for color parallax
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const glowMeshRef = useRef<HTMLDivElement>(null);

  // Damped pointer coordinates with spring tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Light color refs for runtime mode transitions
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Viewport & device detection
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isTouchViewport = width < 1024;

    // --- 1. Scene with Rich Obsidian Charcoal Canvas (#080C0E) ---
    const scene = new THREE.Scene();

    // Responsive camera initialization
    const initialFov = isMobile ? 52 : isTablet ? 46 : 40;
    const camera = new THREE.PerspectiveCamera(initialFov, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 4.9 : 4.0);

    // --- 2. High-Performance WebGL Renderer with Locked Mobile Guardrails ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
      precision: isMobile ? 'mediump' : 'highp',
    });
    renderer.setSize(width, height);

    // Dynamic resolution throttling: strictly capped at 1.0 on mobile and 1.3 on tablets
    const maxDpr = isMobile ? 1.0 : isTablet ? 1.3 : Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(maxDpr);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false; // Zero shadow map pass overhead on mobile

    // --- 3. Unified Monochromatic Biophilic Three-Point Lighting ---
    // 3a. Key Light: Crisp pure clean white (#FFFFFF) calibrated to reveal natural GLB textures
    const keyLightColor = new THREE.Color('#FFFFFF');
    const keyLight = new THREE.DirectionalLight(keyLightColor, 2.6);
    keyLight.position.set(4.5, 6, 4.5);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // 3b. Fill Light: Calibrated pure white (#FFFFFF) at low intensity to soften contrast
    const fillLightColor = new THREE.Color('#FFFFFF');
    const fillLight = new THREE.DirectionalLight(fillLightColor, 1.8);
    fillLight.position.set(-5, -2, 3.5);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    // 3c. Back/Rim Light: Single soft, low-saturation botanical sage green (#2DD4BF)
    const rimLightColor = new THREE.Color('#2DD4BF');
    const rimLight = new THREE.DirectionalLight(rimLightColor, 2.8);
    rimLight.position.set(0, -5, -4);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Subtle biophilic obsidian ambient bounce
    const ambientLight = new THREE.AmbientLight(0x0a1012, 1.6);
    scene.add(ambientLight);

    // --- 4. Contact Shadow Disc (Zero GPU draw overhead) ---
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 5, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
      grad.addColorStop(0.35, 'rgba(8, 12, 14, 0.4)');
      grad.addColorStop(1, 'rgba(8, 12, 14, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(isMobile ? 0 : 0.85, -1.2, 0);
    scene.add(contactShadow);

    // --- 5. Model Pivot & 300vh Target Spatial States ---
    const modelPivot = new THREE.Group();
    scene.add(modelPivot);

    const modelTarget = {
      posX: isMobile ? 0 : 0.85,
      posY: 0,
      posZ: 0,
      rotX: 0.12,
      rotY: -0.25,
      rotZ: 0,
      cameraZ: isMobile ? 4.9 : 4.0,
      cameraX: 0,
      cameraY: 0,
      shadowOpacity: 0.72,
      keyIntensity: 2.6,
      fillIntensity: 1.8,
      rimIntensity: 2.8,
      rimSaturation: 0.65, // Controlled sage saturation
    };

    let isDisposed = false;

    // --- 6. 2.7MB Draco Asset Pipeline with Pre-Warmed GPU Shaders ---
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/assets/petziq-model.glb',
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        // Auto-center and compute normalized bounds
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = isMobile ? 1.52 : 1.95;
        const scale = targetScale / (maxDim || 1);

        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        // Hardware-Accelerated Intersections & Static Node Matrices
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();

            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat.name.toLowerCase().includes('leaf') || mat.name.toLowerCase().includes('plant')) {
                mat.roughness = 0.52;
                mat.metalness = 0.06;
              } else {
                mat.roughness = Math.max(0.16, (mat.roughness ?? 0.3) * 0.78);
                mat.metalness = Math.min(0.96, (mat.metalness ?? 0.5) * 1.3);
              }
            }
          }
        });

        // Pre-compile shaders into WebGL cache before revealing
        renderer.compile(scene, camera);

        modelPivot.add(model);
        setLoadProgress(100);
        setTimeout(() => setModelLoaded(true), 80);

        // --- 7. Multi-Tiered Z-Axis Depth Parallax Timeline (300vh Container) ---
        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          });

          // Phase 1 (0% -> 33.3%): Camera sweeps inward along a curve with organic spring floating idle
          tl.to(
            modelTarget,
            {
              posX: isMobile ? 0 : -0.95,
              posY: -0.15,
              rotY: Math.PI * 1.1,
              rotX: 0.22,
              cameraZ: isMobile ? 4.2 : 3.4,
              cameraX: isMobile ? 0 : 0.15,
              cameraY: 0.12,
              shadowOpacity: 0.55,
              keyIntensity: 2.8,
              fillIntensity: 2.0,
              rimIntensity: 3.2,
              ease: 'none',
            },
            0
          )
          // Phase 2 (33.3% -> 66.6%): Camera tracks laterally and rotates to expose geometric detail
          .to(
            modelTarget,
            {
              posX: isMobile ? 0 : 0.95,
              posY: -0.4,
              rotY: Math.PI * 2.15,
              rotX: -0.16,
              cameraZ: isMobile ? 3.9 : 3.2,
              cameraX: isMobile ? 0 : -0.2,
              cameraY: -0.15,
              shadowOpacity: 0.65,
              keyIntensity: 3.0,
              fillIntensity: 1.9,
              rimIntensity: 3.4,
              ease: 'none',
            },
            0.333
          )
          // Phase 3 (66.6% -> 100%): Scene aligns orthogonally to stage model behind oncoming panels
          .to(
            modelTarget,
            {
              posX: 0,
              posY: -0.75,
              rotY: Math.PI * 2.9,
              rotX: 0.06,
              cameraZ: isMobile ? 3.7 : 3.0,
              cameraX: 0,
              cameraY: 0,
              shadowOpacity: 0.8,
              keyIntensity: 2.6,
              fillIntensity: 1.8,
              rimIntensity: 2.8,
              ease: 'none',
            },
            0.666
          );

          // Monochromatic Biophilic Ambient Mesh Parallax
          if (glowMeshRef.current) {
            tl.to(
              glowMeshRef.current,
              {
                background:
                  'radial-gradient(circle at 75% 35%, rgba(16, 185, 129, 0.22) 0%, rgba(45, 212, 191, 0.12) 40%, rgba(6, 8, 10, 0) 75%)',
                ease: 'none',
              },
              0
            ).to(
              glowMeshRef.current,
              {
                background:
                  'radial-gradient(circle at 45% 65%, rgba(16, 185, 129, 0.2) 0%, rgba(45, 212, 191, 0.14) 45%, rgba(6, 8, 10, 0) 80%)',
                ease: 'none',
              },
              0.5
            );
          }

          // Asynchronous velocity tracking across elements:
          // Large headline shifts upward at a dynamic offset
          if (headlineRef.current) {
            tl.to(
              headlineRef.current,
              {
                y: -120,
                ease: 'none',
              },
              0
            );
          }

          // Card reveal transitions with hardware acceleration & intentional 150ms lag offset
          if (layer2Ref.current) {
            gsap.fromTo(
              layer2Ref.current,
              { opacity: 0, y: 50, filter: 'blur(8px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.8,
                delay: 0.15, // 150ms physical separation offset
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: layer2Ref.current,
                  start: 'top 75%',
                  toggleActions: 'play reverse play reverse',
                },
              }
            );
          }

          if (layer3Ref.current) {
            gsap.fromTo(
              layer3Ref.current,
              { opacity: 0, y: 50, filter: 'blur(8px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.8,
                delay: 0.15, // 150ms physical separation offset
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: layer3Ref.current,
                  start: 'top 80%',
                  toggleActions: 'play reverse play reverse',
                },
              }
            );
          }
        }, container);

        return () => ctx.revert();
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.min(99, Math.round((xhr.loaded / xhr.total) * 100)));
        }
      },
      (err) => {
        console.warn('GLB asset loading issue:', err);
        setModelLoaded(true);
      }
    );

    // --- 8. SplitType Editorial Typography Stagger Animation ---
    let splitInstance: SplitType | null = null;
    if (headlineRef.current) {
      splitInstance = new SplitType(headlineRef.current, { types: 'words,chars' });
      if (splitInstance.words) {
        gsap.fromTo(
          splitInstance.words,
          { opacity: 0, y: 32, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            stagger: 0.03,
            ease: 'power3.out',
            delay: 0.1,
          }
        );
      }
    }

    // Pointer-reactive physics on desktop
    const handlePointerMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!isTouchViewport) {
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
    }

    // Viewport resize handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 768;
      const tablet = w >= 768 && w < 1024;

      camera.aspect = w / h;
      camera.fov = mobile ? 52 : tablet ? 46 : 40;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(mobile ? 1.0 : tablet ? 1.3 : Math.min(window.devicePixelRatio || 1, 1.5));

      if (mobile) {
        modelTarget.posX = 0;
      }
    };
    window.addEventListener('resize', handleResize);

    // --- 9. High-Performance Render Loop (Locked 60+ FPS Interpolation) ---
    let reqId: number;
    let lastTime = performance.now();
    let elapsed = 0;

    let curPosX = isMobile ? 0 : 0.85;
    let curPosY = 0;
    let curRotX = 0.12;
    let curRotY = -0.25;
    let curRotZ = 0;
    let curCameraZ = isMobile ? 4.9 : 4.0;
    let curCameraX = 0;
    let curCameraY = 0;

    const lerpFactor = isTouchViewport ? 0.14 : 0.1;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      elapsed += delta;

      // Micro-floating idle loop
      const floatY = Math.sin(elapsed * 1.5) * 0.035;
      const floatTilt = Math.cos(elapsed * 1.2) * 0.02;

      // Spring-damped pointer tracking
      if (!isTouchViewport) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;
      }

      // Smooth kinematic coordinate interpolation
      curPosX += (modelTarget.posX - curPosX) * lerpFactor;
      curPosY += (modelTarget.posY - curPosY) * lerpFactor;
      curRotX += (modelTarget.rotX - curRotX) * lerpFactor;
      curRotY += (modelTarget.rotY - curRotY) * lerpFactor;
      curRotZ += (modelTarget.rotZ - curRotZ) * lerpFactor;
      curCameraZ += (modelTarget.cameraZ - curCameraZ) * lerpFactor;
      curCameraX += (modelTarget.cameraX - curCameraX) * lerpFactor;
      curCameraY += (modelTarget.cameraY - curCameraY) * lerpFactor;

      modelPivot.position.x = curPosX + mouseRef.current.x * 0.12;
      modelPivot.position.y = curPosY + floatY + mouseRef.current.y * 0.12;
      modelPivot.position.z = modelTarget.posZ;

      modelPivot.rotation.x = curRotX + floatTilt + -mouseRef.current.y * 0.15;
      modelPivot.rotation.y = curRotY + mouseRef.current.x * 0.22;
      modelPivot.rotation.z = curRotZ + mouseRef.current.x * 0.06;

      contactShadow.position.x = modelPivot.position.x;
      contactShadow.position.y = curPosY - 1.25;
      (contactShadow.material as THREE.MeshBasicMaterial).opacity = modelTarget.shadowOpacity;

      // Monochromatic Three-Point Light Intensity Interpolation
      keyLight.intensity = modelTarget.keyIntensity;
      fillLight.intensity = modelTarget.fillIntensity;
      rimLight.intensity = modelTarget.rimIntensity;

      camera.position.z = curCameraZ;
      camera.position.x = curCameraX;
      camera.position.y = curCameraY;
      camera.lookAt(0, curPosY * 0.45, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(reqId);
      if (!isTouchViewport) {
        window.removeEventListener('mousemove', handlePointerMove);
      }
      window.removeEventListener('resize', handleResize);
      if (splitInstance) splitInstance.revert();
      renderer.dispose();
      dracoLoader.dispose();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '300vh' }}>
      {/* Dynamic Background Gradient Mesh with Biophilic Highlights (#06080A Canvas) */}
      <div
        ref={glowMeshRef}
        className="fixed inset-0 pointer-events-none transition-all duration-700 z-0"
        style={{
          background:
            'radial-gradient(circle at 65% 25%, rgba(16, 185, 129, 0.16) 0%, rgba(45, 212, 191, 0.08) 40%, transparent 75%)',
        }}
      />

      {/* Luxury Loading Screen Overlay with Architectural Monospace Progress Indicator */}
      {!modelLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#06080A]/98 backdrop-blur-md transition-opacity duration-500 pointer-events-none">
          <div className="mb-4">
            <img
              src="/petziq-shield-logo.png"
              alt="Petziq Shield"
              className="w-12 h-12 rounded object-contain shadow-[0_0_24px_rgba(16,185,129,0.3)] animate-pulse"
            />
          </div>
          <div className="relative flex items-center justify-center">
            {/* SVG Circular Progress Ring */}
            <svg className="h-14 w-14 -rotate-90 transform" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-white/10 fill-none"
                strokeWidth="2"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-emerald-400 fill-none transition-all duration-200 ease-out"
                strokeWidth="2"
                strokeDasharray="175.9"
                strokeDashoffset={175.9 - (175.9 * loadProgress) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute font-mono text-xs font-bold text-white tracking-widest">
              {loadProgress}%
            </span>
          </div>
          <p className="mt-3 font-mono text-[11px] tracking-[0.25em] text-emerald-400 uppercase">
            CALIBRATING_3D_CORE
          </p>
        </div>
      )}

      {/* Sticky Fixed WebGL Canvas Layer */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Layer 1: Phase 1 Entrance (0vh - 100vh) — Asymmetrical Left-Aligned Editorial Architecture */}
      <div
        ref={layer1Ref}
        className="absolute top-0 left-0 w-full h-screen flex items-center z-10 pointer-events-none transform-gpu will-change-transform"
      >
        <div className="w-full pl-[6vw] lg:pl-[8vw] pr-[6vw] lg:pr-[38vw]">
          <div className="max-w-2xl text-left pointer-events-auto">
            {/* Auxiliary Functional Metadata Tag in Widely Spaced Monospace */}
            <div className="inline-flex items-center gap-2.5 rounded-[4px] border border-emerald-500/25 bg-[#06080A]/85 px-3 py-1 mb-6 backdrop-blur-xl brutalist-card-emerald">
              <img
                src="/petziq-shield-logo.png"
                alt="Petziq"
                className="w-3.5 h-3.5 rounded-[2px] object-contain shrink-0"
              />
              <span className="meta-tag text-emerald-300">
                EDITION // 2026.BIO
              </span>
              <span className="text-white/20">|</span>
              <span className="meta-tag text-ink-300">
                COMPANION_ECOSYSTEM
              </span>
            </div>

            {/* Oversized, Tight-Tracked Editorial Serif Headline with Fluid Scaling */}
            <h1
              ref={headlineRef}
              className="editorial-title font-bold text-white tracking-[-0.035em] text-balance"
            >
              A smarter voice for the pets you hold close.
            </h1>

            {/* Editorial Lead Paragraph with Negative Overlap Accent */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-ink-200 font-normal max-w-lg">
              Merging living botanical telemetry with aerospace-grade laser QR hardware, automated health passports, and instantaneous cellular routing.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={onOrderTag}
                className="btn-primary rounded-[4px] px-6 py-3 font-mono text-xs uppercase tracking-wider bg-emerald-400 hover:bg-emerald-300 text-ink-950 font-bold shadow-[0_12px_32px_-6px_rgba(16,185,129,0.35)] transition-all duration-300 hover:scale-[1.02]"
              >
                <Tag className="h-4 w-4" />
                Acquire Smart Tag (₹599)
              </button>
              <button
                onClick={() => onNavigate('/explore')}
                className="btn-ghost rounded-[4px] px-5 py-3 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-300 hover:border-emerald-400/60 hover:bg-emerald-500/12 transition-all duration-300"
              >
                Explore 330 Breeds
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Editorial Architectural Metrics Bar with Low-Radius Borders */}
            <div className="mt-10 grid grid-cols-3 gap-0 border border-white/[0.12] rounded-[4px] bg-[#06080A]/75 backdrop-blur-md divide-x divide-white/[0.12] max-w-lg">
              <div className="p-3.5 sm:p-4">
                <p className="font-editorial text-2xl sm:text-3xl font-bold text-white">
                  330
                </p>
                <p className="meta-tag text-emerald-300/80 mt-1">PET_TAXA</p>
              </div>
              <div className="p-3.5 sm:p-4">
                <p className="font-editorial text-2xl sm:text-3xl font-bold text-emerald-300">
                  99
                </p>
                <p className="meta-tag text-emerald-300/80 mt-1">FLORA_DOCS</p>
              </div>
              <div className="p-3.5 sm:p-4">
                <p className="font-editorial text-2xl sm:text-3xl font-bold text-teal-200">
                  0.2s
                </p>
                <p className="meta-tag text-emerald-300/80 mt-1">QR_ROUTING</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 2: Phase 2 Exploded Detail Rotation (100vh - 200vh) — Sharp Brutalist Right-Aligned Glass Pane */}
      <div className="absolute top-[105vh] left-0 w-full h-screen flex items-center justify-end z-10 pointer-events-none transform-gpu will-change-transform">
        <div className="w-full pr-[6vw] lg:pr-[10vw] pl-[6vw] lg:pl-[44vw] flex justify-end">
          <div
            ref={layer2Ref}
            className="max-w-lg text-left p-8 sm:p-10 brutalist-card brutalist-card-emerald backdrop-blur-2xl pointer-events-auto transform-gpu will-change-transform relative bg-[#06080A]/90"
          >
            {/* 90-Degree Structural Internal Anchor Lines */}
            <div className="absolute top-0 left-0 w-6 h-px bg-emerald-400" />
            <div className="absolute top-0 left-0 w-px h-6 bg-emerald-400" />
            <div className="absolute bottom-0 right-0 w-6 h-px bg-emerald-400" />
            <div className="absolute bottom-0 right-0 w-px h-6 bg-emerald-400" />

            <div className="inline-flex items-center gap-2 rounded-[2px] border border-emerald-400/30 text-emerald-300 bg-emerald-500/10 px-2.5 py-1">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span className="meta-tag text-[10px]">DIRECT_OPTICAL_ROUTING</span>
            </div>

            <h2 className="mt-4 font-editorial text-2xl sm:text-3xl font-bold text-white leading-tight">
              Instant finder protection. Zero application barrier.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-ink-200">
              When anyone scans your pet&apos;s physical collar tag with any native smartphone camera, they are routed to your pet&apos;s emergency profile with immediate telephone and WhatsApp routing options.
            </p>

            <div className="mt-6 pt-4 border-t border-white/[0.1] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Laser-etched precision QR
              </span>
              <span className="meta-tag text-ink-400 text-[10px]">WATERPROOF_ACRYLIC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 3: Phase 3 Dashboard Pivot (200vh - 300vh) — Sharp Architectural Hero Card with Multi-Layered Drop Shadows */}
      <div className="absolute top-[205vh] left-0 w-full h-[85vh] flex items-center justify-center z-10 pointer-events-none transform-gpu will-change-transform">
        <div
          ref={layer3Ref}
          className="container-px w-full text-center max-w-3xl pointer-events-auto transform-gpu will-change-transform"
        >
          <div className="p-8 sm:p-12 brutalist-card brutalist-card-sage backdrop-blur-2xl relative bg-[#06080A]/90">
            {/* 90-Degree Structural Internal Anchor Lines */}
            <div className="absolute top-0 left-0 w-8 h-px bg-teal-400" />
            <div className="absolute top-0 left-0 w-px h-8 bg-teal-400" />
            <div className="absolute bottom-0 right-0 w-8 h-px bg-teal-400" />
            <div className="absolute bottom-0 right-0 w-px h-8 bg-teal-400" />

            <span className="meta-tag text-emerald-300">
              HARDWARE_SPECIFICATION // MIL_SPEC
            </span>

            <h2 className="mt-3 font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Crafted for lifetime companionship.
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink-200 max-w-xl mx-auto">
              Every Petziq Smart Tag is cut from aircraft-grade acrylic and laser engraved with micro-precision for lifetime durability and instant optical legibility.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onOrderTag}
                className="btn-primary rounded-[4px] px-7 py-3 font-mono text-xs uppercase tracking-wider bg-emerald-400 hover:bg-emerald-300 text-ink-950 font-bold shadow-[0_16px_36px_-8px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.02]"
              >
                Customize Shape, Color & Pet Name &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
