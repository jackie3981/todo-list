import { describe, it, expect } from "vitest";
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from "./todoReducers";

describe("todoReducer", () => {
  /* ============================
     FETCH TODOS
     ============================ */

  describe("FETCH actions", () => {
    it("FETCH_START sets loading true and clears error", () => {
      const prevState = { ...initialTodoState, error: "old error" };

      const next = todoReducer(prevState, { type: TODO_ACTIONS.FETCH_START });

      expect(next.isTodoListLoading).toBe(true);
      expect(next.error).toBe("");
    });

    it("FETCH_SUCCESS stores todos and stops loading", () => {
      const todos = [
        { id: 1, title: "Task A", isCompleted: false },
        { id: 2, title: "Task B", isCompleted: true },
      ];
      const prevState = { ...initialTodoState, isTodoListLoading: true };

      const next = todoReducer(prevState, {
        type: TODO_ACTIONS.FETCH_SUCCESS,
        payload: todos,
      });

      expect(next.isTodoListLoading).toBe(false);
      expect(next.todoList).toEqual(todos);
      expect(next.filterError).toBe("");
    });

    it("FETCH_ERROR sets error message when not a filter error", () => {
      const prevState = { ...initialTodoState, isTodoListLoading: true };

      const next = todoReducer(prevState, {
        type: TODO_ACTIONS.FETCH_ERROR,
        payload: { message: "Network error", isFilterError: false },
      });

      expect(next.isTodoListLoading).toBe(false);
      expect(next.error).toBe("Network error");
      expect(next.filterError).toBe("");
    });

    it("FETCH_ERROR sets filterError when it is a filter error", () => {
      const prevState = { ...initialTodoState, isTodoListLoading: true };

      const next = todoReducer(prevState, {
        type: TODO_ACTIONS.FETCH_ERROR,
        payload: { message: "No results", isFilterError: true },
      });

      expect(next.error).toBe("");
      expect(next.filterError).toBe("No results");
    });
  });

  /* ============================
     ADD TODO
     ============================ */

  describe("ADD TODO actions", () => {
    it("ADD_TODO_START optimistically adds the temp todo at the beginning", () => {
      const existing = [{ id: 1, title: "Existing", isCompleted: false }];
      const tempTodo = { id: 999, title: "New", isCompleted: false };

      const next = todoReducer(
        { ...initialTodoState, todoList: existing },
        { type: TODO_ACTIONS.ADD_TODO_START, payload: tempTodo },
      );

      expect(next.todoList).toHaveLength(2);
      expect(next.todoList[0]).toEqual(tempTodo);
      expect(next.error).toBe("");
    });

    it("ADD_TODO_SUCCESS replaces temp todo with saved todo", () => {
      const tempTodo = { id: 999, title: "New", isCompleted: false };
      const savedTodo = { id: "abc-123", title: "New", isCompleted: false };

      const next = todoReducer(
        { ...initialTodoState, todoList: [tempTodo], dataVersion: 0 },
        {
          type: TODO_ACTIONS.ADD_TODO_SUCCESS,
          payload: { tempId: 999, todo: savedTodo },
        },
      );

      expect(next.todoList).toHaveLength(1);
      expect(next.todoList[0]).toEqual(savedTodo);
      expect(next.dataVersion).toBe(1);
    });

    it("ADD_TODO_ERROR removes temp todo and sets error", () => {
      const tempTodo = { id: 999, title: "New", isCompleted: false };
      const existing = { id: 1, title: "Keep", isCompleted: false };

      const next = todoReducer(
        { ...initialTodoState, todoList: [tempTodo, existing] },
        {
          type: TODO_ACTIONS.ADD_TODO_ERROR,
          payload: { tempId: 999, message: "Server error" },
        },
      );

      expect(next.todoList).toHaveLength(1);
      expect(next.todoList[0].id).toBe(1);
      expect(next.error).toBe("Server error");
    });
  });

  /* ============================
     COMPLETE TODO
     ============================ */

  describe("COMPLETE TODO actions", () => {
    const baseTodos = [
      { id: 1, title: "Task A", isCompleted: false },
      { id: 2, title: "Task B", isCompleted: false },
    ];

    it("COMPLETE_TODO_START optimistically marks todo as completed", () => {
      const next = todoReducer(
        { ...initialTodoState, todoList: baseTodos },
        { type: TODO_ACTIONS.COMPLETE_TODO_START, payload: { id: 1 } },
      );

      expect(next.todoList[0].isCompleted).toBe(true);
      expect(next.todoList[1].isCompleted).toBe(false);
    });

    it("COMPLETE_TODO_SUCCESS increments dataVersion", () => {
      const next = todoReducer(
        { ...initialTodoState, dataVersion: 3 },
        { type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS },
      );

      expect(next.dataVersion).toBe(4);
    });

    it("COMPLETE_TODO_ERROR rolls back to original todo", () => {
      const originalTodo = { id: 1, title: "Task A", isCompleted: false };
      const optimisticList = [
        { id: 1, title: "Task A", isCompleted: true },
        { id: 2, title: "Task B", isCompleted: false },
      ];

      const next = todoReducer(
        { ...initialTodoState, todoList: optimisticList },
        {
          type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
          payload: { id: 1, originalTodo, message: "Failed" },
        },
      );

      expect(next.todoList[0].isCompleted).toBe(false);
      expect(next.error).toBe("Failed");
    });
  });

  /* ============================
     UPDATE TODO
     ============================ */

  describe("UPDATE TODO actions", () => {
    it("UPDATE_TODO_START optimistically updates the title", () => {
      const todos = [{ id: 1, title: "Old", isCompleted: false }];
      const editedTodo = { id: 1, title: "Updated", isCompleted: false };

      const next = todoReducer(
        { ...initialTodoState, todoList: todos },
        { type: TODO_ACTIONS.UPDATE_TODO_START, payload: { editedTodo } },
      );

      expect(next.todoList[0].title).toBe("Updated");
    });

    it("UPDATE_TODO_ERROR rolls back to original todo", () => {
      const originalTodo = { id: 1, title: "Original", isCompleted: false };
      const optimisticList = [{ id: 1, title: "Edited", isCompleted: false }];

      const next = todoReducer(
        { ...initialTodoState, todoList: optimisticList },
        {
          type: TODO_ACTIONS.UPDATE_TODO_ERROR,
          payload: { originalTodo, message: "Update failed" },
        },
      );

      expect(next.todoList[0].title).toBe("Original");
      expect(next.error).toBe("Update failed");
    });
  });

  /* ============================
     DELETE TODO
     ============================ */

  describe("DELETE TODO actions", () => {
    const baseTodos = [
      { id: 1, title: "Task A", isCompleted: false, createdTime: "2025-01-02" },
      { id: 2, title: "Task B", isCompleted: false, createdTime: "2025-01-01" },
    ];

    it("DELETE_TODO_START optimistically removes the todo", () => {
      const next = todoReducer(
        { ...initialTodoState, todoList: baseTodos },
        { type: TODO_ACTIONS.DELETE_TODO_START, payload: { id: 1 } },
      );

      expect(next.todoList).toHaveLength(1);
      expect(next.todoList[0].id).toBe(2);
    });

    it("DELETE_TODO_SUCCESS increments dataVersion", () => {
      const next = todoReducer(
        { ...initialTodoState, dataVersion: 5 },
        { type: TODO_ACTIONS.DELETE_TODO_SUCCESS },
      );

      expect(next.dataVersion).toBe(6);
    });

    it("DELETE_TODO_ERROR re-inserts the deleted todo", () => {
      const deletedTodo = {
        id: 1,
        title: "Task A",
        isCompleted: false,
        createdTime: "2025-01-02",
      };
      const remaining = [
        { id: 2, title: "Task B", isCompleted: false, createdTime: "2025-01-01" },
      ];

      const next = todoReducer(
        { ...initialTodoState, todoList: remaining },
        {
          type: TODO_ACTIONS.DELETE_TODO_ERROR,
          payload: { deletedTodo, message: "Delete failed" },
        },
      );

      expect(next.todoList).toHaveLength(2);
      expect(next.error).toBe("Delete failed");
    });
  });

  /* ============================
     UI ACTIONS
     ============================ */

  describe("UI actions", () => {
    it("SET_SORT updates sortBy and sortDirection", () => {
      const next = todoReducer(initialTodoState, {
        type: TODO_ACTIONS.SET_SORT,
        payload: { sortBy: "title", sortDirection: "asc" },
      });

      expect(next.sortBy).toBe("title");
      expect(next.sortDirection).toBe("asc");
    });

    it("SET_FILTER updates filterTerm", () => {
      const next = todoReducer(initialTodoState, {
        type: TODO_ACTIONS.SET_FILTER,
        payload: "groceries",
      });

      expect(next.filterTerm).toBe("groceries");
    });

    it("CLEAR_ERROR clears both error and filterError", () => {
      const prevState = {
        ...initialTodoState,
        error: "some error",
        filterError: "filter error",
      };

      const next = todoReducer(prevState, { type: TODO_ACTIONS.CLEAR_ERROR });

      expect(next.error).toBe("");
      expect(next.filterError).toBe("");
    });

    it("RESET_FILTERS restores default filter/sort values", () => {
      const prevState = {
        ...initialTodoState,
        filterTerm: "search",
        sortBy: "title",
        sortDirection: "asc",
        filterError: "err",
      };

      const next = todoReducer(prevState, {
        type: TODO_ACTIONS.RESET_FILTERS,
      });

      expect(next.filterTerm).toBe("");
      expect(next.sortBy).toBe("creationDate");
      expect(next.sortDirection).toBe("desc");
      expect(next.filterError).toBe("");
    });
  });

  /* ============================
     EDGE CASES
     ============================ */

  describe("Edge cases", () => {
    it("throws on unknown action type", () => {
      expect(() =>
        todoReducer(initialTodoState, { type: "UNKNOWN_ACTION" }),
      ).toThrow("Unknown action type: UNKNOWN_ACTION");
    });

    it("initialTodoState has correct defaults", () => {
      expect(initialTodoState.todoList).toEqual([]);
      expect(initialTodoState.error).toBe("");
      expect(initialTodoState.filterError).toBe("");
      expect(initialTodoState.isTodoListLoading).toBe(false);
      expect(initialTodoState.sortBy).toBe("creationDate");
      expect(initialTodoState.sortDirection).toBe("desc");
      expect(initialTodoState.filterTerm).toBe("");
      expect(initialTodoState.dataVersion).toBe(0);
    });
  });
});
