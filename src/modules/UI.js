import * as projectModule from "./project.js";
import * as todoModule from "./todo.js";

const todoDom = (todo) => {
    let todoTasksContainer = document.getElementById("todo");

    let etask = document.createElement("li");
    let etitle = document.createElement("h3");
    let edescription = document.createElement("p");
    let edueDate = document.createElement("p");
    let noteLabel = document.createElement("span");
    let enotes = document.createElement("p");

    let checkmarkDiv = document.createElement("div");
    let checkmarkBtn = document.createElement("i");
    let editBtn = document.createElement("i");
    let deleteBtn = document.createElement("i");

    let priority = () => {
        let setColor = (level) => {
            let priorityColor;
            if(level == "high") priorityColor = "red";
            else if (level == "medium") priorityColor = "gold";
            else priorityColor = "green";
            return priorityColor;
        }
        let color = setColor(todo.getPriority());
        return {color};
    }

    let addText = () => {
        etitle.textContent = todo.getTitle();
        edescription.textContent = todo.getDescription();
        edueDate.textContent = todo.getDueDate();
        noteLabel.textContent = "Notes: ";
        enotes.textContent = todo.getNotes();
    }
    
    let addStyles = () => {
        etask.classList.add("task");
        etask.style.borderLeft = priority().color + " 5px solid";
        etitle.classList.add("title");
        edescription.classList.add("description");
        edueDate.classList.add("due-date");
        noteLabel.style.fontWeight = "bold";
        enotes.classList.add("notes");

        checkmarkDiv.classList.add("checkmark-div");
        checkmarkBtn.classList.add("checkmark-btn");

        editBtn.classList.add("edit-btn");
        editBtn.classList.add("fa-solid");
        editBtn.classList.add("fa-pen-to-square");

        deleteBtn.classList.add("delete-btn");
        deleteBtn.classList.add("fa-regular");
        deleteBtn.classList.add("fa-trash-can");
    }

    let addEvents = () => {
        checkmarkDiv.onclick = () => {
            checkmarkBtn.classList.toggle("fa-solid");
            checkmarkBtn.classList.toggle("fa-circle-check");
            if(checkmarkBtn.classList.length == 1) {
                checkmarkDiv.style.border = "1px solid black";
                etask.style.textDecoration = "none";
                etask.style.backgroundColor = "inherit";
            }
            else {
                checkmarkDiv.style.border = "none";
                etask.style.textDecoration = "line-through";
                etask.style.backgroundColor = "rgb(237, 232, 221)";
            }
        }

        deleteBtn.onclick = () => etask.remove();
    }

    let append = () => {
        enotes.prepend(noteLabel);
        checkmarkDiv.append(checkmarkBtn);
        etask.append(checkmarkDiv, etitle, edescription, edueDate, enotes, editBtn, deleteBtn);
        todoTasksContainer.append(etask);
    }

    let createInDom = () => {
        addText();
        addStyles();
        addEvents();
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
    }

    let clearForm = () => {
        let inputs = form.getElementsByTagName("input");
        for(let i = 0; i < inputs.length; i++) {
            if(inputs[i].getAttribute("name") !== "t-priority")inputs[i].value = "";
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
        let priority = document.querySelector("input[name='t-priority']:checked").value;
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
        if(projectModule.projects.length > 6) document.getElementById("nav").style.transform = "none";
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

const mobileNav = (() => {
    let openNavBtn = document.getElementById("open-nav-btn");
    let nav = document.getElementById("nav");
    let project = document.getElementById("project");
    openNavBtn.onclick = () => {
        if(nav.style.display == "block") {
            nav.style.display = "none";
            project.style.marginTop = "20px";
        }
        else {
            nav.style.display = "block";
            project.style.marginTop = "0px";
        }
    }
})();
export {todoDom};