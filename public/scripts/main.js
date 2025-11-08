const addColumn = document.getElementById("addColumn");
const columnDiv = document.getElementById("columnDiv");
const newColumnForm = document.querySelector('.new-column-form');
const newTaskForm = document.querySelector('.new-task-form');
const updateTaskForm = document.querySelector('.update-task-form');
const updateColumnForm = document.querySelector('.update-column-form');
const backdrop = document.querySelector('.backdrop');
const newTaskData = document.getElementById("newTaskData");
const updateTaskData = document.getElementById("UpdateTaskData");
const updateColumnData = document.getElementById("UpdateColumnData");
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
    if(currentChangeMenu && currentChangeMenu.style.display === 'flex'){
        currentChangeMenu.style.display = 'none';
        currentChangeTask.style.zIndex = '1';
    }
    currentChangeMenuColumn.style.display = 'none';
    currentChangeColumn.style.zIndex = '1';
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
    if (updateTaskForm.style.display === 'flex') {
        const isEditButton = e.target.closest('.editMenu');
        if(!updateTaskForm.contains(e.target) && !isEditButton) {
            updateTaskForm.style.display = 'none';
            backdrop.style.display = 'none';
        }
    }
});

columnDiv.addEventListener('click', (e) => {
    const newTaskButton = e.target.closest('.newTask');
    if (newTaskButton) {
        newTaskForm.style.display = 'flex';
        backdrop.style.display = 'block';
        if(currentChangeMenu && currentChangeMenu.style.display === 'flex') {
            currentChangeMenu.style.display = 'none';
            currentChangeTask.style.zIndex = '1';
        }
        if(currentChangeMenuColumn && currentChangeMenuColumn.style.display === 'flex') {
            currentChangeMenuColumn.style.display = 'none';
            currentChangeColumn.style.zIndex = '1';
        }
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
<div data-description="${description || ''}" data-column-id="${column_id}" class="column flex flex-col justify-center gap-[16px] flex-shrink-0 p-[24px] bg-[#262626] max-w-[348px] w-full rounded-[16px]  border-t-4 border-solid max-h-[100%]" style="border-top-color: ${color}">
        <div class="flex flex-row justify-between items-center">
        <div>
            <span class="text-style-large-bold title">${title}</span>
        </div>
        <button class="menuBtnTaskColumn w-[24px] flex self-start">
                <img src="../src/9023500_dots_three_outline_fill_icon.svg" alt="menu">
            </button>
            <div style="display: none" class="absolute change-window-column flex-col justify-center items-center w-[150px] bg-gray-950 rounded-lg border-[1px] border-dashed border-white">
                <div class="editMenuColumn flex flex-row gap-[16px] items-center justify-start w-full rounded-lg px-[20px] py-[10px] border-b-[1px] border-dashed border-white hover:bg-gray-800 cursor-pointer">
                     <img class="w-[20px]" src="../src/352547_edit_mode_icon.svg" alt="edit">
                     <span class="text-style-title">Edit</span>
                </div>
                <div class="deleteMenuColumn flex flex-row gap-[16px] items-center justify-start w-full rounded-lg px-[20px] py-[10px] hover:bg-gray-800 cursor-pointer">
                     <img class="w-[20px]" src="../src/7853766_trash_kashifarif_delete_remove_recycle_icon.svg" alt="edit">
                     <span class="text-style-title text-[#E32636]">Delete</span>
                </div>
            </div>
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
    wrapper.innerHTML = `<div class="task-style relative" data-id="${taskId}" style="background-color:${color}">
    <div class="flex flex-row justify-between items-center">
        <span class="text-style-title title">${title}</span>
        <div> 
            <button class="menuBtnTask w-[24px] flex self-start">
                <img src="../src/9023500_dots_three_outline_fill_icon.svg" alt="menu">
            </button>
            <div style="display: none" class="absolute change-window flex-col justify-center items-center w-[150px] bg-gray-950 rounded-lg border-[1px] border-dashed border-white">
                <div class="editMenu flex flex-row gap-[16px] items-center justify-start w-full rounded-lg px-[20px] py-[10px] border-b-[1px] border-dashed border-white hover:bg-gray-800 cursor-pointer">
                     <img class="w-[20px]" src="../src/352547_edit_mode_icon.svg" alt="edit">
                     <span class="text-style-title">Edit</span>
                </div>
                <div class="deleteMenu flex flex-row gap-[16px] items-center justify-start w-full rounded-lg px-[20px] py-[10px] hover:bg-gray-800 cursor-pointer">
                     <img class="w-[20px]" src="../src/7853766_trash_kashifarif_delete_remove_recycle_icon.svg" alt="edit">
                     <span class="text-style-title text-[#E32636]">Delete</span>
                </div>
            </div> </div> </div> <p class="text-style-main description">${description || ''}</p> 
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
let currentTask;
let currentChangeTask;
let currentChangeMenu;
let currentChangeMenuColumn;
let currentChangeColumn;
let currentColumn;
let currentColumnElementUpdate;
document.addEventListener('DOMContentLoaded', () => {
    columnDiv.addEventListener('click', async(e) =>{
        if(e.target.closest('.menuBtnTask')) {
            const btn = e.target.closest('.menuBtnTask');
            const task = btn.closest('.task-style')
            const changeMenu = task.querySelector('.change-window');
            const wasOpen = changeMenu.style.display === 'flex';
            currentChangeTask = task;
            document.querySelectorAll('.change-window').forEach((el) => {
                el.style.display = 'none';
                el.closest('.task-style').style.zIndex = '1';
            })
            currentChangeMenu = changeMenu;
            if (!wasOpen) {
                changeMenu.style.display = 'flex';
                task.style.zIndex =  '10';
            }
        }
        if(e.target.closest('.deleteMenu')) {
            const task = e.target.closest('.task-style');
            const token = localStorage.getItem('token');
            const taskId = task.dataset.id;
            try{
                const res = await fetch('/api/tasks/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    },
                    body: JSON.stringify({
                        taskId: taskId,
                    })
                })
                if(res.status === 200){
                    task.remove();
                }
            }catch(err){
                console.error(err);
            }
        }
        if(e.target.closest('.editMenu')) {
            const task = e.target.closest('.task-style');
            currentTask = task.dataset.id;
            updateTaskForm.style.display = 'flex';
            currentChangeMenu.style.display = 'none';
            backdrop.style.display = 'block';
            task.style.zIndex =  '1';
        }
        if(e.target.closest('.menuBtnTaskColumn')) {
            const btn = e.target.closest('.menuBtnTaskColumn');
            const column = btn.closest('.column')
            const changeMenu = column.querySelector('.change-window-column');
            const wasOpen = changeMenu.style.display === 'flex';
            currentChangeColumn = column
            currentChangeMenuColumn = changeMenu;
            currentColumn = column.dataset.columnId
            currentColumnElementUpdate = column;
            document.querySelectorAll('.change-window-column').forEach((el) => {
                el.style.display = 'none';
                el.closest('.column').style.zIndex = '1';
            })
            if (!wasOpen) {
                changeMenu.style.display = 'flex';
                column.style.zIndex =  '10';
            }
        }
        if(e.target.closest('.deleteMenuColumn')) {
            const column = e.target.closest('.column');
            const token = localStorage.getItem('token');
            try{
                const res = await fetch('/api/columns/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    },
                    body: JSON.stringify({
                        columnId: currentColumn,
                    })
                })
                if(res.status === 200){
                    column.remove();
                }
            }catch(err){
                console.error(err);
            }
        }
        if(e.target.closest('.editMenuColumn')) {
            const column = e.target.closest('.column');
            updateColumnForm.style.display = 'flex';
            currentChangeMenuColumn.style.display = 'none';
            backdrop.style.display = 'block';
            column.style.zIndex =  '1';
        }
    })
})
updateColumnForm.addEventListener('submit', async(e) =>{
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData(updateColumnData);
    const title = data.get('updatenameColumn');
    const color = data.get('updatecolorColumn');
    const description = data.get('updatedescriptionColumn');
    try{
        const res = await fetch('/api/columns/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                columnId: currentColumn,
                title: title,
                color: color,
                description: description,
            })
        })
        if(res.status === 200){
            await updateColumn(currentColumn);
            updateColumnForm.style.display = 'none';
            backdrop.style.display = 'none';
            updateColumnData.reset();
        }
    }catch(err){
        console.error(err);
    }
})
async function updateColumn(columnId){
    const token = localStorage.getItem('token');
    let data;
    try{
        const res = await fetch(`/api/columns/column/${columnId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        data = await res.json();
    }catch(err){
        console.error(err);
    }
    console.log(data);
    const column = columnDiv.querySelector(`[data-column-id="${currentColumn}"]`)
    console.log(column);
    if(!column){
        return;
    }
    column.querySelector('.title').innerText = data.title;
    column.dataset.description = data.description;
    column.style.borderTopColor = data.color;
}
updateTaskForm.addEventListener('submit', async(e) =>{
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData(updateTaskData);
    const title = data.get('updatenameTask');
    const color = data.get('updatecolorTask');
    const description = data.get('updatedescriptionTask');
    try{
        const res = await fetch('/api/tasks/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify({
                taskId: currentTask,
                title: title,
                color: color,
                description: description,
            })
        })
        if(res.status === 200){
            updateTask(currentTask);
            updateTaskForm.style.display = 'none';
            currentChangeMenu.style.display = 'none';
            backdrop.style.display = 'none';
        }
    }catch(err){
        console.error(err);
    }
})
async function updateTask(taskId){
    const token = localStorage.getItem('token');
    let data;
    try{
        const res = await fetch(`/api/tasks/task/${taskId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        data = await res.json();
    }catch(err){
        console.error(err);
    }
    console.log(data);
    const task = columnDiv.querySelector(`[data-id="${taskId}"]`)
    console.log(task);
    if(!task){
        return;
    }
    task.querySelector('.title').innerText = data.title;
    task.querySelector('.description').innerText = data.description;
    task.style.backgroundColor = data.color;
}
document.addEventListener('click', (e) =>{
    console.log(e.target)

})