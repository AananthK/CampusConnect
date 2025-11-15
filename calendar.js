// ----------------------
// SIMPLE MONTHLY CALENDAR
// ----------------------

let currentDate = new Date();

document.addEventListener("DOMContentLoaded", () => {
    renderCalendar();

    document.getElementById("prevMonthBtn").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById("nextMonthBtn").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
});

// Render calendar for the current month
function renderCalendar() {
    const monthYearLabel = document.getElementById("calendarMonth");
    const calendarGrid = document.getElementById("calendarGrid");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Month Names
    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    monthYearLabel.textContent = `${monthNames[month]} ${year}`;

    // Clear previous cells
    calendarGrid.innerHTML = "";

    // First day of month
    const firstDay = new Date(year, month, 1).getDay();

    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Blank cells before the first day
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.style.padding = "1rem";
        calendarGrid.appendChild(emptyCell);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.textContent = day;
        dayCell.style.padding = "1rem";
        dayCell.style.background = "#fff";
        dayCell.style.border = "1px solid #d1d5db";
        dayCell.style.borderRadius = "8px";
        dayCell.style.textAlign = "center";
        dayCell.style.cursor = "pointer";
        dayCell.style.transition = "0.15s";

        // Hover effect
        dayCell.addEventListener("mouseover", () => {
            dayCell.style.background = "#e7edff";
        });
        dayCell.addEventListener("mouseout", () => {
            dayCell.style.background = "#fff";
        });

        // Highlight today
        const today = new Date();
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayCell.style.background = "#2d5be3";
            dayCell.style.color = "#fff";
            dayCell.style.fontWeight = "bold";
        }

        // Click event placeholder
        dayCell.addEventListener("click", () => {
            alert(`Clicked on ${monthNames[month]} ${day}, ${year}`);
            // Your teammate can later replace this with: openEventOverlay(...)
        });

        calendarGrid.appendChild(dayCell);
    }
}
