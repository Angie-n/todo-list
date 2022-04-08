import * as projectModule from "./project.js";
import * as todoModule from "./todo.js";

const todoDom = (todo) => {
    let todoTasksContainer = document.getElementById("todo");

    let etask = document.createElement("li");
    let etitle = document.createElement("h3");
    let edescription = document.createElement("p");
    let edueDate = document.createElement("p");
    let enotes = document.createElement("p");

    let checkmarkBtn = document.createElement("i");
    let editBtn = document.createElement("i");
    let deleteBtn = document.createElement("i");

    let hoverDiv = document.createElement("div");

    let priority = () => {
        let color = setColor(todo.priority);
        let setColor = (level) => {
            if(level == "high") priorityColor = "red";
            else if (level == "medium") priorityColor = "yellow";
            else priorityColor = "green";
        }
        return {color};
    }

    let addText = () => {
        etitle.textContent = todo.getTitle();
        edescription.textContent = todo.getDescription();
        edueDate.textContent = todo.getDueDate();
        enotes.textContent = todo.getNotes();
    }
    
    let addStyles = () => {
        etask.classList.add("task");
        etask.style.borderColor = priority.color;
        etitle.classList.add("title");
        edescription.classList.add("description");
        edueDate.classList.add("due-date");
        enotes.classList.add("notes");

        checkmarkBtn.classList.add("fa-solid");
        checkmarkBtn.classList.add("fa-circle-check")

        editBtn.classList.add("fa-solid");
        editBtn.classList.add("fa-pen-to-square");

        deleteBtn.classList.add("fa-regular");
        deleteBtn.classList.add("fa-trash-can");
    }

    let append = () => {
        hoverDiv.append(enotes);
        todoTasksContainer.append(checkmarkBtn, etask, etitle, edescription, edueDate, hoverDiv, editBtn, deleteBtn);
    }

    let createInDom = () => {
        addText();
        addStyles();
        append();
    }

    return {createInDom};
} 

const form = (div, addBtn) => {
    let form = div.getElementsByTagName("form")[0];
    let exitBtn = div.getElementsByClassName("exit-btn")[0];
    let blocker = document.getElementById("blocker");

    let addEvents = () => {
        addBtn.onclick = e => {
            blocker.style.filter = "blur(5px)";
            div.style.display = "flex";
        };

        exitBtn.onclick = e => {
            removeStyles();
        };
        console.log(div);
    }

    let clearForm = () => {
        let inputs = form.getElementsByTagName("input");
        for(let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
    }

    let removeStyles = () => {
        blocker.style.filter = "none";
        div.style.display = "none";
    }

    return {addEvents, clearForm, removeStyles}
}

const newTodo = (() => {
    let addTodoDiv = document.getElementById("add-todo");
    let todoForm = addTodoDiv.getElementsByTagName("form")[0];
    let addBtn = document.getElementById("add-todo-btn");

    let f = form(addTodoDiv, addBtn);
    f.addEvents();

    todoForm.onsubmit = (e => {
        e.preventDefault();
        let name = document.getElementById("t-name").value.trim();
        let description = document.getElementById("t-description").value;
        let dueDate = document.getElementById("t-due-date").value;
        let priority = document.querySelector("input[name='priority'].checked");
        let notes = document.getElementById("t-notes").value;

        let task = todoModule.todo(name, description, dueDate, priority, notes);
        todoDom(task).createInDom();
        f.clearForm();
        f.removeStyles();
    })
})();

const newProject = (() => {
    let addProjectDiv = document.getElementById("add-project");
    let formDiv = addProjectDiv.getElementsByTagName("form")[0];
    let addBtn = document.getElementById("add-project-btn");

    let f = form(addProjectDiv, addBtn);
    f.addEvents();

    formDiv.onsubmit = (e => {
        e.preventDefault();
        let name = document.getElementById("p-name").value.trim();
        let description = document.getElementById("p-description").value;

        if(!validateForm(name)) return false;

        let project = projectModule.project(name, description, []);
        projectModule.projects.push(project);
        f.clearForm();
        f.removeStyles();
        createBtnToProject(project);
    })

    let validateForm = (name) => {
        let errorMsg = formDiv.getElementsByClassName("error-msg")[0];
        for(let i = 0; i < projectModule.projects.length; i++) {
            if(name == projectModule.projects[i].getTitle()) {
                errorMsg.textContent = "*Error: Name is already used in an existing project";
                return false;
            }
        }
        errorMsg.textContent = "";
        return true;
    }

    let createBtnToProject = (project) => {
        let li = document.createElement("li");
        let btn = document.createElement("button");
        btn.classList.add("to-project-btn");
        btn.textContent = project.getTitle();
        btn.onclick = () => showProject(project);
        li.append(btn);

        let nav = document.getElementById("nav");
        nav.insertBefore(li, nav.lastElementChild);
    }
})();

const showProject = (project) => {
    let title = document.getElementById("project-title");
    let description = document.getElementById("project-description");

    title.textContent = project.getTitle();
    description.textContent = project.getDescription();

    let todosArr = project.getTodos();
    let message = document.getElementById("project-msg")
    if(todosArr.length == 0) message.textContent = "No upcoming tasks for this project";
    else {
        for(let i = 0; i < todosArr.length; i++) todoDom.createInDom(todosArr[i]);
        message.textContent = "";
    }
}