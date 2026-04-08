const API_URL = "https://ll.thespacedevs.com/2.2.0/launch/?format=json&limit=12";
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
  if (launch.image && typeof launch.image === "string") {
    return launch.image;
  }

  return "https://via.placeholder.com/800x500?text=No+Image";
}

function createLaunchCard(launch) {
  const name = launch.name || "Unnamed Launch";
  const status = launch.status ? launch.status.name : "Not available";
  const provider = launch.launch_service_provider
    ? launch.launch_service_provider.name
    : "Not available";
  const rocket =
    launch.rocket && launch.rocket.configuration
      ? launch.rocket.configuration.full_name
      : "Not available";
  const location =
    launch.pad && launch.pad.location
      ? launch.pad.location.name
      : "Not available";
  const missionDescription =
    launch.mission && launch.mission.description
      ? launch.mission.description
      : "Mission details not available.";
  const imageUrl = getImageUrl(launch);

  return `
    <article class="launch-card">
      <div class="launch-image-wrapper">
        <img class="launch-image" src="${imageUrl}" alt="${name}">
      </div>

      <div class="launch-content">
        <div class="launch-top">
          <span class="status-pill">${status}</span>
          <h3 class="launch-name">${name}</h3>
        </div>

        <div class="launch-meta">
          <div class="meta-row">
            <span class="meta-label">Provider</span>
            <span class="meta-value">${provider}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Rocket</span>
            <span class="meta-value">${rocket}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Location</span>
            <span class="meta-value">${location}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Launch Time</span>
            <span class="meta-value">${formatDate(launch.net)}</span>
          </div>
        </div>

        <p class="launch-description">${missionDescription}</p>
      </div>
    </article>
  `;
}

function renderLaunches(data) {
  if (data.length === 0) {
    launchesGrid.innerHTML = `<div class="status-card">No launches found.</div>`;
  } else {
    launchesGrid.innerHTML = data.map(createLaunchCard).join("");
  }

  launchesGrid.classList.remove("hidden");
}

function applyFiltersAndSort() {
  const searchValue = searchInput.value.toLowerCase().trim();
  const selectedStatus = statusFilter.value;
  const selectedSort = sortSelect.value;

  filteredLaunches = allLaunches.filter((launch) => {
    const matchesSearch = launch.name.toLowerCase().includes(searchValue);
    const matchesStatus =
      selectedStatus === "all" ||
      (launch.status && launch.status.name === selectedStatus);

    return matchesSearch && matchesStatus;
  });

  if (selectedSort === "date-asc") {
    filteredLaunches.sort((a, b) => new Date(a.net) - new Date(b.net));
  } else if (selectedSort === "date-desc") {
    filteredLaunches.sort((a, b) => new Date(b.net) - new Date(a.net));
  } else if (selectedSort === "name-asc") {
    filteredLaunches.sort((a, b) => a.name.localeCompare(b.name));
  } else if (selectedSort === "name-desc") {
    filteredLaunches.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderLaunches(filteredLaunches);
}

async function fetchLaunches() {
  loading.classList.remove("hidden");
  errorBox.classList.add("hidden");
  launchesGrid.classList.add("hidden");

  try {
    const cachedRaw = localStorage.getItem("launchCache");
    const cached = cachedRaw ? JSON.parse(cachedRaw) : null;

    if (cached && Date.now() - cached.time < CACHE_TIME) {
      allLaunches = cached.data;
      filteredLaunches = [...allLaunches];
      renderLaunches(filteredLaunches);
      loading.classList.add("hidden");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(API_URL, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to fetch launch data.");
    }

    const data = await response.json();

    allLaunches = data.results || [];
    filteredLaunches = [...allLaunches];

    if (allLaunches.length === 0) {
      throw new Error("No launch data found.");
    }

    localStorage.setItem(
      "launchCache",
      JSON.stringify({
        data: allLaunches,
        time: Date.now()
      })
    );

    renderLaunches(filteredLaunches);
  } catch (err) {
    errorBox.textContent = err.name === "AbortError"
      ? "Request took too long. Please try again."
      : "Error loading data.";
    errorBox.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

searchInput.addEventListener("input", applyFiltersAndSort);
statusFilter.addEventListener("change", applyFiltersAndSort);
sortSelect.addEventListener("change", applyFiltersAndSort);

fetchLaunches();