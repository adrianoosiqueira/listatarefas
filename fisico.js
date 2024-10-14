const taskList = document.getElementById('taskList');
const addBtn = document.getElementById('addBtn');
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
let currentTask = null;

async function fetchTasks() {
    const response = await fetch('/tasks');
    const data = await response.json();
    taskList.innerHTML = ''; 
    data.tasks.forEach(task => renderTask(task));
}

async function addTask() {
    const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Nova Tarefa' })
    });
    const newTask = await response.json();
    renderTask({ id: newTask.id, name: 'Nova Tarefa', completed: 0 });
}

async function editTask() {
    if (currentTask) {
        const taskId = currentTask.getAttribute('data-id');
        const taskName = currentTask.firstChild.textContent;

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = taskName;

        currentTask.innerHTML = '';
        currentTask.appendChild(editInput);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Salvar';
        saveBtn.classList.add('btn-save');
        currentTask.appendChild(saveBtn);

        saveBtn.addEventListener('click', async function() {
            if (editInput.value.trim() === '') {
                alert('O nome da tarefa não pode estar vazio!');
                return;
            }
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editInput.value, completed: 0 })
            });

            if (response.ok) {
                currentTask.innerHTML = editInput.value;
                currentTask = null;
                fetchTasks();
            }
        });
    } else {
        alert('Selecione uma tarefa para editar.');
    }
}

async function deleteTask() {
    if (currentTask) {
        const taskId = currentTask.getAttribute('data-id');
        await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
        fetchTasks();
    } else {
        alert('Selecione uma tarefa para excluir.');
    }
}

function renderTask(task) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.setAttribute('data-id', task.id);

    const taskContent = document.createElement('span');
    taskContent.textContent = task.name;
    taskDiv.appendChild(taskContent);

    if (task.completed) {
        taskDiv.classList.add('completed');
        taskContent.style.textDecoration = 'line-through';
    }

    taskList.appendChild(taskDiv);

    taskDiv.addEventListener('click', function() {
        if (currentTask === taskDiv) {
            taskDiv.classList.remove('selected');
            currentTask = null;
        } else {
            if (currentTask) {
                currentTask.classList.remove('selected');
            }
            currentTask = taskDiv;
            taskDiv.classList.add('selected');
        }
    });
}

addBtn.addEventListener('click', addTask);
editBtn.addEventListener('click', editTask);
deleteBtn.addEventListener('click', deleteTask);

fetchTasks();
