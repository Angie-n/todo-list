import * as projectModule from "./project.js";
import * as todoModule from "./todo.js";

import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfToday from 'date-fns/startOfToday';
import endOfToday from 'date-fns/endOfToday';
import parseISO from 'date-fns/parseISO'

let allTodos = [];

const todoDom = (todo) => {
    let todoTasksContainer = document.getElementById("todo");

    let etask = document.createElement("li");
    let etitle = document.createElement("h3");
    let edescription = document.createElement("p");
    let edueDate = document.createElement("p");
    let noteLabel = document.createElement("span");
    let noteContent = document.createElement("p");
    let enotes = document.createElement("div");

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
        let getColor = () => {return color};

        return {getColor};
    }

    let addText = () => {
        etitle.textContent = todo.getTitle();
        edescription.textContent = todo.getDescription();
        edueDate.textContent = todo.getDueDate();
        noteLabel.textContent = "Notes: ";
        noteContent.textContent = todo.getNotes();
    }
    
    let addStyles = () => {
        etask.classList.add("task");
        etask.style.borderLeft = priority().getColor() + " 5px solid";
        etitle.classList.add("title");
        edescription.classList.add("description");
        edueDate.classList.add("due-date");
        noteLabel.style.fontWeight = "bold";
        enotes.classList.add("notes");

        editBtn.classList.add("edit-btn");
        editBtn.classList.add("fa-solid");
        editBtn.classList.add("fa-pen-to-square");

        deleteBtn.classList.add("delete-btn");
        deleteBtn.classList.add("fa-regular");
        deleteBtn.classList.add("fa-trash-can");

        let checkmark = () => {
            let toggle = () => {
                if(todo.getIsCompleted()) {
                    todo.setIsCompleted(false);
                    unchecked();
                }
                else {
                    todo.setIsCompleted(true);
                    checked();
                }
            }

            let unchecked = () => {
                checkmarkBtn.classList.remove("fa-solid");
                checkmarkBtn.classList.remove("fa-circle-check");
                checkmarkDiv.style.border = "1px solid black";
                etask.style.textDecoration = "none";
                etask.style.backgroundColor = "inherit";
            }

            let checked = () => {
                checkmarkBtn.classList.add("fa-solid");
                checkmarkBtn.classList.add("fa-circle-check");
                checkmarkDiv.style.border = "none";
                etask.style.textDecoration = "line-through";
                etask.style.backgroundColor = "rgb(237, 232, 221)";
            }
            return {toggle, unchecked, checked};
        }
        checkmarkDiv.classList.add("checkmark-div");
        if(todo.getIsCompleted()) checkmark().checked();
        else checkmark().unchecked();

        return {checkmark};
    }

    let addEvents = () => {
        checkmarkDiv.onclick = () => {
            addStyles().checkmark().toggle();
        }

        deleteBtn.onclick = () => {
            etask.remove();
            let index = allTodos.indexOf(todo);
            allTodos.splice(index, 1);
            todo.setIsDeleted(true);
            if(todoTasksContainer.childElementCount == 0) document.getElementById("project-msg").textContent = "No upcoming tasks for this project";
        }

        let f = form(document.getElementById("change-todo"));
        f.addEvents().enterForm(editBtn);
        editBtn.addEventListener("click", e => {
            changeTodo.passTodos(todo, etask);
            changeTodo.addFormInfo();
        });
    }

    let addAll = () => {
        addText();
        addStyles();
        addEvents();
    }

    let appendPieces = () => {
        enotes.prepend(noteLabel, noteContent);
        checkmarkDiv.append(checkmarkBtn);
        etask.append(checkmarkDiv, etitle, edescription, edueDate, enotes, editBtn, deleteBtn);
    }

    let createInDom = () => {
        addAll();
        appendPieces();
        todoTasksContainer.append(etask);
    }

    let updateInDom = (container) => {
        addAll();
        appendPieces();
        todoTasksContainer.replaceChild(etask, container);
    }

    return {createInDom, priority, updateInDom};
} 

const form = (div) => {
    let form = div.getElementsByTagName("form")[0];
    let exitBtn = div.getElementsByClassName("exit-btn")[0];
    let blocker = document.getElementById("blocker");

    let addEvents = () => {
        let enterForm = (addBtn) => {
            addBtn.onclick = e => {
                blocker.style.filter = "blur(5px)";
                div.style.display = "flex";
            };
        }

        let exitForm = () => {
            exitBtn.onclick = e => {
                clear();
                removeStyles();
            };
        }

        let all = (addBtn) => {
            enterForm(addBtn);
            exitForm();
        }
        return {enterForm, exitForm, all};
    }

    let clear = () => {
        let inputs = form.getElementsByTagName("input");
        for(let i = 0; i < inputs.length; i++) {
            if(inputs[i].getAttribute("type") != "radio")inputs[i].value = "";
        }
        form.getElementsByClassName("error-msg")[0].textContent = "";
    }

    let removeStyles = () => {
        blocker.style.filter = "none";
        div.style.display = "none";
    }

    let validate = () => {
        let errorMsg = form.getElementsByClassName("error-msg")[0];
        let checkEmpty = (input, inputName) => {
            if (input === "") {
                errorMsg.textContent = "*Error: " + inputName + " must be entered.";
                return false;
            }
            errorMsg.textContent = "";
            return true;
        }

        let checkTitleForDuplicate = (input, arr) => {
            for(let i = 0; i < arr.length; i++) {
                if(input == arr[i].getTitle()) {
                    errorMsg.textContent = "*Error: Name is already being used.";
                    return false;
                }
            }
            errorMsg.textContent = "";
            return true;
        }

        let checkDateThisWeek = (input) => {
            if(parseISO(input) < startOfWeek(new Date()) || parseISO(input) > endOfWeek(new Date())) {
                errorMsg.textContent = "*Error: Date needs to within the current week for this project.";
                return false;
            }
            errorMsg.textContent = "";
            return true;
        }

        let checkDateToday = (input) => {
            if(parseISO(input) < startOfToday() || parseISO(input) > endOfToday()) {
                errorMsg.textContent = "*Error: Date needs to be today for this project.";
                return false;
            }
            errorMsg.textContent = "";
            return true;
        }
        return {checkEmpty, checkTitleForDuplicate, checkDateThisWeek, checkDateToday};
    }

    return {addEvents, clear, removeStyles, validate}
}

const newTodo = (() => {
    let addTodoDiv = document.getElementById("add-todo");
    let todoForm = addTodoDiv.getElementsByTagName("form")[0];
    let addBtn = document.getElementById("add-todo-btn");

    let f = form(addTodoDiv);
    f.addEvents().all(addBtn);

    todoForm.onsubmit = (e => {
        e.preventDefault();
        let name = document.getElementById("t-name").value.trim();
        let description = document.getElementById("t-description").value;
        let dueDate = document.getElementById("t-due-date").value;
        let priority = document.querySelector("input[name='t-priority']:checked").value;
        let notes = document.getElementById("t-notes").value;

        if(!f.validate().checkEmpty(name, "Name")) return false;
        if(document.getElementById("project-title").textContent == "This Week" && !f.validate().checkDateThisWeek(dueDate)) return false;
        if(document.getElementById("project-title").textContent == "Today" && !f.validate().checkDateToday(dueDate)) return false;

        let task = todoModule.todo(name, description, dueDate, priority, notes);

        let projects = projectModule.projects;
        for(let i = 0; i < projects.length; i++) {
            if(projects[i].getTitle() == document.getElementById("project-title").textContent) {
                projects[i].getTodos().push(task);
            } 
        }
        if(document.getElementById("project-title").textContent != "This Week") update().updateWeek().checkOne(task);
        if(document.getElementById("project-title").textContent != "Today") update().updateToday().checkOne(task);

        todoDom(task).createInDom();
        f.clear();
        f.removeStyles();
        document.getElementById("project-msg").textContent = "";
        allTodos.push(task);
    })
})();

const changeTodo = (() => {
    let changeTodoDiv = document.getElementById("change-todo");
    let todoForm = changeTodoDiv.getElementsByTagName("form")[0];

    let f = form(changeTodoDiv);
    f.addEvents().exitForm();

    let todo;
    let todoDOM;

    let passTodos = (t, td) => {
        todo = t;
        todoDOM = td;
    }

    let fName = document.getElementById("change-name");
    let fDescription = document.getElementById("change-description");
    let fDueDate = document.getElementById("change-due-date");
    let fNotes = document.getElementById("change-notes");

    let addFormInfo = () => {
        fName.value = todo.getTitle();
        fDescription.value = todo.getDescription();
        fDueDate.value = todo.getDueDate();
        fNotes.value = todo.getNotes();
        let fPriority = document.querySelector("input[name='change-priority'][value='" + todo.getPriority() + "']");
        fPriority.checked = true;
    }

    todoForm.onsubmit = (e => {
        e.preventDefault();
        let name = fName.value.trim();
        let description = fDescription.value;
        let dueDate = fDueDate.value;
        let priority = document.querySelector("input[name='change-priority']:checked").value;
        let notes = fNotes.value;

        if(!f.validate().checkEmpty(name, "Name")) return false;
        if(document.getElementById("project-title").textContent == "This Week" && !f.validate().checkDateThisWeek(dueDate)) return false;
        if(document.getElementById("project-title").textContent == "Today" && !f.validate().checkDateToday(dueDate)) return false;

        todo.update(name, description, dueDate, priority, notes);

        let indexInWeek = defaults.week.getTodos().indexOf(todo);
        let indexInToday = defaults.today.getTodos().indexOf(todo);

        let shouldRemove;

        if(indexInWeek === -1) {update().updateWeek().checkOne(todo);}
        else if(indexInWeek !== -1 && (parseISO(todo.getDueDate()) < startOfWeek(new Date()) || parseISO(todo.getDueDate()) > endOfWeek(new Date()))) {
            let newList = defaults.week.getTodos();
            newList.splice(indexInWeek, 1);
            defaults.week.setTodos(newList);
            if(document.getElementById("project-title").textContent === "This Week") shouldRemove = true;
        }

        if (indexInToday === -1){update().updateToday().checkOne(todo);}
        else if(indexInToday !== -1 && (parseISO(todo.getDueDate()) < startOfToday() || parseISO(todo.getDueDate()) > endOfToday())) {
            let newList = defaults.today.getTodos();
            newList.splice(indexInWeek, 1);
            defaults.today.setTodos(newList);
            if(document.getElementById("project-title").textContent === "Today") shouldRemove = true;
        }

        if(shouldRemove) {
            todoDOM.remove();
            document.getElementById("project-msg").textContent = "No upcoming tasks for this project";
        }
        else todoDom(todo).updateInDom(todoDOM);

        f.clear();
        f.removeStyles();
    })

    return {passTodos, addFormInfo};
})();

const newProject = (() => {
    let addProjectDiv = document.getElementById("add-project");
    let formDiv = addProjectDiv.getElementsByTagName("form")[0];
    let addBtn = document.getElementById("add-project-btn");

    let f = form(addProjectDiv);
    f.addEvents().all(addBtn);

    formDiv.onsubmit = (e => {
        e.preventDefault();
        let name = document.getElementById("p-name").value.trim();
        let description = document.getElementById("p-description").value;

        if(!f.validate().checkEmpty(name, "Name") || !f.validate().checkTitleForDuplicate(name, projectModule.projects)) return false;

        let project = add(name, description, []);
        createBtnToProject(project);
        f.clear();
        f.removeStyles();
    })

    let add = (name, description, todo) => {
        let project = projectModule.project(name, description, todo);
        projectModule.projects.push(project);
        if(projectModule.projects.length > 9) document.getElementById("nav").style.transform = "none";
        return project;
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
    return {add, createBtnToProject}
})();

const showProject = (project) => {
    let title = document.getElementById("project-title");
    let description = document.getElementById("project-description");

    let todoDiv = document.getElementById("todo");
    todoDiv.innerHTML = "";

    title.textContent = project.getTitle();
    description.textContent = project.getDescription();

    let todosArr = project.getTodos().filter(todo => !todo.getIsDeleted());
    if(todosArr.length != project.getTodos().length)project.setTodos(todosArr);

    let message = document.getElementById("project-msg")
    if(todosArr.length == 0) message.textContent = "No upcoming tasks for this project";
    else {
        for(let i = 0; i < todosArr.length; i++) {
            todoDom(todosArr[i]).createInDom();
        }
        message.textContent = "";
    }
}

const defaults = (() => {
    let home = newProject.add("Home", "General tasks", [todoModule.todo("Groceries", "Grocery list of what we need this week", "2022-04-17", "high", ""), todoModule.todo("Workout", "Just do it", "2020-02-22", "low", "Can somebody spot me")]);
    let today = newProject.add("Today", "Upcoming tasks for today", []);
    let week = newProject.add("This Week", "Upcoming tasks for this week", []);
    allTodos.push(home.getTodos()[0]);
    allTodos.push(home.getTodos()[1]);

    let links = document.getElementsByClassName("to-project-btn");
    for(let i = 0; i < links.length; i++) {
        if (links[i].textContent == "Home") {
            links[i].onclick = () => {showProject(home)};
        }
        else if (links[i].textContent == "Today") {
            links[i].onclick = () => {showProject(today)};
        }
        else if (links[i].textContent == "This Week") {
            links[i].onclick = () => {showProject(week)};
        }
    }
    return {home, today, week};
})();

let update = () => {
    let checkAll = () => {
        for(let i = 0; i < allTodos.length; i++) {
            let todo = allTodos[i];
            if(updateWeek().checkOne(todo)) updateToday().checkOne(todo);
        }
    }

    let updateWeek = () => {
        let week = defaults.week;
        let weekTodos = week.getTodos();

        let todayDate = new Date();
        let startofWeekDate = startOfWeek(todayDate);
        let endOfWeekDate = endOfWeek(todayDate);

        let checkOne = (todo) => {
            let todoDate = todo.getDueDate();
            if(parseISO(todoDate) >= startofWeekDate && parseISO(todoDate) <= endOfWeekDate) {
                weekTodos.push(todo);
                return true;
            }
            return false;
        }
        return {checkOne};
    }

    let updateToday = () => {
        let today = defaults.today;
        let todayTodos = today.getTodos();
        let startOfTodayDate = startOfToday();
        let endOfTodayDate = endOfToday();

        let checkOne = (todo) => {
            let todoDate = todo.getDueDate();
            if(parseISO(todoDate) >= startOfTodayDate && parseISO(todoDate) <= endOfTodayDate) {
                todayTodos.push(todo);
                return true;
            }
            return false;
        }
        return {checkOne};
    }
    return {checkAll, updateWeek, updateToday}
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

export {todoDom, newProject, showProject, update};