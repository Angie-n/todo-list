let allTodos = [];
const changeAllTodos = at => {allTodos = at};

const todo = (t, d, dd, p, n) => {
    let title = t;
    let description = d;
    let dueDate = dd;
    let priority = p;
    let notes = n;

    let isCompleted = false;
    let isDeleted = false;
    let isOverdue;

    return {title, description, dueDate, priority, notes, isCompleted, isDeleted, isOverdue};
}
export {allTodos, changeAllTodos, todo};