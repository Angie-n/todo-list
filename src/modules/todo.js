const todo = (title, description, dueDate, priority, notes) => {
    let getTitle = () => {return title};
    let getDescription = () => {return description};
    let getDueDate = () => {return dueDate};
    let getPriority = () => {return priority};
    let getNotes = () => {return notes};

    let isCompleted = false;
    let getIsCompleted = () => {return isCompleted};
    let setIsCompleted = (c) => {isCompleted = c};

    let isDeleted = false;
    let getIsDeleted = () => {return isDeleted};
    let setIsDeleted = (d) => {isDeleted = d};

    let update = (t, d, dd, p, n) => {
        title = t; 
        description = d;
        dueDate = dd;
        priority = p;
        notes = n;
    }
    return {getTitle, getDescription, getDueDate, getPriority, getNotes, getIsCompleted, setIsCompleted, getIsDeleted, setIsDeleted, update};
}
export {todo};