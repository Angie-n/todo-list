import * as todoModule from "./modules/todo.js";
import * as UIModule from "./modules/UI.js";
import * as projectModule from "./modules/project.js";
import * as localStorageModule from "./modules/localStorage.js";

UIModule.showProject(projectModule.projects[0]);
UIModule.update().checkAll();