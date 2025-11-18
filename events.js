async function getEventsForDay(date) { // for now, create dummy events
    const day = new Date(date);

    // Create ONE dummy event that always shows
    const dummyEvents = [
        {
            id: 1,
            title: "Dummy Placeholder Event",
            organizer: "Toronto Metropolitan University",
            date: `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`,
            description: "This is a hardcoded event to show that the daily view works.",
            location: "ENG-101",
            category: "Social",
            bookings: 53,
            capacity: 100,
            start_time: new Date(
                day.getFullYear(),
                day.getMonth(),
                day.getDate(),
                10, 0, 0
            ).toISOString(),  // 10:00 AM
            end_time: new Date(
                day.getFullYear(),
                day.getMonth(),
                day.getDate(),
                12, 0, 0
            ).toISOString()   // 12:00 PM
        },

        {
            id: 2,
            title: "MTH240 Study Hall",
            organizer: "MUES",
            date: `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`,
            description: "This is a hardcoded event to show that the daily view works.",
            location: "ENG-101",
            category: "Academic",
            bookings: 200,
            capacity: 200,
            start_time: new Date(
                day.getFullYear(),
                day.getMonth(),
                day.getDate(),
                11, 0, 0
            ).toISOString(),  // 11:00 AM
            end_time: new Date(
                day.getFullYear(),
                day.getMonth(),
                day.getDate(),
                15, 0, 0
            ).toISOString()   // 5:00 PM
        },

        {
            id: 3,
            title: "World Cup Final",
            organizer: "FIFA",
            date: `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`,
            description: "The FIFA World Cup takes place every four years since its inauguration in 1930. The event's latest format consists of 48 teams coming from 6 different continents as the best nations battle for footballs ultimate prize: the World Cup.\n\nThe final will take place at the MetLife stadium in East Rutherford, New Jersey. This will be the 23rd FIFA World Cup final -- a stage which has featured the likes of football legends such as Pele, Diego Maradona, Zinadine Zidane, Ronaldo Nazario, Franz Beckanbauer, Johan Cruyff, and Lionel Messi.",
            location: "MetLife Stadium, New Jersery, USA",
            category: "Sports",
            bookings: 200,
            capacity: 82500,
            start_time: new Date(
                day.getFullYear(),
                day.getMonth(),
                day.getDate(),
                11, 0, 0
            ).toISOString(),  // 11:00 AM
            end_time: new Date(
                day.getFullYear(),
                day.getMonth(),
                day.getDate(),
                15, 0, 0
            ).toISOString()   // 5:00 PM
        }

        
    ];

    return dummyEvents;
}


function renderDailyEvents(events) { // inserting event cards into daily view
    const container = document.getElementById("dailyEvents");
    container.innerHTML = "";

    if (!events || events.length === 0) {
        container.innerHTML = "<p>No events scheduled for this day.</p>";
        return;
    }

    events.forEach(ev => {
        const card = document.createElement("div");
        card.classList.add("event-card");

        card.innerHTML = `
            <div style ="display:flex">
                <h3 style="font-weight: bold">${ev.title}</h3>
                <h3 style="font-weight:normal">: ${ev.organizer}</h3>
            </div>
            <p><strong>${formatTime(ev.start_time)}</strong> 
               ${ev.end_time ? "– " + formatTime(ev.end_time) : ""}</p>
            <p>Location: ${ev.location || "No location provided"}</p>
            <p>Category: ${ev.category}</p>
            <p class ="event-description"><br>Description: ${ev.description || ""}</p>
            <strong>${ev.bookings < ev.capacity ? ev.bookings + "/" + ev.capacity: "Full"}<strong>
        `;

        container.appendChild(card);

        card.addEventListener("click", () => { //clicking each card opens its details
            openEventDetail(ev);  
        });
    });
}

function formatTime(timeString) {
    return new Date(timeString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function openEventDetail(ev) {
    document.getElementById("modalTitle").textContent = ev.title;
    document.getElementById("modalOrganizer").textContent = "Organizer: " + ev.organizer;
    document.getElementById("modalTime").textContent =
        formatTime(ev.start_time) +
        (ev.end_time ? " – " + formatTime(ev.end_time) : "");
    document.getElementById("modalLocation").textContent =
        "Location: " + (ev.location || "N/A");
    document.getElementById("modalDescription").textContent =
         ev.description || "No description available.";

    document.getElementById("eventModal").style.display = "block";
}

document.getElementById("closeModal").onclick = function() {
    document.getElementById("eventModal").style.display = "none";
};


async function getEventCountForDate(year, month, day) { // get number of events for date
    const date = new Date(year, month, day);
    const events = await getEventsForDay(date);

    return events.length;  // number of events on that date
}

window.getEventCountForDate = getEventCountForDate;
window.onclick = function(event) {
    if (event.target == document.getElementById("eventModal")) {
        document.getElementById("eventModal").style.display = "none";
    }
};

window.getEventsForDay = getEventsForDay;
window.renderDailyEvents = renderDailyEvents;