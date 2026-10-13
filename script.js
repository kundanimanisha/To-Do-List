const emptyMessage = document.getElementById("emptyMessage");
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

const allButton = document.getElementById("allButton");
const pendingButton = document.getElementById("pendingButton");
const completedButton = document.getElementById("completedButton");


// Load saved tasks, or start with an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
// Save the current tasks in the browser
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update the total and completed task counts
function updateCounts() {
    totalTasks.textContent = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    completedTasks.textContent = completed;
}

// Display all tasks on the webpage
function displayTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(function (task) {
            return task.completed === false;
        });
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(function (task) {
            return task.completed === true;
        });
    }
    emptyMessage.hidden = filteredTasks.length > 0;

    if (filteredTasks.length === 0) {
        if (currentFilter === "pending") {
            emptyMessage.textContent = "No pending tasks. You're all caught up!";
        } else if (currentFilter === "completed") {
            emptyMessage.textContent = "No completed tasks yet. Keep going!";
        } else {
            emptyMessage.textContent = "No tasks yet. Add your first task to get started!";
        }
    }

    filteredTasks.forEach(function (task) {
        const index = tasks.indexOf(task);

        const listItem = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        if (task.completed) {
            taskText.classList.add("completed");
        }

        checkbox.addEventListener("change", function () {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            const updatedTask = prompt("Edit your task:", task.text);

            if (updatedTask !== null && updatedTask.trim() !== "") {
                tasks[index].text = updatedTask.trim();

                saveTasks();
                displayTasks();
            }
        });


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(taskText);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });

    updateCounts();
}

// Add a new task
addButton.addEventListener("click", function () {
    const task = taskInput.value.trim();

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: task,
        completed: false
    });

    saveTasks();
    displayTasks();

    taskInput.value = "";
});


taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addButton.click();
    }
});


function setActiveFilter(filter) {
    currentFilter = filter;

    allButton.classList.toggle("active", filter === "all");
    pendingButton.classList.toggle("active", filter === "pending");
    completedButton.classList.toggle("active", filter === "completed");

    displayTasks();
}

allButton.addEventListener("click", function () {
    setActiveFilter("all");
});

pendingButton.addEventListener("click", function () {
    setActiveFilter("pending");
});

completedButton.addEventListener("click", function () {
    setActiveFilter("completed");
});

// Set the initial selected filter
setActiveFilter("all");


// Display previously saved tasks when the page opens
displayTasks();


