const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateEl = document.getElementById("date-picker");

const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElememnts = document.querySelectorAll("span");

const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let savedCountDown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min (prevents choosing past dates) with Today's Date
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute("min", today); 

// Populate Countdown / Complete UI
function updateDOM() {
	countdownActive = setInterval(() => {
		const now = new Date().getTime(); // current moment in time in milliseconds from 1.1.1970
	const distance = countdownValue - now;

	const days = Math.floor(distance / day);
	const hours = Math.floor((distance % day) / hour);
	const minutes = Math.floor((distance % hour) / minute);
	const seconds = Math.floor((distance % minute) / second);

	// Hide Input
	inputContainer.hidden = true;

	// If the countdown has ended, show complete

	if (distance < 0) {
		countdownEl.hidden = true;
		clearInterval(countdownActive);
		completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
		completeEl.hidden = false;
	} else {
		// Populate countdown
		countdownElTitle.textContent = `${countdownTitle}`
		timeElememnts[0].textContent = `${days}`;
		timeElememnts[1].textContent = `${hours}`;
		timeElememnts[2].textContent = `${minutes}`;
		timeElememnts[3].textContent = `${seconds}`;
		completeEl.hidden = true;
		countdownEl.hidden = false;
	}
	}, second); // second means that functions runs every second
}

// Take Values from Form Input, preventing submitting from refreshin the whole page
function updateCountdown(e) {
	e.preventDefault();
	countdownTitle = e.srcElement[0].value;
	countdownDate = e.srcElement[1].value;
	savedCountDown = {
		title: countdownTitle,
		date: countdownDate,
	};
	localStorage.setItem("countdown", JSON.stringify(savedCountDown)); // without stringify, would only save [object, object]
	// Get number version of current Date, update DOM
	countdownValue = new Date(countdownDate).getTime();
	updateDOM();
}

// Reset all values
function reset() {
	// Hide countdowns and show input
	countdownEl.hidden = true;
	completeEl.hidden = true;
	inputContainer.hidden = false;
	// Stop the countdown
	clearInterval(countdownActive);
	// Rest values
	countdownTitle = "";
	countdownDate = "";
	localStorage.removeItem("countdown");
}

function restorePreviousCountdown() {
	if (localStorage.getItem("countdown")) {
		inputContainer.hidden = true;
		savedCountDown = JSON.parse(localStorage.getItem("countdown")); // parse reverses stringify, so we can do below actions
		countdownTitle = savedCountDown.title;
		countdownDate = savedCountDown.date;
		countdownValue = new Date(countdownDate).getTime();
		updateDOM();
	}
}

// Event Listeners
countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", reset);
completeBtn.addEventListener("click", reset);

// On load, check locaStorage
restorePreviousCountdown();