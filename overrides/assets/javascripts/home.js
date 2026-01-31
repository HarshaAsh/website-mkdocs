// ===== YEARS OF EXPERIENCE CALCULATOR =====
function calculateYearsOfExperience() {
  const diff_years = (dt2, dt1) => {
    const diff = (dt2.getTime() - dt1.getTime()) / 1000;
    const days = diff / (60 * 60 * 24);
    return Math.abs(Math.round(days / 365.25));
  };
  
  const dt1 = new Date(2017, 9, 4); // October 4, 2017
  const dt2 = new Date();
  const years = diff_years(dt2, dt1);
  const yearsExpElement = document.getElementById("yearsofexp");
  if (yearsExpElement) {
    yearsExpElement.innerHTML = years + "+";
  }
}

// ===== BLOG POSTS MANAGEMENT =====
let allPosts = [];

function loadBlogPosts() {
  const csvData = document.getElementById('csv-data');
  const csvPath = csvData ? csvData.dataset.csvPath : 'data/blog_posts.csv';
  
  if (typeof Papa === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js';
    script.onload = () => loadPostsFromCSV(csvPath);
    document.head.appendChild(script);
  } else {
    loadPostsFromCSV(csvPath);
  }
}

function loadPostsFromCSV(csvPath) {
  fetch(csvPath)
    .then(response => response.text())
    .then(data => {
      Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          allPosts = results.data;
          renderBlogPosts('All');
          setupFilterButtons();
        }
      });
    })
    .catch(err => console.error('Error loading posts:', err));
}

function renderBlogPosts(filter) {
  const container = document.getElementById('blog-cards-home');
  if (!container) return;
  
  let filtered = allPosts;

  if (filter !== 'All') {
    filtered = allPosts.filter(post => 
      post.topics && post.topics.split('|').map(t => t.trim()).includes(filter)
    );
  }

  // Show only first 6 posts
  filtered = filtered.slice(0, 6);

  let html = '';
  filtered.forEach(post => {
    const topics = post.topics ? post.topics.split('|').map(t => t.trim()) : [];
    html += `
      <div class="blog-card">
        <div class="blog-card-header">
          <h3>${post.title}</h3>
        </div>
        <div class="blog-card-body">
          <p class="blog-excerpt">${post.excerpt || 'Explore this data science topic.'}</p>
          <div class="blog-tags">
            ${topics.slice(0, 3).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
          </div>
          <a href="${post.url}" style="margin-top: 1rem; color: #4051b5; text-decoration: none; font-weight: 600;">Read More →</a>
        </div>
      </div>
    `;
  });

  container.innerHTML = html || '<p style="grid-column: 1/-1; text-align: center;">No posts found for this category.</p>';
}

function setupFilterButtons() {
  const blogFilters = document.getElementById('blog-filters-home');
  if (!blogFilters) return;

  const moreTopicsBtn = document.getElementById('more-topics-btn-home');
  const moreTopicsMenu = document.getElementById('more-topics-menu-home');

  blogFilters.addEventListener('click', (e) => {
    const topicBtn = e.target.closest('a[data-topic]');
    if (!topicBtn) return;

    e.preventDefault();
    blogFilters.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
    topicBtn.classList.add('active');

    if (topicBtn.classList.contains('dropdown-item')) {
      if (moreTopicsBtn) moreTopicsBtn.classList.add('active');
    } else {
      if (moreTopicsBtn) moreTopicsBtn.classList.remove('active');
      if (moreTopicsMenu) moreTopicsMenu.classList.remove('show');
    }

    renderBlogPosts(topicBtn.dataset.topic);
  });

  if (moreTopicsBtn) {
    moreTopicsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (moreTopicsMenu) moreTopicsMenu.classList.toggle('show');
    });
  }

  document.addEventListener('click', (e) => {
    if (blogFilters && !blogFilters.contains(e.target)) {
      if (moreTopicsMenu) moreTopicsMenu.classList.remove('show');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (moreTopicsMenu) moreTopicsMenu.classList.remove('show');
    }
  });
}

// ===== PARTICLES.JS INITIALIZATION =====
function initParticles() {
  if (window.particlesJS && document.getElementById('particles-js')) {
    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": 80,
          "density": { "enable": true, "value_area": 800 }
        },
        "color": { "value": "#00bfff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.8, "random": false },
        "size": { "value": 4, "random": true },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#00bfff",
          "opacity": 0.6,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "out_mode": "bounce"
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": true, "mode": "grab" },
          "onclick": { "enable": true, "mode": "push" },
          "resize": true
        },
        "modes": {
          "grab": { "distance": 200, "line_linked": { "opacity": 1 } },
          "push": { "particles_nb": 4 }
        }
      },
      "retina_detect": true
    });
  }
}

// ===== INITIALIZATION =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    calculateYearsOfExperience();
    loadBlogPosts();
    initParticles();
  });
} else {
  calculateYearsOfExperience();
  loadBlogPosts();
  initParticles();
}
