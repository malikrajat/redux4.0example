import {
	configureStore,
	createSlice,
	getDefaultMiddleware,
	PayloadAction,
} from "@reduxjs/toolkit";
import logger from "redux-logger";
import { v1 as uuid } from "uuid";
import { Todo } from "./type";

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
const todoSlice = createSlice({
	name: "todos",
	initialState: todosInitialState,
	reducers: {
		create: {
			prepare: ({ desc }: { desc: string }) => ({
				payload: {
					id: uuid(),
					desc,
					isComplete: false,
				},
			}),
			reducer: (
				state,
				{
					payload,
				}: PayloadAction<{
					id: string;
					desc: string;
					isComplete: boolean;
				}>
			) => {
				state.push(payload);
			},
		},
		edit: (
			state,
			{ payload }: PayloadAction<{ desc: string; id: string }>
		) => {
			const todoEdit = state.find((todo) => todo.id === payload.id);
			if (todoEdit) {
				todoEdit.desc = payload.desc;
			}
		},
		toggle: (
			state,
			{ payload }: PayloadAction<{ id: string; isComplete: boolean }>
		) => {
			const todoToggle = state.find((todo) => todo.id === payload.id);
			if (todoToggle) {
				todoToggle.isComplete = payload.isComplete;
			}
		},
		remove: (state, { payload }: PayloadAction<{ id: string }>) => {
			const index = state.findIndex((todo) => todo.id === payload.id);
			if (index !== -1) {
				state.splice(index, 1);
			}
		},
	},
});

const selectedTodoSlice = createSlice({
	name: "selectedTodo",
	initialState: null as string | null,
	reducers: {
		select: (state, { payload }: PayloadAction<{ id: string }>) =>
			payload.id,
	},
});

const counterSlice = createSlice({
	name: "counter",
	initialState: 0,
	reducers: {},
	extraReducers: {
		[todoSlice?.actions?.create?.type]: (state) => state + 1,
		[todoSlice?.actions?.edit?.type]: (state) => state + 1,
		[todoSlice?.actions?.remove?.type]: (state) => state + 1,
		[todoSlice?.actions?.toggle?.type]: (state) => state + 1,
	},
});

const reducer = {
	todos: todoSlice.reducer,
	selectedTodo: selectedTodoSlice.reducer,
	counter: counterSlice.reducer,
};

const middleware = [...getDefaultMiddleware(), logger];
export default configureStore({
	reducer,
	middleware,
});

export const {
	create: createTodoActionCreator,
	edit: editTodoActionCreator,
	toggle: toggleTodoActionCreator,
	remove: deleteTodoActionCreator,
} = todoSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;
