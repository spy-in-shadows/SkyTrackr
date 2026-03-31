const API_URL = "https://ll.thespacedevs.com/2.2.0/launch/?format=json&limit=12";

const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const launchesGrid = document.getElementById("launches-grid");

function formatDate(dateString) {
  if (!dateString) {
    return "Not available";
  }

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
      <img class="launch-image" src="${imageUrl}" alt="${name}">
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

const CACHE_TIME = 30 * 60 * 1000;

async function fetchLaunches() {
  const cached = JSON.parse(localStorage.getItem("launchCache"));

  if (cached && Date.now() - cached.time < CACHE_TIME) {
    launchesGrid.innerHTML = cached.data.map(createLaunchCard).join("");
    launchesGrid.classList.remove("hidden");
    loading.classList.add("hidden");
    return;
  }

  loading.classList.remove("hidden");

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    localStorage.setItem("launchCache", JSON.stringify({
      data: data.results,
      time: Date.now()
    }));

    launchesGrid.innerHTML = data.results.map(createLaunchCard).join("");
    launchesGrid.classList.remove("hidden");
  } catch (err) {
    errorBox.textContent = "Error loading data";
    errorBox.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

fetchLaunches();