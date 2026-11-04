import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDownRight,
  ArrowUpRight,
  Menu,
  X,
  Instagram,
  Linkedin,
  MoveUpRight
} from 'lucide-react';
import './style.css';
import characterImage from './vr-character.png';

gsap.registerPlugin(ScrollTrigger);

function ThreeHero() {
  const mountRef = useRef(null);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      host.clientWidth / host.clientHeight,
      0.1,
      100
    );

    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // VR CHARACTER IMAGE
    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load(characterImage);
    texture.colorSpace = THREE.SRGBColorSpace;

    const characterMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const characterGeometry = new THREE.PlaneGeometry(3.5, 4.8);

    const character = new THREE.Mesh(
      characterGeometry,
      characterMaterial
    );

    character.position.set(0, 0, 0.2);
    group.add(character);

    // ORANGE CINEMATIC RING
    const ringGeometry = new THREE.TorusGeometry(
      2.5,
      0.012,
      12,
      160
    );

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xf05a38,
      transparent: true,
      opacity: 0.55
    });

    const ring = new THREE.Mesh(
      ringGeometry,
      ringMaterial
    );

    ring.position.z = -0.5;
    group.add(ring);

    // LIGHTING
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const orangeLight = new THREE.PointLight(
      0xff642f,
      35,
      18
    );

    orangeLight.position.set(3, 2, 4);
    scene.add(orangeLight);

    const redLight = new THREE.PointLight(
      0x8f160d,
      25,
      15
    );

    redLight.position.set(-3, -2, 2);
    scene.add(redLight);

    // FLOATING PARTICLES
    const particleCount = 700;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xffa078,
        size: 0.018,
        transparent: true,
        opacity: 0.65
      })
    );

    scene.add(particles);

    // MOUSE MOVEMENT
    let targetX = 0;
    let targetY = 0;
    let raf;

    const onPointer = (e) => {
      const rect = host.getBoundingClientRect();

      targetX =
        ((e.clientX - rect.left) / rect.width - 0.5) * 0.35;

      targetY =
        ((e.clientY - rect.top) / rect.height - 0.5) * 0.25;
    };

    host.addEventListener('pointermove', onPointer);

    // SCROLL CONTROLLED ZOOM
    const scrollAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    scrollAnimation.to(
      camera.position,
      {
        z: 5.2,
        ease: 'none'
      },
      0
    );

    scrollAnimation.to(
      group.scale,
      {
        x: 1.35,
        y: 1.35,
        z: 1.35,
        ease: 'none'
      },
      0
    );

    scrollAnimation.to(
      group.position,
      {
        y: -0.65,
        ease: 'none'
      },
      0
    );

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      group.rotation.y +=
        (targetX - group.rotation.y) * 0.025;

      group.rotation.x +=
        (targetY - group.rotation.x) * 0.025;

      character.position.y = Math.sin(t * 0.8) * 0.06;

      ring.rotation.z += 0.0015;
      particles.rotation.y = t * 0.01;

      renderer.render(scene, camera);

      raf = requestAnimationFrame(animate);
    };

    animate();

    // RESPONSIVE RESIZE
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;

      if (!w || !h) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener('resize', resize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener('resize', resize);
      host.removeEventListener('pointermove', onPointer);

      scrollAnimation.scrollTrigger?.kill();
      scrollAnimation.kill();

      characterGeometry.dispose();
      characterMaterial.dispose();
      texture.dispose();

      ringGeometry.dispose();
      ringMaterial.dispose();

      particleGeometry.dispose();
      particles.material.dispose();

      renderer.dispose();

      if (host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="three-stage"
      ref={mountRef}
      aria-label="Interactive VR character animation"
    />
  );
}

// SERVICES
const services = [
  ['01', 'Digital strategy', 'A clear direction for brands ready to move forward.'],
  ['02', 'Web experiences', 'Fast, thoughtful websites built to turn attention into action.'],
  ['03', 'Search & visibility', 'SEO that helps the right people discover your business.'],
  ['04', 'Performance marketing', 'Meta and Google campaigns focused on measurable growth.'],
  ['05', 'Social & content', 'Distinctive social media, reels and creative that people remember.']
];

// PROJECTS
const projects = [
  { n: '01', title: 'Digital presence', type: 'Website experience', cls: 'project-a' },
  { n: '02', title: 'Brand momentum', type: 'Social & performance', cls: 'project-b' },
  { n: '03', title: 'Search growth', type: 'SEO strategy', cls: 'project-c' }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', {
        y: 42,
        opacity: 0,
        duration: 1,
        stagger: 0.13,
        ease: 'power3.out',
        delay: 0.2
      });

      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 55, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%',
              once: true
            }
          }
        );
      });

      gsap.to('.hero-orbit', {
        rotate: 360,
        duration: 50,
        repeat: -1,
        ease: 'none'
      });

      gsap.to('.marquee-track', {
        xPercent: -25,
        duration: 24,
        repeat: -1,
        ease: 'none'
      });
    });

    return () => ctx.revert();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="nav-wrap">
        <a className="logo" href="#top" onClick={closeMenu}>
          REVON<span>.</span>AD
        </a>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>

        <a className="nav-cta" href="#contact">
          Let's talk <ArrowUpRight size={15} />
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-grid"></div>
          <div className="hero-orbit"></div>

          <ThreeHero />

          <div className="hero-copy">
            <p className="eyebrow">
              <span className="live-dot"></span>
              INDEPENDENT DIGITAL GROWTH STUDIO
            </p>

            <h1>
              Make your<br />
              <em>next move</em><br />
              matter<span className="orange">.</span>
            </h1>

            <div className="hero-bottom">
              <p>
                We turn bold ideas into meaningful digital experiences,
                stronger brands and measurable growth.
              </p>

              <a className="round-link" href="#about" aria-label="Explore">
                <ArrowDownRight size={25} />
              </a>
            </div>
          </div>

          <div className="hero-index">
            01 / 05 <span>SCROLL TO EXPLORE</span>
          </div>

          <div className="hero-side-note">
            STRATEGY · DESIGN · PERFORMANCE
          </div>
        </section>

        <div className="marquee">
          <div className="marquee-track">
            BUILD WHAT'S NEXT <b>✳</b> THINK BIGGER <b>✳</b> GROW WITH INTENT <b>✳</b> BUILD WHAT'S NEXT <b>✳</b> THINK BIGGER <b>✳</b> GROW WITH INTENT <b>✳</b>
          </div>
        </div>

        <section className="intro section-pad" id="about">
          <div className="section-label reveal">
            [ 01 — WHO WE ARE ]
          </div>

          <div className="intro-content reveal">
            <p className="eyebrow">NOT JUST ANOTHER DIGITAL TEAM</p>

            <h2>
              Good work gets noticed.<br />
              <span>Great strategy gets results.</span>
            </h2>

            <div className="intro-foot">
              <p>
                REVON.AD partners with ambitious businesses to create a
                sharper digital presence. From the first click to the final
                conversion, we bring strategy, creativity and performance
                together.
              </p>

              <a className="text-link" href="#contact">
                GET TO KNOW US <MoveUpRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="services section-pad" id="services">
          <div className="section-head reveal">
            <div className="section-label">
              [ 02 — WHAT WE DO ]
            </div>

            <h2>
              Ideas into<br />
              <em>impact.</em>
            </h2>

            <p>
              Everything your brand needs to move forward — under one roof.
            </p>
          </div>

          <div className="service-list">
            {services.map(([n, title, desc]) => (
              <article className="service-row reveal" key={n}>
                <span className="service-num">{n}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
                <ArrowUpRight className="service-arrow" />
              </article>
            ))}
          </div>
        </section>

        <section className="work section-pad" id="work">
          <div className="work-heading reveal">
            <div>
              <div className="section-label">
                [ 03 — SELECTED FOCUS ]
              </div>

              <h2>
                Made to<br />
                <em>move people.</em>
              </h2>
            </div>

            <p>
              A glimpse of the kind of digital experiences and growth
              systems we love to build.
            </p>
          </div>

          <div className="project-grid">
            {projects.map((p) => (
              <article
                className={`project-card ${p.cls} reveal`}
                key={p.n}
              >
                <div className="project-art">
                  <span className="art-orb"></span>
                  <span className="art-line"></span>
                  <span className="art-number">{p.n}</span>
                </div>

                <div className="project-meta">
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.type}</p>
                  </div>

                  <ArrowUpRight />
                </div>
              </article>
            ))}
          </div>

          <p className="work-note">
            PROJECT SHOWCASE — ADD YOUR CLIENT WORK HERE
          </p>
        </section>

        <section className="approach section-pad">
          <div className="section-label reveal">
            [ 04 — HOW WE WORK ]
          </div>

          <div className="approach-main reveal">
            <h2>
              Clarity first.<br />
              <em>Momentum always.</em>
            </h2>

            <div className="steps">
              <div>
                <b>01</b>
                <span>Discover</span>
                <p>Understand your business, audience and goals.</p>
              </div>

              <div>
                <b>02</b>
                <span>Define</span>
                <p>Build a focused strategy and creative direction.</p>
              </div>

              <div>
                <b>03</b>
                <span>Deliver</span>
                <p>Launch, measure and keep improving.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact section-pad" id="contact">
          <div className="contact-glow"></div>

          <div className="section-label reveal">
            [ 05 — YOUR NEXT MOVE ]
          </div>

          <div className="contact-content reveal">
            <p className="eyebrow">HAVE A GOOD ONE IN MIND?</p>

            <h2>
              Let's make<br />
              <em>it happen.</em>
            </h2>

            <a
              className="contact-button"
              href="https://wa.me/919876543210?text=Hi%20REVON.AD%2C%20I%27d%20like%20to%20discuss%20a%20project."
            >
              START A CONVERSATION <ArrowUpRight size={18} />
            </a>

            <p className="contact-hint">
              Replace the sample WhatsApp number in the code with your business number.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <a className="logo" href="#top">
          REVON<span>.</span>AD
        </a>

        <p>MAKE YOUR NEXT MOVE MATTER.</p>

        <div className="socials">
          <a href="https://www.instagram.com/" aria-label="Instagram">
            <Instagram />
          </a>

          <a href="https://www.linkedin.com/" aria-label="LinkedIn">
            <Linkedin />
          </a>
        </div>

        <small>
          © {new Date().getFullYear()} REVON.AD. ALL RIGHTS RESERVED.
        </small>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
