import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Tag, Shield, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AntigravityHeroProps {
  onNavigate: (path: string) => void;
  onOrderTag: () => void;
}

export function AntigravityHero({ onNavigate, onOrderTag }: AntigravityHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Text layer refs for staggered GSAP reveal
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  // Mouse coordinates with damped pointer tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // --- 1. Scene & Dynamic Responsive Camera ---
    const scene = new THREE.Scene();
    
    // Calculate initial responsive FOV & Camera Z
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const initialFov = isMobile ? 52 : isTablet ? 48 : 42;
    const camera = new THREE.PerspectiveCamera(initialFov, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 4.8 : 4.0);

    // --- 2. High-Performance WebGL Renderer (Apple / Google Web Vitals Standard) ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.32;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- 3. Studio Three-Point Lighting Setup (Apple Pro Hardware Style) ---
    // 3a. Strong Key Light (crisp specular highlights & depth)
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // 3b. Soft Diffused Fill Light (ambient bounce fill)
    const fillLight = new THREE.PointLight(0xe8ecf2, 2.5, 25);
    fillLight.position.set(-5, -2, 4);
    scene.add(fillLight);

    // 3c. Sharp Rim / Backlight (high-definition metallic edge isolation)
    const rimLight = new THREE.DirectionalLight(0xb3b3b3, 3.8);
    rimLight.position.set(0, -6, -4);
    scene.add(rimLight);

    // Ambient ground bounce
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    // --- 4. Physically Grounded Contact Shadow Disc ---
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
      grad.addColorStop(0.4, 'rgba(0, 0, 0, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
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

    // --- 5. Model Pivot & Spatial Target State ---
    const modelPivot = new THREE.Group();
    scene.add(modelPivot);

    const modelTarget = {
      posX: isMobile ? 0 : 0.85,
      posY: 0,
      posZ: 0,
      rotX: 0.12,
      rotY: -0.25,
      rotZ: 0,
      cameraZ: isMobile ? 4.8 : 4.0,
      cameraY: 0,
      shadowOpacity: 0.7,
    };

    let isDisposed = false;

    // --- 6. Preload Model with DRACO Decompression ---
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/assets/petziq-model.glb',
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        // Auto-center & normalize dimensions
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = isMobile ? 1.5 : 1.95;
        const scale = targetScale / (maxDim || 1);

        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        // Apple-style Material Tuning: Metalness, roughness & clearcoat depth
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              // Organic parts get soft matte diffusion; hardware gets high metalness & clearcoat sheen
              if (mat.name.toLowerCase().includes('leaf') || mat.name.toLowerCase().includes('plant')) {
                mat.roughness = 0.65;
                mat.metalness = 0.05;
              } else {
                mat.roughness = Math.max(0.18, (mat.roughness ?? 0.3) * 0.85);
                mat.metalness = Math.min(0.95, (mat.metalness ?? 0.5) * 1.25);
              }
            }
          }
        });

        // Warm up WebGL shader cache before fading in
        renderer.compile(scene, camera);

        modelPivot.add(model);
        setLoadProgress(100);
        setTimeout(() => setModelLoaded(true), 150);

        // --- 7. GSAP ScrollTrigger Animation (Fluid Kinetic Damping) ---
        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.4,
            },
          });

          // Phase 1: Descent to middle card showing reverse QR angle
          tl.to(modelTarget, {
            posX: isMobile ? 0 : -0.85,
            posY: -0.25,
            rotY: Math.PI * 1.1,
            rotX: 0.22,
            cameraZ: isMobile ? 4.2 : 3.6,
            cameraY: 0.1,
            shadowOpacity: 0.5,
            ease: 'none',
          }, 0)
          // Phase 2: Complete inspection rotation revealing edge craftsmanship
          .to(modelTarget, {
            posX: isMobile ? 0 : 0.85,
            posY: -0.45,
            rotY: Math.PI * 2.1,
            rotX: -0.15,
            cameraZ: isMobile ? 4.0 : 3.4,
            cameraY: -0.15,
            shadowOpacity: 0.6,
            ease: 'none',
          }, 0.5)
          // Phase 3: Settle into bottom showcase presentation
          .to(modelTarget, {
            posX: 0,
            posY: -0.75,
            rotY: Math.PI * 2.8,
            rotX: 0.08,
            cameraZ: isMobile ? 3.8 : 3.1,
            cameraY: 0,
            shadowOpacity: 0.8,
            ease: 'none',
          }, 1);

          // Staggered UI Layer Reveals (Fade-in + 20px slide-up)
          if (layer2Ref.current) {
            gsap.fromTo(
              layer2Ref.current,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
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
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
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

    // --- 8. Ambient Pointer Tracking Physics ---
    const handlePointerMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // --- 9. Ultra-Responsive Camera Bounds Handler ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 768;
      const tablet = w >= 768 && w < 1024;

      camera.aspect = w / h;
      camera.fov = mobile ? 52 : tablet ? 48 : 42;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Adjust model positioning on resize
      if (mobile) {
        modelTarget.posX = 0;
      }
    };
    window.addEventListener('resize', handleResize);

    // --- 10. Google Material You Damped LERP Animation Loop (0.05 - 0.08 coefficient) ---
    let reqId: number;
    let lastTime = performance.now();
    let elapsed = 0;

    // Current interpolated states
    let curPosX = isMobile ? 0 : 0.85;
    let curPosY = 0;
    let curRotX = 0.12;
    let curRotY = -0.25;
    let curRotZ = 0;
    let curCameraZ = isMobile ? 4.8 : 4.0;
    let curCameraY = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      elapsed += delta;

      // Antigravity micro-floating oscillation
      const floatY = Math.sin(elapsed * 1.5) * 0.045;
      const floatTilt = Math.cos(elapsed * 1.2) * 0.03;

      // Damped pointer follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Fluid Kinetic Motion Damping (Strict 0.065 LERP coefficient)
      const lerpFactor = 0.065;

      curPosX += (modelTarget.posX - curPosX) * lerpFactor;
      curPosY += (modelTarget.posY - curPosY) * lerpFactor;
      curRotX += (modelTarget.rotX - curRotX) * lerpFactor;
      curRotY += (modelTarget.rotY - curRotY) * lerpFactor;
      curRotZ += (modelTarget.rotZ - curRotZ) * lerpFactor;
      curCameraZ += (modelTarget.cameraZ - curCameraZ) * lerpFactor;
      curCameraY += (modelTarget.cameraY - curCameraY) * lerpFactor;

      // Position model with cursor reaction
      modelPivot.position.x = curPosX + (mouseRef.current.x * 0.16);
      modelPivot.position.y = curPosY + floatY + (mouseRef.current.y * 0.16);
      modelPivot.position.z = modelTarget.posZ;

      modelPivot.rotation.x = curRotX + floatTilt + (-mouseRef.current.y * 0.2);
      modelPivot.rotation.y = curRotY + (mouseRef.current.x * 0.3);
      modelPivot.rotation.z = curRotZ + (mouseRef.current.x * 0.1);

      // Synchronize contact shadow to model ground plane
      contactShadow.position.x = modelPivot.position.x;
      contactShadow.position.y = curPosY - 1.25;
      contactShadow.material.opacity = modelTarget.shadowOpacity;

      // Camera coordinates
      camera.position.z = curCameraZ;
      camera.position.y = curCameraY;
      camera.lookAt(0, curPosY * 0.45, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      dracoLoader.dispose();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '250vh' }}>
      {/* Premium Minimal Loading Screen Overlay with Circular Progress Indicator */}
      {!modelLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink-950/90 backdrop-blur-md transition-opacity duration-700 pointer-events-none">
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
                className="stroke-white fill-none transition-all duration-300 ease-out"
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
          <p className="mt-4 text-xs font-mono tracking-widest text-ink-300 uppercase">
            Compiling WebGL Engine...
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
        className="absolute top-0 left-0 w-full h-screen flex items-center z-10 pointer-events-none"
      >
        <div className="container-px w-full">
          <div className="max-w-xl text-left pointer-events-auto">
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
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
                className="btn-ghost text-base inline-flex items-center gap-2"
              >
                Explore 330 Breeds
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Pillar Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-6">
              <div>
                <p className="font-display text-2xl font-bold text-white">330</p>
                <p className="text-xs text-ink-400 mt-0.5">Pet Breeds</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-white">99</p>
                <p className="text-xs text-ink-400 mt-0.5">Plant Guides</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-brand-300">Instant</p>
                <p className="text-xs text-ink-400 mt-0.5">Emergency QR</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 2: Mid-Scroll Angle (80vh - 160vh) with Staggered Reveal */}
      <div className="absolute top-[85vh] left-0 w-full h-screen flex items-center justify-end z-10 pointer-events-none">
        <div className="container-px w-full flex justify-end">
          <div
            ref={layer2Ref}
            className="max-w-md text-left p-6 sm:p-8 rounded-3xl border border-white/[0.12] bg-ink-950/70 backdrop-blur-xl shadow-2xl glass pointer-events-auto"
          >
            <span className="chip border-brand-500/30 text-brand-300 bg-brand-500/10 text-xs">
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
      <div className="absolute top-[175vh] left-0 w-full h-[75vh] flex items-center justify-center z-10 pointer-events-none">
        <div
          ref={layer3Ref}
          className="container-px w-full text-center max-w-2xl pointer-events-auto"
        >
          <div className="p-8 sm:p-10 rounded-3xl border border-white/[0.12] bg-ink-950/80 backdrop-blur-2xl shadow-2xl glass">
            <span className="eyebrow">Precision Engineering</span>
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
