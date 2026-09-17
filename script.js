/* ============================================================
   BIRTHDAY WEBSITE — script.js
   Created by SAMYE
   ============================================================ */

/* ============================================================
   ===== CUSTOMIZE HERE =====
   Change the friend's name and birthday message below.
   ============================================================ */
const FRIEND_NAME    = "Zinia Ahmed";   // Change the name here
const BIRTHDAY_MESSAGE = `Happy Birthday to one of the most amazing people in my life! ❤️

May your special day be filled with happiness, laughter,
beautiful memories, and everything your heart wishes for.

You deserve all the love, happiness, and success in the world.
Keep smiling, keep shining, and never stop being the wonderful
person you are.

May this new chapter of your life bring you countless beautiful
moments and unforgettable memories.

Happy Birthday once again! 🎂✨❤️`;
/* ============================================================
   ===== END CUSTOMIZATION =====
   ============================================================ */


document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     LOADING SCREEN
  ========================================================= */
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent   = document.getElementById('main-content');

  // Stagger letter animations
  const loaderLetters = document.querySelectorAll('.loader-text span');
  loaderLetters.forEach((span, i) => {
    span.style.animationDelay = `${0.05 * i}s`;
  });

  // Hide loader after 2.6s
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    document.body.style.overflow = '';
    startHeroAnimations();
  }, 2600);

  document.body.style.overflow = 'hidden'; // prevent scroll during load


  /* =========================================================
     FLOATING PARTICLES
  ========================================================= */
  const particlesContainer = document.getElementById('particles-container');
  const particleColors = [
    'rgba(255,110,180,0.6)',
    'rgba(168,85,247,0.5)',
    'rgba(96,165,250,0.5)',
    'rgba(255,255,255,0.4)',
    'rgba(251,191,36,0.4)',
  ];

  function createParticle() {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size  = Math.random() * 6 + 2;
    const left  = Math.random() * 100;
    const dur   = Math.random() * 12 + 8;
    const delay = Math.random() * 10;
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: ${color};
      box-shadow: 0 0 ${size * 2}px ${color};
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;
    particlesContainer.appendChild(p);
    setTimeout(() => p.remove(), (dur + delay) * 1000 + 500);
  }

  // Create initial batch
  for (let i = 0; i < 20; i++) {
    setTimeout(createParticle, Math.random() * 3000);
  }
  // Keep spawning
  setInterval(createParticle, 800);


  /* =========================================================
     MUSIC
  ========================================================= */
  const audio        = document.getElementById('bg-music');
  const musicBtn     = document.getElementById('music-btn');
  const musicIcon    = document.getElementById('music-icon');
  const musicLabel   = document.getElementById('music-label');
  const autoplayNote = document.getElementById('autoplay-notice');

  let musicPlaying = false;
  let userInteracted = false;

  function startMusic() {
    audio.play()
      .then(() => {
        musicPlaying = true;
        updateMusicBtn();
        autoplayNote.classList.remove('show');
      })
      .catch(() => {
        // Autoplay blocked
        autoplayNote.classList.add('show');
      });
  }

  function updateMusicBtn() {
    if (musicPlaying) {
      musicIcon.textContent  = '🎵';
      musicLabel.textContent = 'Music On';
    } else {
      musicIcon.textContent  = '🔇';
      musicLabel.textContent = 'Music Off';
    }
  }

  // Try autoplay on load
  setTimeout(startMusic, 2800);

  // On first user interaction
  function handleFirstInteraction() {
    if (!userInteracted) {
      userInteracted = true;
      if (!musicPlaying) {
        startMusic();
      }
    }
  }

  document.addEventListener('click',      handleFirstInteraction, { once: false });
  document.addEventListener('touchstart', handleFirstInteraction, { once: false });
  document.addEventListener('keydown',    handleFirstInteraction, { once: false });

  // Music toggle button
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (musicPlaying) {
      audio.pause();
      musicPlaying = false;
    } else {
      audio.play().then(() => { musicPlaying = true; }).catch(() => {});
    }
    updateMusicBtn();
  });


  /* =========================================================
     HERO ANIMATIONS (called after loading screen hides)
  ========================================================= */
  function startHeroAnimations() {
    // Wish lines stagger
    const wishLines = document.querySelectorAll('.wish-line');
    wishLines.forEach((line, i) => {
      setTimeout(() => line.classList.add('visible'), 400 + i * 300);
    });
  }


  /* =========================================================
     SCROLL REVEAL — IntersectionObserver
  ========================================================= */
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // When message section is visible, start typing
        if (entry.target.id === 'typed-message' || entry.target.closest('#message-section')) {
          triggerTyping();
        }
        // Wish lines
        if (entry.target.closest('#wish-section')) {
          const wishLines = document.querySelectorAll('.wish-line');
          wishLines.forEach((line, i) => {
            setTimeout(() => line.classList.add('visible'), i * 300);
          });
        }
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  // Also observe message card specifically
  const messageCard = document.querySelector('.message-card');
  if (messageCard) {
    const msgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerTyping();
          msgObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    msgObserver.observe(messageCard);
  }


  /* =========================================================
     TYPING ANIMATION
  ========================================================= */
  const typedEl    = document.getElementById('typed-message');
  const signatureEl = document.querySelector('.message-signature');
  let typingStarted = false;

  function triggerTyping() {
    if (typingStarted) return;
    typingStarted = true;

    typedEl.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.classList.add('typed-cursor');
    typedEl.appendChild(cursor);

    const text  = BIRTHDAY_MESSAGE;
    let index   = 0;
    const speed = 22; // ms per character — adjust for speed

    function typeChar() {
      if (index < text.length) {
        cursor.before(document.createTextNode(text[index]));
        index++;
        setTimeout(typeChar, speed);
      } else {
        // Remove cursor
        setTimeout(() => {
          cursor.remove();
          if (signatureEl) signatureEl.classList.add('visible');
        }, 600);
      }
    }

    setTimeout(typeChar, 300);
  }


  /* =========================================================
     HERO BUTTON — scroll to message
  ========================================================= */
  const openSurpriseBtn = document.getElementById('open-surprise-btn');
  if (openSurpriseBtn) {
    openSurpriseBtn.addEventListener('click', () => {
      const messageSection = document.getElementById('message-section');
      if (messageSection) {
        messageSection.scrollIntoView({ behavior: 'smooth' });
      }
      launchSmallConfetti(30);
      launchFlyingHearts(6);
    });
  }


  /* =========================================================
     MAKE A WISH BUTTON
  ========================================================= */
  const wishBtn    = document.getElementById('wish-btn');
  const wishResult = document.getElementById('wish-result');
  const wishCandles = document.querySelectorAll('.wish-flame');
  const wishCake   = document.getElementById('wish-cake');
  let   wishMade   = false;

  if (wishBtn) {
    wishBtn.addEventListener('click', () => {
      if (wishMade) return;
      wishMade = true;
      wishBtn.disabled = true;

      // Blow out candles one by one
      wishCandles.forEach((flame, i) => {
        setTimeout(() => {
          flame.classList.add('out');
        }, i * 150 + 100);
      });

      // Cake celebration animation
      setTimeout(() => {
        wishCake.style.animation = 'none';
        wishCake.style.transform = 'scale(1.1)';
        setTimeout(() => {
          wishCake.style.transform = '';
          wishCake.style.animation = '';
        }, 300);

        // Show result
        wishResult.classList.add('show');

        // Launch effects
        launchConfetti(80);
        launchFlyingHearts(12);

      }, wishCandles.length * 150 + 400);
    });
  }


  /* =========================================================
     CELEBRATE AGAIN BUTTON
  ========================================================= */
  const celebrateBtn = document.getElementById('celebrate-btn');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      launchConfetti(120);
      launchFlyingHearts(20);

      // Celebrate final section animation
      const finalInner = document.querySelector('.final-inner');
      if (finalInner) {
        finalInner.style.transform = 'scale(1.02)';
        finalInner.style.transition = 'transform 0.3s ease';
        setTimeout(() => { finalInner.style.transform = ''; }, 400);
      }

      // Scroll to top after a brief pause
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 900);
    });
  }


  /* =========================================================
     CONFETTI SYSTEM
  ========================================================= */
  const confettiContainer = document.getElementById('confetti-container');
  const confettiColors = [
    '#ff6eb4', '#c084fc', '#60a5fa', '#fde047',
    '#f0abfc', '#34d399', '#fb923c', '#ffffff',
    '#f472b6', '#818cf8', '#a78bfa', '#fbbf24',
  ];
  const confettiShapes = ['circle', 'rect', 'star'];

  function launchConfetti(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => createConfettiPiece(), Math.random() * 800);
    }
  }

  function launchSmallConfetti(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => createConfettiPiece(), Math.random() * 500);
    }
  }

  function createConfettiPiece() {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');

    const color   = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const size    = Math.random() * 10 + 6;
    const left    = Math.random() * 100;
    const dur     = Math.random() * 2.5 + 1.5;
    const delay   = 0;
    const shape   = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];

    piece.style.cssText = `
      left: ${left}%;
      top: -20px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${shape === 'circle' ? '50%' : shape === 'star' ? '0' : '2px'};
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      box-shadow: 0 0 4px ${color};
      transform-origin: center;
    `;

    confettiContainer.appendChild(piece);
    setTimeout(() => piece.remove(), (dur + 0.5) * 1000);
  }


  /* =========================================================
     FLYING HEARTS
  ========================================================= */
  const heartEmojis = ['💖', '💕', '❤️', '💗', '💓', '💞', '🌸', '✨'];

  function launchFlyingHearts(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => createFlyingHeart(), Math.random() * 1000);
    }
  }

  function createFlyingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('fly-heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    const left = Math.random() * 90 + 5;
    const bottom = Math.random() * 40;
    const dur  = Math.random() * 1 + 1.5;
    const size = Math.random() * 14 + 18;

    heart.style.cssText = `
      left: ${left}vw;
      bottom: ${bottom}vh;
      font-size: ${size}px;
      animation-duration: ${dur}s;
    `;

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), dur * 1000 + 200);
  }


  /* =========================================================
     WISH SECTION — observe wish lines
  ========================================================= */
  const wishSection = document.getElementById('wish-section');
  if (wishSection) {
    const wishObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lines = document.querySelectorAll('.wish-line');
          lines.forEach((line, i) => {
            setTimeout(() => line.classList.add('visible'), i * 350);
          });
          wishObserver.disconnect();
        }
      });
    }, { threshold: 0.25 });
    wishObserver.observe(wishSection);
  }

}); // End DOMContentLoaded
