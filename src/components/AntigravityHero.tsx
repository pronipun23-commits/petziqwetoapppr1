import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { ArrowRight, Tag, Shield, CheckCircle2, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AntigravityHeroProps {
  onNavigate: (path: string) => void;
  onOrderTag: () => void;
}

export function AntigravityHero({ onNavigate, onOrderTag }: AntigravityHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  // Dynamic card border highlight refs for color parallax
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const glowMeshRef = useRef<HTMLDivElement>(null);

  // Damped pointer coordinates
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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

    // --- 1. Scene & Deep Obsidian Charcoal Canvas Background ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f12);

    // Responsive camera initialization
    const initialFov = isMobile ? 54 : isTablet ? 48 : 42;
    const camera = new THREE.PerspectiveCamera(initialFov, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 4.9 : 4.0);

    // --- 2. High-Efficiency WebGL Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile, // Turn off costly MSAA on low-end mobile to gain frame budget
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);

    // Dynamic resolution base target (capped at 1.5 stationary to protect GPU fill-rate)
    const stationaryMaxDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let currentDpr = isMobile ? 1.0 : isTablet ? 1.2 : stationaryMaxDpr;
    renderer.setPixelRatio(currentDpr);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Pillar 3: If screen width < 1024px, completely disable real-time canvas shadow computation
    const enableShadows = !isTouchViewport;
    renderer.shadowMap.enabled = enableShadows;
    if (enableShadows) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    // --- 3. Pillar 1: Chromatic Vibrancy & Biophilic Cyber Three-Point Lighting Profile ---
    // 3a. Key Light: Warm Sunset Gold / Soft Terracotta (#FFB26B / #F59E0B)
    const keyLightColor = new THREE.Color('#f59e0b');
    const keyLight = new THREE.DirectionalLight(keyLightColor, isTouchViewport ? 3.8 : 4.5);
    keyLight.position.set(4.5, 6, 4.5);
    if (enableShadows) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0001;
    }
    scene.add(keyLight);

    // 3b. Fill Light: Fresh Vibrant Botanical Mint / Sage Green (#10B981 / #34D399)
    const fillLightColor = new THREE.Color('#10b981');
    const fillLight = new THREE.PointLight(fillLightColor, 3.2, 30);
    fillLight.position.set(-5, -2, 3.5);
    scene.add(fillLight);

    // 3c. Rim/Backlight: Electric Neon Lime / Cyber-Cyan Halo Silhouette (#06B6D4 / #22C55E)
    const rimLightColor = new THREE.Color('#06b6d4');
    const rimLight = new THREE.DirectionalLight(rimLightColor, isTouchViewport ? 3.4 : 4.2);
    rimLight.position.set(0, -5, -4);
    scene.add(rimLight);

    // Subtle ambient bounce
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    // --- 4. Physically Grounded Soft Contact Shadow ---
    let contactShadow: THREE.Mesh | null = null;
    if (enableShadows) {
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 256;
      shadowCanvas.height = 256;
      const sCtx = shadowCanvas.getContext('2d');
      if (sCtx) {
        const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
        grad.addColorStop(0.35, 'rgba(11, 15, 18, 0.4)');
        grad.addColorStop(1, 'rgba(11, 15, 18, 0)');
        sCtx.fillStyle = grad;
        sCtx.fillRect(0, 0, 256, 256);
      }
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      });
      contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
      contactShadow.rotation.x = -Math.PI / 2;
      contactShadow.position.set(isMobile ? 0 : 0.85, -1.2, 0);
      scene.add(contactShadow);
    }

    // --- 5. Model Pivot & Target States ---
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
      cameraY: 0,
      shadowOpacity: 0.75,
      // Dynamic color interpolation parameters
      keyHue: 0.11, // Sunset Gold
      fillHue: 0.44, // Botanical Mint
      rimHue: 0.52, // Cyber Cyan
    };

    let isDisposed = false;

    // --- 6. Pillar 2: 2.7MB Asset Delivery & Draco WebAssembly Pipeline ---
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    // Load the 2.7MB local asset
    loader.load(
      '/assets/petziq-model.glb',
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        // Bounding calculation & auto-centering
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = isMobile ? 1.52 : 1.95;
        const scale = targetScale / (maxDim || 1);

        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        // Apple-style Material Tuning with colorful iridescent reflections
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            // Raycasting BVH optimization: disable matrix auto-update on static nodes
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();

            if (enableShadows) {
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }

            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat.name.toLowerCase().includes('leaf') || mat.name.toLowerCase().includes('plant')) {
                mat.roughness = 0.55;
                mat.metalness = 0.08;
              } else {
                mat.roughness = Math.max(0.16, (mat.roughness ?? 0.3) * 0.8);
                mat.metalness = Math.min(0.96, (mat.metalness ?? 0.5) * 1.3);
              }
            }
          }
        });

        // Warm up WebGL shader cache before presenting to eliminate mid-scroll stutter
        renderer.compile(scene, camera);

        modelPivot.add(model);
        setLoadProgress(100);
        setTimeout(() => setModelLoaded(true), 120);

        // --- 7. Pillar 4: Lenis-Synchronized GSAP ScrollTrigger Animation ---
        const scrubValue = isTouchViewport ? 1.8 : 1.2;

        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: 'bottom bottom',
              scrub: scrubValue, // Cushioned touch inertia for mobile
            },
          });

          // Phase 1 (0 -> 50% scroll): Morph position and transition lighting to botanical green
          tl.to(modelTarget, {
            posX: isMobile ? 0 : -0.85,
            posY: -0.22,
            rotY: Math.PI * 1.15,
            rotX: 0.2,
            cameraZ: isMobile ? 4.3 : 3.6,
            cameraY: 0.1,
            shadowOpacity: 0.5,
            keyHue: 0.42, // Shift key toward botanical emerald
            fillHue: 0.12, // Shift fill toward warm amber
            rimHue: 0.48, // Vivid aqua
            ease: 'none',
          }, 0)
          // Phase 2 (50% -> 100% scroll): Full 360 showcase and transition lighting to cyber cyan/lime
          .to(modelTarget, {
            posX: 0,
            posY: -0.72,
            rotY: Math.PI * 2.85,
            rotX: 0.08,
            cameraZ: isMobile ? 3.8 : 3.1,
            cameraY: 0,
            shadowOpacity: 0.8,
            keyHue: 0.52, // Cyber cyan
            fillHue: 0.38, // Mint green
            rimHue: 0.22, // Electric lime
            ease: 'none',
          }, 0.5);

          // Dynamic Color Parallax: Morph glowing background and glassmorphic card borders
          if (glowMeshRef.current) {
            tl.to(glowMeshRef.current, {
              background: 'radial-gradient(circle at 75% 35%, rgba(16, 185, 129, 0.28) 0%, rgba(6, 182, 212, 0.15) 45%, transparent 70%)',
              ease: 'none',
            }, 0)
            .to(glowMeshRef.current, {
              background: 'radial-gradient(circle at 45% 65%, rgba(245, 158, 11, 0.25) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 75%)',
              ease: 'none',
            }, 0.5);
          }

          // Staggered reveals for glassmorphic cards
          if (layer2Ref.current) {
            gsap.fromTo(
              layer2Ref.current,
              { opacity: 0, y: 30, filter: 'blur(6px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.9,
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
              { opacity: 0, y: 30, filter: 'blur(6px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.9,
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
          { opacity: 0, y: 40, filter: 'blur(10px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.1,
            stagger: 0.035,
            ease: 'power4.out',
            delay: 0.15,
          }
        );
      }
    }

    // --- 9. Pillar 3: Dynamic Hardware & Adaptive DPR Throttling ---
    let isScrollingFast = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScrollAdaptive = () => {
      if (!isScrollingFast) {
        isScrollingFast = true;
        // Dynamically throttle DPR: 1.0 for mobile, 1.2 for tablet during active scroll
        const scrollDpr = isMobile ? 1.0 : isTablet ? 1.2 : 1.25;
        renderer.setPixelRatio(scrollDpr);
      }
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingFast = false;
        // Restore stationary max DPR when scroll stops
        renderer.setPixelRatio(stationaryMaxDpr);
      }, 95);
    };

    window.addEventListener('scroll', handleScrollAdaptive, { passive: true });

    // Pointer tracking
    const handlePointerMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Responsive resize listener
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 768;
      const tablet = w >= 768 && w < 1024;

      camera.aspect = w / h;
      camera.fov = mobile ? 54 : tablet ? 48 : 42;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(stationaryMaxDpr);

      if (mobile) {
        modelTarget.posX = 0;
      }
    };
    window.addEventListener('resize', handleResize);

    // --- 10. Performance Monitor & Damped Kinetic Render Loop ---
    let reqId: number;
    let lastTime = performance.now();
    let elapsed = 0;

    let frameCount = 0;
    let lastFpsCheck = performance.now();
    let lowFpsCount = 0;

    // Interpolation state
    let curPosX = isMobile ? 0 : 0.85;
    let curPosY = 0;
    let curRotX = 0.12;
    let curRotY = -0.25;
    let curRotZ = 0;
    let curCameraZ = isMobile ? 4.9 : 4.0;
    let curCameraY = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      elapsed += delta;

      // Real-time FPS monitor: if FPS dips below 50 repeatedly, downgrade to Eco-Power mode
      frameCount++;
      if (now - lastFpsCheck >= 1000) {
        const currentFps = (frameCount * 1000) / (now - lastFpsCheck);
        frameCount = 0;
        lastFpsCheck = now;

        if (currentFps < 50) {
          lowFpsCount++;
          if (lowFpsCount >= 3) {
            setLowPowerMode(true);
          }
        } else {
          lowFpsCount = Math.max(0, lowFpsCount - 1);
        }
      }

      // Micro-floating antigravity physics
      const floatY = Math.sin(elapsed * 1.6) * 0.04;
      const floatTilt = Math.cos(elapsed * 1.3) * 0.025;

      // Damped pointer follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.055;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.055;

      // Fluid Kinetic Motion Damping (0.065 LERP)
      const lerpFactor = 0.065;
      curPosX += (modelTarget.posX - curPosX) * lerpFactor;
      curPosY += (modelTarget.posY - curPosY) * lerpFactor;
      curRotX += (modelTarget.rotX - curRotX) * lerpFactor;
      curRotY += (modelTarget.rotY - curRotY) * lerpFactor;
      curRotZ += (modelTarget.rotZ - curRotZ) * lerpFactor;
      curCameraZ += (modelTarget.cameraZ - curCameraZ) * lerpFactor;
      curCameraY += (modelTarget.cameraY - curCameraY) * lerpFactor;

      modelPivot.position.x = curPosX + (mouseRef.current.x * 0.14);
      modelPivot.position.y = curPosY + floatY + (mouseRef.current.y * 0.14);
      modelPivot.position.z = modelTarget.posZ;

      modelPivot.rotation.x = curRotX + floatTilt + (-mouseRef.current.y * 0.18);
      modelPivot.rotation.y = curRotY + (mouseRef.current.x * 0.28);
      modelPivot.rotation.z = curRotZ + (mouseRef.current.x * 0.08);

      if (contactShadow) {
        contactShadow.position.x = modelPivot.position.x;
        contactShadow.position.y = curPosY - 1.25;
        (contactShadow.material as THREE.MeshBasicMaterial).opacity = modelTarget.shadowOpacity;
      }

      // Dynamic light color morphing
      keyLight.color.setHSL(modelTarget.keyHue, 0.95, 0.55);
      fillLight.color.setHSL(modelTarget.fillHue, 0.85, 0.48);
      rimLight.color.setHSL(modelTarget.rimHue, 0.92, 0.52);

      camera.position.z = curCameraZ;
      camera.position.y = curCameraY;
      camera.lookAt(0, curPosY * 0.45, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(reqId);
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScrollAdaptive);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (splitInstance) splitInstance.revert();
      renderer.dispose();
      dracoLoader.dispose();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '250vh' }}>
      {/* Dynamic Background Gradient Mesh with Biophilic Cyber Highlights */}
      <div
        ref={glowMeshRef}
        className="fixed inset-0 pointer-events-none transition-all duration-700 z-0"
        style={{
          background:
            'radial-gradient(circle at 65% 25%, rgba(245, 158, 11, 0.18) 0%, rgba(16, 185, 129, 0.16) 40%, rgba(11, 15, 18, 0) 70%)',
        }}
      />

      {/* Premium Minimal Loading Screen Overlay with Circular Progress Indicator */}
      {!modelLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F12]/95 backdrop-blur-md transition-opacity duration-700 pointer-events-none">
          <div className="relative flex items-center justify-center">
            {/* SVG Circular Progress Ring */}
            <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-white/10 fill-none"
                strokeWidth="3"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-amber-400 fill-none transition-all duration-300 ease-out"
                strokeWidth="3"
                strokeDasharray="175.9"
                strokeDashoffset={175.9 - (175.9 * loadProgress) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute font-mono text-xs font-semibold text-white">
              {loadProgress}%
            </span>
          </div>
          <p className="mt-4 text-xs font-mono tracking-widest text-emerald-300 uppercase">
            Unpacking 2.7MB Draco Asset...
          </p>
        </div>
      )}

      {/* Sticky Fixed WebGL Canvas Layer or Low-Power Static Fallback */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-0">
        {!lowPowerMode ? (
          <canvas ref={canvasRef} className="w-full h-full block" />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-b from-[#0B0F12] via-[#0D151C] to-[#0B0F12]">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-emerald-500/30 bg-radial from-emerald-500/20 to-transparent flex items-center justify-center shadow-glow animate-pulse">
              <Tag className="w-24 h-24 text-emerald-300 drop-shadow-[0_0_24px_rgba(16,185,129,0.5)]" />
              <span className="absolute bottom-4 font-mono text-[10px] text-emerald-300 tracking-wider uppercase bg-[#0B0F12]/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Eco Power Mode Active
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Layer 1: Initial Hero Section (0vh - 80vh) */}
      <div
        ref={layer1Ref}
        className="absolute top-0 left-0 w-full h-screen flex items-center z-10 pointer-events-none transform-gpu will-change-transform"
      >
        <div className="container-px w-full">
          <div className="max-w-xl text-left pointer-events-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300 mb-4 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Biophilic Cyber-Minimalism</span>
            </div>

            <h1 ref={headlineRef} className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              A smarter voice for the pets you love most.
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-ink-300">
              Laser-engraved Smart Tag hardware integrated with real-time care intelligence, husbandry encyclopedias, and instant emergency QR profiles.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={onOrderTag}
                className="btn-primary text-base shadow-glow transition-transform hover:scale-[1.02]"
              >
                <Tag className="h-4 w-4" />
                Order Smart Tag (₹599)
              </button>
              <button
                onClick={() => onNavigate('/explore')}
                className="btn-ghost text-base inline-flex items-center gap-2 border border-emerald-500/20 text-emerald-300 hover:border-emerald-500/40"
              >
                Explore 330 Breeds
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Pillar Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-6">
              <div>
                <p className="font-display text-2xl font-bold text-amber-300">330</p>
                <p className="text-xs text-ink-400 mt-0.5">Pet Breeds</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-emerald-400">99</p>
                <p className="text-xs text-ink-400 mt-0.5">Plant Guides</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-cyan-400">Instant</p>
                <p className="text-xs text-ink-400 mt-0.5">Emergency QR</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 2: Mid-Scroll Angle (80vh - 160vh) with Staggered Reveal */}
      <div className="absolute top-[85vh] left-0 w-full h-screen flex items-center justify-end z-10 pointer-events-none transform-gpu will-change-transform">
        <div className="container-px w-full flex justify-end">
          <div
            ref={layer2Ref}
            className="max-w-md text-left p-6 sm:p-8 rounded-3xl border border-emerald-500/20 bg-[#0B0F12]/80 backdrop-blur-xl shadow-2xl glass pointer-events-auto transform-gpu will-change-transform"
          >
            <span className="chip border-emerald-500/30 text-emerald-300 bg-emerald-500/10 text-xs">
              <Shield className="h-3.5 w-3.5" />
              Direct Scan Routing
            </span>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
              Instant Finder Protection. No App Needed.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              When anyone scans your pet’s physical collar tag with any smartphone camera, they are routed to your pet’s emergency profile with immediate call and WhatsApp options.
            </p>
            <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-ink-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Laser-etched precision QR
              </span>
              <span>Waterproof Acrylic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 3: End of 250vh Hero Showcase (170vh - 250vh) with Staggered Reveal */}
      <div className="absolute top-[175vh] left-0 w-full h-[75vh] flex items-center justify-center z-10 pointer-events-none transform-gpu will-change-transform">
        <div
          ref={layer3Ref}
          className="container-px w-full text-center max-w-2xl pointer-events-auto transform-gpu will-change-transform"
        >
          <div className="p-8 sm:p-10 rounded-3xl border border-cyan-500/20 bg-[#0B0F12]/85 backdrop-blur-2xl shadow-2xl glass">
            <span className="eyebrow text-cyan-300">Precision Engineering</span>
            <h2 className="mt-3 section-title text-balance text-gradient">
              Crafted for lifetime companionship
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-300 max-w-lg mx-auto">
              Every Petziq Smart Tag is cut from aircraft-grade acrylic and laser engraved for lifetime readability.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button onClick={onOrderTag} className="btn-primary text-sm sm:text-base">
                Customize Shape, Color & Pet Name &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
