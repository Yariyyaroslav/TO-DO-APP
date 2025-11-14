async function getAllTask() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch('/api/tasks/getAll', {
            method: 'GET',
            headers: {
                'token': token,
            }
        })
        if(!res.ok){
            console.error('An error occurred')
        }
        const tasks = await res.json()
        console.log(tasks);
        createPriorityBoard(tasks);

    }catch(err) {
        console.log(err);
    }
}
getAllTask();
const priorityDiv = document.getElementById('priority');
function createPriorityBoard(data){
    const priorityData = data.reduce((acc, cur) => {
        if(!acc[cur.priority]) {
            acc[cur.priority] = [];
        }
        acc[cur.priority].push(cur);
        return acc;
    }, {})
    Object.keys(priorityData).forEach(key => {
        const tasksInGroup = priorityData[key];
        const div = document.createElement('div');
        div.classList.add('priorityBoard');
            div.innerHTML = `
           
            <h2 class="text-style-large-bold">P${key}</h2>
            <hr class="h-[1px] bg-[white] w-full">
            <div class="taskSpace">

     
        </div>`;
            priorityDiv.append(div);
            const taskSpace = div.querySelector('.taskSpace');
            tasksInGroup.forEach(task => {
                const div = document.createElement('div');
                div.innerHTML = `
                <div class="max-w-[300px] task-style relative border-[1px] border-solid border-[white]" data-id="${task._id}" style="background-color:${task.color}">
    <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row gap-[20px] justify-between items-center w-full">
            <span class="text-style-title title">${task.title}</span>
            <span class="rounded-2xl border-[1px] border-solid border-[white] bg-[black] bg-opacity-15 w-[50px] h-[35px] text-style-main text-center p-[5px] flex items-center justify-center priority">P${task.priority}</span>
        </div>
        </div> <p class="text-style-main description">${task.description || ''}</p>
</div>`
                taskSpace.append(div);
            })
    })
}

