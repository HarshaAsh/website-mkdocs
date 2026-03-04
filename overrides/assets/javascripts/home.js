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

function renderBlogPosts(filter, showAll = false) {
  const container = document.getElementById('blog-cards-home');
  if (!container) return;
  
  let filtered = allPosts;

  if (filter !== 'All') {
    filtered = allPosts.filter(post => 
      post.topics && post.topics.split('|').map(t => t.trim()).includes(filter)
    );
  }

  const maxPosts = 8;
  const shouldLimit = !showAll && filtered.length > maxPosts;
  const displayPosts = shouldLimit ? filtered.slice(0, maxPosts) : filtered;

  // Detect current language from URL path
  const currentPath = window.location.pathname;
  let langPrefix = '';
  if (currentPath.startsWith('/hi/')) {
    langPrefix = '/hi';
  } else if (currentPath.startsWith('/te/')) {
    langPrefix = '/te';
  }

  let html = '';
  displayPosts.forEach(post => {
    const topics = post.topics ? post.topics.split('|').map(t => t.trim()) : [];
    
    // Convert absolute URL to relative path and add language prefix
    let blogUrl = post.url;
    if (blogUrl && langPrefix) {
      // Extract path from full URL (e.g., "https://www.harshaash.com/Python/CrewAI" -> "/Python/CrewAI")
      const urlPath = blogUrl.replace('https://www.harshaash.com', '');
      // Add language prefix
      blogUrl = langPrefix + urlPath;
    } else if (blogUrl) {
      // For English, just use relative path
      blogUrl = blogUrl.replace('https://www.harshaash.com', '');
    }
    
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
          <a href="${blogUrl}" class="blog-read-more">Read More →</a>
        </div>
      </div>
    `;
  });

  // Add "View All Posts" card if there are more posts
  if (shouldLimit) {
    html += `
      <div class="blog-card view-all-posts-card" onclick="viewAllPosts()">
        <div class="view-all-posts-content">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="view-all-posts-icon">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
          <h3>View All Posts</h3>
          <p>Click to see all ${filtered.length} blog posts</p>
        </div>
      </div>
    `;
  }

  container.innerHTML = html || '<p class="blog-empty">No posts found for this category.</p>';

  // Hide or show the "View All Blog Posts" button
  const viewAllLink = document.querySelector('.view-all-link');
  if (viewAllLink) {
    viewAllLink.style.display = showAll ? 'none' : 'block';
  }
}

function viewAllPosts() {
  const activeFilter = document.querySelector('#blog-filters-home .active');
  const filter = activeFilter ? activeFilter.dataset.topic : 'All';
  renderBlogPosts(filter, true);
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
