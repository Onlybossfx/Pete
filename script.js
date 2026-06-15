// Mobile Menu Toggle (Touch-friendly)
const menuBtn = document.getElementById('menuToggle');
const dropdown = document.getElementById('dropdownMenu');

if (menuBtn && dropdown) {
  // Toggle menu on button click
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (window.innerWidth < 600) {
      const isVisible = dropdown.style.display === 'flex';
      dropdown.style.display = isVisible ? 'none' : 'flex';
    }
  });
  
  // Close dropdown when clicking outside (mobile only)
  document.addEventListener('click', function(e) {
    if (window.innerWidth < 600) {
      if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }
  });
  
  // Handle window resize - reset dropdown display
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 600) {
      dropdown.style.display = 'flex';
    } else {
      dropdown.style.display = 'none';
    }
  });
  
  // Initial setup
  if (window.innerWidth < 600) {
    dropdown.style.display = 'none';
  } else {
    dropdown.style.display = 'flex';
  }
}

// Modal Functionality for Trailer Button
const modal = document.getElementById('trailerModal');
const watchBtn = document.getElementById('watchTrailerBtn');
const closeBtn = document.querySelector('.close-modal');
const iframe = document.getElementById('trailerVideo');

if (watchBtn && modal && closeBtn && iframe) {
  // Open modal and play video
  watchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = 'flex';
    // Replace '4M87I71CvN0' with your actual YouTube video ID
    iframe.src = "https://www.youtube.com/embed/4M87I71CvN0?autoplay=1&rel=0";
  });
  
  // Close modal and stop video
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    iframe.src = iframe.src.replace("?autoplay=1&rel=0", "?si=placeholder");
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      iframe.src = iframe.src.replace("?autoplay=1&rel=0", "?si=placeholder");
    }
  });
}

