document.getElementById('highPriorityButton').addEventListener('click', () => addTask('high'));
document.getElementById('mediumPriorityButton').addEventListener('click', () => addTask('medium'));
document.getElementById('lowPriorityButton').addEventListener('click', () => addTask('low'));

const taskInput = document.getElementById('taskInput');
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask('medium'); // Default priority when Enter is pressed
    }
});

const addTask = (priority) => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const task = {
            text: taskText,
            priority: priority
        };
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        tasks.sort(comparePriority);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
        taskInput.value = ''; // Clear the input field
    }
};

const renderTasks = (tasks) => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${task.text} (${task.priority})`;
        listItem.classList.add(`priority-${task.priority}`);

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
};

const getNextPriority = (currentPriority, action) => {
    const priorities = ['high', 'medium', 'low'];
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

const comparePriority = (a, b) => {
    const priorities = ['high', 'medium', 'low'];
    return priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
};

// Initial render of tasks from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(tasks);
});