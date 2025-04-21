// Bus schedules
const udupiForenoon = [
  ["6:45 AM", "Hari"], ["7:15 AM", "Apsara"], ["7:30 AM", "Lakshmisha"],
  ["7:45 AM", "Ashok (Manai)"], ["8:00 AM", "Apsara"], ["8:20 AM", "Apsara"],
  ["8:45 AM", "S.V.T"], ["9:20 AM", "S.V.T"], ["9:35 AM", "Hari"],
  ["9:50 AM", "Rama"], ["10:10 AM", "Dingla"], ["10:30 AM", "Ashok(Manai)"],
  ["10:45 AM", "Spoorthi"], ["11:10 AM", "Apsara"], ["11:25 AM", "JuniorGopal"],
  ["11:45 AM", "Lakshmisha"]
];

const udupiAfternoon = [
  ["12:10 PM", "S.V.T"], ["12:30 PM", "Apsara"], ["1:15 PM", "Rama"],
  ["1:35 PM", "S.V.T"], ["2:00 PM", "Apsara"], ["2:30 PM", "Dingla"],
  ["2:50 PM", "Hari"], ["3:20 PM", "Ashok(Manai)"], ["3:40 PM", "Apsara"],
  ["4:00 PM", "Lakshmisha"], ["4:30 PM", "Apsara"], ["5:00 PM", "S.V.T"],
  ["5:20 PM", "Apsara"], ["5:35 PM", "JuniorGopal"], ["6:00 PM", "S.V.T"],
  ["6:15 PM", "Rama"], ["7:00 PM", "Dingla"]
];

const ajekarForenoon = [
  ["7:30 AM", "S.V.T"], ["7:45 AM", "Rama"], ["8:30 AM", "S.V.T"],
  ["8:40 AM", "Dingla"], ["9:05 AM", "JuniorGopal"], ["9:20 AM", "Ashok"],
  ["9:50 AM", "Apsara"], ["10:20 AM", "Lakshmisha"], ["10:45 AM", "Rama"],
  ["11:10 AM", "S.V.T"], ["11:35 AM", "Apsara"]
];

const ajekarAfternoon = [
  ["12:00 PM", "Apsara"], ["12:15 PM", "S.V.T"], ["12:30 PM", "Hari"],
  ["1:20 PM", "Ashok"], ["1:55 PM", "Dingla"], ["2:05 PM", "Apsara"],
  ["2:35 PM", "JuniorGopal"], ["2:50 PM", "Lakshmisha"], ["3:30 PM", "Apsara"],
  ["3:50 PM", "S.V.T"], ["4:15 PM", "Rama"], ["4:45 PM", "Apsara"],
  ["5:20 PM", "S.V.T"], ["5:50 PM", "Dingla"], ["6:10 PM", "Apsara"],
  ["6:20 PM", "Ashok"], ["6:30 PM", "Hari"], ["7:15 PM", "Lakshmisha"],
  ["7:35 PM", "Apsara"], ["8:00 PM", "S.V.T"], ["8:40 PM", "Apsara"]
];

// Function to parse time string into a Date object
function parseTime(timeStr) {
  const now = new Date();
  let [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
}

// Function to render bus times for a list
function renderList(id, buses) {
  const now = new Date();
  const container = document.getElementById(id);
  container.innerHTML = "";

  buses
    .filter(([time]) => parseTime(time) > now)
    .sort((a, b) => parseTime(a[0]) - parseTime(b[0]))
    .forEach(([time, name]) => {
      const li = document.createElement("li");
      li.textContent = `${time} - ${name}`;
      container.appendChild(li);
    });
}

// Function to render all bus times (no filtering)
function renderAllList(id, buses) {
  const container = document.getElementById(id);
  container.innerHTML = "";

  buses
    .sort((a, b) => parseTime(a[0]) - parseTime(b[0]))
    .forEach(([time, name]) => {
      const li = document.createElement("li");
      li.textContent = `${time} - ${name}`;
      container.appendChild(li);
    });
}

// Update clock every second
function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date().toLocaleTimeString();
  clock.textContent = now;
}
setInterval(updateClock, 1000);
updateClock();

// Render bus lists
renderList("udupi-forenoon", udupiForenoon);
renderList("udupi-afternoon", udupiAfternoon);
renderList("ajekar-forenoon", ajekarForenoon);
renderList("ajekar-afternoon", ajekarAfternoon);

// Dark Mode Toggle
const toggleBtn = document.getElementById("toggleMode");
if (localStorage.getItem("mode") === "dark") {
  document.body.classList.add("dark");
}
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("mode", document.body.classList.contains("dark") ? "dark" : "light");
});

// Collapsible section functionality
document.querySelectorAll(".collapsible, .sub-collapsible").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const next = btn.nextElementSibling;
    next.style.display = next.style.display === "block" ? "none" : "block";
  });
});

// Show All / Hide All button functionality
document.querySelectorAll(".show-all-btn").forEach(button => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const heading = button.parentElement;
    const content = heading.nextElementSibling;
    const listId = content.id;
    const allBusesMap = {
      "udupi-forenoon": udupiForenoon,
      "udupi-afternoon": udupiAfternoon,
      "ajekar-forenoon": ajekarForenoon,
      "ajekar-afternoon": ajekarAfternoon
    };
    if (button.textContent === "Show All") {
      renderAllList(listId, allBusesMap[listId]);
      content.style.display = "block";
      button.textContent = "Hide All";
    } else {
      renderList(listId, allBusesMap[listId]);
      content.style.display = "block";
      button.textContent = "Show All";
    }
  });
});
