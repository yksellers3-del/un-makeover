import { Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useInView } from "motion/react";
import type React from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import type * as THREE from "three";

// ─── 3D Components ───────────────────────────────────────────────────────────

function FloatingGem({
  position,
  scale,
  color,
}: { position: [number, number, number]; scale: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.015;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.3;
  });
  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 300;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#C9A84C"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C9A84C" />
      <FloatingGem position={[3, 1, -2]} scale={0.4} color="#C9A84C" />
      <FloatingGem position={[-3, -1, -3]} scale={0.3} color="#8B5E3C" />
      <FloatingGem position={[2, -2, -1]} scale={0.25} color="#E8D5A3" />
      <FloatingGem position={[-2, 2, -2]} scale={0.35} color="#C9A84C" />
      <FloatingGem position={[0, 3, -4]} scale={0.2} color="#D4AF37" />
      <ParticleField />
      <Sparkles
        count={100}
        scale={10}
        size={2}
        speed={0.3}
        color="#C9A84C"
        opacity={0.5}
      />
    </>
  );
}

// ─── Counter Hook ─────────────────────────────────────────────────────────────

function useCounter(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Celebrity", href: "#celebrity" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 2rem",
        height: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled
          ? "rgba(245,240,232,0.96)"
          : "rgba(245,240,232,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(201,168,76,0.3)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 30px rgba(74,44,26,0.1)" : "none",
        transition: "all 0.3s ease",
      }}
      data-ocid="navbar"
    >
      <a href="/" style={{ textDecoration: "none" }}>
        <span
          className="font-display"
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "var(--dark-brown)",
          }}
        >
          <span className="gold-gradient-text">UN Makeover</span>
        </span>
      </a>
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {navLinks.map((l) => (
          <a
            key={l.label}
            href={l.href}
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "0.9rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--warm-brown)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
            }}
            className="nav-link"
            data-ocid={`navbar.${l.label.toLowerCase()}_link`}
          >
            {l.label}
          </a>
        ))}
        <a
          href="tel:08657085754"
          className="btn-gold"
          style={{
            padding: "10px 22px",
            fontSize: "0.85rem",
            textDecoration: "none",
          }}
          data-ocid="navbar.book_button"
        >
          Book Now
        </a>
      </div>
      <button
        type="button"
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: "none",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
        }}
        aria-label="Toggle menu"
        data-ocid="navbar.menu_toggle"
      >
        <div
          style={{
            width: 24,
            height: 2,
            background: "var(--dark-brown)",
            marginBottom: 5,
            transition: "all 0.3s",
            transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none",
          }}
        />
        <div
          style={{
            width: 24,
            height: 2,
            background: "var(--dark-brown)",
            marginBottom: 5,
            opacity: menuOpen ? 0 : 1,
          }}
        />
        <div
          style={{
            width: 24,
            height: 2,
            background: "var(--dark-brown)",
            transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none",
          }}
        />
      </button>
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "72px",
            left: 0,
            right: 0,
            background: "rgba(245,240,232,0.98)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(201,168,76,0.3)",
            padding: "1rem 2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "var(--text)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="tel:08657085754"
            className="btn-gold"
            style={{ textAlign: "center", textDecoration: "none" }}
          >
            Book Now
          </a>
        </div>
      )}
      <style>
        {
          "@media (max-width: 768px) { .nav-link { display: none !important; } .menu-btn { display: block !important; } }"
        }
      </style>
    </nav>
  );
}

// ─── Floating Buttons ─────────────────────────────────────────────────────────

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/918657085754"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 200,
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#25D366,#128C7E)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        color: "white",
      }}
      aria-label="Chat on WhatsApp"
      data-ocid="whatsapp_float_button"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="white"
        aria-hidden="false"
      >
        <title>WhatsApp</title>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

function InstagramButton() {
  return (
    <a
      href="https://www.instagram.com/un_makeover_utkarsha"
      target="_blank"
      rel="noopener noreferrer"
      className="instagram-float"
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "2rem",
        zIndex: 200,
        width: 60,
        height: 60,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
      }}
      aria-label="Follow on Instagram"
      data-ocid="instagram_float_button"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="white"
        aria-hidden="false"
      >
        <title>Instagram</title>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    </a>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg,var(--cream) 0%,var(--beige) 100%)",
        paddingTop: "72px",
        display: "flex",
        alignItems: "center",
      }}
      data-ocid="hero.section"
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            style={{ background: "transparent" }}
            gl={{ alpha: true }}
          >
            <HeroScene />
          </Canvas>
        </Suspense>
      </div>
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(201,168,76,0.2) 0%,transparent 70%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(139,94,60,0.2) 0%,transparent 70%)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "4rem 2rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(201,168,76,0.15)",
              border: "1px solid rgba(201,168,76,0.4)",
              borderRadius: 50,
              padding: "6px 18px",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                color: "var(--gold)",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              ★ Trusted by 100+ Celebrities ★
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display"
            style={{
              fontSize: "clamp(2.4rem,5vw,4rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "var(--dark-brown)",
              marginBottom: "0.5rem",
            }}
          >
            UN Makeover
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="font-display gold-gradient-text"
            style={{
              fontSize: "clamp(2.4rem,5vw,4rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: "1.5rem",
              display: "block",
            }}
          >
            Utkarsha Nakti Patil
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              fontSize: "1.15rem",
              color: "var(--text-muted)",
              marginBottom: "0.75rem",
              fontStyle: "italic",
            }}
          >
            Luxury Bridal &amp; Celebrity Makeup Artist
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              fontSize: "1rem",
              color: "var(--text-muted)",
              marginBottom: "2.5rem",
              maxWidth: 480,
              lineHeight: 1.7,
            }}
          >
            Transforming brides into timeless beauties with 15+ years of
            artistry. From intimate weddings to grand Bollywood sets — we create
            flawless looks that last.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
          >
            <a
              href="tel:08657085754"
              className="btn-gold pulse-gold"
              style={{
                textDecoration: "none",
                display: "inline-block",
                fontSize: "1rem",
              }}
              data-ocid="hero.book_cta"
            >
              📞 Book Now — 08657085754
            </a>
            <a
              href="#portfolio"
              style={{
                display: "inline-block",
                padding: "14px 28px",
                borderRadius: 50,
                border: "1.5px solid var(--warm-brown)",
                color: "var(--warm-brown)",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
              }}
              data-ocid="hero.portfolio_link"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--warm-brown)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--warm-brown)";
              }}
            >
              View Portfolio
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              className="pulse-gold"
              style={{
                borderRadius: "50%",
                padding: 6,
                display: "inline-block",
              }}
            >
              <div
                style={{
                  width: "clamp(260px,30vw,380px)",
                  height: "clamp(260px,30vw,380px)",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid var(--gold)",
                  boxShadow: "0 20px 60px rgba(74,44,26,0.3)",
                }}
              >
                <img
                  src="/assets/images/photo1.png"
                  alt="Utkarsha Nakti Patil - Makeup Artist"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
              </div>
            </div>
            <div
              className="float-gem"
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                background:
                  "linear-gradient(135deg,var(--gold),var(--warm-brown))",
                color: "white",
                borderRadius: "50%",
                width: 80,
                height: 80,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1.3,
                boxShadow: "0 8px 20px rgba(201,168,76,0.5)",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>15+</span>Years
            </div>
            <div
              className="float-gem"
              style={{
                position: "absolute",
                bottom: 20,
                left: "-30px",
                background: "rgba(255,252,245,0.95)",
                border: "1px solid rgba(201,168,76,0.4)",
                borderRadius: 12,
                padding: "8px 14px",
                boxShadow: "0 8px 24px rgba(74,44,26,0.15)",
              }}
            >
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--warm-brown)",
                }}
              >
                500+
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                Happy Brides
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          style={{
            width: 28,
            height: 44,
            border: "2px solid rgba(201,168,76,0.5)",
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",
            paddingTop: 6,
          }}
        >
          <div
            style={{
              width: 4,
              height: 8,
              borderRadius: 2,
              background: "var(--gold)",
            }}
          />
        </motion.div>
      </div>
      <style>
        {
          "@media(max-width:768px){.hero-grid{grid-template-columns:1fr!important;text-align:center}}"
        }
      </style>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  delay,
}: { icon: string; value: number; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCounter(value, 2000, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="glow-card"
      style={{ borderRadius: 20, padding: "2rem", textAlign: "center" }}
      data-ocid={`stats.card.${label.replace(/\s+/g, "_").toLowerCase()}`}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{icon}</div>
      <div
        className="font-display"
        style={{
          fontSize: "2.8rem",
          fontWeight: 800,
          color: "var(--warm-brown)",
          lineHeight: 1,
        }}
      >
        {count}+
      </div>
      <div
        style={{ color: "var(--text-muted)", marginTop: 6, fontWeight: 500 }}
      >
        {label}
      </div>
    </motion.div>
  );
}

function StatsSection() {
  const stats = [
    { icon: "💍", value: 500, label: "Happy Brides" },
    { icon: "⭐", value: 100, label: "Celebrity Clients" },
    { icon: "✨", value: 15, label: "Years Experience" },
    { icon: "🏆", value: 50, label: "Awards Won" },
  ];
  return (
    <section
      style={{
        background:
          "linear-gradient(135deg,var(--dark-brown),var(--warm-brown))",
        padding: "5rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
      data-ocid="stats.section"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center,rgba(201,168,76,0.15) 0%,transparent 70%)",
        }}
      />
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: "1.5rem",
          }}
        >
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    title: "Bridal Makeup",
    icon: "💍",
    img: "/assets/images/photo2.png",
    desc: "Transform into the most radiant bride. HD, airbrush, traditional & contemporary styles.",
    detail:
      "Our signature bridal package includes pre-bridal consultation, trial session, and day-of application with premium international brands. Long-lasting formulas that look flawless from ceremony to reception.",
  },
  {
    title: "Celebrity & Ramp",
    icon: "🎬",
    img: "/assets/images/photo3.png",
    desc: "Editorial and high-fashion makeup for ramp walks, photoshoots, and celebrity events.",
    detail:
      "Specializing in camera-ready looks for film, television, editorial, and runway. Utkarsha has worked backstage at Lakme Fashion Week and on sets of top Bollywood productions.",
  },
  {
    title: "Party Makeup",
    icon: "✨",
    img: "/assets/images/photo4.png",
    desc: "Glamorous looks for every celebration. Long-lasting formulas for day to night events.",
    detail:
      "From cocktail parties to sangeet nights, our party looks are designed to turn heads. Available for group bookings for bridesmaids, family members, and guests.",
  },
  {
    title: "Pre-Bridal",
    icon: "🌸",
    img: "/assets/images/photo5.png",
    desc: "4-step pre-bridal treatment packages for glowing, camera-ready skin.",
    detail:
      "Our pre-bridal package includes 4 sessions: deep cleanse facial, skin brightening treatment, threading & shaping, and final glow session. Start 3 months before your wedding for best results.",
  },
  {
    title: "Engagement Makeup",
    icon: "💫",
    img: "/assets/images/photo6.png",
    desc: "Soft, romantic looks for your engagement ceremony. Natural glow or dramatic styles.",
    detail:
      "Your engagement day deserves a look as special as the moment. We create timeless, romantic looks that photograph beautifully and reflect your personal style.",
  },
  {
    title: "Portfolio Shoots",
    icon: "📸",
    img: "/assets/images/photo7.png",
    desc: "Camera-ready looks optimized for photography and videography.",
    detail:
      "Collaborating with top photographers, we create editorial looks that translate perfectly on camera — for modeling portfolios, corporate headshots, or creative projects.",
  },
];

function ServicesSection() {
  return (
    <section
      id="services"
      style={{
        padding: "6rem 2rem",
        background: "var(--cream)",
        position: "relative",
        overflow: "hidden",
      }}
      className="section-glow-bg"
      data-ocid="services.section"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <div className="section-divider" />
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 700,
              color: "var(--dark-brown)",
              marginBottom: "1rem",
            }}
          >
            Our Services
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Every service is crafted with precision, premium products, and a
            deep understanding of beauty. Hover over each card to discover more.
          </p>
        </motion.div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
            gap: "2rem",
          }}
        >
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flip-card"
              data-ocid={`services.item.${i + 1}`}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div style={{ height: "55%", overflow: "hidden" }}>
                    <img
                      src={svc.img}
                      alt={svc.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      padding: "1.25rem",
                      background: "rgba(255,252,245,0.98)",
                      height: "45%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>{svc.icon}</span>
                      <h3
                        className="font-display"
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: "var(--dark-brown)",
                        }}
                      >
                        {svc.title}
                      </h3>
                    </div>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {svc.desc}
                    </p>
                    <p
                      style={{
                        color: "var(--gold)",
                        fontSize: "0.8rem",
                        marginTop: 6,
                        fontWeight: 600,
                      }}
                    >
                      Hover to learn more →
                    </p>
                  </div>
                </div>
                <div className="flip-card-back">
                  <span style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                    {svc.icon}
                  </span>
                  <h3
                    className="font-display"
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      marginBottom: "1rem",
                      color: "var(--light-gold)",
                    }}
                  >
                    {svc.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.92rem",
                      lineHeight: 1.75,
                      textAlign: "center",
                      opacity: 0.9,
                    }}
                  >
                    {svc.detail}
                  </p>
                  <a
                    href="tel:08657085754"
                    className="btn-gold"
                    style={{
                      marginTop: "1.5rem",
                      textDecoration: "none",
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.4)",
                    }}
                  >
                    Book Now
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Celebrity ────────────────────────────────────────────────────────────────

const CELEBRITIES = [
  "Deepika Padukone",
  "Priyanka Chopra",
  "Kareena Kapoor",
  "Katrina Kaif",
  "Alia Bhatt",
  "Madhuri Dixit",
  "Vidya Balan",
  "Kajol",
  "Tabu",
  "Rani Mukerji",
  "Sushmita Sen",
  "Rekha",
  "Deepika Padukone",
  "Priyanka Chopra",
  "Kareena Kapoor",
  "Katrina Kaif",
  "Alia Bhatt",
  "Madhuri Dixit",
  "Vidya Balan",
  "Kajol",
];

function CelebritySection() {
  return (
    <section
      id="celebrity"
      style={{
        padding: "6rem 0",
        background: "linear-gradient(180deg,var(--beige) 0%,var(--cream) 100%)",
        overflow: "hidden",
        position: "relative",
      }}
      data-ocid="celebrity.section"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 400,
          background:
            "radial-gradient(ellipse,rgba(201,168,76,0.2) 0%,transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <div className="section-divider" />
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 700,
              color: "var(--dark-brown)",
              marginBottom: "1rem",
            }}
          >
            Star-Studded Portfolio
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Utkarsha has worked with{" "}
            <strong style={{ color: "var(--warm-brown)" }}>
              100+ celebrities
            </strong>{" "}
            across Bollywood, regional cinema, and television — bringing her
            signature blend of artistry and precision to India's most glamorous
            sets.
          </p>
        </motion.div>
        <div
          style={{
            overflow: "hidden",
            marginBottom: "3rem",
            padding: "1rem 0",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 80,
              background: "linear-gradient(to right,var(--beige),transparent)",
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 80,
              background: "linear-gradient(to left,var(--beige),transparent)",
              zIndex: 2,
            }}
          />
          <div className="marquee-track">
            {CELEBRITIES.map((name, i) => (
              <div
                key={name + String(i)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginRight: "2rem",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "var(--gold)", marginRight: "0.5rem" }}>
                  ✦
                </span>
                <span
                  className="font-display"
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--dark-brown)",
                  }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {[
            "/assets/images/photo8.png",
            "/assets/images/photo9.png",
            "/assets/images/photo3.png",
          ].map((img, i) => (
            <motion.div
              key={img}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="glow-card"
              style={{ borderRadius: 20, overflow: "hidden" }}
              data-ocid={`celebrity.card.${i + 1}`}
            >
              <div style={{ height: 280, overflow: "hidden" }}>
                <img
                  src={img}
                  alt="Celebrity Work"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </div>
              <div style={{ padding: "1.25rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ color: "var(--gold)" }}>★★★★★</span>
                  <span
                    style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                  >
                    Celebrity Work
                  </span>
                </div>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                    lineHeight: 1.6,
                  }}
                >
                  {
                    [
                      "Utkarsha transformed this artist for a major Bollywood premiere — stunning, camera-perfect results.",
                      "Red carpet ready. The look held flawlessly through 8 hours of events and photography.",
                      "Editorial shoot for a leading magazine. Utkarsha's vision and precision are simply unmatched.",
                    ][i]
                  }
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            background:
              "linear-gradient(135deg,rgba(201,168,76,0.1),rgba(139,94,60,0.1))",
            borderRadius: 24,
            border: "1px solid rgba(201,168,76,0.3)",
          }}
        >
          <p
            className="font-display"
            style={{
              fontSize: "clamp(1.1rem,2.5vw,1.5rem)",
              fontStyle: "italic",
              color: "var(--dark-brown)",
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
          >
            "Her artistry is unmatched. She understands exactly what the camera
            needs and delivers perfection every single time."
          </p>
          <footer style={{ color: "var(--warm-brown)", fontWeight: 600 }}>
            — Celebrity Client, Bollywood
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}

// ─── Why Choose ───────────────────────────────────────────────────────────────

const WHY_ITEMS = [
  {
    icon: "🏅",
    title: "15+ Years Mastery",
    desc: "Over a decade and a half of perfecting the craft, staying ahead of every trend and technique.",
  },
  {
    icon: "🎬",
    title: "Celebrity Clientele",
    desc: "Trusted by 100+ Bollywood stars, TV personalities, and ramp models for their most important moments.",
  },
  {
    icon: "💎",
    title: "Premium Products Only",
    desc: "We use MAC, Huda Beauty, Charlotte Tilbury, NARS, and other international luxury brands exclusively.",
  },
  {
    icon: "⏱️",
    title: "Long-Lasting Formula",
    desc: "Our makeup techniques ensure your look stays flawless for 12+ hours — from morning mehendi to midnight reception.",
  },
  {
    icon: "🎨",
    title: "Personalized Artistry",
    desc: "Every face is a unique canvas. We customize every look to suit your features, outfit, and the occasion.",
  },
  {
    icon: "🏠",
    title: "Home & Venue Service",
    desc: "We come to you! On-location service available across Kalyan, Mumbai, and entire Maharashtra.",
  },
  {
    icon: "📸",
    title: "Camera-Ready Results",
    desc: "Specialized in HD & photography-optimized makeup that looks stunning in every photo and video.",
  },
  {
    icon: "💆",
    title: "Relaxing Experience",
    desc: "Your comfort is our priority. Enjoy a calm, professional session with zero stress on your big day.",
  },
];

function TiltCard({
  item,
  delay,
  index,
}: {
  item: { icon: string; title: string; desc: string };
  delay: number;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-4px)`;
  };
  const handleMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform =
        "perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0)";
  };
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="glow-card tilt-card"
      style={{ borderRadius: 20, padding: "2rem", cursor: "default" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-ocid={`why_choose.item.${index + 1}`}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        {item.icon}
      </div>
      <h3
        className="font-display"
        style={{
          fontSize: "1.15rem",
          fontWeight: 700,
          color: "var(--dark-brown)",
          marginBottom: "0.5rem",
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "0.9rem",
          lineHeight: 1.7,
        }}
      >
        {item.desc}
      </p>
    </motion.div>
  );
}

function WhyChooseSection() {
  return (
    <section
      style={{
        padding: "6rem 2rem",
        background: "linear-gradient(180deg,var(--cream) 0%,var(--beige) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
      data-ocid="why_choose.section"
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle,rgba(201,168,76,0.12) 0%,transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <div className="section-divider" />
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 700,
              color: "var(--dark-brown)",
              marginBottom: "1rem",
            }}
          >
            Why Choose UN Makeover?
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            When it comes to your most cherished moments, only the best will do.
          </p>
        </motion.div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: "1.5rem",
          }}
        >
          {WHY_ITEMS.map((item, i) => (
            <TiltCard key={item.title} item={item} delay={i * 0.08} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function GallerySection({ onLightbox }: { onLightbox: (src: string) => void }) {
  const photos = Array.from(
    { length: 9 },
    (_, i) => `/assets/images/photo${i + 1}.png`,
  );
  return (
    <section
      id="portfolio"
      style={{
        padding: "6rem 2rem",
        background: "var(--dark-brown)",
        position: "relative",
        overflow: "hidden",
      }}
      data-ocid="gallery.section"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center,rgba(201,168,76,0.08) 0%,transparent 70%)",
        }}
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <div className="section-divider" />
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 700,
              color: "var(--light-gold)",
              marginBottom: "1rem",
            }}
          >
            Portfolio Gallery
          </h2>
          <p
            style={{
              color: "rgba(232,213,163,0.7)",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            A glimpse into our world of beauty — click any image to view in
            full.
          </p>
        </motion.div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: "1.25rem",
          }}
        >
          {photos.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                cursor: "zoom-in",
                border: "1px solid rgba(201,168,76,0.2)",
                aspectRatio: "3/4",
              }}
              whileHover={{ scale: 1.03 }}
              onClick={() => onLightbox(src)}
              data-ocid={`gallery.item.${i + 1}`}
            >
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    city: "Kalyan",
    stars: 5,
    text: "Utkarsha di transformed me into a princess on my wedding day! The bridal makeup was absolutely flawless and lasted the entire day through all the functions. I received so many compliments from every single guest!",
  },
  {
    name: "Meera Patel",
    city: "Mumbai",
    stars: 5,
    text: "I've tried many makeup artists but Utkarsha ji is on a completely different level. For my daughter's sangeet, she made everyone look stunning. Truly talented hands!",
  },
  {
    name: "Anjali Singh",
    city: "Thane",
    stars: 5,
    text: "The pre-bridal package was worth every rupee. My skin was glowing like never before. The makeup on my wedding day was perfect — waterproof and long-lasting!",
  },
  {
    name: "Kavita Desai",
    city: "Pune",
    stars: 5,
    text: "Utkarsha madam has a gift. She understood exactly what I wanted without me even explaining. The look she created for my reception was ethereal!",
  },
  {
    name: "Sunita Joshi",
    city: "Nashik",
    stars: 5,
    text: "I was nervous about my makeup but Utkarsha didi made me feel so comfortable. The result was breathtaking. Even my mother-in-law said I looked like a queen!",
  },
  {
    name: "Ritu Mehta",
    city: "Kalyan",
    stars: 5,
    text: "Perfect service from start to finish. Utkarsha ji is so professional and uses only premium products. My party makeup stayed fresh for 12+ hours!",
  },
  {
    name: "Pooja Rao",
    city: "Aurangabad",
    stars: 5,
    text: "I had my portfolio shoot done by Utkarsha madam and the photos came out magazine-worthy. She truly understands lighting and camera angles!",
  },
  {
    name: "Nandini Gupta",
    city: "Kolhapur",
    stars: 5,
    text: "Trusted by celebrities for a reason! She did my best friend's wedding makeup and we all looked stunning. Highly professional and talented.",
  },
  {
    name: "Deepika Verma",
    city: "Mumbai",
    stars: 5,
    text: "The attention to detail is remarkable. Every feature was enhanced perfectly. I felt like a celebrity on my wedding day!",
  },
  {
    name: "Smita Nair",
    city: "Kalyan",
    stars: 5,
    text: "Utkarsha ji did my engagement look and it was absolutely magical. Natural yet stunning — exactly what I wanted. Will definitely book for my wedding!",
  },
];

function TestimonialsSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setActive((a) => (a + 1) % TESTIMONIALS.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);
  const t = TESTIMONIALS[active];
  return (
    <section
      id="reviews"
      style={{
        padding: "6rem 2rem",
        background: "linear-gradient(180deg,var(--beige) 0%,var(--cream) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
      data-ocid="testimonials.section"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <div className="section-divider" />
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 700,
              color: "var(--dark-brown)",
              marginBottom: "1rem",
            }}
          >
            What Our Brides Say
          </h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
            Real stories from real brides — their joy is our greatest
            achievement.
          </p>
        </motion.div>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glow-card"
          style={{
            borderRadius: 28,
            padding: "clamp(1.5rem,4vw,3rem)",
            textAlign: "center",
            marginBottom: "2rem",
          }}
          data-ocid="testimonials.active_card"
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1.5rem",
              color: "rgba(201,168,76,0.3)",
            }}
          >
            &#34;
          </div>
          <p
            style={{
              fontSize: "clamp(1rem,2vw,1.15rem)",
              color: "var(--text)",
              lineHeight: 1.8,
              fontStyle: "italic",
              marginBottom: "2rem",
            }}
          >
            {t.text}
          </p>
          <div
            className="star-rating"
            style={{ marginBottom: "1rem", fontSize: "1.2rem" }}
          >
            {"★".repeat(t.stars)}
          </div>
          <div
            className="font-display"
            style={{
              fontWeight: 700,
              color: "var(--dark-brown)",
              fontSize: "1.1rem",
            }}
          >
            {t.name}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            {t.city}
          </div>
        </motion.div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {TESTIMONIALS.map((t2, i) => (
            <button
              key={t2.name}
              type="button"
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 28 : 10,
                height: 10,
                borderRadius: 5,
                border: "none",
                cursor: "pointer",
                background: i === active ? "var(--gold)" : "var(--beige-dark)",
                transition: "all 0.3s ease",
              }}
              aria-label={`Review ${i + 1}`}
              data-ocid={`testimonials.dot.${i + 1}`}
            />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: "1rem",
          }}
        >
          {TESTIMONIALS.slice(0, 4).map((rev, i) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glow-card"
              style={{
                borderRadius: 16,
                padding: "1.25rem",
                cursor: "pointer",
              }}
              onClick={() => setActive(i)}
              data-ocid={`testimonials.item.${i + 1}`}
            >
              <div
                className="star-rating"
                style={{ marginBottom: 6, fontSize: "0.9rem" }}
              >
                {"★".repeat(rev.stars)}
              </div>
              <p
                style={{
                  color: "var(--text)",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  marginBottom: 8,
                  fontStyle: "italic",
                }}
              >
                "{rev.text.slice(0, 90)}..."
              </p>
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--dark-brown)",
                  fontSize: "0.9rem",
                }}
              >
                {rev.name}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                {rev.city}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "What services do you offer?",
    a: "We offer Bridal Makeup, Engagement Makeup, Pre-Bridal Packages, Party & Event Makeup, Celebrity & Ramp Makeup, Portfolio Shoot Makeup, and Makeup for Special Occasions. We also provide on-location services at your home or venue.",
  },
  {
    q: "How far in advance should I book for bridal makeup?",
    a: "We recommend booking at least 6–12 months in advance for bridal makeup, especially for peak wedding season (October–February and April–May). Last-minute bookings may be accommodated subject to availability.",
  },
  {
    q: "Do you offer home or venue service?",
    a: "Yes! We provide home and on-location services across Kalyan, Mumbai, Thane, Pune, and other Maharashtra locations. Travel charges may apply for locations beyond Kalyan.",
  },
  {
    q: "What brands and products do you use?",
    a: "We use premium international brands including MAC, Charlotte Tilbury, Huda Beauty, NARS, Bobbi Brown, Giorgio Armani, Dior, and Fenty Beauty. All products are 100% authentic and skin-safe.",
  },
  {
    q: "How long does bridal makeup take?",
    a: "Full bridal makeup typically takes 2.5–3.5 hours depending on the look complexity. For party or event makeup, 1–1.5 hours is standard.",
  },
  {
    q: "Do you offer a trial session before the wedding?",
    a: "Absolutely! A trial session is highly recommended and part of our premium bridal packages. We finalize your look, test products, and ensure you are completely happy before the big day.",
  },
  {
    q: "What is included in the pre-bridal package?",
    a: "Our pre-bridal package includes 4 sessions over 3 months: Deep cleanse facial + glow treatment, Skin brightening + de-tanning, Threading & eyebrow shaping, and Final glow session 1 week before the wedding.",
  },
  {
    q: "Can you do traditional Indian as well as Western looks?",
    a: "Yes, Utkarsha is trained in both traditional Indian bridal looks (South Indian, North Indian, Maharashtrian, Gujarati) and contemporary Western styles. We can create beautiful fusion looks too.",
  },
  {
    q: "Do you work with celebrities and does that cost more?",
    a: "Yes, Pinkie has an extensive celebrity clientele from Bollywood and television. Our standard pricing applies to all clients — we believe every bride deserves the celebrity treatment!",
  },
  {
    q: "What are your working hours?",
    a: "Our studio is open Monday through Sunday, 10:00 AM to 8:00 PM. For early morning bridal appointments (before 10 AM), prior arrangements can be made.",
  },
  {
    q: "How do I book an appointment?",
    a: "You can book by calling or WhatsApp at 08657085754, visiting our studio at Gauripada, Kalyan, or reaching out through our Instagram.",
  },
  {
    q: "Are your products safe for sensitive skin?",
    a: "Yes! We carefully select products suitable for all skin types including sensitive skin. During your consultation, please inform us of any known allergies or skin conditions.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section
      style={{
        padding: "6rem 2rem",
        background: "var(--cream)",
        position: "relative",
        overflow: "hidden",
      }}
      className="section-glow-bg"
      data-ocid="faq.section"
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <div className="section-divider" />
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 700,
              color: "var(--dark-brown)",
              marginBottom: "1rem",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
            Everything you need to know before booking.
          </p>
        </motion.div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {FAQS.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glow-card"
              style={{ borderRadius: 16, overflow: "hidden" }}
              data-ocid={`faq.item.${i + 1}`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1.25rem 1.5rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: 16,
                }}
                data-ocid={`faq.toggle.${i + 1}`}
              >
                <span
                  className="font-display"
                  style={{
                    fontWeight: 600,
                    color: "var(--dark-brown)",
                    fontSize: "1rem",
                    flex: 1,
                  }}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    color: "var(--gold)",
                    fontSize: "1.4rem",
                    transition: "transform 0.3s",
                    transform: openIndex === i ? "rotate(45deg)" : "none",
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </button>
              {openIndex === i && (
                <div
                  style={{
                    padding: "0 1.5rem 1.25rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.75,
                    fontSize: "0.95rem",
                  }}
                  data-ocid={`faq.answer.${i + 1}`}
                >
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section
      style={{
        padding: "6rem 2rem",
        background:
          "linear-gradient(135deg,var(--dark-brown) 0%,#2C1508 50%,var(--dark-brown) 100%)",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
      data-ocid="cta.section"
    >
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(201,168,76,0.2) 0%,transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "-100px",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(201,168,76,0.15) 0%,transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "15%",
          color: "rgba(201,168,76,0.4)",
          fontSize: "1.5rem",
          animation: "sparkle 3s ease-in-out infinite",
        }}
      >
        ✦
      </div>
      <div
        style={{
          position: "absolute",
          top: "60%",
          right: "20%",
          color: "rgba(201,168,76,0.3)",
          fontSize: "1rem",
          animation: "sparkle 4s ease-in-out infinite 1s",
        }}
      >
        ✦
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div
            style={{
              color: "var(--gold)",
              fontSize: "1rem",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: "1rem",
              fontWeight: 600,
            }}
          >
            Ready to Look Stunning?
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem,5vw,3.5rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.2,
              marginBottom: "1.5rem",
            }}
          >
            Your Dream Look Awaits — Let's Create It Together
          </h2>
          <p
            style={{
              color: "rgba(232,213,163,0.8)",
              fontSize: "1.1rem",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
            }}
          >
            Whether it's your wedding day, a glamorous event, or a celebrity
            photoshoot, Utkarsha Nakti Patil brings your vision to life with
            unmatched artistry.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="tel:08657085754"
              className="btn-gold"
              style={{
                textDecoration: "none",
                fontSize: "1.05rem",
                padding: "16px 36px",
              }}
              data-ocid="cta.call_button"
            >
              📞 Call Now — 08657085754
            </a>
            <a
              href="https://wa.me/918657085754"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "16px 36px",
                borderRadius: 50,
                border: "1.5px solid rgba(255,255,255,0.4)",
                color: "white",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1.05rem",
                transition: "all 0.3s",
                backdropFilter: "blur(10px)",
              }}
              data-ocid="cta.whatsapp_button"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              💬 WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

function MapsSection() {
  return (
    <section
      style={{
        padding: "5rem 2rem",
        background: "var(--beige)",
        position: "relative",
        overflow: "hidden",
      }}
      data-ocid="maps.section"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <div className="section-divider" />
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.8rem,3vw,2.5rem)",
              fontWeight: 700,
              color: "var(--dark-brown)",
              marginBottom: "0.75rem",
            }}
          >
            Find Our Studio
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Gauripada, Kalyan, Maharashtra 421301
          </p>
        </motion.div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            alignItems: "start",
          }}
          className="maps-grid"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="glow-card"
              style={{ borderRadius: 20, overflow: "hidden", height: 400 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.5!2d73.1282!3d19.2403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDE0JzI1LjEiTiA3M8KwMDcnNDEuNSJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Makeup by Utkarsha Nakti Patil Location"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glow-card"
            style={{ borderRadius: 20, padding: "2.5rem" }}
          >
            <h3
              className="font-display"
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--dark-brown)",
                marginBottom: "2rem",
              }}
            >
              Studio Details
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {[
                {
                  icon: "📍",
                  label: "Address",
                  val: "Gauripada, Kalyan, Maharashtra 421301",
                },
                { icon: "📞", label: "Phone", val: "08657085754" },
                { icon: "💬", label: "WhatsApp", val: "08657085754" },
                {
                  icon: "🕐",
                  label: "Hours",
                  val: "Monday – Sunday: 10:00 AM – 8:00 PM",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{ fontSize: "1.4rem", flexShrink: 0, marginTop: 2 }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "var(--dark-brown)",
                        marginBottom: 2,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{ color: "var(--text-muted)", lineHeight: 1.5 }}
                    >
                      {item.val}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="https://maps.google.com/?q=Khadakpada+Circle+Kalyan+Maharashtra"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{
                display: "inline-block",
                marginTop: "2rem",
                textDecoration: "none",
              }}
              data-ocid="maps.directions_button"
            >
              🗺️ Get Directions
            </a>
          </motion.div>
        </div>
      </div>
      <style>
        {
          "@media(max-width:768px){.maps-grid{grid-template-columns:1fr!important}}"
        }
      </style>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wa = `https://wa.me/918657085754?text=${encodeURIComponent(`New Booking Request\nName: ${form.name}\nPhone: ${form.phone}\nService: ${form.service}\nMessage: ${form.message}`)}`;
    window.open(wa, "_blank");
    setSubmitted(true);
  };
  return (
    <section
      id="contact"
      style={{
        padding: "6rem 2rem",
        background: "var(--cream)",
        position: "relative",
        overflow: "hidden",
      }}
      className="section-glow-bg"
      data-ocid="contact.section"
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <div className="section-divider" />
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 700,
              color: "var(--dark-brown)",
              marginBottom: "1rem",
            }}
          >
            Book an Appointment
          </h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
            Send your details and we'll get back to you within 24 hours to
            confirm your booking.
          </p>
        </motion.div>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glow-card"
            style={{ borderRadius: 24, padding: "3rem", textAlign: "center" }}
            data-ocid="contact.success_state"
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
            <h3
              className="font-display"
              style={{
                fontSize: "1.5rem",
                color: "var(--dark-brown)",
                marginBottom: "0.75rem",
              }}
            >
              Request Sent!
            </h3>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
              Your WhatsApp message has been prepared. Utkarsha will confirm
              your appointment shortly.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="btn-gold"
              style={{ marginTop: "1.5rem" }}
            >
              Book Another
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glow-card"
            style={{
              borderRadius: 24,
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
            onSubmit={handleSubmit}
            data-ocid="contact.form"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
              className="form-grid"
            >
              <div>
                <label
                  htmlFor="contact-name"
                  style={{
                    display: "block",
                    fontWeight: 600,
                    color: "var(--dark-brown)",
                    marginBottom: 6,
                    fontSize: "0.9rem",
                  }}
                >
                  Full Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  className="luxury-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  data-ocid="contact.name_input"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-phone"
                  style={{
                    display: "block",
                    fontWeight: 600,
                    color: "var(--dark-brown)",
                    marginBottom: 6,
                    fontSize: "0.9rem",
                  }}
                >
                  Phone Number *
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  className="luxury-input"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  data-ocid="contact.phone_input"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="contact-service"
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "var(--dark-brown)",
                  marginBottom: 6,
                  fontSize: "0.9rem",
                }}
              >
                Service Required
              </label>
              <select
                id="contact-service"
                className="luxury-input"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                data-ocid="contact.service_select"
              >
                <option value="">Select a service...</option>
                <option>Bridal Makeup</option>
                <option>Pre-Bridal Package</option>
                <option>Engagement Makeup</option>
                <option>Party Makeup</option>
                <option>Celebrity / Ramp Makeup</option>
                <option>Portfolio Shoot Makeup</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="contact-message"
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "var(--dark-brown)",
                  marginBottom: 6,
                  fontSize: "0.9rem",
                }}
              >
                Message / Event Date
              </label>
              <textarea
                id="contact-message"
                className="luxury-input"
                placeholder="Tell us about your event, preferred date, and any special requirements..."
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ resize: "vertical" }}
                data-ocid="contact.message_textarea"
              />
            </div>
            <button
              type="submit"
              className="btn-gold"
              style={{
                fontSize: "1rem",
                padding: "15px 32px",
                alignSelf: "center",
              }}
              data-ocid="contact.submit_button"
            >
              Send via WhatsApp ✉️
            </button>
          </motion.form>
        )}
      </div>
      <style>
        {
          "@media(max-width:600px){.form-grid{grid-template-columns:1fr!important}}"
        }
      </style>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  return (
    <footer
      style={{
        background: "var(--dark-brown)",
        color: "rgba(232,213,163,0.8)",
        padding: "4rem 2rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
      data-ocid="footer"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg,transparent,var(--gold),transparent)",
        }}
      />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          <div>
            <h3
              className="font-display"
              style={{
                fontSize: "1.4rem",
                color: "var(--light-gold)",
                marginBottom: "1rem",
                fontWeight: 700,
              }}
            >
              Makeup by Utkarsha Nakti Patil
            </h3>
            <p
              style={{
                lineHeight: 1.7,
                fontSize: "0.9rem",
                marginBottom: "1.25rem",
              }}
            >
              Luxury bridal & celebrity makeup artistry. Transforming beauty
              into timeless memories since 2009.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <a
                href="https://www.instagram.com/un_makeover_utkarsha"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                  color: "white",
                  textDecoration: "none",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://wa.me/918657085754"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#25D366",
                  color: "white",
                  textDecoration: "none",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
                aria-label="WhatsApp"
              >
                WA
              </a>
            </div>
          </div>
          <div>
            <h4
              style={{
                color: "var(--light-gold)",
                marginBottom: "1rem",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Services
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {[
                "Bridal Makeup",
                "Pre-Bridal Package",
                "Celebrity & Ramp",
                "Party Makeup",
                "Engagement Makeup",
                "Portfolio Shoots",
              ].map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    style={{
                      color: "rgba(232,213,163,0.7)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--light-gold)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(232,213,163,0.7)";
                    }}
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4
              style={{
                color: "var(--light-gold)",
                marginBottom: "1rem",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              Contact
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                fontSize: "0.9rem",
              }}
            >
              <div>📍 Gauripada, Kalyan, Maharashtra 421301</div>
              <div>
                <a
                  href="tel:08657085754"
                  style={{
                    color: "rgba(232,213,163,0.7)",
                    textDecoration: "none",
                  }}
                >
                  📞 08657085754
                </a>
              </div>
              <div>🕐 Mon–Sun: 10 AM – 8 PM</div>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(201,168,76,0.2)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.85rem", margin: 0 }}>
            © {year} Makeup by Utkarsha Nakti Patil. All Rights Reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.8rem",
              color: "rgba(232,213,163,0.5)",
              textDecoration: "none",
            }}
          >
          
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        cursor: "zoom-out",
      }}
      data-ocid="gallery.lightbox"
    >
      <motion.img
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        src={src}
        alt="Gallery view"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          objectFit: "contain",
          borderRadius: 12,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      />
      <button
        type="button"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          border: "none",
          cursor: "pointer",
          color: "white",
          fontSize: "1.3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Close lightbox"
        data-ocid="gallery.lightbox_close_button"
      >
        ✕
      </button>
    </motion.div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <WhatsAppButton />
      <InstagramButton />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <CelebritySection />
      <WhyChooseSection />
      <GallerySection onLightbox={setLightboxSrc} />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <MapsSection />
      <ContactSection />
      <Footer />
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </div>
  );
}
