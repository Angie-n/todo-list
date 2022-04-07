const todo = (title, description, dueDate, priority, notes) => {
    let getTitle = () => {return title};
    let getDescription = () => {return description};
    let getDueDate = () => {return dueDate};
    let getPriority = () => {return priority};
    let getNotes = () => {return notes};
    return {getTitle, getDescription, getDueDate, getPriority, getNotes}
}
export {todo};