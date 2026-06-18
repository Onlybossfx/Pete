document.addEventListener('DOMContentLoaded', () => {
  
  const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
  const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

  // Initialize Supabase client
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  const form = document.getElementById('collaboratorForm');
  const statusDiv = document.getElementById('formStatus');
  const submitBtn = document.querySelector('.submit-btn');
  
  function isHoneypotTriggered(formData) {
    const honeypot = formData.get('honeypot');
    return honeypot && honeypot.trim() !== '';
  }
  
  function validateForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'address', 'dob', 'nationality'];
    const fieldLabels = {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      address: 'Residential Address',
      dob: 'Date of Birth',
      nationality: 'Nationality'
    };

    for (let field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        alert(`⚠️ Please fill in your ${fieldLabels[field] || field}`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('⚠️ Please enter a valid email address');
      return false;
    }

    if (data.phone.replace(/\D/g, '').length < 6) {
      alert('⚠️ Please enter a valid phone number (at least 6 digits)');
      return false;
    }

    return true;
  }
  
  function setLoadingState(isLoading) {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.textContent = 'Sending... ✧';
      submitBtn.disabled = true;
    } else {
      submitBtn.textContent = 'Send Application ✧';
      submitBtn.disabled = false;
    }
  }

  function showSuccess() {
    if (!form || !statusDiv) return;
    form.style.display = 'none';
    statusDiv.style.display = 'block';
    statusDiv.className = 'success';
    statusDiv.innerHTML = `
      <div style="font-family: 'Playfair Display', serif; font-style: italic; text-align: center; padding: 10px;">
        <i class="fas fa-check-circle" style="font-size: 48px; color: #28a745; margin-bottom: 12px;"></i>
        <h3 style="font-family: 'Cinzel', serif; color: #4a3228; font-size: 22px; margin-bottom: 6px;">
          Application Sent!
        </h3>
        <p style="color: #8b7355; font-size: 16px; margin: 8px 0;">
          Thank you, fellow traveler. Your application has been recorded in the Red Book.
        </p>
        <p style="color: #b8860b; font-style: italic; font-size: 14px; margin-top: 10px;">
          "The road goes ever on..."
        </p>
      </div>
    `;
  }

  function showError(message) {
    if (!statusDiv) return;
    statusDiv.style.display = 'block';
    statusDiv.className = 'error';
    statusDiv.innerHTML = `
      <div style="font-family: 'Playfair Display', serif; font-style: italic; text-align: center; padding: 10px; color: #dc3545;">
        <i class="fas fa-exclamation-circle" style="font-size: 36px; margin-bottom: 8px;"></i>
        <p style="font-size: 16px;">${message || 'Something went wrong. Please try again.'}</p>
      </div>
    `;
  }

  function hideStatus() {
    if (!statusDiv) return;
    statusDiv.style.display = 'none';
    statusDiv.className = '';
    statusDiv.innerHTML = '';
  }

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      hideStatus();
      const formData = new FormData(form);

      // 🛡️ HONEYPOT CHECK
      if (isHoneypotTriggered(formData)) {
        console.warn('🛡️ Honeypot triggered — submission blocked');
        showError('Submission blocked. If you are human, please try again.');
        return;
      }

      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        dob: formData.get('dob'),
        postal_code: formData.get('code'),
        gender: formData.get('gender'),
        marital_status: formData.get('status'),
        nationality: formData.get('nation'),
        education: formData.get('edu'),
        languages: formData.get('lang'),
        skills: formData.get('skill'),
        hobbies: formData.get('hobby')
      };

      if (!validateForm(data)) return;

      setLoadingState(true);

      try {
        const { error } = await supabase
          .from('collaborators')
          .insert([data]);

        if (error) throw error;

        showSuccess();

      } catch (error) {
        console.error('❌ Supabase Error:', error);

        let userMessage = 'Something went wrong. Please try again.';
        if (error.code === '23505') {
          userMessage = 'This email has already been submitted. Please use a different email.';
        } else if (error.code === '23502') {
          userMessage = 'Missing required field. Please fill in all required fields.';
        }

        showError(userMessage);

        setTimeout(() => {
          hideStatus();
        }, 5000);

      } finally {
        setLoadingState(false);
      }
    });
  }

  if (form) {
    document.addEventListener('click', function(e) {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        document.activeElement?.blur();
      }
    });
  }

  window.addEventListener('beforeunload', function() {
    if (form) {
      form.reset();
    }
  });

  console.log('🧙‍♂️ LOTR Collaborator Form ready with Supabase + Honeypot');
});