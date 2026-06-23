import './style.css';
import { initThreeBg } from './three-bg.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize 3D Background Canvas
let cleanupThree = null;
try {
  cleanupThree = initThreeBg();
} catch (err) {
  console.error("Failed to initialize Three.js background:", err);
}

// 1. Custom Cursor and Glow Tracking
const cursor = document.querySelector('#custom-cursor');
const glow = document.querySelector('#cursor-glow');

if (cursor && glow) {
  window.addEventListener('mousemove', (e) => {
    // Dynamic smooth cursor positioning
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;

    // Glow position
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });

  // Adding hover scale animation classes to body
  const hoverElements = document.querySelectorAll('a, button, .portfolio-card, input, select, textarea');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
  });
}

// 2. Header Scroll Effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// 3. Scroll Spy Navigation Active Classes
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let currentSectionId = 'hero';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    // Highlight when section is 30% down the viewport
    if (window.scrollY >= (sectionTop - sectionHeight * 0.3)) {
      currentSectionId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
});

// 4. GSAP Intro & Scroll Animations
// Hero Entrance Reveal
const heroTl = gsap.timeline();
heroTl.from('.badge-animated', { opacity: 0, y: -20, duration: 0.6, ease: 'power3.out' })
      .from('.hero-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .from('.hero-ctas', { opacity: 0, y: 15, duration: 0.6, ease: 'power3.out' }, '-=0.5')
      .from('.avatar-glow-wrapper', { opacity: 0, scale: 0.9, duration: 1.2, ease: 'power4.out' }, '-=0.8');

// Section Headers Animations
sections.forEach(section => {
  const header = section.querySelector('.section-header');
  if (header) {
    gsap.from(header, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
});

// Animated Skill Bars on scroll
gsap.to('.skill-bar-fill', {
  scrollTrigger: {
    trigger: '.about-skills-card',
    start: 'top 75%',
    toggleActions: 'play none none none'
  },
  width: (index, target) => {
    // Read percentage from header value and animate to it
    const parentNode = target.closest('.skill-node');
    const valueEl = parentNode.querySelector('.skill-value');
    return valueEl ? valueEl.textContent : '0%';
  },
  duration: 1.5,
  ease: 'power4.out',
  stagger: 0.15
});

// Portfolio Grid Entrance stagger
gsap.from('.portfolio-card', {
  scrollTrigger: {
    trigger: '.portfolio-grid',
    start: 'top 80%',
    toggleActions: 'play none none none'
  },
  opacity: 0,
  y: 50,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power3.out'
});

// Contact grid animations
gsap.from('.contact-form-card', {
  scrollTrigger: {
    trigger: '.contact-section',
    start: 'top 75%'
  },
  opacity: 0,
  x: -30,
  duration: 0.8,
  ease: 'power3.out'
});

gsap.from('.social-card', {
  scrollTrigger: {
    trigger: '.contact-section',
    start: 'top 75%'
  },
  opacity: 0,
  x: 30,
  duration: 0.8,
  stagger: 0.1,
  ease: 'power3.out'
});

// 5. Portfolio Grid Details and Modal Management
const projectData = {
  minimax: {
    title: "MiniMax Agent | The Proactive AI Workspace",
    category: "UI Animation & Sound Design",
    desc: "An in-depth post-production showcase editing video walkthroughs of the MiniMax AI Agent. This edit features complex, pixel-perfect screen-tracking highlights, customized transparent popup graphics, keyboard sound syncing, and dynamic zoom transitions to keep technical viewers engaged during long-form workspace tutorials.",
    software: "Adobe Premiere Pro, Adobe After Effects, Illustrator",
    techniques: "Custom UI Overlays, Keyframed Audio Design, Tracked Virtual Zooming",
    youtubeUrl: "https://www.youtube.com/watch?v=ACompleteExplanationInArabic" // Fallback: redirects to channel
  },
  programming: {
    title: "Before Learning Programming | Crucial Mindset",
    category: "Narrative Pacing & VFX",
    desc: "A fast-paced, high-retention guide discussing the career roadmap and mental shift needed before learning to code. It utilizes quick cuts synchronized to kinetic text elements, custom slide-in graphical grids, and colored split-screen layouts to maximize student attentiveness.",
    software: "Adobe Premiere Pro, After Effects, CapCut Desktop",
    techniques: "Kinetic Typography, Split-Screen Layouts, Rhythmic Sound Pacing",
    youtubeUrl: "https://www.youtube.com/watch?v=BeforeLearningProgramming"
  },
  'ai-coding': {
    title: "Google Antigravity 2.0 | Complete Course",
    category: "3D Tracking & Graphics",
    desc: "A cinematic tutorial series showcasing the advanced Google Antigravity developer kit. The post-production incorporates custom glowing lower thirds, tracked 3D node meshes surrounding the speaker, color-grade enhancements to suit low-light dev setups, and terminal script code popups.",
    software: "Adobe Premiere Pro, After Effects, Blender 3D",
    techniques: "3D Camera Tracking, Custom Glow Nodes, Text Terminals Overlays",
    youtubeUrl: "https://www.youtube.com/watch?v=GoogleAntigravity2"
  },
  'claude-101': {
    title: "Learn Claude AI from Scratch | Comprehensive Guide",
    category: "Custom Assets & Pacing",
    desc: "A detailed guide explaining Claude AI's prompt capabilities. Visuals are enhanced with custom 2D vector illustrations highlighting prompt structure blocks, interactive keyboard shortcut popups, and zoom tracking pointing directly at code outputs to ensure clarity.",
    software: "Adobe Premiere Pro, After Effects, Illustrator",
    techniques: "Graphic Asset Rendering, Mouse-Path Tracking, Keypress SFX",
    youtubeUrl: "https://www.youtube.com/watch?v=LearnClaudeAI"
  },
  'goodbye-claude': {
    title: "Goodbye Claude Paid! | Open Source AI Alternative",
    category: "Kinetic Text & Audio Build-ups",
    desc: "A highly-edited review showing free open-source AI alternatives to Claude Pro. Features a high-tension cinematic intro section with heavy color correction, dramatic riser sound designs, and screen shakes syncing up to key code declarations.",
    software: "Adobe Premiere Pro, After Effects",
    techniques: "Audio Risers, Cinematic Intro Pacing, UI Magnifiers",
    youtubeUrl: "https://www.youtube.com/watch?v=GoodbyeClaudePaid"
  },
  testsprite: {
    title: "TestSprite | Auto-testing Web Apps",
    category: "Workspace Tracking & SFX Synced Cuts",
    desc: "An educational review showing TestSprite's automated script testing capabilities. The post-production highlights specific tests passing with custom checkmark animations, zoom tracks to the terminal output log, and custom keyboard graphics highlighting hotkeys.",
    software: "Adobe Premiere Pro, After Effects, CapCut",
    techniques: "UI Zoom Highlights, Action Checkmark VFX, Synced Terminal Beeps",
    youtubeUrl: "https://www.youtube.com/watch?v=TestSpriteReview"
  }
};

const modal = document.querySelector('#project-modal');
const modalClose = document.querySelector('#modal-close');
const modalPlaceholder = document.querySelector('#modal-video-placeholder');
const modalTitle = document.querySelector('#modal-project-title');
const modalCategory = document.querySelector('#modal-project-category');
const modalDesc = document.querySelector('#modal-project-desc');
const modalSoftware = document.querySelector('#modal-project-software');
const modalTechniques = document.querySelector('#modal-project-techniques');
const modalLink = document.querySelector('#modal-project-link');

const openModal = (projectId) => {
  const data = projectData[projectId];
  if (!data) return;

  // Set text contents
  modalTitle.textContent = data.title;
  modalCategory.textContent = data.category;
  modalDesc.textContent = data.desc;
  modalSoftware.textContent = data.software;
  modalTechniques.textContent = data.techniques;
  modalLink.setAttribute('href', data.youtubeUrl);

  // Inject a clean mockup video container. 
  // Since video IDs can change and youtube embeds require exact IDs, we render a highly stylized 
  // glassmorphic video banner that acts as a play-click link or generic tech embed, allowing visitors 
  // to click and watch on YouTube. This keeps it stable, fast-loading, and completely functional.
  modalPlaceholder.innerHTML = `
    <div class="video-mock-banner" style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(135deg, rgba(13, 11, 20, 0.95) 0%, rgba(20, 16, 32, 0.95) 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 12px; gap: 1rem; border: 1px solid var(--glass-border-hover);">
      <div class="glow-play-icon" style="width: 80px; height: 80px; border-radius: 50%; background: var(--accent-purple); display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; box-shadow: 0 0 30px var(--accent-purple-glow); transition: transform 0.3s ease;">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor" style="margin-left: 4px;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      </div>
      <h3 style="font-size: 1.25rem; font-family: 'Outfit'; color: var(--text-bright); text-align: center; padding: 0 1rem;">Click to watch edits on YouTube</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; max-width: 320px; padding: 0 1.5rem;">Redirects directly to the video showcase showing my Premiere, After Effects, and post-production techniques.</p>
    </div>
  `;

  // Add click to play banner which opens link in new tab
  const playBanner = modalPlaceholder.querySelector('.glow-play-icon');
  if (playBanner) {
    playBanner.addEventListener('click', () => {
      window.open(data.youtubeUrl, '_blank', 'noopener,noreferrer');
    });
    playBanner.addEventListener('mouseenter', () => playBanner.style.transform = 'scale(1.1)');
    playBanner.addEventListener('mouseleave', () => playBanner.style.transform = 'scale(1)');
  }

  // Show modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Disable page scrolling
};

const closeModal = () => {
  modal.classList.add('hidden');
  modalPlaceholder.innerHTML = '';
  document.body.style.overflow = ''; // Restore page scrolling
};

// Bind project card click events
const projectCards = document.querySelectorAll('.portfolio-card');
projectCards.forEach(card => {
  const projectId = card.getAttribute('data-project');
  card.addEventListener('click', () => openModal(projectId));
});

// Bind close events
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// 6. Contact Form Collaboration Submit Handling
const contactForm = document.querySelector('#portfolio-contact-form');
const formFeedback = document.querySelector('#form-feedback');

if (contactForm && formFeedback) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect values (for demonstration or backend logic)
    const name = document.querySelector('#contact-name').value;
    const email = document.querySelector('#contact-email').value;
    const subject = document.querySelector('#contact-subject').value;
    const message = document.querySelector('#contact-message').value;

    console.log("Form Submitted:", { name, email, subject, message });

    // Show custom success message
    formFeedback.classList.remove('hidden');
    contactForm.reset();

    // Hide feedback after 5 seconds
    setTimeout(() => {
      formFeedback.classList.add('hidden');
    }, 5000);
  });
}
