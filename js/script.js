
const DEFAULT_USER = "admin";
const DEFAULT_PASS = "admin123";


let allIssues = [];
let openIssues = [];
let closedIssues = [];
let currentTab = "all";


const loginPage = document.getElementById("login-page");
const mainPage = document.getElementById("main-page");
const loginForm = document.getElementById("login-form");
const issuesGrid = document.getElementById("issues-grid");
const loading = document.getElementById("loading");
const issueCountEl = document.getElementById("issue-count");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const tabButtons = document.querySelectorAll(".tab-btn");
const modal = document.getElementById("issue-modal");
const closeBtn = document.querySelector(".close-btn");


loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === DEFAULT_USER && password === DEFAULT_PASS) {
        loginPage.classList.add("hidden");
        mainPage.classList.remove("hidden");
        loadAllIssues();
    } else {
        alert("Invalid credentials! Use: admin / admin123");
    }
});

async function loadAllIssues() {
    loading.classList.remove("hidden");
    issuesGrid.innerHTML = "";

    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await res.json();

        if (data.status === "success") {
            allIssues = data.data || [];

            openIssues = allIssues.filter(issue => issue.status?.toLowerCase() === "open");
            closedIssues = allIssues.filter(issue => issue.status?.toLowerCase() === "closed");


            renderIssues(allIssues);
            updateCount(allIssues.length);
        } else {
            issuesGrid.innerHTML = "<p style='text-align:center;color:red'>API returned error</p>";
        }
    } catch (err) {
        console.error("Fetch error:", err);
        issuesGrid.innerHTML = "<p style='text-align:center;color:red'>Failed to load issues. Check internet or console.</p>";
    } finally {
        loading.classList.add("hidden");
    }
}


function updateCount(count) {
  issueCountEl.textContent = count || 0;
}


function renderIssues(issues) {
  issuesGrid.innerHTML = "";

  if (issues.length === 0) {
    issuesGrid.innerHTML = "<p style='text-align:center; color:#586069; padding:40px;'>No issues found</p>";
    return;
  }

  issues.forEach(issue => {
    const card = document.createElement("div");
    card.className = `issue-card ${issue.status?.toLowerCase() === "open" ? "open-border" : "closed-border"}`;
    
    const shortDesc = issue.description?.length > 120 
      ? issue.description.substring(0, 120) + "..." 
      : issue.description || "No description";

    card.innerHTML = `
      <div class="card-content">
        <div class="card-title">${issue.title || "Untitled Issue"}</div>
        <div class="card-desc">${shortDesc}</div>
        <div class="card-meta">
          <div>
            ${(issue.labels || []).map(label => `<span class="label">${label}</span>`).join("")}
          </div>
          <div>${issue.author || "Unknown"} • ${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "N/A"}</div>
        </div>
      </div>
    `;

    card.addEventListener("click", () => showModal(issue));
    issuesGrid.appendChild(card);
  });
}

function showModal(issue) {
  document.getElementById("modal-title").textContent = issue.title || "No Title";
  document.getElementById("modal-description").textContent = issue.description || "No description available.";
  document.getElementById("modal-status").textContent = (issue.status || "unknown").toUpperCase();
  document.getElementById("modal-priority").textContent = (issue.priority || "N/A").toUpperCase();
  document.getElementById("modal-author").textContent = issue.author || "Unknown";
  document.getElementById("modal-assignee").textContent = issue.assignee || "Unassigned";
  document.getElementById("modal-labels").textContent = (issue.labels || []).join(", ") || "None";
  document.getElementById("modal-created").textContent = issue.createdAt 
    ? new Date(issue.createdAt).toLocaleString() 
    : "N/A";

  modal.classList.remove("hidden");
}


closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});


tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentTab = btn.dataset.tab;

    if (currentTab === "all") {
      renderIssues(allIssues);
      updateCount(allIssues.length);
    } else if (currentTab === "open") {
      renderIssues(openIssues);
      updateCount(openIssues.length);
    } else if (currentTab === "closed") {
      renderIssues(closedIssues);
      updateCount(closedIssues.length);
    }
  });
});


searchBtn.addEventListener("click", performSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch();
});

async function performSearch() {
  const query = searchInput.value.trim();
  if (!query) {
   
    if (currentTab === "all") renderIssues(allIssues);
    else if (currentTab === "open") renderIssues(openIssues);
    else if (currentTab === "closed") renderIssues(closedIssues);
    return;
  }

  loading.classList.remove("hidden");
  issuesGrid.innerHTML = "";

  try {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.status === "success") {
      renderIssues(data.data || []);
      updateCount(data.total || data.data?.length || 0);
    } else {
      issuesGrid.innerHTML = "<p style='text-align:center;color:red'>Search failed</p>";
    }
  } catch (err) {
    console.error("Search error:", err);
    issuesGrid.innerHTML = "<p style='text-align:center;color:red'>Search error occurred</p>";
  } finally {
    loading.classList.add("hidden");
  }
}