"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Animation configuration
const CONFIG = {
  front: {
    initial: { scale: 0.59, rotZ: 0.0, posX: 0.01, posY: 0, posZ: 0 },
    stage2:  { scale: 0.59, rotZ: 0.0, posX: -1.5, posY: 0.2, posZ: 1 },
  },
};

export default function ThreeBottleScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 5);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;
    scene.environment = envTex;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
    hemi.position.set(0, 1, 0);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(6, 10, 6);
    dirLight.castShadow = false;
    scene.add(dirLight);

    const frontGroup = new THREE.Group();
    scene.add(frontGroup);

    const textureLoader = new THREE.TextureLoader();
    const labelTexture = textureLoader.load("/Fles/lanalicious.png");
    (labelTexture as any).colorSpace = THREE.SRGBColorSpace;
    labelTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const centerAndScaleToFit = (obj: THREE.Object3D, targetHeight = 3) => {
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      obj.position.sub(center);
      const scale = targetHeight / Math.max(1e-6, size.y);
      obj.scale.setScalar(scale);
    };

    const applyMaterialsWithLabel = (obj: THREE.Object3D) => {
      obj.traverse((child: THREE.Object3D) => {
        const mesh = child as THREE.Mesh;
        if ((mesh as any).isMesh) {
          const setMat = (m: any) => {
            if (!m) return m;
            const name = (m.name || "").toString();
            if (name.toLowerCase().includes("label")) {
              const mat = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                roughness: 0.1,
                metalness: 0.0,
                clearcoat: 0.92,
                clearcoatRoughness: 0.08,
                map: labelTexture,
                side: THREE.DoubleSide,
              });
              (mat as any).envMapIntensity = 0.6;
              m?.dispose?.();
              return mat;
            }
            const mat = new THREE.MeshPhysicalMaterial({
              color: 0xf5f6f7,
              roughness: 1.2,
              metalness: 0.0,
              clearcoat: 0.65,
              clearcoatRoughness: 0.22,
              side: THREE.DoubleSide,
            });
            (mat as any).envMapIntensity = 0.55;
            m?.dispose?.();
            return mat;
          };
          if (Array.isArray(mesh.material)) mesh.material = mesh.material.map(setMat) as any;
          else mesh.material = setMat(mesh.material as any);

          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      });
    };

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath("/Fles/");
    mtlLoader.setResourcePath("/Fles/");
    mtlLoader.load("Fles lowQ2.mtl", (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath("/Fles/");
      objLoader.load("Fles lowQ2.obj", (obj) => {
        centerAndScaleToFit(obj, 3);
        applyMaterialsWithLabel(obj);

        const front = obj.clone();
        front.position.set(0, 0, 0);
        frontGroup.add(front);

        // Initial transforms
        frontGroup.position.set(CONFIG.front.initial.posX, -0.5 + CONFIG.front.initial.posY, CONFIG.front.initial.posZ);
        frontGroup.scale.setScalar(CONFIG.front.initial.scale);
        frontGroup.rotation.set(0, 0, CONFIG.front.initial.rotZ);

        setIsLoaded(true);
      });
    });

    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Real-time scroll progress tracking
    let currentScrollProgress = 0;

    const onScroll = () => {
      const y = window.scrollY || 0;
      const viewportHeight = window.innerHeight + 150;
      
      // Calculate which section we're in
      const currentSection = Math.floor(y / viewportHeight) + 1;
      
      // Only allow animation between section 1 and section 2
      if (currentSection <= 2) {
        // Normal animation: 0 = section 1, 1 = section 2
        const rawProgress = y / viewportHeight;
        currentScrollProgress = Math.max(0, Math.min(1, rawProgress));
      } else {
        // Lock bottle animation at final position when in section 3+
        currentScrollProgress = 1.0; // Keep final animation state
      }
      
      console.log('Bottle animation:', { 
        scrollY: y,
        viewportHeight,
        currentSection,
        currentScrollProgress: currentScrollProgress.toFixed(3),
        animationLocked: currentSection > 2
      });
    };
    
    // Simple window scroll listener
    window.addEventListener("scroll", onScroll, { passive: true });


    let raf = 0;

    const animate = (time: number) => {
      // Use current scroll progress directly (no timed animations)
      const f0 = CONFIG.front.initial;
      const f2 = CONFIG.front.stage2;
      const t = currentScrollProgress;
      
      // Three-phase animation with slowmo highlight in the middle
      let frontScale, frontPosX, frontPosY, frontPosZ, frontRotZ;
      
      const tiltAngle = -0.55;
      
      if (t <= 0.15) {
        // Phase 1 (0-15% scroll): Quick pop-out effect with right tilt
        const popProgress = t / 0.15; // 0-1 over first 15% of scroll
        const popScale = 1.2; // Pop out to 120% size for more dramatic effect
        
        frontScale = f0.scale + (popScale - f0.scale) * popProgress;
        frontPosX = f0.posX; // Stay centered during pop
        frontPosY = f0.posY - 0.3 * popProgress; // Move down to avoid touching top
        frontPosZ = f0.posZ + 0.4 * popProgress; // Come forward less dramatically
        frontRotZ = f0.rotZ + (tiltAngle * popProgress); // Add left tilt during pop-out
        
      } else if (t <= 0.7) {
        // Phase 2 (15-70% scroll): Slowmo highlight - bottle stays prominent, gradually revert tilt
        const highlightProgress = (t - 0.15) / 0.55; // 0-1 over middle 55% of scroll
        const popScale = 1.2; // Match the pop-out scale from phase 1
        const highlightScale = 1.3; // Slightly bigger during highlight
        
        // Very subtle movement during slowmo to keep bottle centered and prominent
        frontScale = popScale + (highlightScale - popScale) * Math.sin(highlightProgress * Math.PI);
        frontPosX = f0.posX + (f2.posX * 0.2) * highlightProgress; // Start moving slightly
        frontPosY = (f0.posY - 0.3) + (f2.posY * 0.1) * highlightProgress; // Continue from lowered position
        frontPosZ = f0.posZ + 0.4 - (0.2 * highlightProgress); // Slowly move back from reduced forward position
        // Slowly revert tilt - only revert 30% during highlight phase
        const slowTiltReversion = 0.3; // Only revert 30% of the tilt during highlight
        frontRotZ = f0.rotZ + (tiltAngle * (1 - (highlightProgress * slowTiltReversion)));
        
      } else {
        // Phase 3 (70-100% scroll): Fast transition to final position
        const finalProgress = (t - 0.7) / 0.3; // 0-1 over final 30% of scroll
        const fastEasing = finalProgress * finalProgress; // Quick ease out
        
        const popScale = 1.2; // Match the values from phase 2
        const highlightScale = 1.3;
        // At end of phase 2: scale = popScale + (highlightScale - popScale) * sin(π) = 1.2
        const phase2EndScale = popScale + (highlightScale - popScale) * Math.sin(Math.PI); // = 1.2
        
        // At end of phase 2: tilt is only 30% reverted, so 70% of tilt remains
        const slowTiltReversion = 0.3;
        const phase2EndTiltZ = f0.rotZ + (tiltAngle * (1 - slowTiltReversion)); // 70% of tilt remains
        
        frontScale = phase2EndScale + (f2.scale - phase2EndScale) * fastEasing;
        frontPosX = (f0.posX + f2.posX * 0.2) + ((f2.posX - f0.posX - f2.posX * 0.2)) * fastEasing;
        frontPosY = (f0.posY - 0.3 + f2.posY * 0.1) + ((f2.posY - f0.posY + 0.3 - f2.posY * 0.1)) * fastEasing;
        frontPosZ = (f0.posZ + 0.2) + ((f2.posZ - f0.posZ - 0.2)) * fastEasing;
        // Fast completion of tilt reversion from 70% remaining to final rotation
        frontRotZ = phase2EndTiltZ + (f2.rotZ - phase2EndTiltZ) * fastEasing;
      }
      
      // Apply transformations
      frontGroup.scale.setScalar(frontScale);
      frontGroup.rotation.z = frontRotZ;
      frontGroup.position.set(frontPosX, -0.5 + frontPosY, frontPosZ);

      // Y-axis rotation with slowmo effect
      if (t <= 0.15) {
        frontGroup.rotation.y = 0; // No rotation during pop-out
      } else if (t <= 0.7) {
        // Slow, gentle rotation during highlight phase
        const highlightProgress = (t - 0.15) / 0.55;
        frontGroup.rotation.y = highlightProgress * Math.PI * 0.15; // Gentle rotation during slowmo
      } else {
        // Rotate back to 0 in final phase (same as start position)
        const finalProgress = (t - 0.7) / 0.3;
        const baseRotation = Math.PI * 0.15;
        frontGroup.rotation.y = baseRotation;
        // scale back to 1
        frontGroup.scale.setScalar(frontScale);
      }
      
      // Debug: Log values occasionally
      if (Math.floor(time) % 1000 < 16) { // Every ~1 second
        let phase = 'POP-OUT';
        if (t > 0.15 && t <= 0.7) phase = 'SLOWMO-HIGHLIGHT';
        else if (t > 0.7) phase = 'FAST-FINISH';
        
        console.log('Bottle animation:', {
          phase,
          scrollProgress: t.toFixed(3),
          scale: frontScale.toFixed(3),
          position: {
            x: frontPosX.toFixed(2),
            y: frontPosY.toFixed(2),
            z: frontPosZ.toFixed(2)
          },
          rotation: {
            y: frontGroup.rotation.y.toFixed(2),
            z: frontRotZ.toFixed(2)
          }
        });
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", onScroll);
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if ((mesh as any).isMesh) {
          if (Array.isArray(mesh.material)) mesh.material.forEach((m: any) => m?.dispose?.());
          else (mesh.material as any)?.dispose?.();
          (mesh.geometry as any)?.dispose?.();
        }
      });
      pmrem.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div ref={containerRef} className="absolute inset-0" />
      {!isLoaded && (
        <div className="absolute bottom-6 right-6 text-xs text-gray-500 bg-white/60 px-2 py-1 rounded">
          Loading bottle...
        </div>
      )}
    </div>
  );
}
