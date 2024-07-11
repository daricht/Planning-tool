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
        listItem.textContent = `${task.text} (${task.priority})`;
        if (task.dueDate) {
            listItem.textContent += ` (Due: ${task.dueDate})`;
            listItem.dataset.dueDate = task.dueDate;
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