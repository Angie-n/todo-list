import * as projectModule from "./project.js";

const storage = () => {
    let populateStorage = () => {
        localStorage.setItem("projects", JSON.stringify(projectModule.projects));
    }
    
    let extractStorage = () => {
        let pArr = JSON.parse(localStorage.getItem("projects"));

        projectModule.changeProjects(pArr);
    }
    return {populateStorage, extractStorage};
}

if (storageAvailable('localStorage')) {
    if(!localStorage.getItem('projects')) {
        storage().populateStorage();
    }
    else storage().extractStorage();
}

//function checking if localStorage is supported
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            (storage && storage.length !== 0);
    }
}

export {storage};
