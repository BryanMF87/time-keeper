
// sidebar toggle

const menuButton = document.getElementsByClassName("menu")[0];
const sideBar = document.querySelector("sidebar");

menuButton.addEventListener("click", () => {
    sideBar.style.display === "none" ? 
    sideBar.style.display = "flex" :
    sideBar.style.display = "none";
});




// theme toggle

const themeSwitcher = document.querySelector("input");
const theme = document.getElementsByTagName('link')[0];

themeSwitcher.addEventListener("click", () => {
    theme.getAttribute("href") == "style.css" ? 
    theme.setAttribute("href", "night-mode.css") : 
    theme.setAttribute("href", "style.css")
});




// current timer & buttons

const clockDisplay = document.querySelector(".clock-display");
const startButton = document.getElementsByClassName("start-button")[0];
let playIcon = document.querySelector("#play-icon");
const startButtonP = document.getElementById("start-p");
const stopWatch = { elapsedTime: 0 };
let paused = true;

startButton.addEventListener("click", () => {
    if(paused) {
        paused = false;
        startClock();
        playIcon.className = "fas fa-pause";
        startButtonP.innerHTML = "pause";
    } else {
        paused = true;
        stopWatch.elapsedTime += Date.now() - stopWatch.startTime;
        clearInterval(stopWatch.intervalId);
        playIcon.className = "fas fa-play";
        startButtonP.innerHTML = "start";
    }
});




// reset timer

const resetButton = document.getElementsByClassName("reset-button")[0];

resetButton.addEventListener("click", () => {
    stopWatch.elapsedTime = 0;
    stopWatch.startTime = Date.now();
    displayTime(0, 0, 0);
});




// start the timer

const startClock = () => {
    stopWatch.startTime = Date.now();
    stopWatch.intervalId = setInterval(() => {
        const elapsedTime = Date.now() - stopWatch.startTime + stopWatch.elapsedTime;
        const seconds = parseInt((elapsedTime/1000)%60);
        const minutes = parseInt((elapsedTime/(1000*60))%60);
        const hours = parseInt((elapsedTime/(1000*60*60))%24);
        displayTime(hours, minutes, seconds);
    }, 100);
};

function displayTime(hours, minutes, seconds) {
    const leadZeroTime = [hours, minutes, seconds].map(clockDisplay => clockDisplay < 10 ? `0${clockDisplay}` : clockDisplay)
    clockDisplay.innerHTML = leadZeroTime.join(":");
}




// create an add button function

const addButton = document.getElementsByClassName("add-button")[0];
let actionItem = document.getElementById("action-item");
const list = document.querySelector(".list");
let listItem;

// Check requirments, if passed entry is created

addButton.addEventListener("click", () => {
    checkRequirements();
});

const checkRequirements = () => {
    !paused ? alert("Please pause timer first")
    : createEntry();
};

const createEntry = () => {
    listItem = document.createElement("li");
    listItem.classList.add("list-entry");

    listItem.innerHTML = 
        `<section>
            <div class="entry-info">
                <p>${actionItem.innerHTML}</p>
                <p class="grey">${clockDisplay.innerHTML}</p>
            </div>
            <ul class="entry-buttons">
                    <li>
                    <button>
                        <i class="fas fa-edit"></i>
                    </button>
                </li>
                <li>
                    <button class="delete-button">
                        <i class="fas fa-trash"></i>
                    </button>
                </li>
            </ul>
        </section>`
    ;

    list.appendChild(listItem);
}




// delete entry button

const deleteButton = document.querySelector(".delete-button");
const listElements = document.querySelectorAll(".list-entry");

console.log(listElements)

const deleteItem = () => {
    for (let i = 0; (li = listElements[i]); i++) {
        li.parentNode.removeChild(li);
    }
};

deleteButton.addEventListener("click", () => {
    // TODO 1 - are you sure you want to delete?
    const deleteCheck = prompt("To delete please type 'DELETE'");

    deleteCheck === "DELETE" ?
    // TODO 2 - delete list item on click or reject deletion
    deleteItem()
    : console.log("not deleted");
});