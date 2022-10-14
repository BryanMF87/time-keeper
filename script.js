
// sidebar toggle

const menuBtn = document.querySelector(".menu");
const sideBar = document.querySelector("sidebar");

const toggleMenu = () => {
    sideBar.style.display === "none" ? 
    sideBar.style.display = "flex" :
    sideBar.style.display = "none";
};

menuBtn.addEventListener("click", toggleMenu);





// push new project input to local storage

const newProjectBtn = document.querySelector(".new-project");
const contentTitle = document.querySelector(".title-card h1");
const projectArray = [];
const currentProject = {};


newProjectBtn.addEventListener("click", () => {


    // get the title
    let newProjectTitle = prompt("What will your cool new project be called?");

    if (newProjectTitle === null) { return }

    while (newProjectTitle.length < 1 || newProjectTitle.length > 25) {
    newProjectTitle = prompt("Title must be between 1 and 25 characters long.")
    }

    for(let i = 0; i < projectArray.length; i++) {
        while(projectArray[i].title === newProjectTitle) {
            newProjectTitle = prompt("That project already exists., Try a different name")
        }
    }


    // get the action
    let newProjectAction = prompt("What is your first to-do Item?", "Set up project");

    if(newProjectAction === null) { return };

    while(newProjectAction.length < 1 || newProjectAction > 25) {
        newProjectAction = prompt("Action must be between 1 and 25 characters long.")
    }


    // push it to localStorage
    currentProject.title = getTitle.newProjectTitle;
    console.log(getTitle.newProjectTitle)
    currentProject.action = getAction.newProjectAction;
    currentProject.time = "00:00:00";

    projectArray.push(currentProject)

    window.localStorage.setItem('project-list', JSON.stringify(projectArray));

    updateSidebar();
});



// Map project-list to sidebar as buttons

const updateSidebar = () => {

    const newProjectEntry = document.createElement("button");

    // newProjectEntry.innerHTML =
    //     `<p>${newProjectTitle}</p>
    //     <p class="grey">00:00:00</p>`;

    // sideBar.appendChild(newProjectEntry);
};
    







// theme toggle

const themeSwitcher = document.querySelector("input");
const theme = document.querySelector('link');

themeSwitcher.addEventListener("click", () => {
    theme.getAttribute("href") == "style.css" ? 
    theme.setAttribute("href", "night-mode.css") : 
    theme.setAttribute("href", "style.css")
});






// Edit action title
let action = document.getElementById("action");

action.addEventListener("click", () => {
    newActionTitle = prompt("What is your current action-item?", action.innerHTML);
    // User cannot 'cancel'
    newActionTitle === null ? newActionTitle = action.innerHTML : false;
    // validate
    while(newActionTitle.length < 1 || newActionTitle.length > 25) {
        newActionTitle = prompt("Title must be between 1 and 25 characters long.")
    };
    
    action.innerHTML = newActionTitle;
});





// Start-pause toggle

const clockDisplay = document.querySelector(".clock-display");
const startButton = document.querySelector(".start-button");
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







// reset timer

const resetButton = document.querySelector(".reset-button");

resetButton.addEventListener("click", () => {
    if(!paused) {
        alert("Please pause timer before restarting")
    } else {
        restartTimer();
    }
});

const restartTimer = () => {
    stopWatch.elapsedTime = 0;
    stopWatch.startTime = Date.now();
    displayTime(0, 0, 0);
};




// add new entry to time recorded list if it passes checks

const addButton = document.querySelector(".add-button");
const list = document.querySelector(".list");
let duplicates = false;

addButton.addEventListener("click", () => {
    !paused ? alert("Please pause timer first") : 
    list.innerHTML.includes(action.innerHTML) ? alert("Please change the action title")
    : createEntry(), restartTimer();
});

const createEntry = () => {
    let newListItem = document.createElement("li");
    newListItem.classList.add("list-item");

    newListItem.innerHTML = 
        `<section>
            <div class="entry-info">
                <p class="title">${action.innerHTML}</p>
                <p class="grey time">${clockDisplay.innerHTML}</p>
            </div>
            <ul class="entry-buttons">
                <li>
                    <button class="edit-button">
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

    list.prepend(newListItem);
    sumTime();
};







// delete & edit buttons

list.addEventListener("click", (event) => {
    event.target.classList.contains("fa-trash") ? deleteItem(event)
    : event.target.classList.contains("fa-edit") ? editItem(event)
    : false;
});


const deleteItem = (event) => {
    let targetLi = event.target.parentElement.parentElement.parentElement.parentElement;
    const deleteCheck = prompt("To delete please type 'DELETE'");
    deleteCheck === "DELETE" ? targetLi.remove() : false // do nothing

    sumTime();
};

const editItem = (event) => {
    let targetItem = event.target.parentElement.parentElement.parentElement.parentElement;
        let title = targetItem.firstElementChild.firstElementChild
        let time = title.nextElementSibling

    let changeTitle = prompt("Change the title", title.innerHTML);
        // validate input
        while(changeTitle.length < 1 || changeTitle.length > 25) {
            changeTitle = prompt("Title must be between 1 & 25 characters.", title.innerHTML)
        };

        title.innerHTML = changeTitle;

    let changeTime = prompt("Change the time. Format hh:mm:ss", time.innerHTML);
        // validate input through regular expression
        let regex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;

        while(!changeTime.match(regex) || changeTime.length !== 8 ) {
            changeTime = prompt("Format must be hh:mm:ss. Numbers only.", time.innerHTML)
        };
        
        time.innerHTML = changeTime;

        sumTime();
};






// Total time recorded

const totalTime = document.querySelector(".total-time");
totalTime.innerHTML = "Total time recorded :" + " 00:00:00";


const sumTime = () => {

    let timeRecorded = [];
    let sumSeconds = 0;

    const itemTime = document.querySelectorAll(".time");
    
    itemTime.forEach(item => {
        timeRecorded.push(item.innerHTML);
    });

    timeRecorded.forEach(entry => {
        let timeEntry = entry.split(":");
        let subSeconds = +timeEntry[0] * 60 * 60 + +timeEntry[1] * 60 + +timeEntry[2];
        sumSeconds += subSeconds;
    })

    let timeTotal = new Date(sumSeconds * 1000).toISOString().substr(11,8);
    
    totalTime.innerHTML = `Total time recorded :` + ` ${timeTotal}`;
};