let projects = [];

const project = (title, description, todos) => {
    let getTitle = () => {return title};
    let getDescription = () => {return description};
    let getTodos = () => {return todos};

    let setTodos = (t) => {todos = t};
    return {getTitle, getDescription, getTodos, setTodos};
}

export {projects, project};
