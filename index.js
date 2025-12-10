// Static company names
    const dematAccountNames = ["Aai", "Atul", "Sonali", "Vikky", "Mitesh", "Vandana", "Vikas", "Sanket", "Mitali"];

    // Dropdown options (same style as dematAccountNames, but you can customize)
    const dropdownOptions = [
      "Aai Sarswat", "Aai Hdfc", "Atul HDFC", 
      "Sonali Joint", "Sonali HDFC", "Vikky Union"
    ];

    // Data store keyed by date
    const ipoData = {};

    function loadDate() {
      const date = document.getElementById("datePicker").value;
      if (!date) {
        alert("Please select a date!");
        return;
      }
      if (!ipoData[date]) {
        ipoData[date] = []; // initialize empty IPO list for this date
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
      renderDate(date);
    }

    function updateIPOName(date, index, value) {
      ipoData[date][index].name = value;
    }

    function updateSelection(date, index, company, value) {
      ipoData[date][index].selections[company] = value;
      renderSummary(date);
    }
	
	function deleteIPO(date, index) {
  if (confirm("Are you sure you want to delete this IPO entry?")) {
    ipoData[date].splice(index, 1);
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