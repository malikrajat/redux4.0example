import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { v1 as uuid } from "uuid";
import { Todo } from "./type";

//constant
const CREATE_TODO = "CREATE_TODO";
const EDIT_TODO = "EDIT_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const DELETE_TODO = "DELETE_TODO";
const SELECT_TODO = "SELECT_TODO";

// aAction & action type

interface CreateTodoActionType {
	type: typeof CREATE_TODO;
	payload: Todo;
}
export const createTodoActionCreator = (data: {
	desc: string;
}): CreateTodoActionType => {
	const { desc } = data;
	return {
		type: CREATE_TODO,
		payload: {
			id: uuid(),
			desc,
			isComplete: false,
		},
	};
};
interface EditTodoActionType {
	type: typeof EDIT_TODO;
	payload: {
		id: string | null;
		desc: string;
	};
}
export const editTodoActionCreator = ({
	desc,
	id,
}: {
	desc: string;
	id: string | null;
}): EditTodoActionType => {
	return {
		type: EDIT_TODO,
		payload: {
			id,
			desc,
		},
	};
};
interface ToggleActionType {
	type: typeof TOGGLE_TODO;
	payload: {
		id: string;
		isComplete: boolean;
	};
}
export const toggleTodoActionCreator = ({
	id,
	isComplete,
}: {
	id: string;
	isComplete: boolean;
}): ToggleActionType => {
	return {
		type: TOGGLE_TODO,
		payload: {
			id,
			isComplete,
		},
	};
};
interface DeleteTodoActionType {
	type: typeof DELETE_TODO;
	payload: {
		id: string;
	};
}
export const deleteTodoActionCreator = ({
	id,
}: {
	id: string;
}): DeleteTodoActionType => {
	return {
		type: DELETE_TODO,
		payload: {
			id,
		},
	};
};
interface SelectTodoActionType {
	type: typeof SELECT_TODO;
	payload: {
		id: string;
	};
}
export const selectTodoActionCreator = ({
	id,
}: {
	id: string;
}): SelectTodoActionType => {
	return {
		type: SELECT_TODO,
		payload: {
			id,
		},
	};
};

// Reducers

const todosInitialState: Todo[] = [
	{
		id: uuid(),
		desc: "Learn React",
		isComplete: true,
	},
	{
		id: uuid(),
		desc: "Learn Redux",
		isComplete: true,
	},
	{
		id: uuid(),
		desc: "Learn Redux-ToolKit",
		isComplete: false,
	},
];
type TodoActionType =
	| CreateTodoActionType
	| EditTodoActionType
	| ToggleActionType
	| DeleteTodoActionType;
const todosReducer = (
	state: Todo[] = todosInitialState,
	action: TodoActionType
) => {
	switch (action.type) {
		case CREATE_TODO:
			return [...state, action.payload];
			break;
		case EDIT_TODO:
			return state.map((todo) =>
				todo.id === action.payload.id
					? { ...todo, desc: action.payload.desc }
					: todo
			);
			break;
		case TOGGLE_TODO:
			return state.map((todo) =>
				todo.id === action.payload.id
					? { ...todo, isComplete: action.payload.isComplete }
					: todo
			);
			break;
		case DELETE_TODO:
			return state.filter((todo) => todo.id !== action.payload.id);
			break;
		default:
			return state;
			break;
	}
};

type SelectedTodoActionTypes = SelectTodoActionType;
const selectedTodoReducer = (
	state: string | null = null,
	action: SelectedTodoActionTypes
) => {
	switch (action.type) {
		case SELECT_TODO:
			{
				const { payload } = action;
				return payload.id;
			}
			break;

		default:
			return state;
			break;
	}
};
const counterReducer = (state: number = 0, action: TodoActionType) => {
	switch (action.type) {
		case CREATE_TODO:
			return state + 1;
			break;
		case EDIT_TODO:
			return state + 1;
			break;
		case TOGGLE_TODO:
			return state + 1;
			break;
		case DELETE_TODO:
			return state + 1;
			break;
		default:
			return state;
			break;
	}
};
const reducer = combineReducers({
	todos: todosReducer,
	selectedTodo: selectedTodoReducer,
	counter: counterReducer,
});
//store
export default createStore(
	reducer,
	composeWithDevTools(applyMiddleware(thunk, logger))
);
