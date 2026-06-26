// ============================================
// SCRIPT.JS - The Hunt for Gollum
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const menuToggle = document.getElementById('menuToggle');
  const dropdownMenu = document.getElementById('dropdownMenu');

  if (menuToggle && dropdownMenu) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (dropdownMenu.style.display === 'flex') {
        dropdownMenu.style.display = 'none';
      } else {
        dropdownMenu.style.display = 'flex';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('nav')) {
        dropdownMenu.style.display = 'none';
      }
    });
  }

  // ============================================
  // SPONSORS TOGGLE (See More / See Less)
  // ============================================
  const toggleBtn = document.getElementById('sponsorsToggle');
  const sponsorsGrid = document.getElementById('sponsorsGrid');

  if (toggleBtn && sponsorsGrid) {
    toggleBtn.addEventListener('click', function() {
      sponsorsGrid.classList.toggle('show-all');
      this.classList.toggle('active');

      const text = this.querySelector('.toggle-text');
      if (text) {
        text.textContent = sponsorsGrid.classList.contains('show-all') 
          ? 'Show Less' 
          : 'See More Supporters';
      }
    });
  }

  // ============================================
  // CONTACT FORM (Feedback)
  // ============================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const comment = document.getElementById('contactComment').value.trim();

      // Simple validation
      if (!name || !email || !comment) {
        alert('Please fill in all fields.');
        return;
      }

      if (!email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }

      const submitBtn = this.querySelector('.goldbtn.send');
      const originalText = submitBtn.innerHTML;

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';

        // Store in localStorage (or send to your backend)
        const feedbacks = JSON.parse(localStorage.getItem('feedbackData') || '[]');
        feedbacks.push({
          id: Date.now(),
          name: name,
          email: email,
          message: comment,
          submitted: new Date().toISOString()
        });
        localStorage.setItem('feedbackData', JSON.stringify(feedbacks));

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        alert('Your message has been sent! Thank you for reaching out.');
        contactForm.reset();

      } catch (error) {
        console.error('Error sending message:', error);
        alert('Something went wrong. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // ============================================
  // COLLABORATE BUTTONS - Smooth scroll or redirect
  // ============================================
  const collaborateBtns = document.querySelectorAll('#collaborateBtn, #collaborateBtn2');
  collaborateBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Already linking to form.html via href
      // Add a small tracking event if needed
      console.log('Collaborate button clicked');
    });
  });

  // ============================================
  // SMOOTH SCROLL FOR NAV LINKS
  // ============================================
  const navLinks = document.querySelectorAll('.dropdown-content a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu
          if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
          }
        }
      }
    });
  });

  // ============================================
  // LOGO CLICK - Back to top
  // ============================================
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  console.log('🎬 The Hunt for Gollum — Website ready!');
});