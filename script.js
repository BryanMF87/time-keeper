

const projects = JSON.parse(localStorage.getItem("projects") || "[]");

const saveToStorage = () => {
    localStorage.setItem("projects", JSON.stringify(projects));
};


// sidebar toggle

const menuBtn = document.querySelector(".menu");
const sideBar = document.querySelector("sidebar");

const toggleMenu = () => {
    sideBar.style.display === "none" ? 
    sideBar.style.display = "flex" :
    sideBar.style.display = "none";
};

menuBtn.addEventListener("click", toggleMenu);





// theme toggle

const themeSwitcher = document.querySelector("input");
const theme = document.querySelector('link');

themeSwitcher.addEventListener("click", () => {
    theme.getAttribute("href") == "style.css" ? 
    theme.setAttribute("href", "night-mode.css") : 
    theme.setAttribute("href", "style.css")
});






// Create new project through prompt input

const newProjectBtn = document.querySelector(".new-project");

newProjectBtn.addEventListener("click", () => {

    // get the title
    let newProjectTitle = prompt("What will your cool new project be called?");

    if (newProjectTitle === null) { return };

    while (newProjectTitle.length < 1 || newProjectTitle.length > 25) {
    newProjectTitle = prompt("Title must be between 1 and 25 characters long.")
    };

    projects.find(item => {
        while(item.title === newProjectTitle) {
            newProjectTitle = prompt("That project already exists., Try a different name")
        }
    });


    // get the action
    let newProjectAction = prompt("What is your first to-do Item?", "Set up project");

    if(newProjectAction === null) { return };

    while(newProjectAction.length < 1 || newProjectAction > 25) {
        newProjectAction = prompt("Action must be between 1 and 25 characters long.")
    };

    addProject(newProjectTitle, newProjectAction);
});





// push new project input to local storage

const addProject = (newProjectTitle, newProjectAction) => {

    let newProject = {};
        newProject.title = newProjectTitle,
        newProject.action = newProjectAction,
        newProject.time = "00:00:00",
        newProject.totalTime = "00:00:00",
        newProject.recordingData = []
    
    projects.unshift(newProject);

    saveToStorage();
    updateSidebar();
    updateContent();
    toggleMenu();
};





// Display sidebar project buttons

const projectBtnContainer = document.querySelector(".project-btn-container");

const updateSidebar = () => {
    
    projectBtnContainer.innerHTML = '';

    projects.forEach(project => {
        let btn = document.createElement("button");
        btn.classList.add("project-button");
        btn.setAttribute("id", `${project.title}`)
        btn.innerHTML = 
            `<p>${project.title}</p>
            <p class="grey">${project.totalTime}</p>`;
        projectBtnContainer.appendChild(btn);
    });

    const projectBtn = document.querySelectorAll(".project-button");
    
    for (const btn of projectBtn) {
        btn.addEventListener("click", () => {
            updateContent(btn.id);
            screen.width < 1200 ? toggleMenu() : false;
        });
    };
};





// Change main content

const contentTitle = document.querySelector(".content-title");
const contentAction = document.getElementById("content-action");
const clockDisplay = document.querySelector(".clock-display");
const currentTimer = document.querySelector(".current-timer");
const totalTime = document.querySelector(".total-time");
const recordingList = document.querySelector(".recording-list");
let activeProject;

const getContent = (activeProject) => {
    contentTitle.innerHTML = activeProject.title;
    contentAction.innerHTML = activeProject.action;
    clockDisplay.innerHTML = activeProject.time;
    currentTimer.style.display = "none" ? currentTimer.style.display = "block" : false;
    totalTime.innerHTML = "Total time recorded : " + activeProject.totalTime;
    updateRecordingList();
};

const updateContent = (target) => {


    if(projects[0] === undefined) {
        contentTitle.innerHTML = "Make a new project";
        contentAction.innerHTML = "Via the sidebar";
        currentTimer.style.display = "none";

    } else if (target === undefined) {
        activeProject = projects[0];
        getContent(activeProject);

    } else if (target !== undefined) {
        activeProject = projects.find(project => project.title === target);
        getContent(activeProject);
    };
};




// Delete selected project

const deleteProjectBtn = document.querySelector(".delete-project");

deleteProjectBtn.addEventListener("click", () => {
    let projectToDelete = prompt("Type the name of the project you wish to delete.");

    if(!projectBtnContainer.innerHTML.includes(projectToDelete)) {
        alert("That project doesn't exist");
    }
    else {
        const removeFromArray = projects.map(
            project => project.title).indexOf(projectToDelete);
        projects.splice(removeFromArray, 1);
            
        saveToStorage();
        updateSidebar();
        updateContent();
    }
});




// Edit action title

contentAction.addEventListener("click", () => {
    newActionTitle = prompt("What is your current action-item?", contentAction.innerHTML);

    newActionTitle === null ? newActionTitle = contentAction.innerHTML : false;

    while(newActionTitle.length < 1 || newActionTitle.length > 25) {
        newActionTitle = prompt("Title must be between 1 and 25 characters long.")
    };

    contentAction.innerHTML = newActionTitle;
    activeProject.action = newActionTitle;
    saveToStorage();
});










/*  CLOCK DISPLAY  */


// Start-pause toggle

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
        activeProject.time = clockDisplay.innerHTML;
        saveToStorage();
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
    saveToStorage(contentTitle.innerHTML, "time", "00:00:00");
};







/*   RECORDING LIST   */


// add new entry to time recording list if it passes checks

const addButton = document.querySelector(".add-button");

addButton.addEventListener("click", () => {
    !paused ? alert("Please pause timer first") : 
    recordingList.innerHTML.includes(contentAction.innerHTML) 
        ? alert("Please change the action title")
        : createListItem();
});



const createListItem = () => {

    let newDataItem = {
        action: contentAction.innerHTML, 
        time: clockDisplay.innerHTML
    };

    activeProject.recordingData.unshift(newDataItem);
    restartTimer();
    saveToStorage();
    updateRecordingList();
};




const updateRecordingList = () => {

    recordingList.innerHTML = "";

    activeProject.recordingData.forEach(item => {
        let newListItem = document.createElement("li");
        newListItem.classList.add("list-item");

        newListItem.innerHTML = 
            `<section>
                <div class="entry-info">
                    <p class="title">${item.action}</p>
                    <p class="grey time">${item.time}</p>
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

        recordingList.appendChild(newListItem);
    });
    sumTime();
};




// delete & edit buttons

recordingList.addEventListener("click", (event) => {
    event.target.classList.contains("fa-trash") ? deleteItem(event)
    : event.target.classList.contains("fa-edit") ? editItem(event)
    : false;
});


const deleteItem = (event) => {
    let deleteButtons = document.querySelectorAll(".delete-button");

    deleteButtons.forEach((button, index) => {
        if (button.contains(event.target)) {
            let deleteCheck = prompt("To delete please type 'DELETE'");
            if(deleteCheck === "DELETE") { 
                activeProject.recordingData = activeProject.recordingData.filter(
                    item => item !== activeProject.recordingData[index]);
                saveToStorage();
                updateRecordingList();
                sumTime();
            };
        };
    });
};



const editItem = (event) => {

    let editButtons = document.querySelectorAll(".edit-button");

    editButtons.forEach((button, index) => {

        if (button.contains(event.target)) {

            let currentAction = activeProject.recordingData[index].action;
            let currentTime = activeProject.recordingData[index].time;

            let editAction = prompt("Change the action title", currentAction);
            // validate input
            if(editAction === null) { return };
            while(editAction.length < 1 || editAction.length > 25) {
                editAction = prompt("Action must be between 1 & 25 characters.", currentAction)
            };


            let editTime = prompt("Change the time. Format hh:mm:ss", currentTime);
            // validate input through regular expression
            let regex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
            while(!editTime.match(regex) || editTime.length !== 8 ) {
                editTime = prompt("Format must be hh:mm:ss. Numbers only.", currentTime)
            };
        
            activeProject.recordingData[index].action = editAction;
            activeProject.recordingData[index].time = editTime;
        };
    });

    updateRecordingList();
    sumTime();
}






// Total time recorded

const sumTime = () => {

    let sumSeconds = 0;

    for(const item of activeProject.recordingData) {
        let itemTime = item.time.split(":");
        let subSeconds = +itemTime[0] * 60 * 60 + +itemTime[1] * 60 + +itemTime[2];
        sumSeconds += subSeconds;
    };

    let timeTotal = new Date(sumSeconds * 1000).toISOString().substr(11,8);

    totalTime.innerHTML = `Total time recorded : ${timeTotal}`;
    activeProject.totalTime = timeTotal;
    saveToStorage();
    updateSidebar(); // to display correct total time

};


// Fetch all content on window load

updateSidebar();
updateContent();