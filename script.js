document.addEventListener('DOMContentLoaded', () => {
  // --- Data & Rendering ---
  const destinationsData = [
    {
      id: 1,
      name: "Hawaii",
      description: "Experience the tropical paradise with stunning beaches and vibrant culture.",
      image: "https://images.unsplash.com/photo-1509610696553-9243c1e230f0?w=500&auto=format&fit=crop&q=60",
      details: "Experience the tropical paradise of Hawaii. From surfing in the Pacific to hiking volcanic craters, this destination offers a perfect blend of adventure and relaxation. Enjoy traditional luaus and vibrant nightlife."
    },
    {
      id: 2,
      name: "Swiss Alps",
      description: "Enjoy breathtaking mountain views and world-class skiing.",
      image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=500&auto=format&fit=crop&q=60",
      details: "The Swiss Alps offer breathtaking mountain scenery and world-class skiing. Whether you're hitting the slopes or enjoying a cozy fondue in a chalet, it's an unforgettable winter wonderland."
    },
    {
      id: 3,
      name: "Santorini",
      description: "Explore the iconic white-washed buildings and stunning sunsets.",
      image: "https://images.unsplash.com/photo-1678266561093-324802646fb2?w=500&auto=format&fit=crop&q=60",
      details: "Santorini is famous for its stunning sunsets and white-washed buildings. Explore clear blue waters, ancient ruins, and delicious Greek cuisine in this romantic getaway."
    }
  ];

  const packagesData = [
    {
      name: "Honeymoon Special",
      price: "$1,299",
      features: ["5 Days in Santorini", "Private Villa", "Romantic Dinner", "Island Tour"],
      featured: false
    },
    {
      name: "Adventure Rush",
      price: "$1,899",
      features: ["7 Days in Swiss Alps", "Skiing Equipment", "Mountain Guide", "Luxury Cabin"],
      featured: true,
      tag: "Most Popular"
    },
    {
      name: "Tropical Escape",
      price: "$999",
      features: ["5 Days in Hawaii", "Surfing Lessons", "Breakfast Included", "Beachfront Hotel"],
      featured: false
    }
  ];

  const renderDestinations = () => {
    const container = document.querySelector('.destination-cards');
    if (!container) return;
    container.innerHTML = destinationsData.map(dest => `
      <article class="destination-card reveal">
        <div class="destination-image">
          <img src="${dest.image}" alt="${dest.name}" loading="lazy" />
        </div>
        <div class="destination-info">
          <h3>${dest.name}</h3>
          <p>${dest.description}</p>
          <button class="details" 
            data-title="${dest.name}"
            data-image="${dest.image}"
            data-description="${dest.details}">
            View Details
          </button>
        </div>
      </article>
    `).join('');
  };

  const renderPackages = () => {
    const container = document.querySelector('.package-cards');
    if (!container) return;
    container.innerHTML = packagesData.map(pkg => `
      <div class="package-card ${pkg.featured ? 'featured' : ''} reveal">
        ${pkg.featured ? `<div class="tag">${pkg.tag}</div>` : ''}
        <div class="package-header">
          <h3>${pkg.name}</h3>
          <p class="price">${pkg.price}</p>
        </div>
        <ul class="package-features">
          ${pkg.features.map(feat => `<li><i class="fa-solid fa-check"></i> ${feat}</li>`).join('')}
        </ul>
        <a href="ticket.html" class="book-package-btn">Book Package</a>
      </div>
    `).join('');
  };

  renderDestinations();
  renderPackages();

  // Re-observe new elements for animation
  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Re-attach modal listeners
    attachModalListeners();
  }, 100);


  // --- Navigation Logic ---
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');

  if (btn && nav) {
    const openMenu = () => {
      btn.setAttribute('aria-expanded', 'true');
      nav.classList.add('open');
      const firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    };

    const closeMenu = () => {
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      btn.focus();
    };

    btn.addEventListener('click', () => {
      const isOpen = nav.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
      }
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !btn.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // --- Ticket Form Validation Logic ---
  const ticketForm = document.getElementById('ticketForm');

  if (ticketForm) {
    const inputs = {
      fullName: document.getElementById('fullName'),
      email: document.getElementById('email'),
      destination: document.getElementById('destination'),
      date: document.getElementById('date'),
      tickets: document.getElementById('tickets')
    };

    // Helper: Reset field status
    const resetField = (input) => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('invalid', 'valid');
      input.classList.remove('error', 'success');
    };

    // Helper: Mark field invalid
    const setInvalid = (input) => {
      const group = input.closest('.form-group');
      if (group) group.classList.add('invalid');
      input.classList.add('error');
    };

    // Helper: Mark field valid
    const setValid = (input) => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('invalid');
      input.classList.add('success');
    };

    // Validators
    const validators = {
      fullName: (value) => value.trim().length > 3,
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      destination: (value) => value !== "",
      date: (value) => {
        if (!value) return false;
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      tickets: (value) => value >= 1 && value <= 10
    };

    // Real-time validation handler
    const handleInput = (e) => {
      const input = e.target;
      const name = input.name;

      resetField(input);

      if (validators[name] && validators[name](input.value)) {
        setValid(input);
      } else {
        setInvalid(input);
      }
    };

    // Attach listeners
    Object.values(inputs).forEach(input => {
      if (input) {
        input.addEventListener('input', handleInput);
        input.addEventListener('blur', handleInput);
      }
    });

    // Form Submission
    ticketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate all fields on submit
      Object.entries(inputs).forEach(([name, input]) => {
        if (!validators[name](input.value)) {
          setInvalid(input);
          isValid = false;
        } else {
          setValid(input);
        }
      });

      if (isValid) {
        alert('Booking confirmed!\nThank you for choosing GlobeTrek.');
        ticketForm.reset();
        Object.values(inputs).forEach(input => {
          input.classList.remove('success');
        });
      }
    });
  }

  // --- Modal Logic ---
  const attachModalListeners = () => {
    const modal = document.getElementById('detailsModal');
    const detailsButtons = document.querySelectorAll('.details');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');

    if (modal && detailsButtons.length > 0) {
      // Open Modal
      detailsButtons.forEach(btn => {
        // Remove old listeners to prevent duplicates (simple approach)
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', (e) => {
          const title = newBtn.getAttribute('data-title');
          const image = newBtn.getAttribute('data-image');
          const description = newBtn.getAttribute('data-description');

          if (title) modalTitle.textContent = title;
          if (image) modalImage.src = image;
          if (description) modalDescription.textContent = description;

          modal.classList.add('show');
          document.body.style.overflow = 'hidden'; // Disable scroll
        });
      });

      // Close Modal Function
      const closeModalFunc = () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Enable scroll
      };

      if (closeModal) { // Ensure listener isn't added multiple times in a real app, but here it's okay inside the scope check if careful
        // For safety, we can just rely on the existing static listeners for close buttons if they are outside the dynamic content
      }
    }
  };

  // Static Modal Listeners (Close, click outside)
  const modal = document.getElementById('detailsModal');
  const closeModal = document.querySelector('.close-modal');
  if (modal) {
    const closeModalFunc = () => {
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    };

    if (closeModal) closeModal.addEventListener('click', closeModalFunc);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModalFunc(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('show')) closeModalFunc(); });
  }




  // --- Contact Form Logic ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Message Sent!\nWe will get back to you shortly.');
      contactForm.reset();
    });
  }
  // --- Scroll Animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  // --- Dynamic Year ---
  const footerYear = document.querySelector('footer p');
  if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${currentYear} GlobeTrek. All rights reserved.`;
  }
});
