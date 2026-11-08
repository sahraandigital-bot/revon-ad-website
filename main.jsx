
import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const introRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;

    if (!video || !hero) return;

    let ctx;

    const setupAnimation = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return;

      ctx = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=1800",
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Character rotation and zoom through the video
        timeline.to(video, {
          currentTime: video.duration,
          ease: "none",
          duration: 1,
        }, 0);

        // Text moves together with the character animation
        timeline.to(titleRef.current, {
          y: -180,
          scale: 0.72,
          opacity: 0,
          ease: "none",
          duration: 0.65,
        }, 0.12);

        timeline.to(introRef.current, {
          y: -100,
          opacity: 1,
          ease: "none",
          duration: 0.35,
        }, 0.45);

      }, hero);
    };

    video.addEventListener("loadedmetadata", setupAnimation);

    if (video.readyState >= 1) setupAnimation();

    return () => {
      video.removeEventListener("loadedmetadata", setupAnimation);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <main>
      <section className="hero" ref={heroRef}>
        <video
          ref={videoRef}
          className="hero-video"
          src="/vr-rotation.mp4"
          muted
          playsInline
          preload="auto"
        />

        <div className="hero-content">
          <h1 ref={titleRef}>REVON.AD</h1>

          <div className="hero-intro" ref={introRef}>
            <p>CREATIVE DIGITAL EXPERIENCE</p>
            <span>Ideas into impact.</span>
          </div>
        </div>

        <div className="scroll-indicator">
          SCROLL TO EXPLORE
          <span></span>
        </div>
      </section>

      <section className="content-section">
        <p className="eyebrow">01 / OUR VISION</p>
        <h2>
          We create digital
          <span> experiences.</span>
        </h2>
        <p className="section-description">
          Building meaningful digital experiences through creativity,
          strategy and technology.
        </p>
      </section>

      <section className="services-section">
        <p className="eyebrow">02 / WHAT WE DO</p>
        <h2>Our Services</h2>

        <div className="service-list">
          <div>01 — Website Development</div>
          <div>02 — Search Engine Optimization</div>
          <div>03 — Social Media Marketing</div>
          <div>04 — Meta & Google Ads</div>
          <div>05 — Content Creation</div>
        </div>
      </section>

      <section className="contact-section">
        <p className="eyebrow">03 / LET'S CONNECT</p>
        <h2>Let's build something different.</h2>
        <a href="mailto:hello@revon.ad">GET IN TOUCH ↗</a>
        <p className="copyright">© 2026 REVON.AD</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
