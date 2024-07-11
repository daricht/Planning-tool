document.getElementById('highPriorityButton').addEventListener('click', () => addTask('priority-9'));
document.getElementById('mediumPriorityButton').addEventListener('click', () => addTask('priority-5'));
document.getElementById('lowPriorityButton').addEventListener('click', () => addTask('priority-1'));

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
        listItem.classList.add(`${task.priority}`);

        const increasePriorityButton = document.createElement('button');
        increasePriorityButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        increasePriorityButton.classList.add('task-buttons');
        increasePriorityButton.addEventListener('click', () => {
            const newPriority = getNextPriority(task.priority, 'increase');
            if (newPriority) {
                changePriority(index, newPriority);
            }
        });

        const decreasePriorityButton = document.createElement('button');
        decreasePriorityButton.innerHTML = '<i class="fas fa-arrow-down"></i>';
        decreasePriorityButton.classList.add('task-buttons');
        decreasePriorityButton.addEventListener('click', () => {
            const newPriority = getNextPriority(task.priority, 'decrease');
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
    const priorities = ['priority-10', 'priority-9', 'priority-8', 'priority-7', 'priority-6', 'priority-5', 'priority-4', 'priority-3', 'priority-2', 'priority-1'];
    const currentIndex = priorities.indexOf(currentPriority);
    if (action === 'increase' && currentIndex > 0) {
        return priorities[currentIndex - 1];
    } else if (action === 'decrease' && currentIndex < priorities.length - 1) {
        return priorities[currentIndex + 1];
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

const priorities = {
    'priority-10': 1, // highes
    'priority-9': 2,
    'priority-8': 3,
    'priority-7': 4,
    'priority-6': 5,
    'priority-5': 6,
    'priority-4': 7,
    'priority-3': 8,
    'priority-2': 9,
    'priority-1': 10, // lowest
};

const comparePriority = (a, b) => {
    return priorities[a.priority] - priorities[b.priority];
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
            if (daysDiff <= 3) newPriorityLevel = 1;
            else if (daysDiff <= 6) newPriorityLevel = 2;
            else if (daysDiff <= 9) newPriorityLevel = 3;
            else if (daysDiff <= 12) newPriorityLevel = 4;
            else if (daysDiff <= 15) newPriorityLevel = 5;
            else if (daysDiff <= 18) newPriorityLevel = 6;
            else if (daysDiff <= 21) newPriorityLevel = 7;
            else if (daysDiff <= 24) newPriorityLevel = 8;
            else if (daysDiff <= 27) newPriorityLevel = 9;
            // Convert to priority string
            const newPriority = `priority-${newPriorityLevel}`;
            // Check if we need to increase the priority
            if (priorities[task.priority] > priorities[newPriority]) {
                task.priority = newPriority;
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