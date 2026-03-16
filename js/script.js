
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