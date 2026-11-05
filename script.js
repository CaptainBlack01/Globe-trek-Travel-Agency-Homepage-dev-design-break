document.addEventListener('DOMContentLoaded', () => {
  const destinations = [
    {
      id: 'hawaii',
      name: 'Hawaii',
      description: 'Experience the tropical paradise of Hawaii. From surfing in the Pacific to hiking volcanic craters, this destination offers a perfect blend of adventure and relaxation. Enjoy traditional island food and the welcoming local culture.',
      image: 'https://images.unsplash.com/photo-1509610696553-9243c1e230f0?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 'swiss-alps',
      name: 'Swiss Alps',
      description: 'The Swiss Alps offer breathtaking mountain scenery and world-class skiing. Whether you are hitting the slopes or enjoying a cozy fondue in a chalet, it is an unforgettable winter wonderland.',
      image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 'santorini',
      name: 'Santorini',
      description: 'Santorini is famous for its stunning sunsets and white-washed buildings. Explore clear blue waters, ancient ruins, and delicious Greek cuisine in this romantic getaway.',
      image: 'https://images.unsplash.com/photo-1678266561093-324802646fb2?w=500&auto=format&fit=crop&q=60'
    }
  ];

  const packages = [
    { name: 'Honeymoon Special', destination: 'santorini', price: '$1,299', features: ['5 Days in Santorini', 'Private Villa', 'Romantic Dinner', 'Island Tour'] },
    { name: 'Adventure Rush', destination: 'swiss-alps', price: '$1,899', features: ['7 Days in Swiss Alps', 'Skiing Equipment', 'Mountain Guide', 'Luxury Cabin'], featured: true, tag: 'Most Popular' },
    { name: 'Tropical Escape', destination: 'hawaii', price: '$999', features: ['5 Days in Hawaii', 'Surfing Lessons', 'Breakfast Included', 'Beachfront Hotel'] }
  ];

  const destinationContainer = document.querySelector('.destination-cards');
  if (destinationContainer) {
    destinationContainer.innerHTML = destinations.map((destination) => `
      <article class="destination-card reveal">
        <div class="destination-image"><img src="${destination.image}" alt="${destination.name}" loading="lazy"></div>
        <div class="destination-info">
          <h3>${destination.name}</h3>
          <p>${destination.description}</p>
          <button class="details" type="button" data-destination="${destination.id}">View Details</button>
        </div>
      </article>`).join('');
  }

  const packageContainer = document.querySelector('.package-cards');
  if (packageContainer) {
    packageContainer.innerHTML = packages.map((pkg) => `
      <article class="package-card ${pkg.featured ? 'featured' : ''} reveal">
        ${pkg.featured ? `<div class="tag">${pkg.tag}</div>` : ''}
        <div class="package-header"><h3>${pkg.name}</h3><p class="price">${pkg.price}</p></div>
        <ul class="package-features">${pkg.features.map((feature) => `<li><i class="fa-solid fa-check" aria-hidden="true"></i> ${feature}</li>`).join('')}</ul>
        <a href="ticket.html?destination=${encodeURIComponent(pkg.destination)}" class="book-package-btn">Book Package</a>
      </article>`).join('');
  }

  // Observe all reveal elements once, including cards rendered above.
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('active'));
  }

  // Responsive navigation.
  const menuButton = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');
  if (menuButton && nav) {
    const setMenuOpen = (open) => {
      menuButton.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
    };
    menuButton.addEventListener('click', () => setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
    document.addEventListener('click', (event) => {
      if (nav.classList.contains('open') && !nav.contains(event.target) && !menuButton.contains(event.target)) setMenuOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        setMenuOpen(false);
        menuButton.focus();
      }
    });
  }

  // Destination details dialog, using delegated events so rendered buttons work reliably.
  const modal = document.getElementById('detailsModal');
  if (modal) {
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const closeButton = modal.querySelector('.close-modal');
    let lastFocusedElement = null;
    const closeModal = () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocusedElement) lastFocusedElement.focus();
    };
    document.addEventListener('click', (event) => {
      const detailsButton = event.target.closest('.details[data-destination]');
      if (!detailsButton) return;
      const destination = destinations.find((item) => item.id === detailsButton.dataset.destination);
      if (!destination) return;
      lastFocusedElement = detailsButton;
      modalTitle.textContent = destination.name;
      modalImage.src = destination.image;
      modalImage.alt = destination.name;
      modalDescription.textContent = destination.description;
      modal.querySelector('.book-now-modal').href = `ticket.html?destination=${encodeURIComponent(destination.id)}`;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    });
    closeButton?.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });
  }

  // Booking form: client-side validation only; no booking is transmitted or stored.
  const ticketForm = document.getElementById('ticketForm');
  if (ticketForm) {
    const fields = {
      fullName: document.getElementById('fullName'),
      email: document.getElementById('email'),
      destination: document.getElementById('destination'),
      date: document.getElementById('date'),
      tickets: document.getElementById('tickets')
    };
    const status = document.getElementById('bookingStatus');
    const localDate = new Date();
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    const today = localDate.toISOString().slice(0, 10);
    fields.date.min = today;

    const validators = {
      fullName: (value) => value.trim().length >= 4,
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      destination: (value) => Boolean(value),
      date: (value) => Boolean(value) && value >= today,
      tickets: (value) => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 10
    };
    const validateField = (name) => {
      const field = fields[name];
      const valid = validators[name](field.value);
      const group = field.closest('.form-group');
      group?.classList.toggle('invalid', !valid);
      group?.classList.toggle('valid', valid);
      field.classList.toggle('error', !valid);
      field.classList.toggle('success', valid);
      field.setAttribute('aria-invalid', String(!valid));
      return valid;
    };

    Object.entries(fields).forEach(([name, field]) => {
      field.addEventListener('input', () => {
        if (field.dataset.touched === 'true') validateField(name);
        if (status) status.textContent = '';
      });
      field.addEventListener('change', () => {
        field.dataset.touched = 'true';
        validateField(name);
      });
      field.addEventListener('blur', () => {
        field.dataset.touched = 'true';
        validateField(name);
      });
    });

    const queryDestination = new URLSearchParams(window.location.search).get('destination');
    if (queryDestination && Array.from(fields.destination.options).some((option) => option.value === queryDestination)) {
      fields.destination.value = queryDestination;
    }

    ticketForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const valid = Object.keys(fields).map((name) => {
        fields[name].dataset.touched = 'true';
        return validateField(name);
      }).every(Boolean);
      if (!valid) {
        status.textContent = 'Please correct the highlighted fields.';
        ticketForm.querySelector('.error')?.focus();
        return;
      }
      status.textContent = 'The form passed validation, but this demo has no booking service connected. Your request was not sent or saved.';
    });
  }

  // Contact form is also a front-end demo and does not send a message.
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = document.getElementById('contactStatus');
      if (status) status.textContent = 'This demo has no messaging service connected. Your message was not sent.';
    });
  }

  document.querySelectorAll('footer p').forEach((footerText) => {
    footerText.textContent = `© ${new Date().getFullYear()} GlobeTrek. All rights reserved.`;
  });
});
