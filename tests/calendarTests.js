// --------------------------------------------------
// SIMPLE TEST HELPER
// --------------------------------------------------
function assert(description, condition) {
  if (condition) {
    console.log(`✅ PASS: ${description}`);
  } else {
    console.error(`❌ FAIL: ${description}`);
  }
}

console.log("%cRunning Calendar Tests...", "color: blue; font-size: 16px");


// --------------------------------------------------
// 1) DISPLAYING EVENTS IN DAILY VIEW (logic-based)
// --------------------------------------------------

setSelectedDate(2025, 10, 15); // November 15, 2025
addEvent("2025-11-15", "Hackathon");

renderDailyCalendar(); // UI refresh (not tested directly)

assert(
  "Daily view reflects events for selected date",
  getEventsForDate("2025-11-15").length === 1
);


// --------------------------------------------------
// 2) CALENDAR UPDATES WHEN EVENT IS ADDED
// --------------------------------------------------

addEvent("2025-11-15", "Study Session");

assert(
  "Adding a second event updates stored data",
  getEventsForDate("2025-11-15").length === 2
);


// --------------------------------------------------
// 3) SELECTED DATE APPLIES ACROSS ALL CALENDAR VIEWS
// --------------------------------------------------

setSelectedDate(2025, 0, 5); // Jan 5, 2025

renderDailyCalendar();
renderWeeklyCalendar();
renderMonthlyCalendar();

const selected = getSelectedDate();

assert(
  "Selected date updates global state",
  selected.year === 2025 &&
  selected.month === 0 &&
  selected.day === 5
);

assert(
  "Daily uses selected date",
  selected.day === currentDate.getDate()
);

assert(
  "Monthly uses selected date's month",
  selected.month === currentDate.getMonth()
);

console.log("%cTests complete.", "color: green; font-size: 14px");
