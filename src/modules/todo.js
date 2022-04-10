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
    return {getTitle, getDescription, getDueDate, getPriority, getNotes, getIsCompleted, setIsCompleted, getIsDeleted, setIsDeleted};
}
export {todo};