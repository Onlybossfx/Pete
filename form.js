document.addEventListener('DOMContentLoaded', () => {

  const bookOverlay = document.querySelector('.book-overlay');
  const openBtn = document.getElementById('openBookBtn');
  const closeBtn = document.querySelector('.close-book');
  const pages = document.querySelectorAll('.page');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const currentPageSpan = document.getElementById('currentPage');
  const totalPagesSpan = document.getElementById('totalPages');
  
  let currentPage = 0;
  const totalPages = pages.length;
  let isAnimating = false;
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;

  // Set total pages
  totalPagesSpan.textContent = totalPages;

  // ===== OPEN BOOK =====
  openBtn.addEventListener('click', () => {
    bookOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentPage = 0;
    updatePages();
  });

  // ===== CLOSE BOOK =====
  closeBtn.addEventListener('click', () => {
    bookOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Click outside to close
  bookOverlay.addEventListener('click', (e) => {
    if (e.target === bookOverlay) {
      bookOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ===== UPDATE PAGES =====
  function updatePages() {
    pages.forEach((page, index) => {
      page.classList.remove('active', 'flipping', 'flipping-back');
      
      if (window.innerWidth >= 768) {
        // Desktop: show two pages (current and next)
        if (index === currentPage || index === currentPage + 1) {
          page.classList.add('active');
        }
        // Hide prev/next based on position
        if (index < currentPage || index > currentPage + 1) {
          page.style.display = 'none';
        } else {
          page.style.display = 'block';
        }
      } else {
        // Mobile: show one page
        if (index === currentPage) {
          page.classList.add('active');
          page.style.display = 'block';
        } else {
          page.style.display = 'none';
        }
      }
    });

    // Update counter
    const displayPage = window.innerWidth >= 768 ? Math.floor(currentPage / 2) + 1 : currentPage + 1;
    currentPageSpan.textContent = Math.min(displayPage, totalPages);

    // Update buttons
    const maxPage = window.innerWidth >= 768 ? totalPages - 2 : totalPages - 1;
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= maxPage;

    // Update drag indicator
    const dragIndicator = document.querySelector('.cover-instruction');
    if (dragIndicator && currentPage === 0) {
      dragIndicator.style.display = 'flex';
    } else if (dragIndicator) {
      dragIndicator.style.display = 'none';
    }
  }

  // ===== NEXT PAGE =====
  function nextPage() {
    if (isAnimating) return;
    const maxPage = window.innerWidth >= 768 ? totalPages - 2 : totalPages - 1;
    if (currentPage >= maxPage) return;

    isAnimating = true;
    const current = pages[currentPage];
    const next = pages[currentPage + 1];

    if (current) current.classList.add('flipping');
    if (next) next.classList.add('flipping');

    setTimeout(() => {
      if (window.innerWidth >= 768) {
        currentPage += 2;
      } else {
        currentPage += 1;
      }
      updatePages();
      isAnimating = false;
    }, 600);
  }

  // ===== PREV PAGE =====
  function prevPage() {
    if (isAnimating) return;
    if (currentPage <= 0) return;

    isAnimating = true;
    const current = pages[currentPage];
    const prev = pages[currentPage - 1];

    if (current) current.classList.add('flipping-back');
    if (prev) prev.classList.add('flipping-back');

    setTimeout(() => {
      if (window.innerWidth >= 768) {
        currentPage -= 2;
      } else {
        currentPage -= 1;
      }
      if (currentPage < 0) currentPage = 0;
      updatePages();
      isAnimating = false;
    }, 600);
  }

  // ===== EVENT LISTENERS =====
  prevBtn.addEventListener('click', prevPage);
  nextBtn.addEventListener('click', nextPage);

  // ===== KEYBOARD SUPPORT =====
  document.addEventListener('keydown', (e) => {
    if (!bookOverlay.classList.contains('active')) return;
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
    if (e.key === 'Escape') {
      bookOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ===== TOUCH / SWIPE SUPPORT (mobile) =====
  const bookContainer = document.getElementById('bookContainer');

  bookContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isDragging = true;
  }, { passive: true });

  bookContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    touchEndX = e.changedTouches[0].screenX;
  }, { passive: true });

  bookContainer.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = touchStartX - touchEndX;
    
    // Swipe left = next, swipe right = prev
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextPage();
      } else {
        prevPage();
      }
    }
  }, { passive: true });

  // ===== WINDOW RESIZE =====
  window.addEventListener('resize', () => {
    updatePages();
  });

  // ===== INIT =====
  updatePages();

});

