const addColumn = document.getElementById("addColumn");
const columnDiv = document.getElementById("columnDiv");
const newColumnForm = document.querySelector('.new-column-form');
const newTaskForm = document.querySelector('.new-task-form');
const backdrop = document.querySelector('.backdrop');
const newTaskData = document.getElementById("newTaskData")
const newColumnData = document.getElementById("newColumnData");
const newTaskBtn = document.querySelectorAll('.newTask');
addColumn.addEventListener("click", () => {
    newColumnForm.style.display = newColumnForm.style.display === 'none' ? 'flex' : 'none';
    backdrop.style.display = backdrop.style.display === 'none' ? 'block' : 'none';
})

document.addEventListener('click', (e) => {
    if (newColumnForm.style.display === 'flex') {
        if (!newColumnForm.contains(e.target) && !addColumn.contains(e.target)) {
            newColumnForm.style.display = 'none';
            backdrop.style.display = 'none';
        }
    }
})

newColumnData.addEventListener('submit', (e) => {
    e.preventDefault();
    newColumnForm.style.display = 'none';
    backdrop.style.display = 'none';
    const data = new FormData(newColumnData);
    const title = data.get('name')
    const color = data.get('color')
    const description = data.get('description')
    createColumn(title, color, description)
})
function createColumn(title, color, description) {
    const div = document.createElement("div");
    div.innerHTML = `
<div data-description="${description}" class="column flex flex-col justify-center gap-[16px] flex-shrink-0 p-[24px] bg-[#262626] max-w-[348px] w-full rounded-[16px]  border-t-4 border-solid" style="border-top-color: ${color}">
        <div>
            <span class="text-style-large-bold">${title}</span>
        </div>
        <div class="column flex flex-col gap-[16px]">
           <div class="newTask order-9999 border-dashed button-plus-on-hover border-[1px] border-[#595959] p-[24px] rounded-[16px] cursor-pointer">
                <button class="text-[16px] button-style-task glow-on-hover text-text-color-accent leading-[150%] font-semibold cursor-pointer">+ New Task</button>
            </div>
        </div>
    </div> `
    columnDiv.appendChild(div);
}


let column
newTaskBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        console.log('clicked');
        newTaskForm.style.display = newTaskForm.style.display === 'none' ? 'flex' : 'none';
        backdrop.style.display = backdrop.style.display === 'none' ? 'block' : 'none';
        column = btn.closest('.column');
    })
})
document.addEventListener('click', (e) => {
    if (newTaskForm.style.display === 'flex') {
        let isClickOnTaskBtn = false;
        newTaskBtn.forEach(btn => {
            if (btn.contains(e.target)) {
                isClickOnTaskBtn = true;
            }
        });
        if (!newTaskForm.contains(e.target) && !isClickOnTaskBtn) {
            newTaskForm.style.display = 'none';
            backdrop.style.display = 'none';
        }
    }
})

newTaskData.addEventListener('submit', (e) => {
    e.preventDefault();
    newTaskForm.style.display = 'none';
    backdrop.style.display = 'none';
    const data = new FormData(newTaskData);
    const title = data.get('nameTask')
    const color = data.get('colorTask')
    const description = data.get('descriptionTask')
    createTask(title, color, description);
})

function createTask(title, color, description) {
    const div = document.createElement("div");
    div.innerHTML = `<div class="task-style" style="background:${color}">
    <span class="text-style-title">${title}</span>
    <p class="text-style-main">${description}</p>
    </div>`
    column.appendChild(div);
}