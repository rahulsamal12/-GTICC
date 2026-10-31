import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';

const easeOut = [0.22, 1, 0.36, 1];

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 48, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 90, damping: 13 },
  },
};

const groupReveal = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

function RevealSection({ children, className = '', ...props }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      variants={shouldReduceMotion ? undefined : sectionReveal}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.12 }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

function BrightShimmer() {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return null;

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: '-150%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.22), rgba(200, 162, 74, 0.28), rgba(255, 255, 255, 0.22), transparent)',
        transform: 'skewX(-25deg)',
        pointerEvents: 'none',
        zIndex: 2,
      }}
      animate={{
        left: ['-150%', '200%']
      }}
      transition={{
        repeat: Infinity,
        repeatDelay: 4.5,
        duration: 1.6,
        ease: 'easeInOut'
      }}
    />
  );
}

function OrbitRing({ radius, color, speed, rotation }) {
  const ringRef = useRef();
  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * speed;
    }
  });

  const circlePoints = useMemo(() => {
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  return (
    <group ref={ringRef} rotation={rotation}>
      <line geometry={circlePoints}>
        <lineBasicMaterial color={color} transparent opacity={0.35} />
      </line>
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function Globe() {
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x += delta * 0.03;
    }
  });

  const R = 1.30;
  const { points, lineGeometry } = useMemo(() => {
    const pts = [];
    const numPoints = 35;
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      
      const x = R * Math.sin(phi) * Math.cos(theta);
      const y = R * Math.sin(phi) * Math.sin(theta);
      const z = R * Math.cos(phi);
      pts.push(new THREE.Vector3(x, y, z));
    }

    const connectionPoints = [];
    for (let i = 0; i < pts.length; i++) {
      const distances = pts.map((p, idx) => ({ idx, dist: pts[i].distanceTo(p) }));
      distances.sort((a, b) => a.dist - b.dist);
      for (let k = 1; k <= 2; k++) {
        if (distances[k]) {
          connectionPoints.push(pts[i]);
          connectionPoints.push(pts[distances[k].idx]);
        }
      }
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(connectionPoints);
    return { points: pts, lineGeometry: geometry };
  }, [R]);

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[R * 0.94, 32, 32]} />
        <meshStandardMaterial
          color="#071b33"
          emissive="#0B4F9C"
          emissiveIntensity={0.65}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[R * 0.97, 18, 18]} />
        <meshStandardMaterial
          color="#0B4F9C"
          wireframe
          emissive="#0B4F9C"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      <mesh rotation={[0.5, Math.PI / 4, 0.2]}>
        <sphereGeometry args={[R * 1.01, 10, 10]} />
        <meshStandardMaterial
          color="#C8A24A"
          wireframe
          emissive="#C8A24A"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#FFDF89"
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </lineSegments>

      {points.map((pt, idx) => (
        <mesh key={idx} position={[pt.x, pt.y, pt.z]}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#C8A24A"
            emissiveIntensity={3.5}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      ))}

      <OrbitRing
        radius={R * 1.32}
        color="#C8A24A"
        speed={0.4}
        rotation={[Math.PI / 3, Math.PI / 6, 0]}
      />
      <OrbitRing
        radius={R * 1.48}
        color="#00D4FF"
        speed={-0.3}
        rotation={[-Math.PI / 4, Math.PI / 4, Math.PI / 12]}
      />
      <OrbitRing
        radius={R * 1.22}
        color="#ffffff"
        speed={0.5}
        rotation={[Math.PI / 8, -Math.PI / 6, Math.PI / 3]}
      />
    </group>
  );
}

function ThreeDNetworkScene() {
  return (
    <div className="gticc-benefits-canvas-container">
      <Canvas camera={{ position: [0, 0, 4.0], fov: 60 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1.0} color="#0B4F9C" />
        <directionalLight position={[0, 5, 0]} intensity={1.2} color="#C8A24A" />
        <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.2} position={[0, -0.3, 0]}>
          <Globe />
        </Float>
        <Stars radius={100} depth={50} count={180} factor={4} saturation={0.5} fade speed={1.2} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}

function BlinkingStar({ position, color, size, phase, speed }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed + phase;
      const blink = (Math.sin(t) * 0.5 + 0.5);
      meshRef.current.material.emissiveIntensity = 0.8 + blink * 4.5;
      meshRef.current.material.opacity = 0.4 + blink * 0.6;
    }
  });
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.8}
        roughness={0}
        metalness={0}
      />
    </mesh>
  );
}

function BlinkingStarField() {
  const stars = useMemo(() => {
    const palette = ['#ffffff', '#C8A24A', '#00D4FF', '#ffffff', '#ffe8b0', '#ffffff'];
    const items = [];
    for (let i = 0; i < 90; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3.5 + Math.random() * 5.5;
      items.push({
        position: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi) - 2,
        ],
        color: palette[Math.floor(Math.random() * palette.length)],
        size: 0.018 + Math.random() * 0.034,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 2.2,
      });
    }
    return items;
  }, []);

  return (
    <>
      {stars.map((s, i) => (
        <BlinkingStar key={i} {...s} />
      ))}
    </>
  );
}

function BlinkingStarsBackground() {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return null;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      <Canvas style={{ background: 'transparent' }} camera={{ position: [0, 0, 8], fov: 75 }}>
        <ambientLight intensity={0.1} />
        <BlinkingStarField />
        <Stars radius={120} depth={60} count={600} factor={2.5} saturation={0.6} fade speed={1.0} />
      </Canvas>
    </div>
  );
}

export default function Membership() {
  const shouldReduceMotion = useReducedMotion();

  // Dynamic SEO setup
  useEffect(() => {
    document.title = "GTICC Membership | Global Trade & Investment Collaboration Consortium";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Join GTICC membership to access business networking, visibility, events, roundtables, member directory listing, and cross-border collaboration opportunities through a Canada-based global consortium.");
    }
  }, []);

  return (
    <div className="site-content gticc-membership-page">
      <style>{`
        .gticc-membership-page .gticc-card,
        .gticc-membership-page .infobox {
          position: relative !important;
          overflow: hidden !important;
          transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }
        
        .gticc-membership-page .grid-wrapper {
          perspective: 1200px !important;
        }
        
        .gticc-membership-page .gticc-card:hover {
          transform: translateY(-8px) scale(1.015) !important;
          border-color: rgba(255, 223, 137, 0.9) !important;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4), 0 0 28px rgba(200, 162, 74, 0.42) !important;
        }
        
        .gticc-membership-page .infobox:hover {
          transform: translateY(-12px) rotateX(4deg) rotateY(2deg) scale(1.025) !important;
          border-color: rgba(255, 223, 137, 0.98) !important;
          box-shadow: 0 30px 68px rgba(0, 0, 0, 0.48), 0 0 35px rgba(200, 162, 74, 0.52) !important;
        }

        .gticc-membership-benefits-3d {
          position: relative !important;
          overflow: hidden !important;
          isolation: isolate !important;
          perspective: 1200px !important;
        }
        
        .gticc-benefits-3d-scene {
          position: absolute !important;
          inset: 0 !important;
          pointer-events: none !important;
          z-index: 0 !important;
          transform-style: preserve-3d !important;
          overflow: hidden !important;
        }

        .gticc-benefits-orb,
        .gticc-benefits-ring {
          position: absolute !important;
          transform-style: preserve-3d !important;
          pointer-events: none !important;
        }

        .gticc-benefits-orb {
          width: 140px !important;
          height: 140px !important;
          border-radius: 50% !important;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.45), transparent 15%),
                      radial-gradient(circle at 50% 50%, rgba(11, 79, 156, 0.45), rgba(200, 162, 74, 0.12) 50%, transparent 80%) !important;
          box-shadow: 0 0 60px rgba(11, 79, 156, 0.22), inset -15px -15px 30px rgba(3, 13, 30, 0.5) !important;
          opacity: 0.45 !important;
          animation: gticcBenefitsOrbFloat 9s ease-in-out infinite !important;
        }

        .gticc-benefits-orb.orb-1 {
          left: 8% !important;
          top: 25% !important;
        }

        .gticc-benefits-orb.orb-2 {
          right: 7% !important;
          bottom: 20% !important;
          width: 110px !important;
          height: 110px !important;
          animation-delay: -3.5s !important;
        }

        .gticc-benefits-ring {
          width: 480px !important;
          height: 200px !important;
          border: 1px dashed rgba(200, 162, 74, 0.22) !important;
          border-radius: 50% !important;
          left: 50% !important;
          top: 50% !important;
          box-shadow: 0 0 25px rgba(200, 162, 74, 0.08) !important;
          animation: gticcBenefitsRingSpin 15s linear infinite !important;
        }

        .gticc-benefits-ring.ring-1 {
          transform: translate(-50%, -50%) rotateX(75deg) rotateY(10deg) rotateZ(0deg) !important;
        }

        .gticc-benefits-ring.ring-2 {
          width: 600px !important;
          height: 250px !important;
          border-color: rgba(11, 79, 156, 0.25) !important;
          animation-duration: 20s !important;
          animation-direction: reverse !important;
          transform: translate(-50%, -50%) rotateX(-70deg) rotateY(-5deg) rotateZ(0deg) !important;
        }

        @keyframes gticcBenefitsOrbFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
          50% {
            transform: translate3d(-15px, 25px, 40px) scale(1.05) rotate(180deg);
          }
        }

        @keyframes gticcBenefitsRingSpin {
          from {
            transform: translate(-50%, -50%) rotateX(75deg) rotateY(10deg) rotateZ(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotateX(75deg) rotateY(10deg) rotateZ(360deg);
          }
        }

        .gticc-benefits-canvas-container {
          width: 100%;
          height: 380px;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 991px) {
          .gticc-benefits-canvas-container {
            height: 300px;
          }
        }

        @media (max-width: 767px) {
          .gticc-actions {
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
          }
          .gticc-actions .btn {
            width: 100%;
            max-width: 320px;
            margin: 0 !important;
          }
          .responsive-lead-text {
            font-size: 18px !important;
            line-height: 28px !important;
          }
          .gticc-benefits-canvas-container {
            height: 250px;
          }
        }
      `}</style>

      {/* 1. Hero Section */}
      <motion.section
        className="gticc-hero gticc-hero--fullscreen gticc-membership-hero"
        style={{ backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.78), rgba(13, 17, 23, 0.9)), url("/membership_background_img.webp")', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%' }}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: easeOut }}
      >
        <div className="container text-center">
          <span className="sub-title"></span>
          <h1 className="title" id="gticc-membership-h1" style={{ margin: '0 auto 20px auto' }}>GTICC Membership</h1>
          <p className="responsive-lead-text" style={{ maxWidth: '820px', margin: '0 auto 16px auto' }}>
            Connect with businesses, investors, institutions, and sector leaders across Canada and international markets.
          </p>
          <p className="responsive-lead-text text-white-50" style={{ fontSize: '18px', maxWidth: '800px', margin: '0 auto 30px auto' }}>
            GTICC membership provides access to a structured global collaboration network designed for business visibility, introductions, events, sector discussions, delegations, and international partnership opportunities.
          </p>
          <div className="gticc-actions" style={{ justifyContent: 'center' }}>
            <Link className="btn" to="/membership/apply">Apply for Membership</Link>
            <Link className="btn btn-ghost" to="/membership/plans">View Plans</Link>
          </div>
          <p className="gticc-small-disclaimer mt-4" style={{ maxWidth: '750px', margin: '20px auto 0 auto' }}>
            GTICC acts as a facilitator and connector. Membership provides access to networking, visibility, programs, and introductions. It does not guarantee investment, contracts, sales, government approvals, funding, or business outcomes.
          </p>
        </div>
      </motion.section>

      {/* 2. Facilitator Positioning Statement */}
      <RevealSection className="space-ptb bg-dark rounded-section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="sub-title"></span>
              <h2 className="title text-white">GTICC Facilitates Connections.<br />Members Drive Outcomes.</h2>
            </div>
            <div className="col-lg-7 text-white-50" style={{ fontSize: '17px', lineHeight: '1.75' }}>
              <p className="mb-3">
                GTICC provides a platform for business visibility, curated networking, sector engagement, events, roundtables, delegation participation, and introduction opportunities.
              </p>
              <p className="mb-3">
                GTICC does not act as a broker, legal advisor, financial advisor, investment advisor, immigration advisor, government representative, or party to any transaction unless a separate written agreement states otherwise.
              </p>
              <p className="mb-3">
                All members are responsible for their own due diligence, negotiations, agreements, compliance, professional advice, and final business decisions.
              </p>
              <p className="mb-0">
                Membership does not guarantee investment, buyers, contracts, sales, approvals, funding, government support, immigration outcomes, or successful business results.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* 3. Short Intro to Benefits */}
      <RevealSection className="space-ptb gticc-membership-benefits-3d" style={{ position: 'relative', overflow: 'hidden' }}>
        <BlinkingStarsBackground />
        <div className="gticc-benefits-3d-scene" aria-hidden="true">
          <span className="gticc-benefits-orb orb-1"></span>
          <span className="gticc-benefits-orb orb-2"></span>
          <span className="gticc-benefits-ring ring-1"></span>
          <span className="gticc-benefits-ring ring-2"></span>
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="sub-title"></span>
              <h2 className="title text-white">Membership Built for Global Business Connections</h2>
              <p className="text-white-50 mt-3 mb-4" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                GTICC membership helps organizations and professionals become part of a cross-border business network focused on trade, investment, innovation, sector collaboration, and market access.
              </p>
              <Link className="btn" to="/membership/benefits">Explore All Benefits</Link>
            </div>
            <div className="col-lg-7">
              <ThreeDNetworkScene />
            </div>
          </div>
        </div>
      </RevealSection>

      {/* 4. Short Intro to Plans */}
      <RevealSection className="space-ptb bg-dark rounded-section">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title"></span>
            <h2 className="title text-white">Choose the Membership Pathway That Fits Your Role</h2>
            <p className="text-white-50 max-w-600 mt-2 mb-4" style={{ margin: '0 auto' }}>
              We offer six distinct plans tailored for students, entrepreneurs, SMEs, established corporations, and global strategic partners.
            </p>
            <div className="mt-4">
              <Link className="btn" to="/membership/plans">View Plans & Pricing</Link>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Footer Disclaimer */}
      <RevealSection style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="gticc-card gticc-disclaimer-card" style={{ borderLeft: '4px solid #C8A24A', background: 'rgba(8, 22, 48, 0.3)' }}>
            <p className="gticc-small-disclaimer" style={{ fontSize: '17px', color: '#a4b0be', margin: 0 }}>
              <strong>Disclaimer:</strong> GTICC is a facilitator and connector. GTICC membership provides access to networking, visibility, events, introductions, and collaboration opportunities. GTICC does not guarantee investment, funding, sales, contracts, approvals, or business outcomes. Members are responsible for their own due diligence and final decisions.
            </p>
          </div>
        </div>
      </RevealSection>

      {/* Final CTA */}
      <RevealSection className="space-ptb bg-dark rounded-section">
        <div className="container text-center">
          <h2 className="title text-white mb-3">Expand Your Global Business Reach</h2>
          <p className="responsive-lead-text text-white-50 max-w-600 mb-4" style={{ margin: '0 auto 30px auto' }}>
            Partner with GTICC to unlock curated global introductions, business briefings, delegation access, and collaborative trade corridors.
          </p>
          <Link className="btn" to="/membership/apply">Apply for Membership Today</Link>
        </div>
      </RevealSection>
    </div>
  );
}
