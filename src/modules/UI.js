import * as projectModule from "./project.js";

const todoTasksContainer = document.getElementById("tasks");

const newTodo = (todo) => {
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
        etitle.textContent = todo.getTitle;
        edescription.textContent = todo.getDescription;
        edueDate.textContent = todo.getDueDae;
        enotes.textContent = todo.getNotes;
    }
    
    let addStyles = () => {
        etask.classList.addClass("task");
        etask.style.borderColor = priority.color;
        etitle.classList.addClass("title");
        edescription.classList.addClass("description");
        edueDate.classList.addClass("due-date");
        enotes.classList.addClass("notes");

        checkmarkBtn.classList.add("fa-solid fa-circle-check");
        editBtn.classList.add("fa-solid fa-pen-to-square");
        deleteBtn.classList.add("fa-regular fa-trash-can");
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

const newProject = (() => {
    let addProjectBtn = document.getElementById("add-project-btn");
    let addProjectDiv = document.getElementById("add-project");
    let exitBtn = addProjectDiv.getElementsByClassName("exit-btn")[0];
    let form = addProjectDiv.getElementsByTagName("form")[0];
    let blocker = document.getElementById("blocker");

    addProjectBtn.onclick = (e => {
        blocker.style.filter = "blur(5px)";
        addProjectDiv.style.display = "flex";
    });

    exitBtn.onclick = (e => {
        removeStyles();
    });

    form.onsubmit = (e => {
        e.preventDefault();
        let name = document.getElementById("project-name").value.trim();
        let description = document.getElementById("project-description").value.trim();

        if(!validateForm(name)) return false;

        projectModule.projects.push(projectModule.project(name, description, []));
        clearForm();
        removeStyles();
        console.log(projectModule.projects[0].getTitle());
    })

    let validateForm = (name) => {
        let errorMsg = form.getElementsByClassName("error-msg")[0];

        if(name == "") {
            errorMsg.textContent = "*Error: Name is missing";
            return false;
        }
        for(let i = 0; i < projectModule.projects.length; i++) {
            if(name == projectModule.projects[i].getTitle()) {
                errorMsg.textContent = "*Error: Name is already used in an existing project";
                return false;
            }
        }
        errorMsg.textContent = "";
        return true;
    }

    let clearForm = () => {
        let inputs = form.getElementsByTagName("input");
        for(let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
    }

    let removeStyles = () => {
        blocker.style.filter = "none";
        addProjectDiv.style.display = "none";
    }
})();