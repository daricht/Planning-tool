document.getElementById('highPriorityButton').addEventListener('click', () => addTask('1'));
document.getElementById('mediumPriorityButton').addEventListener('click', () => addTask('5'));
document.getElementById('lowPriorityButton').addEventListener('click', () => addTask('9'));

const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask('medium'); // Default priority when Enter is pressed
    }
});

const addTask = (priority) => {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    if (taskText !== '') {
        const task = {
            text: taskText,
            priority: priority,
            dueDate: dueDate
        };
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        tasks.sort(comparePriority);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
        taskInput.value = ''; // Clear the input field
        dueDateInput.value = ''; // Clear the due date field
    }
};

const renderTasks = (tasks) => { // Render tasks to the DOM
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.id = `task-${index}`; // Assign ID to each task's container

        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = `${task.text} (${task.priority})`;
        listItem.appendChild(taskTextSpan);


        if (task.dueDate) {
            const dueDate = document.createElement('span');
            dueDate.textContent = ` (Due: ${task.dueDate})`;
            dueDate.classList.add('due-date');
            listItem.appendChild(dueDate);
        }
        listItem.classList.add(`priority-${task.priority}`);

        const increasePriorityButton = document.createElement('button');
        increasePriorityButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        increasePriorityButton.classList.add('task-buttons');
        increasePriorityButton.addEventListener('click', () => {
            const newPriority = getNextPriority(task.priority, 'decrease');
            if (newPriority) {
                changePriority(index, newPriority);
            }
        });

        const decreasePriorityButton = document.createElement('button');
        decreasePriorityButton.innerHTML = '<i class="fas fa-arrow-down"></i>';
        decreasePriorityButton.classList.add('task-buttons');
        decreasePriorityButton.addEventListener('click', () => {
            const newPriority = getNextPriority(task.priority, 'increase');
            if (newPriority) {
                changePriority(index, newPriority);
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add('task-buttons');
        deleteButton.addEventListener('click', () => deleteTask(index));

        // Pencil (Edit) Button
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa fa-pencil"></i>'; // Assuming FontAwesome is used
        editButton.className = 'task-buttons edit-button';
        editButton.onclick = () => editTask(index); // Function to handle task editing

        listItem.appendChild(editButton);
        listItem.appendChild(increasePriorityButton);
        listItem.appendChild(decreasePriorityButton);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });
    updateTaskPriorities();
};

const getNextPriority = (currentPriority, action) => {
    let numericPriority = parseInt(currentPriority, 10);
    if (action === 'increase') {
        return numericPriority < 10 ? numericPriority + 1 : numericPriority;
    } else if (action === 'decrease') {
        return numericPriority > 1 ? numericPriority - 1 : numericPriority;
    }
    return null;
};

// Function to show a date input field once the edit task button is clicked
const editTask = (index) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks[index];

    //Hide old due date and edit button
    const oldDueDate = document.querySelector(`#task-${index} .due-date`);
    oldDueDate.style.display = 'none';
    const editButton = document.querySelector(`#task-${index} .edit-button`);
    editButton.style.display = 'none';

    // Create a date input field
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'edit-date-input';
    dateInput.value = task.dueDate; // Set current due date as default value

    // Create a save button for the date input
    const saveButton = document.createElement('button');
    saveButton.innerHTML = '<i class="fa fa-save"></i>'; // Assuming FontAwesome is used
    saveButton.className = 'save-date-btn task-buttons';

    // Append the date input and save button to the task element
    const taskElement = document.querySelector(`#task-${index}`); // Assuming each task has an id like 'task-0', 'task-1', etc.
    taskElement.insertBefore(dateInput, taskElement.childNodes[1]); // Insert the date input before the task text
    taskElement.insertBefore(saveButton, taskElement.childNodes[2]);

    // Event listener for the save button
    saveButton.addEventListener('click', () => {
        const newDueDate = dateInput.value;
        changeDueDate(index, newDueDate);
        // Remove the date input and save button after saving
        taskElement.removeChild(dateInput);
        taskElement.removeChild(saveButton);
        editButton.style.display = 'inline-block'; // Show the edit button again
        oldDueDate.style.display = 'inline-block'; // Show the new due date
    });
};


const changePriority = (index, newPriority) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].priority = newPriority;
    tasks.sort(comparePriority);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
};

const deleteTask = (index) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
};

const comparePriority = (a, b) => {
    return a.priority - b.priority;
};

const changeDueDate = (index, newDueDate) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (index >= 0 && index < tasks.length) {
        tasks[index].dueDate = newDueDate;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
    }
};

const updateTaskPriorities = () => {
    const now = new Date();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let updated = false;
    tasks.forEach(task => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        if (dueDate) {
            const timeDiff = dueDate - now;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            let newPriorityLevel = 10; // Default to lowest priority
            if (daysDiff <= 1) newPriorityLevel = 2;
            else if (daysDiff <= 2) newPriorityLevel = 2;
            else if (daysDiff <= 3) newPriorityLevel = 3;
            else if (daysDiff <= 5) newPriorityLevel = 4;
            else if (daysDiff <= 8) newPriorityLevel = 5;
            else if (daysDiff <= 11) newPriorityLevel = 6;
            else if (daysDiff <= 14) newPriorityLevel = 7;
            else if (daysDiff <= 17) newPriorityLevel = 8;
            else if (daysDiff <= 28) newPriorityLevel = 9;
            // Check if we need to increase the priority
            if (task.priority > newPriorityLevel) {
                task.priority = newPriorityLevel;
                updated = true;
            }
        }
    });
    if (updated) {
        tasks.sort(comparePriority);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
};

setInterval(() => {
    updateTaskPriorities();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(tasks);
}, 60 * 60 * 1000); // Update priorities and render tasks every hour

document.addEventListener('DOMContentLoaded', () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(tasks);
});