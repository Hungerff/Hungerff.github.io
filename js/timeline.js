document.addEventListener('DOMContentLoaded', function() {
  initTimelineAnimations();
});

function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (!timelineItems.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        const icon = entry.target.querySelector('.timeline-icon');
        const content = entry.target.querySelector('.timeline-content');
        
        if (icon) {
          icon.style.transform = 'scale(1)';
          icon.style.opacity = '1';
        }
        
        if (content) {
          content.style.transform = 'translateX(0)';
          content.style.opacity = '1';
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  timelineItems.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const icon = item.querySelector('.timeline-icon');
    const content = item.querySelector('.timeline-content');
    
    item.style.opacity = '1';
    
    if (icon) {
      icon.style.transform = 'scale(0.5)';
      icon.style.opacity = '0';
      icon.style.transition = 'all 0.5s ease ' + (index * 0.1) + 's';
    }
    
    if (content) {
      content.style.transform = isEven ? 'translateX(-50px)' : 'translateX(50px)';
      content.style.opacity = '0';
      content.style.transition = 'all 0.5s ease ' + (index * 0.1 + 0.2) + 's';
    }
    
    observer.observe(item);
  });
  
  addTimelineInteractivity();
}

function addTimelineInteractivity() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  timelineItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      const content = this.querySelector('.timeline-content');
      const icon = this.querySelector('.timeline-icon');
      
      if (content) {
        content.style.transform = 'translateY(-5px)';
        content.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
      }
      
      if (icon) {
        icon.style.transform = 'scale(1.1)';
      }
    });
    
    item.addEventListener('mouseleave', function() {
      const content = this.querySelector('.timeline-content');
      const icon = this.querySelector('.timeline-icon');
      
      if (content) {
        content.style.transform = 'translateY(0)';
        content.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
      }
      
      if (icon) {
        icon.style.transform = 'scale(1)';
      }
    });
    
    const icon = item.querySelector('.timeline-icon');
    
    if (icon) {
      icon.addEventListener('click', function() {
        const content = this.parentElement.querySelector('.timeline-content');
        
        if (content) {
          content.classList.toggle('highlight');
          
          if (content.classList.contains('highlight')) {
            content.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            content.style.borderColor = 'var(--primary-color)';
          } else {
            content.style.backgroundColor = '';
            content.style.borderColor = '';
          }
        }
      });
    }
  });
}

function applyRetroTimelineStyles() {
  if (document.body.classList.contains('retro')) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timeline = document.querySelector('.timeline');
    
    if (timeline) {
      timeline.style.backgroundImage = 'none';
    }
    
    timelineItems.forEach(item => {
      const content = item.querySelector('.timeline-content');
      const icon = item.querySelector('.timeline-icon');
      
      if (content) {
        content.style.backgroundColor = '#000080';
        content.style.border = '2px solid #ffff00';
        content.style.boxShadow = '5px 5px 0 #000000';
        content.style.borderRadius = '0';
      }
      
      if (icon) {
        icon.style.backgroundColor = '#ff0000';
        icon.style.border = '3px solid #ffff00';
        icon.style.boxShadow = 'none';
        icon.style.borderRadius = '0';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const retroToggleButton = document.querySelector('.retro-toggle');
  
  if (retroToggleButton) {
    retroToggleButton.addEventListener('click', function() {
      setTimeout(applyRetroTimelineStyles, 100);
    });
  }
  
  if (document.body.classList.contains('retro')) {
    applyRetroTimelineStyles();
  }
});