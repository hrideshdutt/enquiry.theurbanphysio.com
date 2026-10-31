/* ==========================================================================
   The Urban Physio - Patient Enquiry Form Logic
   Handles dynamic day calculation, pain scale slider, validation, and API submit
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('patientEnquiryForm');
  const painSlider = document.getElementById('painScale');
  const painValueBadge = document.getElementById('painValue');
  const dateInput = document.getElementById('preferredDate');
  const dayInput = document.getElementById('preferredDay');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');

  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalPatientName = document.getElementById('modalPatientName');
  const modalDateDay = document.getElementById('modalDateDay');
  const modalSlotMode = document.getElementById('modalSlotMode');
  const modalPhone = document.getElementById('modalPhone');

  // 1. Minimum date = Today (Patients cannot pick past dates)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;

  // Default to today or tomorrow
  dateInput.value = `${yyyy}-${mm}-${dd}`;
  updateDayOfWeek(dateInput.value);

  // 2. Auto calculate Day of Week on Date change
  dateInput.addEventListener('change', (e) => {
    updateDayOfWeek(e.target.value);
  });

  function updateDayOfWeek(dateString) {
    if (!dateString) {
      dayInput.value = '';
      return;
    }
    const [year, month, day] = dateString.split('-').map(Number);
    // Create date in local timezone
    const selectedDate = new Date(year, month - 1, day);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[selectedDate.getDay()];
    dayInput.value = dayName || '';
  }

  // 3. Pain Scale Slider Update
  painSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    let category = 'Moderate';
    let className = 'moderate';

    if (val <= 3) {
      category = 'Mild Discomfort';
      className = 'mild';
    } else if (val >= 4 && val <= 6) {
      category = 'Moderate Pain';
      className = 'moderate';
    } else {
      category = 'Severe / Acute Pain';
      className = 'severe';
    }

    painValueBadge.textContent = `${val} / 10 (${category})`;
    painValueBadge.className = `pain-badge ${className}`;
  });

  // 4. Live validation cleanup on user input
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      clearFieldError(input);
    });
    input.addEventListener('change', () => {
      clearFieldError(input);
    });
  });

  function clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    if (formGroup && formGroup.classList.contains('has-error')) {
      formGroup.classList.remove('has-error');
    }
  }

  function setFieldError(input) {
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('has-error');
    }
  }

  // 5. Form Validation
  function validateForm() {
    let isValid = true;
    let firstErrorField = null;

    // Full Name
    const fullName = document.getElementById('fullName');
    if (!fullName.value.trim() || fullName.value.trim().length < 3) {
      setFieldError(fullName);
      if (!firstErrorField) firstErrorField = fullName;
      isValid = false;
    }

    // Phone (10 digits)
    const phone = document.getElementById('phone');
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.value.replace(/[\s\-\+]/g, '').slice(-10);
    if (!phoneRegex.test(cleanPhone)) {
      setFieldError(phone);
      if (!firstErrorField) firstErrorField = phone;
      isValid = false;
    }

    // Email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      setFieldError(email);
      if (!firstErrorField) firstErrorField = email;
      isValid = false;
    }

    // Age
    const age = document.getElementById('age');
    const ageVal = parseInt(age.value, 10);
    if (!ageVal || ageVal < 1 || ageVal > 120) {
      setFieldError(age);
      if (!firstErrorField) firstErrorField = age;
      isValid = false;
    }

    // Gender
    const gender = document.getElementById('gender');
    if (!gender.value) {
      setFieldError(gender);
      if (!firstErrorField) firstErrorField = gender;
      isValid = false;
    }

    // Street Address
    const streetAddress = document.getElementById('streetAddress');
    if (!streetAddress.value.trim()) {
      setFieldError(streetAddress);
      if (!firstErrorField) firstErrorField = streetAddress;
      isValid = false;
    }

    // Area
    const area = document.getElementById('area');
    if (!area.value.trim()) {
      setFieldError(area);
      if (!firstErrorField) firstErrorField = area;
      isValid = false;
    }

    // City
    const city = document.getElementById('city');
    if (!city.value.trim()) {
      setFieldError(city);
      if (!firstErrorField) firstErrorField = city;
      isValid = false;
    }

    // Pincode (6 digits)
    const pincode = document.getElementById('pincode');
    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(pincode.value.trim())) {
      setFieldError(pincode);
      if (!firstErrorField) firstErrorField = pincode;
      isValid = false;
    }

    // Concern Category
    const concernCategory = document.getElementById('concernCategory');
    if (!concernCategory.value) {
      setFieldError(concernCategory);
      if (!firstErrorField) firstErrorField = concernCategory;
      isValid = false;
    }

    // Duration
    const duration = document.getElementById('duration');
    if (!duration.value) {
      setFieldError(duration);
      if (!firstErrorField) firstErrorField = duration;
      isValid = false;
    }

    // Problem Description
    const problemDescription = document.getElementById('problemDescription');
    if (!problemDescription.value.trim() || problemDescription.value.trim().length < 5) {
      setFieldError(problemDescription);
      if (!firstErrorField) firstErrorField = problemDescription;
      isValid = false;
    }

    // Past History
    const pastHistory = document.getElementById('pastHistory');
    if (!pastHistory.value.trim()) {
      setFieldError(pastHistory);
      if (!firstErrorField) firstErrorField = pastHistory;
      isValid = false;
    }

    // Preferred Date
    const preferredDate = document.getElementById('preferredDate');
    if (!preferredDate.value) {
      setFieldError(preferredDate);
      if (!firstErrorField) firstErrorField = preferredDate;
      isValid = false;
    }

    // Time Slot
    const timeSlot = document.getElementById('timeSlot');
    if (!timeSlot.value) {
      setFieldError(timeSlot);
      if (!firstErrorField) firstErrorField = timeSlot;
      isValid = false;
    }

    if (!isValid && firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorField.focus();
    }

    return isValid;
  }

  // 6. Form Submission Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData(form);
    const consultationModeElem = form.querySelector('input[name="consultationMode"]:checked');

    const payload = {
      fullName: formData.get('fullName').trim(),
      phone: formData.get('phone').trim(),
      email: formData.get('email').trim(),
      age: formData.get('age'),
      gender: formData.get('gender'),
      streetAddress: formData.get('streetAddress').trim(),
      area: formData.get('area').trim(),
      city: formData.get('city').trim(),
      pincode: formData.get('pincode').trim(),
      concernCategory: formData.get('concernCategory'),
      duration: formData.get('duration'),
      problemDescription: formData.get('problemDescription').trim(),
      painScale: formData.get('painScale'),
      pastHistory: formData.get('pastHistory').trim(),
      currentMedication: (formData.get('currentMedication') || '').trim(),
      consultationMode: consultationModeElem ? consultationModeElem.value : 'Clinic Visit',
      preferredDate: formData.get('preferredDate'),
      preferredDay: formData.get('preferredDay'),
      timeSlot: formData.get('timeSlot'),
      additionalNotes: (formData.get('additionalNotes') || '').trim(),
      submittedAt: new Date().toISOString()
    };

    // UI Loading state
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnSpinner.classList.add('active');

    try {
      const response = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        // Populate modal data
        modalPatientName.textContent = payload.fullName;
        modalDateDay.textContent = `${payload.preferredDate} (${payload.preferredDay})`;
        modalSlotMode.textContent = `${payload.timeSlot} • ${payload.consultationMode}`;
        modalPhone.textContent = payload.phone;

        // Show Modal
        successModal.hidden = false;
        form.reset();
        // Reset slider badge & min date
        painValueBadge.textContent = '5 / 10 (Moderate)';
        painValueBadge.className = 'pain-badge moderate';
        dateInput.value = `${yyyy}-${mm}-${dd}`;
        updateDayOfWeek(dateInput.value);
      } else {
        const errorMsg = result.message || 'Unable to submit enquiry at this moment.';
        const details = result.details ? `\nDetails: ${result.details}` : '';
        alert(`Notice: ${errorMsg}${details}`);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Network or server connection error. Please ensure you are connected to the internet.');
    } finally {
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnSpinner.classList.remove('active');
    }
  });

  // Modal Close
  closeModalBtn.addEventListener('click', () => {
    successModal.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Close modal when clicking outside
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.hidden = true;
    }
  });
});

