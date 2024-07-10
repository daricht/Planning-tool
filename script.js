document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('addTaskButton');
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const taskList = document.getElementById('taskList');

    const priorityOrder = {
        'low': 3,
        'medium': 2,
        'high': 1
    };

    const comparePriority = (a, b) => {
        const priorityA = priorityOrder[a.priority];
        const priorityB = priorityOrder[b.priority];
        return priorityA - priorityB;
    };

    const addTask = () => {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;
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

    const renderTasks = (tasks) => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${task.text} (${task.priority})`;
            listItem.classList.add(`priority-${task.priority}`);

            const changePriorityButton = document.createElement('button');
            changePriorityButton.textContent = 'Change Priority';
            changePriorityButton.addEventListener('click', () => {
                const newPriority = prompt('Enter new priority (low, medium, high):', task.priority);
                if (newPriority && priorityOrder[newPriority] !== undefined) {
                    changePriority(index, newPriority);
                }
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(index));

            listItem.appendChild(changePriorityButton);
            listItem.appendChild(deleteButton);
            taskList.appendChild(listItem);
        });
    };

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.sort(comparePriority);
        renderTasks(tasks);
    };

    addTaskButton.addEventListener('click', addTask);

    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    loadTasks(); // Load tasks when the page is loaded
});