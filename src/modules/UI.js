import * as projectModule from "./project.js";
import * as todoModule from "./todo.js";
import {storage} from "./localStorage";

import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfToday from 'date-fns/startOfToday';
import endOfToday from 'date-fns/endOfToday';
import parseISO from 'date-fns/parseISO'

const compare = (() => {
    const objects = (obj1, obj2) => {return JSON.stringify(obj1) == JSON.stringify(obj2);};
    const objectInArray = (obj, arr) => {
        let index = -1;
        arr.forEach((e,i) => {
            if(objects(obj, e)) index = i;
        });
        return index;
    }
    return {objects, objectInArray};
});

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

        let color = setColor(todo.priority);
        let getColor = () => {return color};

        return {getColor};
    }

    let addText = () => {
        etitle.textContent = todo.title;
        edescription.textContent = todo.description;
        edueDate.textContent = todo.dueDate;
        noteLabel.textContent = "Notes: ";
        noteContent.textContent = todo.notes;
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
                if(todo.isCompleted) {
                    todo.isCompleted = false;
                    unchecked();
                }
                else {
                    todo.isCompleted = true;
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
        if(todo.isCompleted) checkmark().checked();
        else checkmark().unchecked();

        return {checkmark};
    }

    let addEvents = () => {
        checkmarkDiv.onclick = () => {
            addStyles().checkmark().toggle();
            storage().populateStorage();
        }

        deleteBtn.onclick = () => {
            etask.remove();
            let index = todoModule.allTodos.indexOf(todo);
            todoModule.allTodos.splice(index, 1);
            todo.isDeleted = true;
            if(todoTasksContainer.childElementCount == 0) document.getElementById("project-msg").style.display = "flex";
            storage().populateStorage();
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
                if(input == arr[i].title) {
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
            if(projects[i].title == document.getElementById("project-title").textContent) {
                projects[i].todos.push(task);
            } 
        }
        if(document.getElementById("project-title").textContent != "This Week") update().updateWeek().checkOne(task);
        if(document.getElementById("project-title").textContent != "Today") update().updateToday().checkOne(task);

        todoDom(task).createInDom();
        f.clear();
        f.removeStyles();
        document.getElementById("project-msg").style.display = "none";
        todoModule.allTodos.push(task);
        storage().populateStorage();
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
        fName.value = todo.title;
        fDescription.value = todo.description;
        fDueDate.value = todo.dueDate;
        fNotes.value = todo.notes;
        let fPriority = document.querySelector("input[name='change-priority'][value='" + todo.priority + "']");
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

        todo.name = name;
        todo.description = description;
        todo.dueDate = dueDate;
        todo.priority = priority;
        todo.notes = notes;

        let indexInWeek = defaults.week.todos.indexOf(todo);
        let indexInToday = defaults.today.todos.indexOf(todo);

        let shouldRemove;

        if(indexInWeek === -1) {update().updateWeek().checkOne(todo);}
        else if(indexInWeek !== -1 && (parseISO(todo.dueDate) < startOfWeek(new Date()) || parseISO(todo.dueDate) > endOfWeek(new Date()))) {
            let newList = defaults.week.todos;
            newList.splice(indexInWeek, 1);
            defaults.week.todos = newList;
            if(document.getElementById("project-title").textContent === "This Week") shouldRemove = true;
        }

        if (indexInToday === -1){update().updateToday().checkOne(todo);}
        else if(indexInToday !== -1 && (parseISO(todo.dueDate) < startOfToday() || parseISO(todo.dueDate) > endOfToday())) {
            let newList = defaults.today.todos;
            newList.splice(indexInWeek, 1);
            defaults.today.todos = newList;
            if(document.getElementById("project-title").textContent === "Today") shouldRemove = true;
        }

        if(shouldRemove) {
            todoDOM.remove();
            document.getElementById("project-msg").style.display = "flex";
        }
        else todoDom(todo).updateInDom(todoDOM);

        f.clear();
        f.removeStyles();
        storage().populateStorage();
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
        storage().populateStorage();
    })

    let add = (name, description, todo) => {
        let project = projectModule.project(name, description, todo);
        projectModule.projects.push(project);
        if(projectModule.projects.length > 9) document.getElementById("nav").style.transform = "none";
        return project;
    }

    let createBtnToProject = (project) => {
        let li = document.createElement("li");
        let addBtn = document.createElement("button");
        addBtn.classList.add("to-project-btn");
        addBtn.textContent = project.title;
        addBtn.onclick = () => showProject(project);

        let deleteBtn = document.createElement("i");
        deleteBtn.classList.add("delete-project-btn");
        deleteBtn.classList.add("fa-solid");
        deleteBtn.classList.add("fa-file-circle-xmark");
        deleteBtn.onclick = e => {
            let index = projectModule.projects.indexOf(project);
            for(let t = 0; t < projectModule.projects[index].todos.length; t++) projectModule.projects[index].todos[t].isDeleted = true;
            projectModule.projects.splice(index, 1);
            li.remove();
            storage().populateStorage();
            if(project.title == document.getElementById("project-title").textContent) showProject(projectModule.projects[0]);
            else if(document.getElementById("project-title").textContent == projectModule.projects[1].title)showProject(projectModule.projects[1]);
            else if(document.getElementById("project-title").textContent == projectModule.projects[2].title)showProject(projectModule.projects[2]);
        }

        li.append(addBtn, deleteBtn);

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

    title.textContent = project.title;
    description.textContent = project.description;

    let todosArr = project.todos.filter(todo => !todo.isDeleted);
    if(todosArr.length != project.todos.length)project.todos = todosArr;

    let message = document.getElementById("project-msg")
    if(todosArr.length == 0) message.style.display = "flex";
    else {
        for(let i = 0; i < todosArr.length; i++) {
            todoDom(todosArr[i]).createInDom();
        }
        message.style.display = "none";
    }
}

const defaults = (() => {
    let home;
    let today;
    let week;

    if(projectModule.projects.length == 0) {
        home = newProject.add("Home", "General tasks", []);
        today = newProject.add("Today", "Upcoming tasks for today", []);
        week = newProject.add("This Week", "Upcoming tasks for this week", []);
    }
    else {
        home = projectModule.projects[0];
        today = projectModule.projects[1];
        today.todos = [];
        week = projectModule.projects[2];
        week.todos = [];
    }

    let allTodos = [];
    for(let i = 0; i < projectModule.projects.length; i++) {
        if(i < 3) {
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
        }
        else newProject.createBtnToProject(projectModule.projects[i]);
        for(let t = 0; t < projectModule.projects[i].todos.length; t++) {
            if(compare().objectInArray(projectModule.projects[i].todos[t], allTodos) == -1) {
                allTodos.push(projectModule.projects[i].todos[t]);
            }
        }
    }
    todoModule.changeAllTodos(allTodos);

    return {home, today, week};
})();

const update = () => {
    let checkAll = () => {
        for(let i = 0; i < todoModule.allTodos.length; i++) {
            let todo = todoModule.allTodos[i];
            if(updateWeek().checkOne(todo)) updateToday().checkOne(todo);
        }
        storage().populateStorage();
    }

    let updateWeek = () => {
        let week = defaults.week;
        let weekTodos = week.todos;

        let todayDate = new Date();
        let startofWeekDate = startOfWeek(todayDate);
        let endOfWeekDate = endOfWeek(todayDate);

        let checkOne = (todo) => {
            let todoDate = todo.dueDate;
            if(parseISO(todoDate) >= startofWeekDate && parseISO(todoDate) <= endOfWeekDate) {
                let index = compare().objectInArray(todo, weekTodos);
                if(index != -1) weekTodos[index] = todo;
                else weekTodos.push(todo);
                return true;
            }
            return false;
        }
        return {checkOne};
    }

    let updateToday = () => {
        let today = defaults.today;
        let todayTodos = today.todos;
        let startOfTodayDate = startOfToday();
        let endOfTodayDate = endOfToday();

        let checkOne = (todo) => {
            let todoDate = todo.dueDate;
            if(parseISO(todoDate) >= startOfTodayDate && parseISO(todoDate) <= endOfTodayDate) {
                let index = compare().objectInArray(todo, todayTodos);
                if(index != -1) todayTodos[index] = todo;
                else todayTodos.push(todo);
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

export {todoDom, newProject, showProject, update, defaults};