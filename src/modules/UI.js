import * as projectModule from "./project.js";

const newTodo = (todo) => {
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
        let description = document.getElementById("project-description").value;

        if(!validateForm(name)) return false;

        let project = projectModule.project(name, description, []);
        projectModule.projects.push(project);
        clearForm();
        removeStyles();
        createBtnToProject(project);
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
    for(let i = 0; i < todosArr.length; i++) {
        newTodo.createInDom(todosArr[i]);
    }
}