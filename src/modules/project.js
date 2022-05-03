let projects = [];
const changeProjects = (arr) => {projects = arr};

const project = (t, d, td) => {
    let title = t;
    let description = d;
    let todos = td;
    
    return {title, description, todos};
}

export {projects, changeProjects, project};
