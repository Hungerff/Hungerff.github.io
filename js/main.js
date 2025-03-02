document.addEventListener('DOMContentLoaded', function() {
  // Initialize common functionality across all pages
  initNavigation();
  initScrollAnimations();

  // Page-specific initializations
  if (document.querySelector('.gallery-section')) {
    initGallery();
  }
});

// Handle active navigation states
function initNavigation() {
  const currentLocation = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    // Check if the current path includes the link path
    if (currentLocation.includes(linkPath) && linkPath !== '../index.html' && linkPath !== 'index.html') {
      link.classList.add('active');
    } else if (currentLocation.endsWith('/') && (linkPath === 'index.html' || linkPath === '../index.html')) {
      link.classList.add('active');
    }

    // Add subtle hover animation
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });

    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// Initialize scroll-based animations
function initScrollAnimations() {
  // Simple scroll reveal for elements
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

  // Set initial state for scroll reveal elements
  revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // Check elements on load and scroll
  window.addEventListener('scroll', checkScroll);
  window.addEventListener('resize', checkScroll);
  // Initial check
  checkScroll();
}

// Initialize gallery functionality
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.querySelector('.gallery-modal');
  const modalImg = document.querySelector('.modal-content');
  const captionText = document.querySelector('.modal-caption');
  const closeModal = document.querySelector('.close-modal');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Make sure we have all required elements
  if (!modal || !modalImg) {
    console.error('Gallery modal elements not found');
    return;
  }

  // Add CSS styles for improved modal appearance
  const style = document.createElement('style');
  style.textContent = `
    .gallery-modal {
      display: none;
      position: fixed;
      z-index: 9999; /* Extremely high z-index to ensure it's above everything */
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.9);
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

    .modal-content {
      display: block;
      max-width: 80%;
      max-height: 70vh;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      transform: scale(0.95);
      transition: transform 0.3s ease;
      margin-bottom: 20px;
      z-index: 10000; /* Even higher z-index for content */
    }

    .gallery-modal.show .modal-content {
      transform: scale(1);
    }

    .modal-caption {
      color: white;
      text-align: center;
      padding: 12px 20px;
      width: 80%;
      max-width: 600px;
      margin: 0 auto;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 4px;
      z-index: 10000; /* Match content z-index */
    }

    .modal-caption h3 {
      margin-top: 0;
      margin-bottom: 8px;
      color: white;
      font-size: 18px;
    }

    .modal-caption p {
      margin: 0;
      font-size: 16px;
      line-height: 1.4;
    }

    .close-modal {
      position: absolute;
      top: 20px;
      right: 30px;
      color: white;
      font-size: 40px;
      font-weight: bold;
      cursor: pointer;
      z-index: 10001; /* Highest z-index for close button */
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .close-modal:hover {
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

  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked button
      button.classList.add('active');

      // Get the filter value
      const filter = button.getAttribute('data-filter');

      // Filter gallery items
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

  // Modal functionality
  galleryItems.forEach(item => {
    item.style.cursor = 'pointer';

    item.addEventListener('click', () => {
      // Get the image source
      const img = item.querySelector('img');
      if (img) {
        modalImg.src = img.src;

        // Preload the image to get proper dimensions
        const tempImg = new Image();
        tempImg.src = img.src;
        tempImg.onload = () => {
          // Now show the modal after the image is loaded
          modal.style.display = 'flex';

          // Force modal to appear on top by adding it to the end of the body
          document.body.appendChild(modal);

          // Trigger reflow before adding the show class for smooth animation
          void modal.offsetWidth;

          // Add show class for animation
          modal.classList.add('show');
        };
      }

      // Get the caption info from gallery-overlay
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

  // Close modal
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      closeModalFunction();
    });
  }

  // Close modal when clicking outside the image
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModalFunction();
    }
  });

  // Close modal with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModalFunction();
    }
  });

  // Function to close modal with animation
  function closeModalFunction() {
    modal.classList.remove('show');

    // Wait for animation to complete before hiding the modal
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }

  // Make sure the modal is initially hidden
  modal.style.display = 'none';
}

// Add smooth scrolling for anchor links
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

// Theme color customization
function setThemeColors(primary, secondary, accent) {
  document.documentElement.style.setProperty('--primary-color', primary);
  document.documentElement.style.setProperty('--secondary-color', secondary);
  document.documentElement.style.setProperty('--accent-color', accent);
}

// Optional: Add this to enable users to change theme colors
// setThemeColors('#ff7b00', '#e63946', '#2a9d8f');