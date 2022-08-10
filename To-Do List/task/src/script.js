// select everything
// select the todo-form
const todoForm = document.querySelector('.todo-form');
// select the input box
const todoInput = document.querySelector('.todo-input');
// select the <ul> with class="todo-items"
const todoItemsList = document.querySelector('.todo-items');

// array which stores every todos
let todos = [];

// add an eventListener on form, and listen for submit event
todoForm.addEventListener('submit', function(event) {
    // prevent the page from reloading when submitting the form
    event.preventDefault();
    addTodo(todoInput.value); // call addTodo function with input box current value
});

// function to add todo
function addTodo(task) {
    // if task is not empty
    if (task !== '') {
        // make a todo object, which has id, name, and completed properties
        const todo = {
            id: Date.now(),
            name: task,
            completed: false
        };

        // then add it to todos array
        todos.push(todo);
        addToLocalStorage(todos); // then store it in localStorage

        // finally clear the input box value
        todoInput.value = '';
    }
}

// function to render given todos to screen
function renderTodos(todos) {
    // clear everything inside <ul> with class=todo-items
    todoItemsList.innerHTML = '';

    // run through each task inside todos
    todos.forEach(function(task) {
        // check if the task is completed
        const checked = task.completed ? 'checked': null;

        // make a <li> element and fill it
        // <li> </li>
        const li = document.createElement('li');
        // <li class="task"> </li>
        li.setAttribute('class', 'task');
        // <li class="task" data-key="20200708"> </li>
        li.setAttribute('data-key', task.id);
        /* <li class="task" data-key="20200708">
              <input type="checkbox" class="checkbox">
              Go to Gym
              <button class="delete-btn">X</button>
            </li> */
        // if task is completed, then add a class to <li> called 'checked', which will add line-through style
        if (task.completed === true) {
            li.classList.add('checked');
        }

        li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      <span class="task">${task.name}</span>
      <button class="delete-btn">X</button>
     
    `;
        // finally add the <li> to the <ul>
        todoItemsList.append(li);
    });

}

// function to add todos to local storage
function addToLocalStorage(todos) {
    // convert the array to string then store it.
    localStorage.setItem('todos', JSON.stringify(todos));
    // render them to screen
    renderTodos(todos);
}

// function helps to get everything from local storage
function getFromLocalStorage() {
    const reference = localStorage.getItem('todos');
    // if reference exists
    if (reference) {
        // converts back to array and store it in todos array
        todos = JSON.parse(reference);
        renderTodos(todos);
    }
}

// toggle the value to completed and not completed
function toggle(id) {
    todos.forEach(function(task) {
        // use == not ===, because here types are different. One is number and other is string
        if (task.id == id) {
            // toggle the value
            task.completed = !task.completed;
        }
    });

    addToLocalStorage(todos);
}

// deletes a todo from todos array, then updates localstorage and renders updated list to screen
function deleteTodo(id) {
    // filters out the <li> with the id and updates the todos array
    todos = todos.filter(function(task) {
        // use != not !==, because here types are different. One is number and other is string
        return task.id != id;
    });

    // update the localStorage
    addToLocalStorage(todos);
}

// initially get everything from localStorage
getFromLocalStorage();

// after that addEventListener <ul> with class=todoItems. Because we need to listen for click event in all delete-btn and checkbox
todoItemsList.addEventListener('click', function(event) {
    // check if the event is on checkbox
    if (event.target.type === 'checkbox') {
        // toggle the state
        toggle(event.target.parentElement.getAttribute('data-key'));
    }

    // check if that is a delete-btn
    if (event.target.classList.contains('delete-btn')) {
        // get id from data-key attribute's value of parent <li> where the delete-btn is present
        deleteTodo(event.target.parentElement.getAttribute('data-key'));
    }
});