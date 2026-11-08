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

/* --------------------------------
   CINEMATIC 3D CHARACTER
-------------------------------- */

function ThreeHero() {
  const mountRef = useRef(null);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    host.appendChild(renderer.domElement);

    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    const loader = new THREE.TextureLoader();

    const texture = loader.load(characterImage);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const geometry = new THREE.PlaneGeometry(6, 4);

    const character = new THREE.Mesh(geometry, material);
    character.position.set(0, 0, 0);
    characterGroup.add(character);

    /* Orange cinematic halo */

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(2.8, 0.012, 12, 180),
      new THREE.MeshBasicMaterial({
        color: 0xff5727,
        transparent: true,
        opacity: 0.65
      })
    );

    halo.position.z = -0.8;
    characterGroup.add(halo);

    /* Background particles */

    const particleCount = 900;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 15;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffa078,
      size: 0.018,
      transparent: true,
      opacity: 0.65
    });

    const particles = new THREE.Points(
      particleGeometry,
      particleMaterial
    );

    scene.add(particles);

    /* Mouse parallax */

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const onPointerMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 0.22;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 0.16;
    };

    window.addEventListener('pointermove', onPointerMove);

    /* Scroll controlled animation */

    const cinematicTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.story-sequence',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2
      }
    });

    cinematicTimeline
      .to(characterGroup.scale, {
        x: 1.25,
        y: 1.25,
        z: 1.25,
        ease: 'none'
      }, 0)

      .to(characterGroup.rotation, {
        y: 0.12,
        x: -0.04,
        ease: 'none'
      }, 0)

      .to(camera.position, {
        z: 6.2,
        ease: 'none'
      }, 0)

      .to(characterGroup.position, {
        y: -0.2,
        ease: 'none'
      }, 0.2)

      .to(characterGroup.scale, {
        x: 1.75,
        y: 1.75,
        z: 1.75,
        ease: 'none'
      }, 0.42)

      .to(characterGroup.rotation, {
        y: -0.16,
        x: 0.035,
        ease: 'none'
      }, 0.48)

      .to(camera.position, {
        z: 4.8,
        ease: 'none'
      }, 0.55)

      .to(characterGroup.position, {
        y: -0.45,
        ease: 'none'
      }, 0.7);

    /* Render loop */

    const clock = new THREE.Clock();
    let animationFrame;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      currentX += (mouseX - currentX) * 0.035;
      currentY += (mouseY - currentY) * 0.035;

      characterGroup.rotation.y +=
        (currentX - characterGroup.rotation.y) * 0.015;

      characterGroup.rotation.x +=
        (currentY - characterGroup.rotation.x) * 0.015;

      halo.rotation.z = elapsed * 0.12;
      particles.rotation.y = elapsed * 0.009;

      renderer.render(scene, camera);

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    /* Responsive resize */

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);

      cinematicTimeline.scrollTrigger?.kill();
      cinematicTimeline.kill();

      geometry.dispose();
      material.dispose();
      texture.dispose();

      halo.geometry.dispose();
      halo.material.dispose();

      particleGeometry.dispose();
      particleMaterial.dispose();

      renderer.dispose();

      if (host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="three-stage" ref={mountRef} />;
}

/* --------------------------------
   WEBSITE CONTENT
-------------------------------- */

const services = [
  {
    number: '01',
    title: 'Digital Strategy',
    description: 'Clear direction and smart planning for ambitious brands.'
  },
  {
    number: '02',
    title: 'Web Experiences',
    description: 'Modern websites designed to create meaningful experiences.'
  },
  {
    number: '03',
    title: 'Search & SEO',
    description: 'Helping the right people discover your business online.'
  },
  {
    number: '04',
    title: 'Performance Ads',
    description: 'Focused Meta and Google campaigns built around growth.'
  },
  {
    number: '05',
    title: 'Social & Content',
    description: 'Creative content that captures attention and builds brands.'
  }
];

const projects = [
  {
    number: '01',
    title: 'Digital Presence',
    category: 'Website Experience'
  },
  {
    number: '02',
    title: 'Brand Momentum',
    category: 'Social & Performance'
  },
  {
    number: '03',
    title: 'Search Growth',
    category: 'SEO Strategy'
  }
];

/* --------------------------------
   MAIN APP
-------------------------------- */

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.hero-logo', {
        opacity: 0,
        y: 35,
        duration: 1.5,
        ease: 'power4.out'
      });

      gsap.from('.hero-scroll', {
        opacity: 0,
        duration: 1.2,
        delay: 0.8
      });

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(
          element,
          {
            y: 70,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 82%',
              once: true
            }
          }
        );
      });

      gsap.utils.toArray('.service-card').forEach((element, index) => {
        gsap.from(element, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: index * 0.08,
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true
          }
        });
      });
    });

    return () => context.revert();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <ThreeHero />

      <div className="cinematic-background" />

      <header className="site-header">
        <a href="#home" className="brand">
          REVON<span>.</span>AD
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? 'navigation open' : 'navigation'}>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
      </header>

      <main className="story-sequence" id="home">

        {/* HERO */}

        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-logo">
              REVON<span>.</span>AD
            </h1>

            <div className="hero-scroll">
              <span>SCROLL TO EXPERIENCE</span>
              <ArrowDown size={17} />
            </div>
          </div>

          <div className="hero-corner">
            DIGITAL EXPERIENCE / 001
          </div>
        </section>

        {/* ABOUT */}

        <section className="story-section about-section" id="about">
          <div className="story-copy reveal">
            <span className="eyebrow">01 / THE VISION</span>

            <h2>
              Beyond the
              <br />
              <em>ordinary.</em>
            </h2>

            <p>
              We bring strategy, creativity and technology together
              to build digital experiences that move brands forward.
            </p>
          </div>

          <span className="section-index">01 — 05</span>
        </section>

        {/* SERVICES */}

        <section className="story-section services-section" id="services">
          <div className="section-heading reveal">
            <span className="eyebrow">02 / WHAT WE DO</span>

            <h2>
              Ideas into
              <br />
              <em>impact.</em>
            </h2>

            <p>
              Digital solutions designed to help your business
              stand out and grow.
            </p>
          </div>

          <div className="service-list">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <span>{service.number}</span>

                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>

                <ArrowUpRight />
              </article>
            ))}
          </div>

          <span className="section-index">02 — 05</span>
        </section>

        {/* WORK */}

        <section className="story-section work-section" id="work">
          <div className="section-heading reveal">
            <span className="eyebrow">03 / OUR CREATIVE WORLD</span>

            <h2>
              Made to
              <br />
              <em>move people.</em>
            </h2>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <article className="project-card reveal" key={project.number}>
                <span className="project-number">{project.number}</span>

                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                </div>

                <ArrowUpRight />
              </article>
            ))}
          </div>

          <p className="project-note">
            SELECTED DIGITAL EXPERIENCES
          </p>

          <span className="section-index">03 — 05</span>
        </section>

        {/* APPROACH */}

        <section className="story-section approach-section">
          <div className="section-heading reveal">
            <span className="eyebrow">04 / THE PROCESS</span>

            <h2>
              Clarity first.
              <br />
              <em>Momentum always.</em>
            </h2>
          </div>

          <div className="approach-list">
            <div className="approach-item reveal">
              <span>01</span>
              <h3>Discover</h3>
              <p>Understand your business, audience and goals.</p>
            </div>

            <div className="approach-item reveal">
              <span>02</span>
              <h3>Define</h3>
              <p>Create a focused strategy and creative direction.</p>
            </div>

            <div className="approach-item reveal">
              <span>03</span>
              <h3>Deliver</h3>
              <p>Launch, measure and keep improving.</p>
            </div>
          </div>

          <span className="section-index">04 — 05</span>
        </section>

        {/* CONTACT */}

        <section className="story-section contact-section" id="contact">
          <div className="contact-content reveal">
            <span className="eyebrow">05 / YOUR NEXT MOVE</span>

            <h2>
              Let's make
              <br />
              <em>it happen.</em>
            </h2>

            <p>
              Have an idea? Let's turn it into something meaningful.
            </p>

            <a
              className="contact-button"
              href="https://wa.me/919876543210?text=Hi%20REVON.AD"
              target="_blank"
              rel="noreferrer"
            >
              START A CONVERSATION
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="contact-footer">
            <a href="#home" className="brand">
              REVON<span>.</span>AD
            </a>

            <div className="social-links">
              <a href="https://www.instagram.com/" aria-label="Instagram">
                <Instagram />
              </a>

              <a href="https://www.linkedin.com/" aria-label="LinkedIn">
                <Linkedin />
              </a>
            </div>

            <small>
              © {new Date().getFullYear()} REVON.AD
            </small>
          </div>
        </section>

      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
