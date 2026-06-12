// Carousel initialization
const swiper = new Swiper('.supportSwiper', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach((question) => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    answer.classList.toggle('show');
    const icon = question.querySelector('i');
    if (icon) {
      icon.style.transform = answer.classList.contains('show') ? 'rotate(180deg)' : '';
    }
  });
});

// Form submission (MVP - no backend, just console log)
const form = document.getElementById('supportForm');
const feedback = document.getElementById('formFeedback');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Log to console for now
    console.log('Form submitted:', { name, email, message });

    // Show success message
    feedback.innerHTML = '<span style="color: #b87a4a;">✓ The pigeon has returned. You are now marked.</span>';
    form.reset();

    // Clear feedback after 4 seconds
    setTimeout(() => {
      feedback.innerHTML = '';
    }, 4000);
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

// Header scroll effect
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(30, 24, 20, 0.96)';
      header.style.backdropFilter = 'blur(12px)';
    } else {
      header.style.background = 'rgba(30, 24, 20, 0.92)';
      header.style.backdropFilter = 'blur(10px)';
    }
  });
}