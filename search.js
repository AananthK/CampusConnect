async function loadMockEvents() {
    const today = new Date();
    const events = await getEventsForDay(today);
    return events;
}
// Main container
const eventsContainer = document.getElementById("events");
// Read search box
const searchBox = document.getElementById("searchInput");
// Function to render events
const categoryFilter = document.getElementById("categoryFilter");
//Allows filter logic to know the selected category.

function renderBrowserEvents(eventList) {
    eventsContainer.innerHTML = "";

    if (!eventList || eventList.length === 0) {
        eventsContainer.innerHTML = "<p>No events match your search.</p>";
        return;
    }
    eventList.forEach(ev => {
        const div = document.createElement("div");
        div.classList.add("event");

        div.innerHTML = `
            <strong>${ev.title}</strong><br>
            ${ev.description}<br>
            <em>${ev.organizer}</em><br>
            Category: ${ev.category}<br>
            ${new Date(ev.start_time).toLocaleString()}
        `;
        eventsContainer.appendChild(div);
    });
}

// Filter + search combined
function applySearch() {
    const query = searchBox.value.toLowerCase();
    const selectedCategory = categoryFilter.value; // "" or "Academic"/"Social"/"Sports"

    const filtered = allMockEvents.filter(ev => {
        const matchesText =
            ev.title.toLowerCase().includes(query) ||
            ev.description.toLowerCase().includes(query) ||
            ev.organizer.toLowerCase().includes(query) ||
            ev.category.toLowerCase().includes(query);

        const matchesCategory =
            selectedCategory === "" || ev.category === selectedCategory;

        return matchesText && matchesCategory;
    });

    renderBrowserEvents(filtered);
}

let allMockEvents = [];

// Initial page load
(async function init() {
    allMockEvents = await loadMockEvents();
    renderBrowserEvents(allMockEvents);

    // When user types in the search box
    searchBox.addEventListener("input", applySearch);

    // When user changes the category dropdown
    categoryFilter.addEventListener("change", applySearch);
})();
