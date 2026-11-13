document.addEventListener('DOMContentLoaded', () => {
  const destinationsData = [
    {
      id: 1,
      slug: 'hawaii',
      name: 'Hawaii',
      description: 'Experience the tropical paradise with stunning beaches and vibrant culture.',
      image:
        'https://images.unsplash.com/photo-1509610696553-9243c1e230f0?w=500&auto=format&fit=crop&q=60',
      details:
        'Experience the tropical paradise of Hawaii. From surfing in the Pacific to hiking volcanic craters, this destination offers a perfect blend of adventure and relaxation. Enjoy traditional luaus and vibrant nightlife.',
    },
    {
      id: 2,
      slug: 'swiss-alps',
      name: 'Swiss Alps',
      description: 'Enjoy breathtaking mountain views and world-class skiing.',
      image:
        'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=500&auto=format&fit=crop&q=60',
      details:
        "The Swiss Alps offer breathtaking mountain scenery and world-class skiing. Whether you're hitting the slopes or enjoying a cozy fondue in a chalet, it's an unforgettable winter wonderland.",
    },
    {
      id: 3,
      slug: 'santorini',
      name: 'Santorini',
      description: 'Explore the iconic white-washed buildings and stunning sunsets.',
      image:
        'https://images.unsplash.com/photo-1678266561093-324802646fb2?w=500&auto=format&fit=crop&q=60',
      details:
        'Santorini is famous for its stunning sunsets and white-washed buildings. Explore clear blue waters, ancient ruins, and delicious Greek cuisine in this romantic getaway.',
    },
  ];

  const packagesData = [
    {
      name: 'Honeymoon Special',
      price: '$1,299',
      destination: 'santorini',
      features: ['5 Days in Santorini', 'Private Villa', 'Romantic Dinner', 'Island Tour'],
      featured: false,
    },
    {
      name: 'Adventure Rush',
      price: '$1,899',
      destination: 'swiss-alps',
      features: ['7 Days in Swiss Alps', 'Skiing Equipment', 'Mountain Guide', 'Luxury Cabin'],
      featured: true,
      tag: 'Most Popular',
    },
    {
      name: 'Tropical Escape',
      price: '$999',
      destination: 'hawaii',
      features: ['5 Days in Hawaii', 'Surfing Lessons', 'Breakfast Included', 'Beachfront Hotel'],
      featured: false,
    },
  ];

  const renderDestinations = () => {
    const container = document.querySelector('.destination-cards');
    if (!container) return;
    container.innerHTML = destinationsData
      .map(
        (dest) => `
      <article class="destination-card reveal">
        <div class="destination-image">
          <img src="${dest.image}" alt="${dest.name}" loading="lazy" width="500" height="200" />
        </div>
        <div class="destination-info">
          <h3>${dest.name}</h3>
          <p>${dest.description}</p>
          <button type="button" class="details"
            data-title="${dest.name}"
            data-image="${dest.image}"
            data-description="${dest.details}"
            data-slug="${dest.slug}">
            View Details
          </button>
        </div>
      </article>
    `
      )
      .join('');
  };

  const renderPackages = () => {
    const container = document.querySelector('.package-cards');
    if (!container) return;
    container.innerHTML = packagesData
      .map(
        (pkg) => `
      <div class="package-card ${pkg.featured ? 'featured' : ''} reveal">
        ${pkg.featured ? `<div class="tag">${pkg.tag}</div>` : ''}
        <div class="package-header">
          <h3>${pkg.name}</h3>
          <p class="price">${pkg.price}</p>
        </div>
        <ul class="package-features">
          ${pkg.features.map((feat) => `<li><i class="fa-solid fa-check" aria-hidden="true"></i> ${feat}</li>`).join('')}
        </ul>
        <a href="ticket.html?destination=${pkg.destination}" class="book-package-btn">Book Package</a>
      </div>
    `
      )
      .join('');
  };

  renderDestinations();
  renderPackages();

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  const observeReveals = () => {
    document.querySelectorAll('.reveal:not(.active)').forEach((el) => revealObserver.observe(el));
  };
  observeReveals();

  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    const openMenu = () => {
      hamburger.setAttribute('aria-expanded', 'true');
      navLinks.classList.add('open');
      const firstLink = navLinks.querySelector('a');
      if (firstLink) firstLink.focus();
    };

    const closeMenu = () => {
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      hamburger.focus();
    };

    hamburger.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  const scrollTargets = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = scrollTargets
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length > 0) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          scrollTargets.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
              link.setAttribute('aria-current', 'location');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }

  const ticketForm = document.getElementById('ticketForm');

  if (ticketForm) {
    const inputs = {
      fullName: document.getElementById('fullName'),
      email: document.getElementById('email'),
      destination: document.getElementById('destination'),
      date: document.getElementById('date'),
      tickets: document.getElementById('tickets'),
    };
    const ticketStatus = document.getElementById('ticketStatus');

    const resetField = (input) => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('invalid', 'valid');
      input.classList.remove('error', 'success');
      input.removeAttribute('aria-invalid');
    };

    const setInvalid = (input) => {
      const group = input.closest('.form-group');
      if (group) group.classList.add('invalid');
      input.classList.add('error');
      input.classList.remove('success');
      input.setAttribute('aria-invalid', 'true');
    };

    const setValid = (input) => {
      const group = input.closest('.form-group');
      if (group) {
        group.classList.remove('invalid');
        group.classList.add('valid');
      }
      input.classList.add('success');
      input.classList.remove('error');
      input.removeAttribute('aria-invalid');
    };

    const validators = {
      fullName: (value) => value.trim().length > 3,
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      destination: (value) => value !== '',
      date: (value) => {
        if (!value) return false;
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      tickets: (value) => Number(value) >= 1 && Number(value) <= 10,
    };

    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (inputs.date) inputs.date.min = todayIso;

    const validateInput = (input) => {
      const validator = validators[input.name];
      if (!validator) return false;
      return validator(input.value);
    };

    const handleInput = (e) => {
      const input = e.target;
      resetField(input);
      validateInput(input) ? setValid(input) : setInvalid(input);
    };

    Object.values(inputs).forEach((input) => {
      if (input) {
        input.addEventListener('input', handleInput);
        input.addEventListener('blur', handleInput);
      }
    });

    const params = new URLSearchParams(window.location.search);
    const preselected = params.get('destination');
    if (preselected && inputs.destination) {
      const hasOption = Array.from(inputs.destination.options).some(
        (option) => option.value === preselected
      );
      if (hasOption) {
        inputs.destination.value = preselected;
        setValid(inputs.destination);
      }
    }

    ticketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      Object.entries(inputs).forEach(([name, input]) => {
        if (!input) return;
        if (!validators[name](input.value)) {
          setInvalid(input);
          isValid = false;
        } else {
          setValid(input);
        }
      });

      if (!isValid) {
        if (ticketStatus) {
          ticketStatus.textContent = 'Please fix the highlighted fields and try again.';
          ticketStatus.classList.add('error');
        }
        return;
      }

      if (ticketStatus) {
        ticketStatus.textContent = 'Booking confirmed! Thank you for choosing GlobeTrek.';
        ticketStatus.classList.remove('error');
      }
      ticketForm.reset();
      Object.values(inputs).forEach((input) => {
        if (!input) return;
        input.classList.remove('success', 'error');
        const group = input.closest('.form-group');
        if (group) group.classList.remove('valid', 'invalid');
      });
      if (inputs.tickets) inputs.tickets.value = '1';
    });
  }

  const modal = document.getElementById('detailsModal');

  if (modal) {
    const modalContent = modal.querySelector('.modal-content');
    const closeModalButton = modal.querySelector('.close-modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const modalBookLink = modal.querySelector('.book-now-modal');
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let lastFocused = null;

    const closeModal = () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    };

    const openModal = (trigger) => {
      lastFocused = trigger;
      const title = trigger.getAttribute('data-title');
      const image = trigger.getAttribute('data-image');
      const description = trigger.getAttribute('data-description');
      const slug = trigger.getAttribute('data-slug');

      if (modalTitle) modalTitle.textContent = title || '';
      if (modalImage) {
        modalImage.src = image || '';
        modalImage.alt = title || '';
      }
      if (modalDescription) modalDescription.textContent = description || '';
      if (modalBookLink) {
        modalBookLink.href = slug ? `ticket.html?destination=${slug}` : 'ticket.html';
      }

      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeModalButton) closeModalButton.focus();
    };

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.details');
      if (trigger) openModal(trigger);
    });

    if (closeModalButton) closeModalButton.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('show')) return;

      if (e.key === 'Escape') {
        closeModal();
        return;
      }

      if (e.key === 'Tab' && modalContent) {
        const focusable = Array.from(modalContent.querySelectorAll(focusableSelector)).filter(
          (el) => el.offsetParent !== null
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const contactStatus = document.getElementById('contactStatus');
    const contactFields = Array.from(contactForm.querySelectorAll('input, textarea'));

    contactFields.forEach((field) => {
      field.addEventListener('input', () => field.removeAttribute('aria-invalid'));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const invalid = contactFields.filter(
        (field) =>
          !field.value.trim() ||
          (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))
      );

      contactFields.forEach((field) => field.removeAttribute('aria-invalid'));

      if (invalid.length > 0) {
        invalid.forEach((field) => field.setAttribute('aria-invalid', 'true'));
        if (contactStatus) {
          contactStatus.textContent = 'Please complete all fields with a valid email address.';
          contactStatus.classList.add('error');
        }
        invalid[0].focus();
        return;
      }

      if (contactStatus) {
        contactStatus.textContent = 'Message sent! We will get back to you shortly.';
        contactStatus.classList.remove('error');
      }
      contactForm.reset();
    });
  }

  const footerYear = document.querySelector('footer p');
  if (footerYear) {
    footerYear.innerHTML = `&copy; ${new Date().getFullYear()} GlobeTrek. All rights reserved.`;
  }
});
