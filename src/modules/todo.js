const todo = (title, description, dueDate, priority, notes) => {
    let getTitle = () => {return title};
    let getDescription = () => {return description};
    let getDueDate = () => {return dueDate};
    let getPriority = () => {return priority};
    let getNotes = () => {return notes};

    let isCompleted = false;
    let getIsCompleted = () => {return isCompleted};
    let setIsCompleted = (c) => {isCompleted = c};
    return {getTitle, getDescription, getDueDate, getPriority, getNotes, getIsCompleted, setIsCompleted};
}
export {todo};