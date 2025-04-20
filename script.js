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
  
  // Utility to parse time to Date object
  function parseTime(timeStr) {
    const now = new Date();
    let [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  }
  
  // Filter & render
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
  
  // Clock
  function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date().toLocaleTimeString();
    clock.textContent = now;
  }
  setInterval(updateClock, 1000);
  updateClock();
  
  // Render all lists
  renderList("udupi-forenoon", udupiForenoon);
  renderList("udupi-afternoon", udupiAfternoon);
  renderList("ajekar-forenoon", ajekarForenoon);
  renderList("ajekar-afternoon", ajekarAfternoon);
  
  // Dark mode toggle
  const toggleBtn = document.getElementById("toggleMode");
  if (localStorage.getItem("mode") === "dark") {
    document.body.classList.add("dark");
  }
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("mode", document.body.classList.contains("dark") ? "dark" : "light");
  });
  
  // Collapsibles
  document.querySelectorAll(".collapsible, .sub-collapsible").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      const next = btn.nextElementSibling;
      if (next.style.display === "block") {
        next.style.display = "none";
      } else {
        next.style.display = "block";
      }
    });
  });

  // Show All button behavior
  document.querySelectorAll(".show-all-btn").forEach(button => {
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering collapsible toggle
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

  // Render all buses without filtering by time
  function renderAllList(id, buses) {
    const container = document.getElementById(id);
    container.innerHTML = "";
    buses
      .sort((a, b) => {
        const timeA = parseTime(a[0]);
        const timeB = parseTime(b[0]);
        return timeA - timeB;
      })
      .forEach(([time, name]) => {
        const li = document.createElement("li");
        li.textContent = `${time} - ${name}`;
        container.appendChild(li);
      });
  }
  const stars = document.querySelectorAll('.star');
  const summary = document.getElementById('rating-summary');
  
  // Initialize or get from localStorage
  let totalRatings = parseInt(localStorage.getItem('totalRatings')) || 0;
  let ratingSum = parseInt(localStorage.getItem('ratingSum')) || 0;
  
  // Check if user has already rated (set to 'true' when they rate once)
  let hasRated = localStorage.getItem('hasRated') === 'true';
  
  // Store the user's rating if available
  let userRating = parseInt(localStorage.getItem('userRating')) || null;
  
  updateSummary();
  
  if (userRating !== null) {
    // Set the rating as selected if the user has already rated
    setRating(userRating);
    disableRating(); // Disable the rating system if the user has already rated
  }
  
  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      if (!hasRated) {
        highlightStars(parseInt(star.dataset.rating));
      }
    });
  
    star.addEventListener('mouseout', () => {
      if (!hasRated) {
        clearHighlight();
      }
    });
  
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
  
      // If the user has already rated, prevent them from rating again and show an alert
      if (hasRated) {
        alert("You have already rated. Your rating is locked and cannot be changed.");
        return;
      }
  
      // Save the rating
      totalRatings++;
      ratingSum += rating;
      localStorage.setItem('totalRatings', totalRatings);
      localStorage.setItem('ratingSum', ratingSum);
      localStorage.setItem('hasRated', 'true');  // Mark as rated (lifetime)
      localStorage.setItem('userRating', rating); // Store the user's rating
  
      setRating(rating);
      updateSummary();
      disableRating(); // Disable the rating system after user has rated
      alert(`Thanks for rating ${rating} star(s)!`);
    });
  });
  
  function highlightStars(rating) {
    stars.forEach(star => {
      star.classList.toggle('hovered', parseInt(star.dataset.rating) <= rating);
    });
  }
  
  function clearHighlight() {
    stars.forEach(star => star.classList.remove('hovered'));
  }
  
  function setRating(rating) {
    stars.forEach(star => {
      star.classList.toggle('selected', parseInt(star.dataset.rating) <= rating);
    });
  }
  
  function clearRating() {
    stars.forEach(star => {
      star.classList.remove('selected');
    });
  }
  
  function updateSummary() {
    if (totalRatings === 0) {
      summary.innerText = '⭐ No ratings yet';
    } else {
      const average = (ratingSum / totalRatings).toFixed(1);
      summary.innerText = `⭐ ${average} from ${totalRatings} user(s)`;
    }
  }
  
  function disableRating() {
    stars.forEach(star => {
      star.classList.add('disabled');  // Add a disabled class to make them unclickable
      star.removeEventListener('click', handleStarClick);  // Remove the click event listener
    });
  }
  
  // Optionally, you can add a 'disabled' class in your CSS to style the stars differently when disabled
  