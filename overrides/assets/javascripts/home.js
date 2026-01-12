// ===== UTILITY FUNCTIONS =====

/**
 * Calculate years of experience from start date to today
 */
function diff_years(dt2, dt1) {
  const diff = (dt2.getTime() - dt1.getTime()) / 1000;
  const days = diff / (60 * 60 * 24);
  return Math.abs(Math.round(days / 365.25));
}

const startDate = new Date(2017, 11, 4); // December 4, 2017
const today = new Date();
const yearsExpElement = document.getElementById('yearsofexp');
if (yearsExpElement) {
  yearsExpElement.innerHTML = diff_years(today, startDate);
}

// ===== BLOG POSTS DATA MANAGEMENT =====

let posts = [];

/**
 * Load blog posts from CSV file using PapaParse
 */
function loadPostsFromCSV() {
  if (typeof Papa === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js';
    script.onload = function() { loadPostsFromCSV(); };
    document.head.appendChild(script);
    return;
  }
  
  // Get the CSV path from the data attribute if available
  const blogPostsDiv = document.getElementById('blog-posts');
  const csvPath = blogPostsDiv ? blogPostsDiv.dataset.csvPath : 'data/blog_posts.csv';
  
  Papa.parse(csvPath, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      posts = results.data.map(post => ({
        title: post.title,
        url: /^https?:\/\//.test(post.path) 
          ? post.path 
          : post.path.split('/').map(s => encodeURIComponent(s.trim())).join('/'),
        topics: post.topics ? post.topics.split('|').map(s => s.trim()) : [],
        excerpt: post.excerpt || ''
      }));
      renderPosts('All');
    }
  });
}

loadPostsFromCSV();

/**
 * Render filtered blog posts to the page
 * @param {string} filterTopic - Topic to filter by or 'All'
 * @param {boolean} showAll - Whether to show all posts or limit to maxPosts
 */
function renderPosts(filterTopic, showAll = false) {
  const container = document.getElementById('blog-cards');
  if (!container) return;
  
  const filtered = posts.filter(p => 
    filterTopic === 'All' || p.topics.indexOf(filterTopic) !== -1
  );
  
  if (!filtered.length) {
    container.innerHTML = '<div class="col-12"><p><em>No posts found for this topic.</em></p></div>';
    return;
  }
  
  const maxPosts = 8;
  const shouldLimit = !showAll && filtered.length > maxPosts;
  const displayPosts = shouldLimit ? filtered.slice(0, maxPosts) : filtered;
  
  let html = displayPosts.map(p => `
    <div class="card col-md-6 col-lg-4 mb-3" style="border: none; border-radius: 0; padding-right: 0.75rem; padding-left: 0.25rem;">
      <div class="card-body" style="border: 2px solid transparent; width: 100%; color: black;
                                    border-image-source: linear-gradient(89deg, #2f6df6 49.562%, #000d85 69.38%, #0edefb 89.14%);
                                    border-image-slice: 1;">
        <h5 class="card-title d-flex justify-content-between align-items-center" style="color:black;">${p.title}</h5>
        <p class="card-text">${p.excerpt}</p>
        <p class="card-text"><small class="text-muted">Topics: ${p.topics.join(', ')}</small></p>
        <a href="${p.url}" class="stretched-link"></a>
      </div>
    </div>
  `).join('');
  
  if (shouldLimit) {
    html += `
    <div class="card col-md-6 col-lg-4 mb-3" style="border: none; border-radius: 0; padding-right: 0.5rem; padding-left: 0.5rem; cursor: pointer;" 
         onclick="renderPosts('All', true); document.querySelectorAll('#blog-filters .active').forEach(el => el.classList.remove('active')); document.querySelector('#blog-filters [data-topic=\\'All\\']').classList.add('active');">
      <div class="card-body" style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 200px; border: 2px solid transparent; width: 100%; color: black;
                                    border-image-source: linear-gradient(89deg, #2f6df6 49.562%, #000d85 69.38%, #0edefb 89.14%);
                                    border-image-slice: 1;">
        <h5 class="card-title" style="color:black; font-size: 1rem; margin-bottom: 1rem;">View All Posts</h5>
        <p class="card-text" style="text-align: center;">Click here to see all ${filtered.length} blog posts</p>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 3rem; height: 3rem; fill: black; margin-top: 1rem;">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
        </svg>
      </div>
    </div>
    `;
  }
  
  container.innerHTML = html;
}

// ===== EVENT HANDLERS & INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
  // Set default active filter
  const defaultBtn = document.querySelector('#blog-filters [data-topic="All"]');
  if (defaultBtn) defaultBtn.classList.add('active');

  const blogFilters = document.getElementById('blog-filters');
  const moreTopicsBtn = document.getElementById('more-topics-btn');
  const moreTopicsMenu = document.getElementById('more-topics-menu');
  
  // Blog filter click handler
  if (blogFilters) {
    blogFilters.addEventListener('click', function(e) {
      const btn = e.target.closest('button[data-topic], a[data-topic]');
      if (!btn) return;
      
      e.preventDefault();
      
      // Remove active class from all filters
      Array.from(this.querySelectorAll('.active')).forEach(el => el.classList.remove('active'));

      if (btn.tagName.toLowerCase() === 'a') {
        // Dropdown item selected
        if (moreTopicsBtn) moreTopicsBtn.classList.add('active');
        btn.classList.add('active');
        if (moreTopicsMenu) moreTopicsMenu.classList.remove('show');
      } else {
        // Top-level button selected
        btn.classList.add('active');
        if (moreTopicsBtn) moreTopicsBtn.classList.remove('active');
        if (moreTopicsMenu) moreTopicsMenu.classList.remove('show');
      }

      renderPosts(btn.getAttribute('data-topic'));
    });
  }

  // Dropdown toggle
  if (moreTopicsBtn) {
    moreTopicsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (moreTopicsMenu) moreTopicsMenu.classList.toggle('show');
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (blogFilters && !blogFilters.contains(e.target)) {
      if (moreTopicsMenu) moreTopicsMenu.classList.remove('show');
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (moreTopicsMenu) moreTopicsMenu.classList.remove('show');
    }
  });
});
