import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
export const getTodosAsync = createAsyncThunk(
	'todos/getTodosAsync',
	async () => {
		const resp = await fetch('http://localhost:7000/todos');
		if (resp.ok) {
			const todos = await resp.json();
			return { todos };
		}
	}
)
export const addTodoAsync = createAsyncThunk(
    'todos/addTodosAsync',
    async (payload)=>{
        const resp = await fetch('http://localhost:7000/todos',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
			body: JSON.stringify({ title: payload.title }),
        });
		if (resp.ok) {
			const todo = await resp.json();
			return { todo };
		} 
    }
)

export const toggleCompleteAsync = createAsyncThunk(
    'todos/toggleTodosAsync',
    async(payload)=>{
        const resp = await fetch(`http://localhost:7000/todos/${payload.id}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
			body: JSON.stringify({completed: payload.completed})
        });
		if (resp.ok) {
            const todo = await resp.json()
            return{id: todo.id, completed: todo.completed}
        }
    }
)

export const deleteTodoAsync = createAsyncThunk(
    'todos/deleteTodosAsync',
    async(payload)=>{
        const resp = await fetch(`http://localhost:7000/todos/${payload.id}`,
        {
            method: 'DELETE',
        });
        
        if (resp.ok) {
            return {id: payload.id}
        }
    }
)

const TodoSlice = createSlice({
    name: 'todo',
    initialState: [
        {id: 1, title: 'Todo 1', completed: false},
        {id: 2, title: 'Todo 2', completed: false},
        {id: 3, title: 'Todo 3', completed: false},
    ],
    reducers: {
        addTodo: (state, action) => {
            const newTodo = {
                id: Date.now(),
                title: action.payload.title,
                completed: false,
            }
            state.push(newTodo)
            },
            toggleComplete: (state, action)=>{
                const index = state.findIndex((todo)=>todo.id===action.payload.id)
                state[index].completed = action.payload.completed
            },
            deleteTodo: (state, action)=>{
                return state.filter((todo)=>todo.id!==action.payload.id)
            }
        
    },
    extraReducers: {
		[getTodosAsync.fulfilled]: (state, action) => {
            console.log('fetched data successfully...');
			return action.payload.todos;
		},
        [getTodosAsync.pending]: (state, action)=>{
            console.log('fetching data...');
        },
		[addTodoAsync.fulfilled]: (state, action) => {
			state.push(action.payload.todo);
		},		
        [toggleCompleteAsync.fulfilled]: (state, action) => {
            const index = state.findIndex((todo)=>todo.id===action.payload.id)
            state[index].completed = action.payload.completed
		},
        [deleteTodoAsync.fulfilled]: (state, action) => {
            return state.filter((todo)=>todo.id!==action.payload.id)
		},	
    }

})

export const {addTodo,toggleComplete,deleteTodo} = TodoSlice.actions
export default TodoSlice.reducer