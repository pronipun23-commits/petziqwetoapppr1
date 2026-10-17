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

    // --- 1. Scene with Transparent Canvas for Rich Background Mesh ---
    const scene = new THREE.Scene();

    // Responsive camera initialization
    const initialFov = isMobile ? 52 : isTablet ? 46 : 40;
    const camera = new THREE.PerspectiveCamera(initialFov, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 4.9 : 4.0);

    // --- 2. Ultra High-Efficiency WebGL Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true, // Transparent canvas lets luminous background gradients shine through
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
      precision: isMobile ? 'mediump' : 'highp',
    });
    renderer.setSize(width, height);

    // Strict performance DPR: 1.0 on mobile to completely prevent GPU fill-rate throttling
    const maxDpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(maxDpr);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false; // Disable heavy multi-pass real-time shadow map computation

    // --- 3. Optimized Biophilic Three-Point Lighting Profile (Zero shadow pass overhead) ---
    // 3a. Key Light: Warm Sunset Gold / Soft Terracotta
    const keyLightColor = new THREE.Color('#f59e0b');
    const keyLight = new THREE.DirectionalLight(keyLightColor, 4.2);
    keyLight.position.set(4.5, 6, 4.5);
    scene.add(keyLight);

    // 3b. Fill Light: Fresh Botanical Mint / Sage Green
    const fillLightColor = new THREE.Color('#10b981');
    const fillLight = new THREE.DirectionalLight(fillLightColor, 2.6);
    fillLight.position.set(-5, -2, 3.5);
    scene.add(fillLight);

    // 3c. Rim/Backlight: Electric Neon Lime / Cyber-Cyan Halo Silhouette
    const rimLightColor = new THREE.Color('#06b6d4');
    const rimLight = new THREE.DirectionalLight(rimLightColor, 3.5);
    rimLight.position.set(0, -5, -4);
    scene.add(rimLight);

    // Subtle ambient bounce
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    // --- 4. Lightweight Contact Shadow (Single transparent quad, zero GPU cost) ---
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 5, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.35, 'rgba(11, 15, 18, 0.35)');
      grad.addColorStop(1, 'rgba(11, 15, 18, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(isMobile ? 0 : 0.85, -1.2, 0);
    scene.add(contactShadow);

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
      shadowOpacity: 0.7,
      keyHue: 0.11, // Sunset Gold
      fillHue: 0.44, // Botanical Mint
      rimHue: 0.52, // Cyber Cyan
    };

    let isDisposed = false;

    // --- 6. 2.7MB Draco Asset Pipeline ---
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

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

        // Optimize model mesh matrices
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();

            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat.name.toLowerCase().includes('leaf') || mat.name.toLowerCase().includes('plant')) {
                mat.roughness = 0.55;
                mat.metalness = 0.08;
              } else {
                mat.roughness = Math.max(0.18, (mat.roughness ?? 0.3) * 0.8);
                mat.metalness = Math.min(0.95, (mat.metalness ?? 0.5) * 1.25);
              }
            }
          }
        });

        // Warm up WebGL shader cache
        renderer.compile(scene, camera);

        modelPivot.add(model);
        setLoadProgress(100);
        setTimeout(() => setModelLoaded(true), 80);

        // --- 7. GSAP ScrollTrigger Animation (Direct Instant Scrub for Zero Lag) ---
        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true, // Immediate direct synchronization with scroll position
            },
          });

          // Phase 1 (0 -> 50% scroll)
          tl.to(modelTarget, {
            posX: isMobile ? 0 : -0.85,
            posY: -0.22,
            rotY: Math.PI * 1.15,
            rotX: 0.2,
            cameraZ: isMobile ? 4.3 : 3.6,
            cameraY: 0.1,
            shadowOpacity: 0.5,
            keyHue: 0.42,
            fillHue: 0.12,
            rimHue: 0.48,
            ease: 'none',
          }, 0)
          // Phase 2 (50% -> 100% scroll)
          .to(modelTarget, {
            posX: 0,
            posY: -0.72,
            rotY: Math.PI * 2.85,
            rotX: 0.08,
            cameraZ: isMobile ? 3.8 : 3.1,
            cameraY: 0,
            shadowOpacity: 0.75,
            keyHue: 0.52,
            fillHue: 0.38,
            rimHue: 0.22,
            ease: 'none',
          }, 0.5);

          // Dynamic Ambient Background Glow Parallax (Rich Sunset Amber -> Botanical Emerald -> Cyber Cyan)
          if (glowMeshRef.current) {
            tl.to(glowMeshRef.current, {
              background: 'radial-gradient(circle at 75% 35%, rgba(16, 185, 129, 0.32) 0%, rgba(6, 182, 212, 0.22) 40%, rgba(11, 15, 18, 0) 75%)',
              ease: 'none',
            }, 0)
            .to(glowMeshRef.current, {
              background: 'radial-gradient(circle at 45% 65%, rgba(245, 158, 11, 0.30) 0%, rgba(139, 92, 246, 0.24) 45%, rgba(11, 15, 18, 0) 80%)',
              ease: 'none',
            }, 0.5);
          }

          // Card reveal transitions
          if (layer2Ref.current) {
            gsap.fromTo(
              layer2Ref.current,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
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
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
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

    // --- 8. SplitType Editorial Headline Animation ---
    let splitInstance: SplitType | null = null;
    if (headlineRef.current) {
      splitInstance = new SplitType(headlineRef.current, { types: 'words,chars' });
      if (splitInstance.words) {
        gsap.fromTo(
          splitInstance.words,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: 'power3.out',
            delay: 0.1,
          }
        );
      }
    }

    // Pointer tracking (only on non-touch devices to avoid tracking drag touches)
    const handlePointerMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!isTouchViewport) {
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
    }

    // Resize listener
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 768;
      const tablet = w >= 768 && w < 1024;

      camera.aspect = w / h;
      camera.fov = mobile ? 52 : tablet ? 46 : 40;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5));

      if (mobile) {
        modelTarget.posX = 0;
      }
    };
    window.addEventListener('resize', handleResize);

    // --- 9. High-FPS Render Loop (Responsive LERP: 0.12 for snappy response) ---
    let reqId: number;
    let lastTime = performance.now();
    let elapsed = 0;

    let curPosX = isMobile ? 0 : 0.85;
    let curPosY = 0;
    let curRotX = 0.12;
    let curRotY = -0.25;
    let curRotZ = 0;
    let curCameraZ = isMobile ? 4.9 : 4.0;
    let curCameraY = 0;

    const lerpFactor = isTouchViewport ? 0.14 : 0.1;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      elapsed += delta;

      // Micro-floating physics
      const floatY = Math.sin(elapsed * 1.5) * 0.035;
      const floatTilt = Math.cos(elapsed * 1.2) * 0.02;

      // Snappy pointer follow on desktop
      if (!isTouchViewport) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;
      }

      // Smooth, responsive interpolation
      curPosX += (modelTarget.posX - curPosX) * lerpFactor;
      curPosY += (modelTarget.posY - curPosY) * lerpFactor;
      curRotX += (modelTarget.rotX - curRotX) * lerpFactor;
      curRotY += (modelTarget.rotY - curRotY) * lerpFactor;
      curRotZ += (modelTarget.rotZ - curRotZ) * lerpFactor;
      curCameraZ += (modelTarget.cameraZ - curCameraZ) * lerpFactor;
      curCameraY += (modelTarget.cameraY - curCameraY) * lerpFactor;

      modelPivot.position.x = curPosX + (mouseRef.current.x * 0.12);
      modelPivot.position.y = curPosY + floatY + (mouseRef.current.y * 0.12);
      modelPivot.position.z = modelTarget.posZ;

      modelPivot.rotation.x = curRotX + floatTilt + (-mouseRef.current.y * 0.15);
      modelPivot.rotation.y = curRotY + (mouseRef.current.x * 0.22);
      modelPivot.rotation.z = curRotZ + (mouseRef.current.x * 0.06);

      contactShadow.position.x = modelPivot.position.x;
      contactShadow.position.y = curPosY - 1.25;
      (contactShadow.material as THREE.MeshBasicMaterial).opacity = modelTarget.shadowOpacity;

      // Light color changes
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
    <div ref={containerRef} className="relative w-full" style={{ height: '240vh' }}>
      {/* Dynamic Background Gradient Mesh with Biophilic Cyber Highlights */}
      <div
        ref={glowMeshRef}
        className="fixed inset-0 pointer-events-none transition-all duration-700 z-0"
        style={{
          background:
            'radial-gradient(circle at 65% 25%, rgba(245, 158, 11, 0.28) 0%, rgba(16, 185, 129, 0.24) 40%, rgba(6, 182, 212, 0.14) 65%, transparent 85%)',
        }}
      />

      {/* Premium Minimal Loading Screen Overlay with Circular Progress Indicator & Brand Shield */}
      {!modelLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F12]/95 backdrop-blur-md transition-opacity duration-500 pointer-events-none">
          <div className="mb-4">
            <img
              src="/petziq-shield-logo.png"
              alt="Petziq Shield"
              className="w-12 h-12 rounded-xl object-contain shadow-glow animate-pulse"
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
                strokeWidth="3"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-amber-400 fill-none transition-all duration-200 ease-out"
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
          <p className="mt-3 text-xs font-mono tracking-widest text-emerald-300 uppercase">
            Loading Petziq 3D...
          </p>
        </div>
      )}

      {/* Sticky Fixed WebGL Canvas Layer */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Layer 1: Initial Hero Section (0vh - 80vh) */}
      <div
        ref={layer1Ref}
        className="absolute top-0 left-0 w-full h-screen flex items-center z-10 pointer-events-none transform-gpu will-change-transform"
      >
        <div className="container-px w-full">
          <div className="max-w-xl text-left pointer-events-auto">
            {/* Apple-tier Minimalist Pill Badge with Brand Shield */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-[#0B0F12]/60 px-3.5 py-1.5 text-xs font-medium text-white mb-6 backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <img
                src="/petziq-shield-logo.png"
                alt="Petziq"
                className="w-4 h-4 rounded object-contain shrink-0"
              />
              <span className="font-mono uppercase tracking-widest text-[11px] text-amber-300">Biophilic Cyber-Minimalism</span>
              <span className="text-white/30">|</span>
              <span className="text-ink-300 text-[11px]">Companion Ecosystem</span>
            </div>

            <h1 ref={headlineRef} className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.06]">
              A smarter voice for the pets you love most.
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-ink-200 font-normal">
              Merging living botanical care with laser-engraved Smart Tag hardware, automated vaccination passports, and instant smartphone emergency routing.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={onOrderTag}
                className="btn-primary text-base shadow-[0_0_28px_rgba(20,184,166,0.45)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_36px_rgba(20,184,166,0.6)]"
              >
                <Tag className="h-4 w-4" />
                Order Smart Tag (₹599)
              </button>
              <button
                onClick={() => onNavigate('/explore')}
                className="btn-ghost text-base inline-flex items-center gap-2 border border-emerald-500/25 bg-emerald-500/[0.04] text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all duration-300"
              >
                Explore 330 Breeds
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Editorial Glassmorphic Metric Bar */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.12] pt-6 backdrop-blur-sm">
              <div>
                <p className="font-display text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">330</p>
                <p className="text-xs text-ink-300 mt-0.5 tracking-wide">Pet Breeds</p>
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-400">99</p>
                <p className="text-xs text-ink-300 mt-0.5 tracking-wide">Plant Guides</p>
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-cyan-400">Instant</p>
                <p className="text-xs text-ink-300 mt-0.5 tracking-wide">Emergency QR</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 2: Mid-Scroll Angle (80vh - 160vh) */}
      <div className="absolute top-[85vh] left-0 w-full h-screen flex items-center justify-end z-10 pointer-events-none transform-gpu will-change-transform">
        <div className="container-px w-full flex justify-end">
          <div
            ref={layer2Ref}
            className="max-w-md text-left p-7 sm:p-9 rounded-3xl border border-white/[0.16] bg-[#0B0F12]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(16,185,129,0.15)] glass pointer-events-auto transform-gpu will-change-transform"
          >
            <span className="chip border-emerald-400/30 text-emerald-300 bg-emerald-500/10 text-xs px-3 py-1 font-mono uppercase tracking-wider">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              Direct Scan Routing
            </span>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
              Instant Finder Protection. No App Needed.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-200">
              When anyone scans your pet’s physical collar tag with any smartphone camera, they are routed to your pet’s emergency profile with immediate call and WhatsApp options.
            </p>
            <div className="mt-6 pt-4 border-t border-white/[0.1] flex items-center justify-between text-xs text-ink-300">
              <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Laser-etched precision QR
              </span>
              <span className="font-mono text-[11px] text-ink-400">Waterproof Acrylic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 3: End of Hero Showcase */}
      <div className="absolute top-[165vh] left-0 w-full h-[75vh] flex items-center justify-center z-10 pointer-events-none transform-gpu will-change-transform">
        <div
          ref={layer3Ref}
          className="container-px w-full text-center max-w-2xl pointer-events-auto transform-gpu will-change-transform"
        >
          <div className="p-8 sm:p-11 rounded-3xl border border-white/[0.16] bg-[#0B0F12]/90 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_35px_rgba(6,182,212,0.18)] glass">
            <span className="eyebrow text-cyan-300 font-mono tracking-widest uppercase text-xs">Precision Engineering</span>
            <h2 className="mt-3 section-title text-balance text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-teal-200">
              Crafted for lifetime companionship
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-200 max-w-lg mx-auto">
              Every Petziq Smart Tag is cut from aircraft-grade acrylic and laser engraved with micro-precision for lifetime durability and instant optical legibility.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onOrderTag}
                className="btn-primary text-sm sm:text-base bg-gradient-to-r from-brand-500 via-teal-500 to-cyan-500 hover:from-brand-400 hover:to-cyan-400 shadow-[0_0_28px_rgba(20,184,166,0.5)] transition-all hover:scale-[1.03]"
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
