// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId) {
        nextId = Math.random() * 10; //Sets nextId to a random number between 0 and 10.
        localStorage.setItem('nextId', JSON.stringify(nextId)); //Stores value in nextId
        console.log(nextId);
        return nextId;
    }
    else {
        nextId = ++nextId;//Incriments nextID by 1.
        localStorage.setItem('nextId', JSON.stringify(nextId));
        console.log(nextId);
        return nextId;
    }
}

// Todo: create a function to create a task card
function createTaskCard(task) {

    console.log(task);
    const taskCard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
    const cardBody = $('<div>').addClass('card-body');
    const cardDate = $('<p>').addClass('card-text').text(task.date);
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);
    //? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
    if (task.date && task.status !== 'done') {
        const now = dayjs();//Loaded via html, will get the current date if left empty
        const taskDueDate = dayjs(task.date, 'YYYY/MM/DD');

        //? If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(taskDueDate, 'day')) {
            taskCard.addClass('bg-warning text-white'); //bg-warning bootstrap for yellow
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass('bg-danger text-white'); //bg-danger boostrap for red.
            cardDeleteBtn.addClass('border-light');
        }
    }

    // ? Gather all the elements created above and append them to the correct elements.
    cardBody.append(cardDescription, cardDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);




    saveProjectsToStorage(taskList);


    // ? Return the card so it can be appended to the correct lane.
    return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
   //  taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    // ? Empty existing project cards out of the lanes
    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    // ? Loop through projects and create project cards for each status
    for (let task of taskList) {
        if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
        }
    }
    $(".draggable").draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {

            // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    }
    ); //Come back, probably not correct

}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    console.log($("#taskTitle").val());
    console.log($("#taskDate").val());
    console.log($("#taskDescription").val());
    const task = {
        id: generateTaskId(),
        name: $("#taskTitle").val(),
        date: $("#taskDate").val(),
        description: $("#taskDescription").val(),
        status: 'to-do'
    }
    taskList.push(task); //Add new tasks to the taskList array.
  //  saveProjectsToStorage(taskList)
    renderTaskList();
}

function saveProjectsToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // ? Read projects from localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // ? Get the project id from the event
    // const taskId = ui.draggable[0].dataset.taskId; //
    console.log(ui.draggable[0])
    const taskId = $(ui.draggable[0]).attr('data-task-id')

    // ? Get the id of the lane that the card was dropped into
    const newStatus = event.target.id;

    // for (let task of tasks) { //task can be anything here.
    //     // ? Find the project card by the `id` and update the project status.
    //     console.log(task.id)
    //     console.log(taskId);
    //     if (task.id == taskId) {
    //         task.status = newStatus;
    //     }
    // }
    
    const updatedTasks = tasks.map(task => {
        if (task.id == taskId) {
            task.status = newStatus;
            console.log(taskId,task.id,task)
        }
        console.log(task.id);
        console.log(taskId);
        return task;
    });
    console.log(updatedTasks)
    // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
      });

});




$(".saveTask").on("click", function (event) {
    event.preventDefault();
    handleAddTask(event);




    // if ( $( "input" ).first().val() === "correct" ) {
    //   $( "span" ).text( "Validated..." ).show();
    //   return;
});