/**
 * ==========================================================================
 * One Retro Game Launcher (ORGL) - Vanilla JavaScript Interactive Controller
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Mobile Navigation Hamburger Menu
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      const isActive = hamburgerBtn.classList.toggle('is-active');
      navLinks.classList.toggle('is-active');
      hamburgerBtn.setAttribute('aria-expanded', isActive);
    });

    // Close mobile nav when clicking any nav link
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('is-active');
        navLinks.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('is-active') &&
          !navLinks.contains(e.target) &&
          !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove('is-active');
        navLinks.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Navbar Sticky & ScrollSpy Active Navigation
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Sticky navbar shadow
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }

    // ScrollSpy active link detection
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Video Player Controller
  // --------------------------------------------------------------------------
  const introVideo = document.getElementById('intro-video');
  const videoOverlay = document.getElementById('video-overlay');

  if (videoOverlay && introVideo) {
    videoOverlay.addEventListener('click', () => {
      videoOverlay.style.display = 'none';
      introVideo.play().catch(err => {
        console.log('Video play prevented or empty file:', err);
      });
    });

    introVideo.addEventListener('pause', () => {
      videoOverlay.style.display = 'flex';
    });
  }

  // --------------------------------------------------------------------------
  // 5. Screenshots Carousel Controller
  // --------------------------------------------------------------------------
  const carouselTrack = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');
  const slides = document.querySelectorAll('.screenshot-slide');

  if (carouselTrack && slides.length > 0) {
    // Generate pagination dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = `dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('data-index', idx);
      dot.addEventListener('click', () => scrollToSlide(idx));
      if (dotsContainer) dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

    function getNearestSlideIndex() {
      const trackLeft = carouselTrack.scrollLeft;
      let nearest = 0;
      let nearestDist = Infinity;
      slides.forEach((slide, idx) => {
        const dist = Math.abs(slide.offsetLeft - trackLeft);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = idx;
        }
      });
      return nearest;
    }

    function scrollToSlide(index) {
      if (slides[index]) {
        carouselTrack.scrollTo({
          left: slides[index].offsetLeft,
          behavior: 'smooth'
        });
      }
    }

    function updateActiveDot() {
      const currentIndex = getNearestSlideIndex();
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    carouselTrack.addEventListener('scroll', updateActiveDot, { passive: true });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        scrollToSlide(Math.max(0, getNearestSlideIndex() - 1));
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        scrollToSlide(Math.min(slides.length - 1, getNearestSlideIndex() + 1));
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. Universal Lightbox Modal (Screenshots & Real World Photos)
  // --------------------------------------------------------------------------
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  // Collect all lightbox triggers across screenshots & gallery
  const galleryItems = [];

  // Register Screenshot slides (one lightbox entry per image)
  document.querySelectorAll('.screenshot-slide').forEach((slide, idx) => {
    const title = slide.querySelector('.slide-title')?.textContent || `Screenshot ${idx + 1}`;
    const sub = slide.querySelector('.slide-subtitle')?.textContent || '';
    const imgs = slide.querySelectorAll('.phone-screen img');

    imgs.forEach((img) => {
      const caption = img.getAttribute('data-caption') || `${title} - ${sub}`;
      const itemData = {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || title,
        title: caption,
        group: 'screenshots'
      };
      const galleryIndex = galleryItems.length;
      galleryItems.push(itemData);

      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(galleryIndex);
      });
    });

    // Keep whole-slide click for single-image slides
    if (imgs.length === 1) {
      slide.addEventListener('click', () => {
        const firstIdx = galleryItems.findIndex(item => item.src === imgs[0].getAttribute('src'));
        if (firstIdx >= 0) openLightbox(firstIdx);
      });
    }
  });

  // Register Gallery photos
  document.querySelectorAll('.gallery-card').forEach((card, idx) => {
    const img = card.querySelector('img');
    const deviceName = card.querySelector('.gallery-device-name')?.textContent || `Device Photo ${idx + 1}`;
    if (img) {
      const itemData = {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || deviceName,
        title: `Runs on ${deviceName}`,
        group: 'gallery'
      };
      const galleryIndex = galleryItems.length;
      galleryItems.push(itemData);

      card.addEventListener('click', () => openLightbox(galleryIndex));
    }
  });

  let currentGalleryIdx = 0;

  function openLightbox(index) {
    if (index >= 0 && index < galleryItems.length && lightbox) {
      currentGalleryIdx = index;
      const item = galleryItems[index];

      if (lightboxImg) {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
      }
      if (lightboxCaption) {
        lightboxCaption.textContent = item.title;
      }

      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function navigateLightbox(direction) {
    let newIndex = currentGalleryIdx + direction;
    if (newIndex < 0) newIndex = galleryItems.length - 1;
    if (newIndex >= galleryItems.length) newIndex = 0;
    openLightbox(newIndex);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lbPrev) {
    lbPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
  }

  if (lbNext) {
    lbNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }

  if (lightbox) {
    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-box')) {
        closeLightbox();
      }
    });

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Scroll Reveal Observer (Respects prefers-reduced-motion)
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.step-card, .feature-card, .gallery-card, .download-cta-box, .author-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      revealObserver.observe(el);
    });

    // Custom reveal callback when element gains .revealed
    const style = document.createElement('style');
    style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
  }

  // --------------------------------------------------------------------------
  // 8. Google Play Closed Beta Dialog
  // --------------------------------------------------------------------------
  const playStoreModal = document.getElementById('play-store-modal');
  const playStoreEmailBtn = document.getElementById('play-store-email-btn');
  const playStoreTriggers = document.querySelectorAll('.js-play-store-trigger');
  const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.sayemshafayet.onereogamelauncher';
  const BETA_REQUEST_EMAIL = 'collab@sayemshafayet.com';

  function buildBetaMailto() {
    const subject = 'ORGL Google Play Closed Beta Access Request';
    const body = [
      'Hello, ',
      '',
      'I would like to request access to the One Retro Game Launcher (ORGL) closed beta on Google Play. ',
      '',
      'Thank you!'
    ].join('\n');

    return `mailto:${BETA_REQUEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function openPlayStoreModal() {
    if (!playStoreModal) return;
    playStoreModal.classList.add('is-open');
    playStoreModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playStoreModal.querySelector('.dialog-close-btn')?.focus();
  }

  function closePlayStoreModal() {
    if (!playStoreModal) return;
    playStoreModal.classList.remove('is-open');
    playStoreModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (playStoreEmailBtn) {
    playStoreEmailBtn.href = buildBetaMailto();
  }

  playStoreTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openPlayStoreModal();
    });
  });

  if (playStoreModal) {
    playStoreModal.querySelectorAll('[data-dialog-close]').forEach((el) => {
      el.addEventListener('click', closePlayStoreModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && playStoreModal.classList.contains('is-open')) {
        closePlayStoreModal();
      }
    });
  }

  console.log('ORGL Website script initialized successfully.');
});
