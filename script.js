document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const menuBtn = document.getElementById('menuToggle');
  const dropdown = document.getElementById('dropdownMenu');

  if (menuBtn && dropdown) {
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (window.innerWidth < 600) {
        const isVisible = dropdown.style.display === 'flex';
        dropdown.style.display = isVisible ? 'none' : 'flex';
      }
    });

    document.addEventListener('click', function(e) {
      if (window.innerWidth < 600) {
        if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      }
    });

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

  // ============================================
  // TRAILER MODAL
  // ============================================
  const modal = document.getElementById('trailerModal');
  const watchBtn = document.getElementById('watchTrailerBtn');
  const closeBtn = document.querySelector('.close-modal');
  const iframe = document.getElementById('trailerVideo');

  if (watchBtn && modal && closeBtn && iframe) {
    // Open modal and play video
    watchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      modal.style.display = 'flex';
      // Use embed URL with autoplay
      iframe.src = 'https://www.youtube.com/embed/YYSceespQHs?autoplay=1&rel=0';
    });

    // Close modal and stop video
    function closeModal() {
      modal.style.display = 'none';
      // Reset iframe to stop video
      iframe.src = iframe.src.replace('?autoplay=1&rel=0', '?si=placeholder');
    }

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });
  }

  // ============================================
  // DONATE BUTTON PRESETS
  // ============================================
  const donateInput = document.getElementById('donateAmount');
  const coinButtons = document.querySelectorAll('.coin');

  coinButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const amount = this.dataset.amount;
      if (donateInput && amount) {
        donateInput.value = amount;
        // Highlight selected button
        coinButtons.forEach(b => b.style.borderColor = '');
        this.style.borderColor = '#ffd700';
      }
    });
  });

  // ============================================
  // CONTACT FORM (simple validation)
  // ============================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const comment = document.getElementById('contactComment').value.trim();

      if (!name || !email || !comment) {
        alert('⚠️ Please fill in all fields.');
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        alert('⚠️ Please enter a valid email address.');
        return;
      }

      alert('✅ Thank you! Your message has been sent.');
      this.reset();
    });
  }

  console.log('🧙‍♂️ The Hunt for Gollum — site ready!');
});