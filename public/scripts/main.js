const addColumn = document.getElementById("addColumn");
const columnDiv = document.getElementById("columnDiv");
const newColumnForm = document.querySelector('.new-column-form');
const newTaskForm = document.querySelector('.new-task-form');
const backdrop = document.querySelector('.backdrop');
const newTaskData = document.getElementById("newTaskData");
const newColumnData = document.getElementById("newColumnData");
let currentColumnElement = null;
let currentColumnId = null;

addColumn.addEventListener("click", () => {
    if(!localStorage.getItem('token')){
        window.location.href = '../registerPage/register.html';
        return;
    }
    newColumnForm.style.display = newColumnForm.style.display === 'none' ? 'flex' : 'none';
    backdrop.style.display = backdrop.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('click', (e) => {
    if (newColumnForm.style.display === 'flex') {
        if (!newColumnForm.contains(e.target) && !addColumn.contains(e.target)) {
            newColumnForm.style.display = 'none';
            backdrop.style.display = 'none';
        }
    }
    if (newTaskForm.style.display === 'flex') {
        const isNewTaskBtn = e.target.closest('.newTask');
        if (!newTaskForm.contains(e.target) && !isNewTaskBtn) {
            newTaskForm.style.display = 'none';
            backdrop.style.display = 'none';
        }
    }
});

columnDiv.addEventListener('click', (e) => {
    const newTaskButton = e.target.closest('.newTask');
    if (newTaskButton) {
        newTaskForm.style.display = 'flex';
        backdrop.style.display = 'block';
        currentColumnElement = newTaskButton.closest('.column');
        currentColumnId = currentColumnElement.dataset.columnId;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return;
    }
    loadColumns();
});

async function loadColumns() {
    const token = localStorage.getItem("token");
    try{
        const res = await fetch('/api/columns', {
            method: 'GET',
            headers: {
                'token': token
            }
        });
        if(!res.ok) {
            console.error('Could not fetch columns.');
            if (res.status === 401) window.location.href = '/HomePage/Home.html';
        }
        const columns = await res.json();

        columnDiv.innerHTML = '';
        columnDiv.appendChild(addColumn);
        const elementsToAnimate = [];
        columns.forEach(column => {
            const columnEl = createColumn(column.title, column.color, column.description, column._id);
            loadTasksForColumn(columnEl, column._id);
            elementsToAnimate.push(columnEl);
            const tasksContainer = columnEl.querySelector('.tasks-container');
            initSortable(tasksContainer);
        });
        gsap.from(elementsToAnimate, {
            duration: 1.8,
            opacity: 0,
            y: -100,
            ease: "back.out(1.7)",
            stagger: 0.2
        });

    }catch(err){
        console.log(err);
    }
}

async function loadTasksForColumn(columnCurrentElement, columnId){
    const token = localStorage.getItem("token");
    if(!token) return;

    try {
        const res = await fetch(`/api/tasks/column/${columnId}`, {
            method: 'GET',
            headers: {
                'token': token
            }
        });
        if(!res.ok) {
            console.error('Error server');
            return;
        }
        const elementsToAnimate = [];
        const tasks = await res.json();
        tasks.forEach(task => {
            const taskElement= createTask(task.title, task.color, task.description, task._id, columnCurrentElement);
            elementsToAnimate.push(taskElement);
        });
        gsap.from(elementsToAnimate, {
            duration: 0.9,
            opacity: 0,
            scale: 0.3,
            ease: "expo.out",
            stagger: 0.1
        });
    }catch(err){
        console.log(err);
    }
}
initColumDrag()
newColumnData.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(newColumnData);
    const title = data.get('name');
    const color = data.get('color');
    const description = data.get('description');

    const token = localStorage.getItem('token');
    if(!token) return;

    try{
        const res = await fetch('/api/columns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({ title, color, description })
        });

        if(!res.ok) {
            console.error('Error');
            return;
        }

        const newColumn = await res.json();
        const newColumnElement = createColumn(newColumn.title, newColumn.color, description, newColumn._id);
        const tasksContainer = newColumnElement.querySelector('.tasks-container');
        initSortable(tasksContainer);
        gsap.from(newColumnElement, {
            duration: 0.8,
            opacity: 0,
            y: -100,
            ease: "back.out(1.7)"
        });
        newColumnForm.style.display = 'none';
        backdrop.style.display = 'none';
        newColumnData.reset();
    }catch(err){
        console.log(err);
    }
});

newTaskData.addEventListener('submit', async(e) => {
    e.preventDefault();
    const data = new FormData(newTaskData);
    const title = data.get('nameTask');
    const color = data.get('colorTask');
    const description = data.get('descriptionTask');

    const token = localStorage.getItem('token');
    if (!token || !currentColumnId) {
        return;
    }

    try{
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({ title, color, description, columnId: currentColumnId })
        });

        if(!res.ok) {
            console.error('Error server');
            return
        }

        const newTask = await res.json();
        const newTaskElement = createTask(newTask.title, newTask.color, newTask.description, newTask._id, currentColumnElement);
        gsap.from(newTaskElement, {
            duration: 0.9,
            opacity: 0,
            scale: 0.3,
            ease: "expo.out"
        });
        newTaskForm.style.display = 'none';
        backdrop.style.display = 'none';
        newTaskData.reset();
    }catch(err){
        console.log(err);
    }
});

function createColumn(title, color, description, column_id) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
<div data-description="${description || ''}" data-column-id="${column_id}" class="column flex flex-col justify-center gap-[16px] flex-shrink-0 p-[24px] bg-[#262626] max-w-[348px] w-full rounded-[16px]  border-t-4 border-solid" style="border-top-color: ${color}">
        <div>
            <span class="text-style-large-bold">${title}</span>
        </div>
        
        <div class="tasks-container flex flex-col gap-[16px]">
        </div>
        
        <div class="newTask order-9999 border-dashed button-plus-on-hover border-[1px] border-[#595959] p-[24px] rounded-[16px] cursor-pointer">
            <button class="text-[16px] button-style-task glow-on-hover text-text-color-accent leading-[150%] font-semibold cursor-pointer">+ New Task</button>
        </div>
</div> `;

    const columnElement = wrapper.firstElementChild;
    columnDiv.insertBefore(columnElement, addColumn);
    return columnElement;
}

function createTask(title, color, description, taskId, currentColumn) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<div class="task-style" data-id="${taskId}" style="background-color:${color}">
    <span class="text-style-title">${title}</span>
    <p class="text-style-main">${description || ''}</p>
    </div>`;

    const taskElement = wrapper.firstElementChild;

    if(currentColumn){
        const container = currentColumn.querySelector('.tasks-container');
        if (container) {
            container.appendChild(taskElement);
        } else {
            console.error('Container not found');
        }
    }
    return taskElement;
}