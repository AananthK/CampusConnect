// GLOBAL DATE (current view)
let currentDate = new Date();

// ON PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
    setupButtons();
    renderMonthlyCalendar();
    renderWeeklyCalendar();
    renderDailyCalendar();
});

// --------------------
//  TAB SWITCHING
// --------------------
function showView(view) {
    document.getElementById("dailyView").style.display = "none";
    document.getElementById("weeklyView").style.display = "none";
    document.getElementById("monthlyView").style.display = "none";

    document.getElementById(view).style.display = "block";
}

// --------------------
//  MONTHLY CALENDAR
// --------------------
function setupButtons() {
    document.getElementById("prevMonthBtn").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderMonthlyCalendar();
    });
    document.getElementById("nextMonthBtn").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderMonthlyCalendar();
    });
}

function renderMonthlyCalendar() {
    const monthLabel = document.getElementById("calendarMonth");
    const grid = document.getElementById("calendarGrid");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    monthLabel.textContent = `${monthNames[month]} ${year}`;
    grid.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const today = new Date();

    // Blank cells before 1st
    for (let i = 0; i < firstDay; i++) {
        let blank = document.createElement("div");
        blank.style.minHeight = "90px";
        grid.appendChild(blank);
    }

    // Real days
    for (let day = 1; day <= daysInMonth; day++) {
        let cell = document.createElement("div");
        cell.textContent = day;

        // Sizing for events
        cell.style.minHeight = "90px";
        cell.style.padding = "1rem";
        cell.style.background = "#fff";
        cell.style.border = "1px solid #d1d5db";
        cell.style.borderRadius = "10px";
        cell.style.textAlign = "center";
        cell.style.fontSize = "1.1rem";
        cell.style.cursor = "pointer";

        // Today highlight fix
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.style.background = "#2d5be3";
            cell.style.color = "#fff";
            cell.style.fontWeight = "bold";
            cell.style.outline = "3px solid #ffffff aa"; // white ring so number is visible
        }

        // Hover
        cell.addEventListener("mouseover", () => { cell.style.background = "#e7edff"; });
        cell.addEventListener("mouseout", () => {
            if (cell.style.outline) {
                cell.style.background = "#2d5be3";
                cell.style.color = "#fff";
            } else {
                cell.style.background = "#fff";
                cell.style.color = "#222";
            }
        });

        // Clicking a day moves daily/weekly view to that day
        cell.addEventListener("click", () => {
            currentDate = new Date(year, month, day);
            renderDailyCalendar();
            renderWeeklyCalendar();
            showView("dailyView");
        });

        grid.appendChild(cell);
    }
}

// --------------------
//  WEEKLY VIEW
// --------------------
function renderWeeklyCalendar() {
    const grid = document.getElementById("weeklyGrid");
    const label = document.getElementById("weeklyLabel");

    // Get Sunday of this week
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

// --------------------
//  DAILY VIEW
// --------------------
function renderDailyCalendar() {
    const label = document.getElementById("dailyLabel");
    label.textContent = currentDate.toDateString();

    document.getElementById("dailyEvents").innerHTML = "No events for this day.";
}

function changeDay(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    renderDailyCalendar();
    renderWeeklyCalendar();
}
