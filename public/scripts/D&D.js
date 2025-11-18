function initSortable(taskContainer){
    Sortable.create(taskContainer, {
        group:"shared",
            animation:150,
            ghostClass:"task-ghost",
            dragClass:"task-dragging",

            onEnd: (e)=>{
            const taskId = e.item.dataset.id;
            const newColumnElement = e.to.closest('.column')
            const newColumnId = newColumnElement.dataset.columnId;
            const oldColumnElement = e.from.closest('.column');
            const taskElem = newColumnElement.querySelectorAll('.task-style');
            const taskIds = Array.from(taskElem).map(taskElem => taskElem.dataset.id);
                updateTaskOrder(newColumnId, taskIds);
                if (newColumnElement !== oldColumnElement) {
                    const oldColumnId = oldColumnElement.dataset.columnId;
                    const oldTaskElements = oldColumnElement.querySelectorAll('.task-style');
                    const oldTaskIds = Array.from(oldTaskElements).map(task => task.dataset.id);
                    updateTaskOrder(oldColumnId, oldTaskIds);
                    notifyServerAboutMove(taskId, newColumnId);
                }
            gsap.to([oldColumnElement, newColumnElement], {
                duration: 0.5,
                height: "auto",
                ease: "power2.out",
                onComplete: () => {
                    oldColumnElement.style.height = '';
                    newColumnElement.style.height = '';
                }
            });
        }
    });
}

async function notifyServerAboutMove(taskId, newColumnId) {
    const token = localStorage.getItem("token");
    try{
        const res = await fetch('/api/tasks/statusChange', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'token': token },
            body: JSON.stringify({ taskId, newColumnId })
        })
        let task;
        if (res.status === 200) {
            task = await res.json();
            const column = columnDiv.querySelector(`[data-column-id="${newColumnId}"]`);
            const taskElement = column ? column.querySelector(`[data-id="${taskId}"]`) : null;

            if (taskElement) {
                const infoBlock = taskElement.querySelector('.info');
                const timeSpentEl = taskElement.querySelector('.timespent');
                if (task.completedAt) {
                    if (infoBlock) {
                        infoBlock.style.display = 'flex';
                    }
                    if (timeSpentEl) {
                        const timeLabel = task.timeSpent ? `${task.timeSpent}m` : '0m';
                        timeSpentEl.innerText = timeLabel;
                    }
                } else {
                    if (infoBlock) {
                        infoBlock.style.display = 'none';
                    }
                }
            }

        }

    }catch(err){
        console.error(err)
    }
}
async function updateTaskOrder(columnId, taskIds){
    const token = localStorage.getItem("token");
    if(!token){
        window.location.href = '../registerPage/register.html';
        return;
    }

    try{
        const res = await fetch('/api/tasks/reorder', {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'token': token,
            },
            body: JSON.stringify({
                columnId: columnId,
                taskIds: taskIds,
            })
        })
        if(!res.ok){
            console.error('Error while updating task order');
        }

    }catch(err){
        console.log(err);
    }

}


function initColumDrag(){
    Sortable.create(columnDiv, {
        draggable: '.column',
        filter: 'addColumn',
        animation: 150,
        ghostClass: 'column-ghost',
        onEnd: (e)=>{
            const columns = document.querySelectorAll('.column');
            const newOrderIds = []
            columns.forEach(column => {
                newOrderIds.push(column.dataset.columnId);
            })
            updateColumnsOrder(newOrderIds);
        }
    })
}

async function updateColumnsOrder(newOrderIds){
    const token = localStorage.getItem("token");
    if(!token){
        window.location.href = '../registerPage/register.html';
        return;
    }
    try{
        const res = await fetch('/api/columns/order', {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'token': token,
            },
            body: JSON.stringify({columnIds: newOrderIds})
        })
    }catch(err){
        console.log(err);
    }
}