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

    return {title, description, dueDate, priority, notes, isCompleted, isDeleted};
}
export {allTodos, changeAllTodos, todo};