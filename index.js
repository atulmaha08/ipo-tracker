// Static company names
const dematAccountNames = ["Aai", "Atul", "Sonali", "Vikky", "Mitesh", "Vandana", "Vikas", "Sanket", "Mitali"];

// Dropdown options
const dropdownOptions = [
  "Aai Sarswat", "Aai Hdfc", "Atul HDFC", 
  "Sonali Joint", "Sonali HDFC", "Vikky Union"
];

// Data store keyed by date
const ipoData = {};

// Load data from localStorage on page start
window.onload = function() {
  const storedData = localStorage.getItem("ipoData");
  if (storedData) {
    Object.assign(ipoData, JSON.parse(storedData));
  }
};

// Save data to localStorage
function saveData() {
  localStorage.setItem("ipoData", JSON.stringify(ipoData));
}

function loadDate() {
  const date = document.getElementById("datePicker").value;
  if (!date) {
    alert("Please select a date!");
    return;
  }
  if (!ipoData[date]) {
    ipoData[date] = []; // initialize empty IPO list for this date
    saveData();
  }
  renderDate(date);
}

function renderDate(date) {
  const container = document.getElementById("ipoContainer");
  container.innerHTML = `<h3>IPO List for ${date}</h3>
    <button onclick="addIPO('${date}')">Add IPO Name</button>
    <div class="ipo-list" id="ipoList"></div>`;

  const listContainer = document.getElementById("ipoList");

  ipoData[date].forEach((ipo, index) => {
    const block = document.createElement("div");
    block.className = "ipo-block";

    block.innerHTML = `
      <label>IPO Name: </label>
      <input type="text" value="${ipo.name}" 
             oninput="updateIPOName('${date}', ${index}, this.value)">
      <button onclick="deleteIPO('${date}', ${index})" style="float:right; background:#f44336; color:white; border:none; padding:5px 10px; cursor:pointer;">Delete</button>
      <div>
        ${dematAccountNames.map((c) => `
          <div class="company-row">
            <span>${c}</span>
            <select onchange="updateSelection('${date}', ${index}, '${c}', this.value)">
              <option value="">Select</option>
              ${dropdownOptions.map(opt => `
                <option value="${opt}" ${ipo.selections[c]===opt?"selected":""}>${opt}</option>
              `).join("")}
            </select>
          </div>
        `).join("")}
      </div>
    `;

    listContainer.appendChild(block);
  });

  renderSummary(date);
}

function addIPO(date) {
  ipoData[date].push({ name: "", selections: {} });
  saveData();
  renderDate(date);
}

function updateIPOName(date, index, value) {
  ipoData[date][index].name = value;
  saveData();
}

function updateSelection(date, index, company, value) {
  ipoData[date][index].selections[company] = value;
  saveData();
  renderSummary(date);
}

function deleteIPO(date, index) {
  if (confirm("Are you sure you want to delete this IPO entry?")) {
    ipoData[date].splice(index, 1);
    saveData();
    renderDate(date);
  }
}

function renderSummary(date) {
  const summaryContainer = document.getElementById("summaryContainer");
  const counts = {};

  // Initialize counts
  dropdownOptions.forEach(opt => counts[opt] = 0);

  let hasSelection = false;

  // Count selections
  ipoData[date].forEach(ipo => {
    for (const company in ipo.selections) {
      const val = ipo.selections[company];
      if (val) {
        counts[val]++;
        hasSelection = true;
      }
    }
  });

  // If no selections yet, hide summary
  if (!hasSelection) {
    summaryContainer.innerHTML = "";
    return;
  }

  // Build summary HTML
  let summaryHTML = `<h3>Summary for ${date}</h3><div class="summary">`;
  dropdownOptions.forEach(opt => {
    if (counts[opt] > 0) {
      summaryHTML += `<div>${opt}: ${counts[opt]} Requests</div>`;
    }
  });
  summaryHTML += `</div>`;

  summaryContainer.innerHTML = summaryHTML;
}

// Clear only selected date
function clearDateData() {
  const date = document.getElementById("datePicker").value;
  if (!date) {
    alert("Please select a date first!");
    return;
  }

  if (confirm(`Are you sure you want to clear all IPO data for ${date}?`)) {
    delete ipoData[date];
    saveData();

    document.getElementById("ipoContainer").innerHTML = "";
    document.getElementById("summaryContainer").innerHTML = "";
    alert(`IPO data for ${date} has been cleared.`);
  }
}

// Clear all dates
function clearAllData() {
  if (confirm("Are you sure you want to clear ALL IPO data?")) {
    localStorage.removeItem("ipoData");
    for (const key in ipoData) {
      delete ipoData[key];
    }
    document.getElementById("ipoContainer").innerHTML = "";
    document.getElementById("summaryContainer").innerHTML = "";
    alert("All IPO data cleared.");
  }
}