export const TODO_ACTIONS = {
    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',

    ADD_TODO_START: 'ADD_TODO_START',
    ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
    ADD_TODO_ERROR: 'ADD_TODO_ERROR',

    COMPLETE_TODO_START: 'COMPLETE_TODO_START',
    COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
    COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

    UPDATE_TODO_START: 'UPDATE_TODO_START',
    UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
    UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

    DELETE_TODO_START: 'DELETE_TODO_START',
    DELETE_TODO_SUCCESS: 'DELETE_TODO_SUCCESS',
    DELETE_TODO_ERROR: 'DELETE_TODO_ERROR',

    SET_SORT: 'SET_SORT',
    SET_FILTER: 'SET_FILTER',
    CLEAR_ERROR: 'CLEAR_ERROR',
    RESET_FILTERS: 'RESET_FILTERS',
};

export const initialTodoState = {
    todoList: [],
    error: '',
    filterError: '',
    isTodoListLoading: false,
    sortBy: 'creationDate',
    sortDirection: 'desc',
    filterTerm: '',
    dataVersion: 0,
};

export function todoReducer(state, action) {
    switch (action.type) {
        /* ---------- FETCH TODOS ---------- */

        case TODO_ACTIONS.FETCH_START:
            return {
                ...state,
                isTodoListLoading: true,
                error: '',
            };

        case TODO_ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: action.payload,
                filterError: '',
            };

        case TODO_ACTIONS.FETCH_ERROR:
            return {
                ...state,
                isTodoListLoading: false,
                error: action.payload.isFilterError ? '' : action.payload.message,
                filterError: action.payload.isFilterError ? action.payload.message : '',
            };

        /* ---------- ADD TODO ---------- */

        case TODO_ACTIONS.ADD_TODO_START:
            return {
                ...state,
                todoList: [action.payload, ...state.todoList],
                error: '',
            };

        case TODO_ACTIONS.ADD_TODO_SUCCESS:
            return {
                ...state,
                todoList: state.todoList.map((t) =>
                    t.id === action.payload.tempId ? action.payload.todo : t
                ),
                dataVersion: state.dataVersion + 1,
            };

        case TODO_ACTIONS.ADD_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.filter((t) => t.id !== action.payload.tempId),
                error: action.payload.message,
            };

        /* ---------- COMPLETE TODO ---------- */

        case TODO_ACTIONS.COMPLETE_TODO_START:
            return {
                ...state,
                todoList: state.todoList.map((t) =>
                    t.id === action.payload.id ? { ...t, isCompleted: true } : t
                ),
                error: '',
            };

        case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
            return {
                ...state,
                dataVersion: state.dataVersion + 1,
            };

        case TODO_ACTIONS.COMPLETE_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.map((t) =>
                    t.id === action.payload.id ? action.payload.originalTodo : t
                ),
                error: action.payload.message,
            };

        /* ---------- UPDATE TODO ---------- */

        case TODO_ACTIONS.UPDATE_TODO_START:
            return {
                ...state,
                todoList: state.todoList.map((t) =>
                    t.id === action.payload.editedTodo.id
                        ? action.payload.editedTodo
                        : t
                ),
                error: '',
            };

        case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
            return {
                ...state,
                dataVersion: state.dataVersion + 1,
            };

        case TODO_ACTIONS.UPDATE_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.map((t) =>
                    t.id === action.payload.originalTodo.id
                        ? action.payload.originalTodo
                        : t
                ),
                error: action.payload.message,
            };

        /* ---------- UI ---------- */

        case TODO_ACTIONS.SET_SORT:
            return {
                ...state,
                sortBy: action.payload.sortBy,
                sortDirection: action.payload.sortDirection,
            };

        case TODO_ACTIONS.SET_FILTER:
            return {
                ...state,
                filterTerm: action.payload,
            };

        case TODO_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: '',
                filterError: '',
            };

        case TODO_ACTIONS.RESET_FILTERS:
            return {
                ...state,
                filterTerm: '',
                sortBy: 'creationDate',
                sortDirection: 'desc',
                filterError: '',
            };

        /* ---------- DELETE TODO ---------- */

        case TODO_ACTIONS.DELETE_TODO_START:
            return {
                ...state,
                todoList: state.todoList.filter((t) => t.id !== action.payload.id),
                error: '',
            };

        case TODO_ACTIONS.DELETE_TODO_SUCCESS:
            return {
                ...state,
                dataVersion: state.dataVersion + 1,
            };

        case TODO_ACTIONS.DELETE_TODO_ERROR:
            return {
                ...state,
                todoList: [...state.todoList, action.payload.deletedTodo].sort((a, b) =>
                    state.sortBy === 'title'
                        ? a.title.localeCompare(b.title)
                        : new Date(b.createdTime) - new Date(a.createdTime)
                ),
                error: action.payload.message,
            };

        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}
