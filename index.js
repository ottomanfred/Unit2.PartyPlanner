// References
const COHORT = "2401-FSA-ET-WEB-FT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const eventList = document.querySelector("#events");
const addEventForm = document.querySelector("#addEvent");

//State
const state = {
  events: [],
};

/**
 * Update state with events from API
 */
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getEvents();
  renderEvents();
}

//Render
/**
 * Render events from state
 */
function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events.</li>";
    return;
  }

  const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <h2>${event.name}</h2>
        <p2>${event.description}</p2>
        <p2>${event.date}</p2>
        <p>${event.location}</p>
        <button>Delete</button>
      `;
    const delButton = li.querySelector("button");
    delButton.addEventListener("click", () => deleteEvent(event.id));
    return li;
  });

  eventList.replaceChildren(...eventCards);
}

/**
 * Ask the API to create a new event based on form data
 * @param {Event} event
 */
async function addEvent(event) {
  event.preventDefault();

  try {
    const date = new Date(addEventForm.date.value).toISOString();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date,
        location: addEventForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }
    addEventForm.name.value = "";
    addEventForm.description.value = "";
    addEventForm.date.value = "";
    addEventForm.location.value = "";
    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteEvent(id) {
  try {
    const response = await fetch(API_URL + `/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

//Script

render();
addEventForm.addEventListener("submit", addEvent);
