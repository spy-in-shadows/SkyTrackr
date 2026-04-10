const API_URL = "https://ll.thespacedevs.com/2.2.0/launch/?format=json&ordering=-net&limit=50";
const CACHE_TIME = 30 * 60 * 1000;

let allLaunches = [];
let filteredLaunches = [];

const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const launchesGrid = document.getElementById("launches-grid");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const sortSelect = document.getElementById("sortSelect");

function formatDate(dateString) {
  if (!dateString) return "Not available";
  return new Date(dateString).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function getImageUrl(launch) {
  return launch.image || "https://via.placeholder.com/800x500?text=No+Image";
}

function createLaunchCard(launch) {
  return `
    <article class="launch-card">
      <div class="launch-image-wrapper">
        <img class="launch-image" src="${getImageUrl(launch)}">
      </div>

      <div class="launch-content">
        <span class="status-pill">${launch.status?.name || "N/A"}</span>
        <h3 class="launch-name">${launch.name}</h3>

        <div class="launch-meta">
          <div class="meta-row">
            <span class="meta-label">Provider</span>
            <span class="meta-value">${launch.launch_service_provider?.name || "N/A"}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Rocket</span>
            <span class="meta-value">${launch.rocket?.configuration?.full_name || "N/A"}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Location</span>
            <span class="meta-value">${launch.pad?.location?.name || "N/A"}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Launch Time</span>
            <span class="meta-value">${formatDate(launch.net)}</span>
          </div>
        </div>

        <p class="launch-description">
          ${launch.mission?.description || "Mission details not available."}
        </p>
      </div>
    </article>
  `;
}

function renderLaunches(data) {
  const visible = data.slice(0, 20);

  if (visible.length === 0) {
    launchesGrid.innerHTML = `<div class="status-card">No launches found</div>`;
  } else {
    launchesGrid.innerHTML = visible.map(createLaunchCard).join("");
  }

  launchesGrid.classList.remove("hidden");
}

function applyFiltersAndSort() {
  const search = searchInput.value.toLowerCase().trim();
  const status = statusFilter.value;
  const sort = sortSelect.value;

  filteredLaunches = allLaunches.filter((launch) => {
    const matchesSearch = launch.name.toLowerCase().includes(search);
    const matchesStatus =
      status === "all" ||
      (launch.status && launch.status.name === status);

    return matchesSearch && matchesStatus;
  });

  if (sort === "date-asc") {
    filteredLaunches.sort((a, b) => new Date(a.net) - new Date(b.net));
  } else if (sort === "date-desc") {
    filteredLaunches.sort((a, b) => new Date(b.net) - new Date(a.net));
  } else if (sort === "name-asc") {
    filteredLaunches.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "name-desc") {
    filteredLaunches.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderLaunches(filteredLaunches);
}

async function fetchLaunches() {
  loading.classList.remove("hidden");
  errorBox.classList.add("hidden");
  launchesGrid.classList.add("hidden");

  try {
    const cache = JSON.parse(localStorage.getItem("launchCache"));

    if (
      cache &&
      cache.version === "v3" &&
      Date.now() - cache.time < CACHE_TIME
    ) {
      allLaunches = cache.data;
    } else {
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error("API failed");
      }

      const data = await res.json();
      allLaunches = data.results || [];

      localStorage.setItem(
        "launchCache",
        JSON.stringify({
          data: allLaunches,
          time: Date.now(),
          version: "v3"
        })
      );
    }

    filteredLaunches = [...allLaunches];
    applyFiltersAndSort();

  } catch (err) {
    errorBox.textContent = "Error loading data";
    errorBox.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

searchInput.addEventListener("input", applyFiltersAndSort);
statusFilter.addEventListener("change", applyFiltersAndSort);
sortSelect.addEventListener("change", applyFiltersAndSort);

fetchLaunches();