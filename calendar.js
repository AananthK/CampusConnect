// ----------------------------------------------------
// GLOBAL DATE (shared across all views + tests)
// ----------------------------------------------------
let currentDate = new Date();

// ----------------------------------------------------
// EVENT STORAGE FOR UNIT TESTING
// ----------------------------------------------------
let eventsByDate = {};

function addEvent(dateString, eventName) {
  if (!eventsByDate[dateString]) {
    eventsByDate[dateString] = [];
  }
  eventsByDate[dateString].push(eventName);
}

function getEventsForDate(dateString) {
  return eventsByDate[dateString] || [];
}

// ----------------------------------------------------
// SELECTED DATE HELPERS FOR UNIT TESTING
// ----------------------------------------------------
function setSelectedDate(year, month, day) {
  currentDate = new Date(year, month, day);
}

function getSelectedDate() {
  return {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
    day: currentDate.getDate()
  };
}

// ----------------------------------------------------
// ON PAGE LOAD (real calendar page only)
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupButtons();
  renderMonthlyCalendar();
  renderWeeklyCalendar();
  renderDailyCalendar();
});

// ----------------------------------------------------
// TAB SWITCHING
// ----------------------------------------------------
let currentView = "monthly";

function showView(view) {
  const daily = document.getElementById("dailyView");
  const weekly = document.getElementById("weeklyView");
  const monthly = document.getElementById("monthlyView");

  if (!daily || !weekly || !monthly) return; // skip during tests

  daily.style.display = "none";
  weekly.style.display = "none";
  monthly.style.display = "none";

  document.getElementById(view).style.display = "block";
  currentView = view;
}

function getCurrentView() {
  return currentView;
}

// ----------------------------------------------------
// MONTHLY VIEW
// ----------------------------------------------------
function setupButtons() {
  const prevBtn = document.getElementById("prevMonthBtn");
  const nextBtn = document.getElementById("nextMonthBtn");

  if (!prevBtn || !nextBtn) return; // skip in tests

  prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderMonthlyCalendar();
  });

  nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderMonthlyCalendar();
  });
}

function renderMonthlyCalendar() {
  const monthLabel = document.getElementById("calendarMonth");
  const grid = document.getElementById("calendarGrid");

  if (!monthLabel || !grid) return; // skip in tests

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  monthLabel.textContent = `${monthNames[month]} ${year}`;
  grid.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Blank cells
  for (let i = 0; i < firstDay; i++) {
    let blank = document.createElement("div");
    blank.style.minHeight = "90px";
    grid.appendChild(blank);
  }

  // Real days
  for (let day = 1; day <= daysInMonth; day++) {
    let cell = document.createElement("div");
    cell.textContent = day;

    cell.style.minHeight = "90px";
    cell.style.padding = "1rem";
    cell.style.background = "#fff";
    cell.style.border = "1px solid #d1d5db";
    cell.style.borderRadius = "10px";
    cell.style.textAlign = "center";
    cell.style.fontSize = "1.1rem";
    cell.style.cursor = "pointer";

    // Today highlight
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.style.background = "#2d5be3";
      cell.style.color = "#fff";
      cell.style.fontWeight = "bold";
      cell.style.outline = "3px solid #ffffffaa";
    }

    // Hover effect
    cell.addEventListener("mouseover", () => {
      cell.style.background = "#e7edff";
    });

    cell.addEventListener("mouseout", () => {
      if (cell.style.outline) {
        cell.style.background = "#2d5be3";
        cell.style.color = "#fff";
      } else {
        cell.style.background = "#fff";
        cell.style.color = "#222";
      }
    });

    // Clicking switches to daily
    cell.addEventListener("click", () => {
      currentDate = new Date(year, month, day);
      renderDailyCalendar();
      renderWeeklyCalendar();
      showView("dailyView");
    });

    grid.appendChild(cell);
  }
}

// ----------------------------------------------------
// WEEKLY VIEW
// ----------------------------------------------------
function renderWeeklyCalendar() {
  const grid = document.getElementById("weeklyGrid");
  const label = document.getElementById("weeklyLabel");

  if (!grid || !label) return; // skip in tests

  let weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());

  label.textContent = `Week of ${weekStart.toDateString()}`;
  grid.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    let day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);

    let cell = document.createElement("div");

    cell.style.background = "#fff";
    cell.style.border = "1px solid #d1d5db";
    cell.style.borderRadius = "10px";
    cell.style.padding = "1rem";
    cell.style.minHeight = "100px";

    cell.innerHTML = `
      <strong>${day.toLocaleString("en-US",{ weekday: "short" })}</strong><br>
      ${day.getMonth()+1}/${day.getDate()}
      <div style="margin-top:0.5rem; font-size:0.9rem; color:#444;">No events</div>
    `;

    grid.appendChild(cell);
  }
}

// ----------------------------------------------------
// DAILY VIEW
// ----------------------------------------------------
function renderDailyCalendar() {
  const label = document.getElementById("dailyLabel");
  const eventsDiv = document.getElementById("dailyEvents");

  if (!label || !eventsDiv) return; // skip in tests

  label.textContent = currentDate.toDateString();
  eventsDiv.innerHTML = "No events for this day.";
}

function changeDay(offset) {
  currentDate.setDate(currentDate.getDate() + offset);
  renderDailyCalendar();
  renderWeeklyCalendar();
}
