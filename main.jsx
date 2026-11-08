
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDown,
  ArrowUpRight,
  Menu,
  X,
  Instagram,
  Linkedin
} from 'lucide-react';

import './style.css';
import characterImage from './vr-character.png';

gsap.registerPlugin(ScrollTrigger);

// FULL SCREEN SCROLL CONTROLLED CHARACTER
function ThreeHero() {
  const mountRef = useRef(null);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#100400');

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    host.appendChild(renderer.domElement);

    let character = null;
    let characterMaterial = null;
    let characterGeometry = null;
    let texture = null;

    const loader = new THREE.TextureLoader();

    loader.load(characterImage, (loadedTexture) => {
      texture = loadedTexture;
      texture.colorSpace = THREE.SRGBColorSpace;

      const imageAspect =
        texture.image.width / texture.image.height;

      const viewHeight =
        2 * camera.position.z *
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

      const viewWidth =
        viewHeight * camera.aspect;

      let planeWidth;
      let planeHeight;

      // Image covers the complete screen without a small image box
      if (imageAspect > camera.aspect) {
        planeHeight = viewHeight;
        planeWidth = viewHeight * imageAspect;
      } else {
        planeWidth = viewWidth;
        planeHeight = viewWidth / imageAspect;
      }

      characterGeometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight
      );

      characterMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: false,
        side: THREE.DoubleSide
      });

      character = new THREE.Mesh(
        characterGeometry,
        characterMaterial
      );

      scene.add(character);

      // Scroll animation: character only
      const characterMotion = gsap.timeline({
        scrollTrigger: {
          trigger: '.story-sequence',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.4
        }
      });

      characterMotion.to(character.scale, {
        x: 1.85,
        y: 1.85,
        z: 1.85,
        ease: 'none'
      }, 0);

      characterMotion.to(character.rotation, {
        y: 0.85,
        z: -0.10,
        ease: 'none'
      }, 0);

      characterMotion.to(character.position, {
        x: 0.15,
        y: -0.15,
        ease: 'none'
      }, 0);

      // Keep references for cleanup
      host.characterMotion = characterMotion;
    });

    let targetX = 0;
    let targetY = 0;
    let raf;

    const onPointerMove = (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 0.12;
      targetY = (event.clientY / window.innerHeight - 0.5) * 0.08;
    };

    window.addEventListener('pointermove', onPointerMove);

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

      if (character && texture) {
        const imageAspect =
          texture.image.width / texture.image.height;

        const viewHeight =
          2 * camera.position.z *
          Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

        const viewWidth =
          viewHeight * camera.aspect;

        let w;
        let h;

        if (imageAspect > camera.aspect) {
          h = viewHeight;
          w = h * imageAspect;
        } else {
          w = viewWidth;
          h = w / imageAspect;
        }

        character.geometry.dispose();
        character.geometry = new THREE.PlaneGeometry(w, h);
      }
    };

    const animate = () => {
      if (character) {
        character.rotation.x +=
          (targetY - character.rotation.x) * 0.025;

        // Small mouse movement, scroll controls the main rotation
        character.position.x +=
          (targetX - character.position.x) * 0.012;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);

      host.characterMotion?.scrollTrigger?.kill();
      host.characterMotion?.kill();

      characterGeometry?.dispose();
      characterMaterial?.dispose();
      texture?.dispose();

      renderer.dispose();

      if (host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="three-stage" ref={mountRef} />;
}

// WEBSITE CONTENT
const services = [
  ['01', 'Digital Strategy'],
  ['02', 'Web Experiences'],
  ['03', 'Search & SEO'],
  ['04', 'Performance Ads'],
  ['05', 'Social & Content']
];

const projects = [
  ['01', 'Digital Presence', 'Website Experience'],
  ['02', 'Brand Momentum', 'Social & Performance'],
  ['03', 'Search Growth', 'SEO Strategy']
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-content > *', {
        y: 35,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out'
      });

      gsap.utils.toArray('.reveal').forEach((item) => {
        gsap.fromTo(
          item,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              once: true
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <ThreeHero />

      <header className="site-header">
        <a className="brand" href="#top" onClick={closeMenu}>
          REVON<span>.</span>AD
        </a>

        <nav className={menuOpen ? 'navigation open' : 'navigation'}>
          <a href="#vision" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>

        <a className="header-cta" href="#contact">
          LET'S TALK <ArrowUpRight size={14} />
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main className="story-sequence" id="top">

        {/* HERO */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-logo">
              REVON<span>.AD</span>
            </h1>

            <div className="hero-scroll">
              <span>SCROLL TO DISCOVER</span>
              <ArrowDown size={18} />
            </div>
          </div>

          <div className="hero-corner">
            DIGITAL EXPERIENCE / 001
          </div>
        </section>

        {/* VISION */}
        <section className="story-section" id="vision">
          <div className="section-row reveal">
            <div className="section-title">
              <span className="eyebrow">01 / THE VISION</span>
              <h2>
                Beyond the<br />
                <em>ordinary.</em>
              </h2>
            </div>

            <div className="section-description">
              <p>
                We bring strategy, creativity and technology together
                to build digital experiences that move brands forward.
              </p>
            </div>

            <span className="section-count">01 — 05</span>
          </div>
        </section>

        {/* SERVICES */}
        <section className="story-section" id="services">
          <div className="section-row reveal">
            <div className="section-title">
              <span className="eyebrow">02 / WHAT WE DO</span>
              <h2>
                Ideas into<br />
                <em>impact.</em>
              </h2>
            </div>

            <div className="section-description service-list">
              {services.map(([number, name]) => (
                <div className="service-item" key={number}>
                  <span>{number}</span>
                  <p>{name}</p>
                </div>
              ))}
            </div>

            <span className="section-count">02 — 05</span>
          </div>
        </section>

        {/* WORK */}
        <section className="story-section" id="work">
          <div className="section-row reveal">
            <div className="section-title">
              <span className="eyebrow">03 / OUR CREATIVE WORLD</span>
              <h2>
                Made to<br />
                <em>move people.</em>
              </h2>
            </div>

            <div className="section-description">
              <p>
                A glimpse of the kind of digital experiences and
                growth systems we love to build.
              </p>
            </div>

            <span className="section-count">03 — 05</span>
          </div>

          <div className="project-list reveal">
            {projects.map(([number, name, type]) => (
              <div className="project-item" key={number}>
                <span>{number}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{type}</p>
                </div>
                <ArrowUpRight />
              </div>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section className="story-section" id="approach">
          <div className="process-heading reveal">
            <span className="eyebrow">04 / THE PROCESS</span>
            <h2>
              Clarity first.<br />
              <em>Momentum always.</em>
            </h2>
          </div>

          <div className="process-list reveal">
            <div>
              <span>01</span>
              <h3>Discover</h3>
              <p>Understand your business and audience.</p>
            </div>

            <div>
              <span>02</span>
              <h3>Define</h3>
              <p>Plan the right strategy and creative direction.</p>
            </div>

            <div>
              <span>03</span>
              <h3>Deliver</h3>
              <p>Launch, measure and keep improving.</p>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="story-section contact-section" id="contact">
          <div className="contact-content reveal">
            <span className="eyebrow">05 / YOUR NEXT MOVE</span>

            <h2>
              Let's make<br />
              <em>it happen.</em>
            </h2>

            <a
              className="contact-button"
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
            >
              START A CONVERSATION <ArrowUpRight size={17} />
            </a>
          </div>

          <footer className="site-footer">
            <a className="brand" href="#top">
              REVON<span>.</span>AD
            </a>

            <p>MAKE YOUR NEXT MOVE MATTER.</p>

            <div className="social-links">
              <a href="https://www.instagram.com/" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="https://www.linkedin.com/" aria-label="LinkedIn">
                <Linkedin />
              </a>
            </div>

            <small>© {new Date().getFullYear()} REVON.AD</small>
          </footer>
        </section>

      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
