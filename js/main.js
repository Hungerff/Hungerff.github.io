document.addEventListener('DOMContentLoaded', function() {

  initNavigation();
  initScrollAnimations();
  initRetroMode();

  if (document.querySelector('.gallery-section')) {
    initGallery();
  }
});

function initNavigation() {
  const currentLocation = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');

    if (currentLocation.includes(linkPath) && linkPath !== '../index.html' && linkPath !== 'index.html') {
      link.classList.add('active');
    } else if (currentLocation.endsWith('/') && (linkPath === 'index.html' || linkPath === '../index.html')) {
      link.classList.add('active');
    }

    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });

    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

function initScrollAnimations() {

  const revealElements = document.querySelectorAll('.card, .timeline-item, .gallery-item, .server-card');

  function checkScroll() {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 50) {
        element.classList.add('visible');
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  }

  revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  window.addEventListener('scroll', checkScroll);
  window.addEventListener('resize', checkScroll);

  checkScroll();
}

function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.querySelector('.gallery-modal');
  const modalImg = document.querySelector('.modal-content');
  const captionText = document.querySelector('.modal-caption');
  const closeModal = document.querySelector('.close-modal');
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (!modal || !modalImg) {
    console.error('Gallery modal elements not found');
    return;
  }

  const style = document.createElement('style');
  style.textContent = `

    .gallery-modal {
      display: none;
      position: fixed;
      z-index: 9999; 
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      transition: opacity 0.3s ease;
      opacity: 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .gallery-modal.show {
      opacity: 1;
    }

    body:not(.retro) .gallery-modal {
      background-color: rgba(0, 0, 0, 0.95);
    }

    body:not(.retro) .modal-content {
      display: block;
      max-width: 80%;
      max-height: 70vh;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      transform: scale(0.95);
      transition: transform 0.3s ease;
      margin-bottom: 20px;
      z-index: 10000;
    }

    body:not(.retro) .gallery-modal.show .modal-content {
      transform: scale(1);
    }

    body:not(.retro) .modal-caption {
      color: white;
      text-align: center;
      padding: 12px 20px;
      width: 80%;
      max-width: 600px;
      margin: 0 auto;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 4px;
      z-index: 10000;
    }

    body:not(.retro) .modal-caption h3 {
      margin-top: 0;
      margin-bottom: 8px;
      color: white;
      font-size: 18px;
    }

    body:not(.retro) .modal-caption p {
      margin: 0;
      font-size: 16px;
      line-height: 1.4;
    }

    body:not(.retro) .close-modal {
      position: absolute;
      top: 20px;
      right: 30px;
      color: white;
      font-size: 40px;
      font-weight: bold;
      cursor: pointer;
      z-index: 10001;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    body:not(.retro) .close-modal:hover {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .modal-content {
        max-width: 90%;
        max-height: 60vh;
      }

      .modal-caption {
        width: 90%;
        padding: 10px;
      }

      .modal-caption h3 {
        font-size: 16px;
      }

      .modal-caption p {
        font-size: 14px;
      }
    }
  `;
  document.head.appendChild(style);

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {

      filterButtons.forEach(btn => btn.classList.remove('active'));

      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  galleryItems.forEach(item => {
    item.style.cursor = 'pointer';

    item.addEventListener('click', () => {

      const img = item.querySelector('img');
      if (img) {
        modalImg.src = img.src;

        const tempImg = new Image();
        tempImg.src = img.src;
        tempImg.onload = () => {

          modal.style.display = 'flex';

          document.body.appendChild(modal);

          void modal.offsetWidth;

          modal.classList.add('show');
        };
      }

      const overlay = item.querySelector('.gallery-overlay');
      if (overlay && captionText) {
        const title = overlay.querySelector('h3');
        const desc = overlay.querySelector('p');

        let captionHTML = '';
        if (title) captionHTML += `<h3>${title.textContent}</h3>`;
        if (desc) captionHTML += `<p>${desc.textContent}</p>`;

        captionText.innerHTML = captionHTML;
      }
    });
  });

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      closeModalFunction();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModalFunction();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModalFunction();
    }
  });

  function closeModalFunction() {
    modal.classList.remove('show');

    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }

  modal.style.display = 'none';
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

function setThemeColors(primary, secondary, accent) {
  document.documentElement.style.setProperty('--primary-color', primary);
  document.documentElement.style.setProperty('--secondary-color', secondary);
  document.documentElement.style.setProperty('--accent-color', accent);
}

function initRetroMode() {
  const header = document.querySelector('header');
  if (!header) return;

  const retroToggleButton = document.createElement('button');
  retroToggleButton.classList.add('retro-toggle');
  retroToggleButton.innerHTML = '💾 Retro Mode';
  retroToggleButton.style.position = 'fixed';
  retroToggleButton.style.top = '15px';
  retroToggleButton.style.right = '15px';
  retroToggleButton.style.zIndex = '1000';
  retroToggleButton.style.padding = '8px 15px';
  retroToggleButton.style.backgroundColor = 'var(--card-bg)';
  retroToggleButton.style.color = 'var(--text-color)';
  retroToggleButton.style.border = '1px solid var(--border-color)';
  retroToggleButton.style.borderRadius = 'var(--border-radius-sm)';
  retroToggleButton.style.cursor = 'pointer';
  retroToggleButton.style.fontWeight = 'bold';
  retroToggleButton.style.boxShadow = 'var(--shadow-soft)';
  retroToggleButton.style.transition = 'all 0.3s ease';

  document.body.appendChild(retroToggleButton);

  retroToggleButton.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px)';
    this.style.boxShadow = '0 7px 14px rgba(0, 0, 0, 0.25)';
  });

  retroToggleButton.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = 'var(--shadow-soft)';
  });

  retroToggleButton.addEventListener('click', toggleRetroMode);

  function toggleRetroMode() {
    const body = document.body;

    if (body.classList.contains('retro')) {
      body.classList.remove('retro');
      retroToggleButton.innerHTML = '💾 Retro Mode';

      const retroElements = document.querySelectorAll('.retro-element');
      retroElements.forEach(el => el.remove());

      const main = document.querySelector('main');
      if (main) {
        main.style.backgroundImage = '';
      }

      const styleElements = document.querySelectorAll('[style]');
      styleElements.forEach(el => {

        if (!el.classList.contains('retro-toggle')) {
          el.removeAttribute('style');
        }
      });

      localStorage.setItem('retroMode', 'off');
    } else {
      body.classList.add('retro');
      retroToggleButton.innerHTML = '🔄 Modern Mode';

      const existingRetroElements = document.querySelectorAll('.retro-element');
      existingRetroElements.forEach(el => el.remove());

      addRetroElements();
      localStorage.setItem('retroMode', 'on');
    }

    updateRetroSpecificElements();
  }

  function updateRetroSpecificElements() {

    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      galleryItems.forEach(item => {

        void item.offsetWidth;
      });
    }

    const timeline = document.querySelector('.timeline');
    if (timeline) {

      void timeline.offsetWidth;

      const timelineItems = document.querySelectorAll('.timeline-item');
      timelineItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'none';

        void item.offsetWidth;
      });

      const timelineContents = document.querySelectorAll('.timeline-content');
      timelineContents.forEach(content => {

        void content.offsetWidth;
      });

      const timelineIcons = document.querySelectorAll('.timeline-icon');
      timelineIcons.forEach(icon => {
        icon.style.opacity = '1';
        void icon.offsetWidth;
      });

      const currentScroll = window.scrollY;
      window.scrollTo(0, currentScroll + 1);
      setTimeout(() => window.scrollTo(0, currentScroll), 10);
    }
  }

  function addRetroElements() {
    const container = document.querySelector('.container');
    if (!container) return;

    const footer = document.querySelector('footer');
    const main = document.querySelector('main');

    const marquee = document.createElement('div');
    marquee.classList.add('marquee', 'retro-element');
    marquee.innerHTML = '<span>Welcome to my awesome website! This site is best viewed in Netscape Navigator 4.0 or Internet Explorer 5.0 at 800x600 resolution.</span>';
    container.insertBefore(marquee, container.firstChild);

    const topDivider = document.createElement('div');
    topDivider.classList.add('retro-divider', 'retro-element');
    if (main) {
      main.parentNode.insertBefore(topDivider, main);
    }

    const counter = document.createElement('div');
    counter.classList.add('retro-counter', 'retro-element');
    counter.innerHTML = `
      <div>YOU ARE VISITOR #<span class="blink">1337</span></div>
      <div>SINCE 10-28-1996</div>
    `;

    const guestbook = document.createElement('div');
    guestbook.classList.add('retro-guestbook', 'retro-element');
    guestbook.innerHTML = `
      <h3>SIGN MY GUESTBOOK</h3>
      <input type="text" placeholder="Your name">
      <input type="text" placeholder="Your message">
      <button>Sign!</button>
      <div class="retro-guestbook-entries">
        <div>Radical_BMX_k1d: fire website dawgg!</div>
        <div>Qu1ckscoper999: First!!1!</div>
        <div>CrazyEvilHacker: I can see your IP address..... its 192.168.0.1</div>
      </div>
    `;

    const madeWith = document.createElement('div');
    madeWith.classList.add('retro-element');
    madeWith.style.textAlign = 'center';
    madeWith.style.margin = '20px 0';
    madeWith.innerHTML = `
      <div style="font-size: 11px; color: #ffff00; margin-bottom: 3px;">MADE WITH:</div>
      <div style="display: flex; justify-content: center; gap: 5px; margin-top: 2px;">
        <span style="font-size: 10px; background-color: #c0c0c0; border: 1px outset #ffffff; padding: 2px 4px; color: #000000;">NOTEPAD</span>
        <span style="font-size: 10px; background-color: #c0c0c0; border: 1px outset #ffffff; padding: 2px 4px; color: #000000;">FRONTPAGE</span>
      </div>
    `;

    const bottomDivider = document.createElement('div');
    bottomDivider.classList.add('retro-divider', 'retro-element');

    if (footer) {
      footer.parentNode.insertBefore(counter, footer);
      footer.parentNode.insertBefore(guestbook, footer);
      footer.parentNode.insertBefore(madeWith, footer);
      footer.parentNode.insertBefore(bottomDivider, footer);
    }

    const guestbookButton = guestbook.querySelector('button');
    if (guestbookButton) {
      guestbookButton.addEventListener('click', function() {
        const nameInput = guestbook.querySelector('input:first-of-type');
        const messageInput = guestbook.querySelector('input:last-of-type');
        const entriesDiv = guestbook.querySelector('.retro-guestbook-entries');

        if (nameInput.value && messageInput.value && entriesDiv) {
          const newEntry = document.createElement('div');
          newEntry.textContent = `${nameInput.value}: ${messageInput.value}`;
          entriesDiv.insertBefore(newEntry, entriesDiv.firstChild);

          nameInput.value = '';
          messageInput.value = '';
        }
      });
    }

    let visitorCount = 1337;
    const visitorSpan = counter.querySelector('span');
    if (visitorSpan) {
      setInterval(function() {
        visitorCount++;
        visitorSpan.textContent = visitorCount;
      }, 30000); 
    }

    if (main) {
      main.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAPklEQVQYV2NkIBIwEqkOTUECEMgDMZqkApCmQpyKkRVCTQCbtPvwGRQnQRRCFeMyhKAinAqRFYLjH5cLoEYAANJhDkFQ5L/TAAAAAElFTkSuQmCC')";
    }
  }

  const savedRetroMode = localStorage.getItem('retroMode');
  if (savedRetroMode === 'on') {
    toggleRetroMode();
  }
}