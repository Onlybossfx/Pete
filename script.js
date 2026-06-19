document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // 🔐 SUPABASE CONFIGURATION
  // ============================================
  const SUPABASE_URL = 'https://slelabwkeijziuefyjob.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZWxhYndrZWlqeml1ZWZ5am9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NzIwMDcsImV4cCI6MjA5NzM0ODAwN30.DMSv1vndksl7TM-8JzN1BSljogyVFCF2CUR5ybyMY7o';

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('🧙‍♂️ Supabase initialized for forms');

  // ============================================
  // 💰 PAYSTACK CONFIGURATION
  // ============================================
  // 🔑 REPLACE WITH YOUR PAYSTACK PUBLIC KEY
  // Go to Paystack Dashboard → Settings → API Keys & Webhooks
  const PAYSTACK_PUBLIC_KEY = 'pk_live_7119a1ec5d6c2f268c1073a8dc711567d66dfcae';

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
    watchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      modal.style.display = 'flex';
      iframe.src = 'https://youtu.be/CyP11HJvF0A?si=Ud7eBsV3GJh06F8f';
    });

    function closeModal() {
      modal.style.display = 'none';
      iframe.src = iframe.src.replace('?autoplay=1&rel=0', '?si=placeholder');
    }

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });
  }

  // ============================================
  // 💰 PAYSTACK DONATION FUNCTION
  // ============================================
  function payWithPaystack(amount, email, name) {
    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email || 'donor@middle-earth.com',
      amount: amount * 100, // Paystack expects amount in kobo
      currency: 'NGN',
      ref: 'hfgl-' + Date.now(), // Unique reference
      first_name: name || 'Fellow Traveler',
      callback: function(response) {
        // Transaction successful
        console.log('✅ Payment successful:', response);
        alert('🎉 Thank you for your donation! Your support helps bring Middle-earth to life.');
        // Save donation record to Supabase
        saveDonationToSupabase({
          name: name || 'Anonymous',
          email: email || 'donor@middle-earth.com',
          amount: amount,
          reference: response.reference,
          status: 'success'
        });
      },
      onClose: function() {
        console.log('❌ Payment window closed');
      }
    });
    handler.openIframe();
  }

  // ============================================
  // 📊 SAVE DONATION TO SUPABASE (Optional)
  // ============================================
  async function saveDonationToSupabase(data) {
    try {
      const { error } = await supabase
        .from('donations')
        .insert([data]);

      if (error) throw error;
      console.log('✅ Donation recorded in Supabase');
    } catch (error) {
      console.error('❌ Error saving donation:', error);
    }
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
        coinButtons.forEach(b => b.style.borderColor = '');
        this.style.borderColor = '#ffd700';
      }
    });
  });

  // ============================================
  // 💰 DONATE BUTTON — Open Paystack
  // ============================================
  const donateBtn = document.getElementById('donateBtn');

  if (donateBtn) {
    donateBtn.addEventListener('click', function(e) {
      e.preventDefault();

      // Get amount from input or use default 5
      const amount = parseInt(donateInput.value) || 5;

      if (amount < 1) {
        alert('⚠️ Please enter a valid donation amount (minimum ₦1).');
        return;
      }

      if (amount > 1000000) {
        alert('⚠️ Donation amount too high. Please enter a smaller amount.');
        return;
      }

      // Ask for donor details (optional)
      const donorName = prompt('Enter your name (optional):', 'Fellow Traveler') || 'Anonymous';
      const donorEmail = prompt('Enter your email (optional):', 'fellow@middle-earth.com') || 'donor@middle-earth.com';

      // Proceed with payment
      payWithPaystack(amount, donorEmail, donorName);
    });
  }

  // ============================================
  // 💰 "BACK THIS PROJECT" BUTTON
  // ============================================
  const backProjectBtn = document.getElementById('backProjectBtn');

  if (backProjectBtn) {
    backProjectBtn.addEventListener('click', function(e) {
      e.preventDefault();

      const amount = prompt('Enter your donation amount (₦):', '1000');

      if (amount && !isNaN(amount) && parseInt(amount) > 0) {
        const donorName = prompt('Enter your name (optional):', 'Project Backer') || 'Anonymous';
        const donorEmail = prompt('Enter your email (optional):', 'backer@middle-earth.com') || 'backer@middle-earth.com';
        payWithPaystack(parseInt(amount), donorEmail, donorName);
      } else if (amount !== null) {
        alert('⚠️ Please enter a valid amount.');
      }
    });
  }

  // ============================================
  // 💬 CONTACT FORM — Submit to Supabase
  // ============================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactComment').value.trim();

      // Validate
      if (!name || !email || !message) {
        alert('⚠️ Please fill in all fields.');
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        alert('⚠️ Please enter a valid email address.');
        return;
      }

      // Show loading state
      const submitBtn = this.querySelector('.goldbtn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';
      submitBtn.disabled = true;

      try {
        // Send to Supabase
        const { data, error } = await supabase
          .from('feedback')
          .insert([{ name, email, message }]);

        if (error) throw error;

        alert('✅ Thank you! Your message has been recorded in the Red Book.');
        this.reset();

      } catch (error) {
        console.error('❌ Supabase Error:', error);
        alert('⚠️ Something went wrong. Please try again later.');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ============================================
  // SPONSORS TOGGLE
  // ============================================
  const sponsorsToggle = document.getElementById('sponsorsToggle');
  const sponsorsGrid = document.getElementById('sponsorsGrid');

  if (sponsorsToggle && sponsorsGrid) {
    sponsorsToggle.addEventListener('click', function() {
      const isOpen = sponsorsGrid.classList.toggle('show-all');
      this.classList.toggle('active');

      const toggleText = this.querySelector('.toggle-text');
      if (isOpen) {
        toggleText.textContent = 'See Less Sponsors';
      } else {
        toggleText.textContent = 'See More Sponsors';
      }
    });
  }

  console.log('🧙‍♂️ The Hunt for Gollum — site ready with Supabase + Paystack!');
});