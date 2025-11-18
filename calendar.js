// GLOBAL DATE (current view)
let currentDate = new Date(); // initially set to actual current date
const today = new Date();

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
    // block all views initially (style.display = "none")
    document.getElementById("dailyView").style.display = "none";
    document.getElementById("weeklyView").style.display = "none";
    document.getElementById("monthlyView").style.display = "none";

    // show specified view as a block (full width, on newline) element
    document.getElementById(view).style.display = "block";
}

// --------------------
//  MONTHLY CALENDAR
// --------------------
function setupButtons() {// navigation buttons
    document.getElementById("prevMonthBtn").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1); // current month is changed
        renderMonthlyCalendar(); // calendar is refreshed (updated) to reflet new current month
    });
    document.getElementById("nextMonthBtn").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderMonthlyCalendar();
    });
}

function renderMonthlyCalendar() { // update monthly calendar
    const monthLabel = document.getElementById("calendarMonth");
    const grid = document.getElementById("calendarGrid");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    monthLabel.textContent = `${monthNames[month]} ${year}`; // update month and year
    grid.innerHTML = ""; // clear container containing day numbers and events

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();

    // Blank cells before 1st
    for (let i = 0; i < firstDay; i++) {
        let blank = document.createElement("div");
        blank.style.minHeight = "90px";
        grid.appendChild(blank);
    }

    // Real days
    for (let day = 1; day <= daysInMonth; day++) {
        let cell = document.createElement("div");
        
        cell.style.position = "relative";
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

        // Highlight the current (real-time) date upon start up
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add("today"); // apply styles to current date cell
        }

        (async () => {
            const eventCount = await getEventCountForDate(year, month, day);

            if (eventCount > 0) {
                const bubble = document.createElement("div");
                bubble.classList.add("event-indicator");
                bubble.textContent = eventCount;
                cell.appendChild(bubble);
            }
        })();

        // Hover
        cell.addEventListener("mouseover", () => {
            cell.style.background = "#e7edff";
        });
        cell.addEventListener("mouseout", () => {
            if (!cell.classList.contains("today")) {
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

        cell.style.position = "relative";
        cell.style.background = "#fff";
        cell.style.border = "1px solid #d1d5db";
        cell.style.borderRadius = "10px";
        cell.style.padding = "1rem";
        cell.style.minHeight = "100px";

        cell.innerHTML = `
            <strong>${day.toLocaleString("en-US",{ weekday: "short" })}</strong><br>
            ${day.getMonth()+1}/${day.getDate()}
        `;

        if (
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear()
        ){
            cell.classList.add("today");
        }

        (async () => {
            const eventCount = await getEventCountForDate(
                day.getFullYear(),
                day.getMonth(),
                day.getDate()
            );

            if (eventCount > 0) {
                const bubble = document.createElement("div");
                bubble.classList.add("event-indicator");
                bubble.textContent = eventCount;

                cell.appendChild(bubble);
            }
        })();

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

        cell.addEventListener("click", () => {

            currentDate = new Date(day);
            renderDailyCalendar();
            renderMonthlyCalendar();
            showView("dailyView");
        });

        grid.appendChild(cell);
    }
}

// --------------------
//  DAILY VIEW
// --------------------
async function renderDailyCalendar() {
    // 1. Update the header label
    const label = document.getElementById("dailyLabel");
    label.textContent = currentDate.toDateString();

    // 2. Fetch events for the selected date
    const events = await getEventsForDay(currentDate);

    // 3. Render them visually
    renderDailyEvents(events);
}

function changeDay(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    renderDailyCalendar();
    renderWeeklyCalendar();
    renderMonthlyCalendar();
    
}

window.showView = showView;
window.changeDay = changeDay;
