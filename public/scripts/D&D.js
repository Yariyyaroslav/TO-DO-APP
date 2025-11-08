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

            updateTaskColumn(taskId, newColumnId);
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

async function updateTaskColumn(taskId, newColumnId){
    const token = localStorage.getItem("token");
    if(!token){
        window.location.href = '../registerPage/register.html';
        return;
    }
    try{
        const res = await fetch(`/api/tasks/${taskId}/move`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'token': token,
            },
            body: JSON.stringify({
                newColumnId: newColumnId,
            })
        })
        if(!res.ok){
            console.error('Error while updating task column');
            return;
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