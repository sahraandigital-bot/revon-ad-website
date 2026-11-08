
import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  ArrowDown,
  Instagram,
  Linkedin
} from 'lucide-react';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;

    if (!hero || !video) return;

    let scrollTween;
    let context;

    const setupAnimation = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return;

      video.currentTime = 0;

      context = gsap.context(() => {
        scrollTween = gsap.to(video, {
          currentTime: video.duration,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: () => `+=${Math.max(window.innerHeight * 2.5, video.duration * 450)}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        gsap.to('.hero-title', {
          scale: 0.72,
          opacity: 0,
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=65%',
            scrub: 1
          }
        });

        gsap.utils.toArray('.reveal').forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0, y: 45 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                once: true
              }
            }
          );
        });
      });

      ScrollTrigger.refresh();
    };

    if (video.readyState >= 1) {
      setupAnimation();
    } else {
      video.addEventListener('loadedmetadata', setupAnimation);
    }

    return () => {
      video.removeEventListener('loadedmetadata', setupAnimation);
      context?.revert();
      scrollTween?.kill();
    };
  }, []);

  return (
    <>
      <header className="navbar">
        <a href="#home" className="brand">
          REVON<span>.AD</span>
        </a>

        <nav>
          <a href="#vision">VISION</a>
          <a href="#services">SERVICES</a>
          <a href="#work">WORK</a>
          <a href="#contact">CONTACT</a>
        </nav>

        <a href="#contact" className="nav-button">
          LET'S TALK <ArrowUpRight size={14} />
        </a>
      </header>

      <main>
        <section className="hero" id="home" ref={heroRef}>
          <video
            ref={videoRef}
            className="hero-video"
            src="/vr-rotation.mp4"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
          />

          <div className="hero-overlay"></div>

          <div className="hero-title">
            <p className="hero-kicker">INDEPENDENT DIGITAL EXPERIENCE</p>
            <h1>
              REVON<span>.AD</span>
            </h1>
            <p className="hero-subtitle">
              MAKE YOUR NEXT MOVE MATTER.
            </p>
          </div>

          <div className="scroll-hint">
            <span>SCROLL TO DISCOVER</span>
            <ArrowDown size={17} />
          </div>

          <div className="hero-counter">
            DIGITAL EXPERIENCE / 001
          </div>
        </section>

        <section className="content-section" id="vision">
          <div className="content-row reveal">
            <div className="section-heading">
              <span className="number">01 / THE VISION</span>
              <h2>
                Beyond the<br />
                <em>ordinary.</em>
              </h2>
            </div>

            <div className="row-line"></div>

            <p className="section-description">
              We bring strategy, creativity and technology together
              to build digital experiences that move brands forward.
            </p>

            <span className="section-count">01 — 05</span>
          </div>

          <div className="content-row reveal" id="services">
            <div className="section-heading">
              <span className="number">02 / WHAT WE DO</span>
              <h2>
                Ideas into<br />
                <em>impact.</em>
              </h2>
            </div>

            <div className="row-line"></div>

            <div className="service-list">
              <p><b>01</b> Digital Strategy</p>
              <p><b>02</b> Web Experiences</p>
              <p><b>03</b> Search & SEO</p>
              <p><b>04</b> Performance Ads</p>
              <p><b>05</b> Social & Content</p>
            </div>

            <ArrowUpRight className="big-arrow" />
          </div>

          <div className="content-row reveal" id="work">
            <div className="section-heading">
              <span className="number">03 / OUR CREATIVE WORLD</span>
              <h2>
                Made to<br />
                <em>move people.</em>
              </h2>
            </div>

            <div className="row-line"></div>

            <p className="section-description">
              A glimpse of the kind of digital experiences and
              growth systems we love to build.
            </p>

            <span className="section-count">03 — 05</span>
          </div>

          <div className="content-row process-row reveal">
            <div className="section-heading">
              <span className="number">04 / THE PROCESS</span>
              <h2>
                Clarity first.<br />
                <em>Momentum always.</em>
              </h2>
            </div>

            <div className="row-line"></div>

            <div className="process-list">
              <div>
                <b>01</b>
                <h3>Discover</h3>
                <p>Understand your business.</p>
              </div>

              <div>
                <b>02</b>
                <h3>Define</h3>
                <p>Plan the right strategy.</p>
              </div>

              <div>
                <b>03</b>
                <h3>Deliver</h3>
                <p>Launch and grow.</p>
              </div>
            </div>
          </div>

          <div className="content-row contact-row reveal" id="contact">
            <div className="section-heading">
              <span className="number">05 / YOUR NEXT MOVE</span>
              <h2>
                Let's make<br />
                <em>it happen.</em>
              </h2>
            </div>

            <div className="row-line"></div>

            <a
              className="contact-button"
              href="mailto:hello@revon.ad"
            >
              START A CONVERSATION
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </main>

      <footer>
        <a href="#home" className="brand">
          REVON<span>.AD</span>
        </a>

        <p>MAKE YOUR NEXT MOVE MATTER.</p>

        <div className="social-links">
          <a href="https://www.instagram.com/" aria-label="Instagram">
            <Instagram size={17} />
          </a>
          <a href="https://www.linkedin.com/" aria-label="LinkedIn">
            <Linkedin size={17} />
          </a>
        </div>

        <small>© {new Date().getFullYear()} REVON.AD</small>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
