let projects = [];

const project = (title, description, todos) => {
    let getTitle = () => {return title};
    let getDescription = () => {return description};
    let getTodos = () => {return todos};

    return {getTitle, getDescription, getTodos}
}

export {projects, project};
