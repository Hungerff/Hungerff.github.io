document.addEventListener('DOMContentLoaded', function() {
  // Initialize the timeline
  initTimeline();
});

function initTimeline() {
  const timelineItems = document.querySelectorAll('.timeline-item');

  // Set initial state for timeline items (for animation)
  timelineItems.forEach((item, index) => {
    // Stagger the animation delay
    item.style.transitionDelay = (index * 0.2) + 's';
  });

  // Animate timeline items when they come into view
  function animateTimelineOnScroll() {
    timelineItems.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (itemTop < windowHeight - 100) {
        item.classList.add('visible');
      }
    });
  }

  // Check timeline items on scroll
  window.addEventListener('scroll', animateTimelineOnScroll);

  // Check on initial load
  animateTimelineOnScroll();

  // Hover effect for timeline items
  timelineItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      // Scale up slightly
      this.querySelector('.timeline-content').style.transform = 'scale(1.02)';
      this.querySelector('.timeline-content').style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
    });

    item.addEventListener('mouseleave', function() {
      // Reset scaling
      this.querySelector('.timeline-content').style.transform = 'scale(1)';
      this.querySelector('.timeline-content').style.boxShadow = '';
    });
  });

  // Get all timeline dates for interactive navigation
  const timelineDates = Array.from(document.querySelectorAll('.timeline-date'))
    .map(dateEl => dateEl.textContent);

  // Create a timeline navigation if there are many events
  if (timelineItems.length > 6) {
    createTimelineNavigation(timelineDates);
  }
}

function createTimelineNavigation(dates) {
  // Create a navigation container
  const navContainer = document.createElement('div');
  navContainer.className = 'timeline-navigation';
  navContainer.style.display = 'flex';
  navContainer.style.justifyContent = 'center';
  navContainer.style.gap = '10px';
  navContainer.style.margin = '0 0 30px 0';

  // Add date buttons
  dates.forEach((date, index) => {
    const dateBtn = document.createElement('button');
    dateBtn.textContent = date.split(' - ')[0]; // Just use the year
    dateBtn.className = 'filter-btn'; // Reuse filter button style

    // Style for the first one (active)
    if (index === 0) {
      dateBtn.classList.add('active');
    }

    // Scroll to the corresponding timeline item when clicked
    dateBtn.addEventListener('click', () => {
      // Update active state
      document.querySelectorAll('.timeline-navigation button').forEach(btn => {
        btn.classList.remove('active');
      });
      dateBtn.classList.add('active');

      // Scroll to the timeline item
      const timelineItems = document.querySelectorAll('.timeline-item');
      timelineItems[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    });

    navContainer.appendChild(dateBtn);
  });

  // Add the navigation to the page
  const timelineSection = document.querySelector('.timeline-section');
  const timeline = document.querySelector('.timeline');
  timelineSection.insertBefore(navContainer, timeline);
}