import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Tag, Shield, Sparkles, CheckCircle2, Heart, Sprout, QrCode } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface AntigravityHeroProps {
  onNavigate: (path: string) => void;
  onOrderTag: () => void;
}

export function AntigravityHero({ onNavigate, onOrderTag }: AntigravityHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  // Mouse coordinates for ambient lerp-based pointer tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // --- 1. Three.js Scene & Camera Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 4.2);

    const isMobile = window.innerWidth <= 1024;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // --- 2. Studio Three-Point Lighting Setup ---
    // Key Light (warm high-contrast key)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    // Fill Light (diffused moonlit fill)
    const fillLight = new THREE.PointLight(0xe0e0e0, 2.2, 20);
    fillLight.position.set(-5, -2, 4);
    scene.add(fillLight);

    // Rim Light (sharp metallic edge definition)
    const rimLight = new THREE.DirectionalLight(0xb3b3b3, 3.0);
    rimLight.position.set(0, -6, -4);
    scene.add(rimLight);

    // Ambient soft base
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    // --- 3. Model Parent Pivot ---
    const modelPivot = new THREE.Group();
    scene.add(modelPivot);

    // Spatial parameters animated by GSAP ScrollTrigger
    const modelTransform = {
      rotX: 0.15,
      rotY: -0.2,
      rotZ: 0,
      posX: isMobile ? 0 : 0.85,
      posY: 0,
      posZ: 0,
      cameraZ: 4.2,
      cameraY: 0,
    };

    // --- 4. GLTF / DRACO Asset Loader ---
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let isDisposed = false;

    loader.load(
      '/assets/petziq-model.glb',
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        // Auto-center and normalize geometry scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = isMobile ? 1.6 : 2.0;
        const scale = targetScale / (maxDim || 1);

        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        // Polish materials
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat.roughness !== undefined) mat.roughness = Math.max(0.18, mat.roughness * 0.85);
              if (mat.metalness !== undefined) mat.metalness = Math.min(0.92, mat.metalness * 1.15);
            }
          }
        });

        modelPivot.add(model);
        setModelLoaded(true);

        // --- 5. GSAP ScrollTrigger Cinematic Camera & Model Path ---
        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.2,
            },
          });

          // Phase 1: From Hero initial pose to feature angle (exploring front/side profile)
          tl.to(modelTransform, {
            posX: isMobile ? 0 : -0.85,
            posY: -0.2,
            rotY: Math.PI * 0.8,
            rotX: 0.25,
            cameraZ: 3.8,
            cameraY: 0.15,
            ease: 'none',
          }, 0)
          // Phase 2: Dynamic 360 inspection angle revealing QR reverse face & laser detail
          .to(modelTransform, {
            posX: isMobile ? 0 : 0.85,
            posY: -0.4,
            rotY: Math.PI * 1.8,
            rotX: -0.2,
            cameraZ: 3.4,
            cameraY: -0.2,
            ease: 'none',
          }, 0.5)
          // Phase 3: Descend and center into hardware showcase section
          .to(modelTransform, {
            posX: 0,
            posY: -0.7,
            rotY: Math.PI * 2.5,
            rotX: 0.1,
            cameraZ: 3.1,
            cameraY: 0,
            ease: 'none',
          }, 1);
        }, container);

        return () => ctx.revert();
      },
      undefined,
      (err) => {
        console.warn('Failed loading /assets/petziq-model.glb, falling back to /pet_tag.glb:', err);
      }
    );

    // --- 6. Ambient Pointer Tracking Physics ---
    const handlePointerMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- 7. High-Performance WebGL Render Loop with Lerp Smoothing ---
    let reqId: number;
    let lastTime = performance.now();
    let elapsed = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      elapsed += delta;

      // Antigravity ambient floating oscillation
      const floatY = Math.sin(elapsed * 1.6) * 0.06;
      const floatTilt = Math.cos(elapsed * 1.2) * 0.04;

      // Lerp mouse pointer
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * (delta * 4.5);
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * (delta * 4.5);

      // Apply synced ScrollTrigger transforms + Ambient Physics
      modelPivot.position.x = modelTransform.posX + (mouseRef.current.x * 0.18);
      modelPivot.position.y = modelTransform.posY + floatY + (mouseRef.current.y * 0.18);
      modelPivot.position.z = modelTransform.posZ;

      modelPivot.rotation.x = modelTransform.rotX + floatTilt + (-mouseRef.current.y * 0.25);
      modelPivot.rotation.y = modelTransform.rotY + (mouseRef.current.x * 0.35);
      modelPivot.rotation.z = modelTransform.rotZ + (mouseRef.current.x * 0.15);

      camera.position.z = modelTransform.cameraZ;
      camera.position.y = modelTransform.cameraY;
      camera.lookAt(0, modelTransform.posY * 0.5, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '250vh' }}>
      {/* Sticky Fixed WebGL Canvas Layer */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Layer 1: Initial Hero Section (0vh - 80vh) */}
      <div className="absolute top-0 left-0 w-full h-screen flex items-center z-10 pointer-events-none">
        <div className="container-px w-full">
          <div className="max-w-xl text-left pointer-events-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-brand-300 backdrop-blur-md">
              <Tag className="h-3.5 w-3.5" />
              <span>Petziq Ecosystem &middot; Antigravity 3D Design</span>
            </div>

            <h1 className="mt-6 font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
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

      {/* Layer 2: Mid-Scroll Angle (80vh - 160vh) */}
      <div className="absolute top-[85vh] left-0 w-full h-screen flex items-center justify-end z-10 pointer-events-none">
        <div className="container-px w-full flex justify-end">
          <div className="max-w-md text-left p-6 sm:p-8 rounded-3xl border border-white/[0.12] bg-ink-950/70 backdrop-blur-xl shadow-2xl glass pointer-events-auto">
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

      {/* Layer 3: End of 250vh Hero Showcase (170vh - 250vh) */}
      <div className="absolute top-[175vh] left-0 w-full h-[75vh] flex items-center justify-center z-10 pointer-events-none">
        <div className="container-px w-full text-center max-w-2xl pointer-events-auto">
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
