"use client";

import { useEffect, useState } from "react";
import PanoramicWalkthrough from "@/components/PanoramicWalkthrough";
import Tilt from "@/components/Tilt";

export default function HomePage() {
  const [navbarClass, setNavbarClass] = useState("");

  useEffect(() => {
    if (window.scrollY !== 0) {
      return;
    }

    const initTimer = setTimeout(() => {
      setNavbarClass("nav-entrance-pre");
    }, 50);

    const expandTimer = setTimeout(() => {
      setNavbarClass("nav-entrance-expand");
    }, 3200);

    const showContentTimer = setTimeout(() => {
      setNavbarClass("nav-entrance-show-content");
    }, 4100);

    const cleanupTimer = setTimeout(() => {
      setNavbarClass("");
    }, 4800);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(expandTimer);
      clearTimeout(showContentTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target as HTMLElement;
          target.style.opacity = "1";
          target.style.transform = "translateY(0) scale(1)";
        });
      },
      { threshold: 0.06 }
    );

    const revealElements = document.querySelectorAll(
      "#about, .sv-card, .stat-card, .contact-inner"
    );

    revealElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.opacity = "0";
      htmlElement.style.transform = "translateY(32px) scale(0.97)";
      htmlElement.style.transition = "opacity 0.9s ease, transform 0.9s ease";
      observer.observe(htmlElement);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <header className={`lg-wrap nav-lg-wrap ${navbarClass}`} role="banner">
        <div className="lg-refract" />
        <div className="lg-body nav-lg-body">
          <a href="#" className="nav-logo" aria-label="VORA home">
            VOR<span>A</span>
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#" className="nav-link">
              Walkthrough
            </a>
            <a href="#about-wrap" className="nav-link">
              About
            </a>
            <a href="#services" className="nav-link">
              Services
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </nav>
          <a href="#contact" className="nav-enquire">
            Enquire
          </a>
        </div>
      </header>

      <PanoramicWalkthrough />

      <div id="sections-wrap">
        <div id="ticker" aria-hidden="true">
          <div className="t-track">
            <span className="t-item">Residential Design - </span>
            <span className="t-item">Commercial Spaces - </span>
            <span className="t-item">Furniture Curation - </span>
            <span className="t-item">Material Sourcing - </span>
            <span className="t-item">Lighting Design - </span>
            <span className="t-item">3D Visualisation - </span>
            <span className="t-item">Project Management - </span>
            <span className="t-item">Residential Design - </span>
            <span className="t-item">Commercial Spaces - </span>
            <span className="t-item">Furniture Curation - </span>
            <span className="t-item">Material Sourcing - </span>
            <span className="t-item">Lighting Design - </span>
            <span className="t-item">3D Visualisation - </span>
            <span className="t-item">Project Management - </span>
          </div>
        </div>

        <div id="about-wrap">
          <section id="about">
            <Tilt
              max={4}
              speed={600}
              perspective={1400}
              glare
              maxGlare={0.1}
              className="a-text-card"
            >
              <div className="a-text-card-refract" />
              <div className="a-text-card-body">
                <p className="a-tag">About the Studio</p>
                <h2 className="a-head">We design for the way you actually live.</h2>
                <p className="a-body">
                  VORA is a boutique interior design practice working across India.
                  We believe great spaces begin with listening - understanding how a
                  family moves, what light does to a room at six in the evening, and
                  which textures earn the right to stay. Every project is handled as
                  a bespoke commission from concept to handover.
                </p>
              </div>
            </Tilt>
          </section>
        </div>

        <section id="services">
          <div className="sv-head">
            <h2 className="sv-title">What we do</h2>
            <span className="sv-ct">03 Services</span>
          </div>
          <div className="sv-grid">
            <Tilt
              max={10}
              speed={500}
              perspective={900}
              glare
              maxGlare={0.15}
              scale={1.03}
              className="sv-card"
            >
              <div className="sv-card-refract" />
              <div className="sv-card-body">
                <div className="sv-num">01</div>
                <h3 className="sv-name">Residential</h3>
                <p className="sv-desc">
                  Full-service interior design for homes and penthouses - space
                  planning, material selection, procurement, and end-to-end
                  execution.
                </p>
              </div>
            </Tilt>

            <Tilt
              max={10}
              speed={500}
              perspective={900}
              glare
              maxGlare={0.15}
              scale={1.03}
              className="sv-card"
            >
              <div className="sv-card-refract" />
              <div className="sv-card-body">
                <div className="sv-num">02</div>
                <h3 className="sv-name">Commercial</h3>
                <p className="sv-desc">
                  Brand-aligned interiors for offices, retail, restaurants, and
                  hotels - designed to perform as well as they impress.
                </p>
              </div>
            </Tilt>

            <Tilt
              max={10}
              speed={500}
              perspective={900}
              glare
              maxGlare={0.15}
              scale={1.03}
              className="sv-card"
            >
              <div className="sv-card-refract" />
              <div className="sv-card-body">
                <div className="sv-num">03</div>
                <h3 className="sv-name">Consultation</h3>
                <p className="sv-desc">
                  A focused session on layout, palette, and styling. Expert
                  guidance for clients making decisions on their own terms.
                </p>
              </div>
            </Tilt>
          </div>

          <div id="stats">
            <Tilt
              max={8}
              speed={500}
              perspective={1000}
              glare
              maxGlare={0.12}
              className="stat-card"
            >
              <div className="stat-card-refract" />
              <div className="stat-card-body">
                <div className="stat-num">
                  180<span className="stat-unit">+</span>
                </div>
                <div className="stat-label">Projects Completed</div>
              </div>
            </Tilt>

            <Tilt
              max={8}
              speed={500}
              perspective={1000}
              glare
              maxGlare={0.12}
              className="stat-card"
            >
              <div className="stat-card-refract" />
              <div className="stat-card-body">
                <div className="stat-num">
                  12<span className="stat-unit"> yr</span>
                </div>
                <div className="stat-label">Years of Practice</div>
              </div>
            </Tilt>

            <Tilt
              max={8}
              speed={500}
              perspective={1000}
              glare
              maxGlare={0.12}
              className="stat-card"
            >
              <div className="stat-card-refract" />
              <div className="stat-card-body">
                <div className="stat-num">
                  3<span className="stat-unit"> cities</span>
                </div>
                <div className="stat-label">Delhi - Mumbai - Bangalore</div>
              </div>
            </Tilt>
          </div>
        </section>

        <section id="contact">
          <div className="contact-inner">
            <div className="contact-inner-refract" />
            <div className="contact-inner-body">
              <p className="ct-eye2">Start a conversation</p>
              <h2 className="ct-head">Tell us about your space.</h2>
              <form
                className="ct-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  alert("Thank you for your enquiry. We will get back to you shortly.");
                }}
              >
                <input type="text" placeholder="Your name" required />
                <input type="email" placeholder="Email address" required />
                <input
                  type="text"
                  placeholder="Project type - Residence / Office / Hospitality"
                  required
                />
                <textarea
                  placeholder="Tell us about the project - size, location, timeline, vision..."
                  required
                />
                <button type="submit" className="btn-send">
                  <div className="btn-send-refract" />
                  <div className="btn-send-body">Send Enquiry</div>
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-container">
            <div className="ft-main-row">
              <h2 className="ft-huge-logo">VORA</h2>
              <div className="ft-sub-grid">
                <div className="ft-sub-row">
                  <div className="ft-sub-left">
                    <span>BESPOKE.INTERIORS</span>
                    <span>STUDIO.</span>
                  </div>
                  <div className="ft-sub-right">
                    <span className="ft-bullet">*</span>
                    <span>BUILT BY CRAFTSMEN.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ft-bottom-row">
              <span>
                &copy; 2026 VORA. All Rights Reserved. Product of Vora Studio Pvt Ltd
              </span>
              <div className="ft-bottom-links">
                <a href="#">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
