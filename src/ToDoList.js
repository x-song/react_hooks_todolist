import React, { useState,useRef,useCallback,useEffect,memo} from 'react';
import  {
    createSet,
    createAdd,
    createRemove,
    createToggle
} from  './action'
import './ToDoList.css'
let idSeq  = Date.now();
const LS_KEY = '$_key';
function bindActionCreators(actionCreators,dispatch) {
    const ret = {};
    for (let key in actionCreators) {
        ret[key] = function (...args) {
            const actionCreator = actionCreators[key];
            const action = actionCreator(...args);
            dispatch(action);
        }
    }
    return ret ;
}
function Control(props) {
    const {addTodo} = props ;
    const inputRef = useRef();
    const onSubmit = (e)=>{
        e.preventDefault();
        const newText = inputRef.current.value.trim();
        if(newText.length === 0){
            return ;
        }
        addTodo({
                id:++idSeq,
                text:newText,
                complete: false
            }
        )

        inputRef.current.value = '' ;
    }
    return (
        <div className="control">
          <h1>todos</h1>
            <form onSubmit={onSubmit}>
                <input type="text" ref={inputRef} className="new-todo" placeholder="输入点东西"/>
            </form>
        </div>
    )
}
function TodoItem(props) {

    const  {
        todo:{
            id,
            text,
            complete
        },
        removeTodo,
        toggleToDo

    } = props ;
    const onChange = () => {
        toggleToDo(id)
    }
    const onRemove = () => {
        removeTodo(id)
    }

    return (
        <li className="todo-item">
            <input type="checkbox" onChange={onChange} checked={complete}/>
            <label className={complete?"complete":''}>{text}</label>
            <button onClick={onRemove}>&#xd7;</button>
        </li>
    )
}
 const Todos = memo(function Todos(props) {
     const {removeTodo,toggleToDo,todos} =props ;
     return (
        <ul>
             {
                 todos.map(item=>{
                     return (<TodoItem
                         key={item.id}
                         todo={item}
                         removeTodo={removeTodo}
                         toggleToDo={toggleToDo}

                     />)
                 })
             }
         </ul>
     )

 })
function ToDoList() {
    const [todos,setTodos] = useState([]);

    const dispatch = useCallback((action) => {
        const {type,payload} = action ;
        switch (type) {
            case 'set':
                setTodos(payload);
                break;
            case 'add':
                setTodos(todos=>[...todos,payload]);
                break;
            case 'remove':
                setTodos(todos=>todos.filter(todo=>{
                    return todo.id !== payload ;
                }))
                break;
            case 'toggle':
                setTodos(todos=>todos.map(todo=>{
                    return todo.id === payload ? {
                        ...todo,
                        complete:!todo.complete
                    }: todo
                }))
                break;
            default:

        }
    },[])
    useEffect(()=>{
        const todos = JSON.parse(localStorage.getItem(LS_KEY)|| '[]')
        // setTodos(todos)
        dispatch(createSet(todos))
    },[])
    useEffect(()=>{
        localStorage.setItem(LS_KEY,JSON.stringify(todos))
    },[todos])
  return (
    <div className="todo-list">
        <Control
            {
                ...bindActionCreators({
                    addTodo:createAdd
                },dispatch)
            }
        />
        <Todos
            {
                ...bindActionCreators({
                    removeTodo:createRemove,
                    toggleToDo:createToggle
                },dispatch)
            }

            todos={todos}/>
    </div>
  );
}

export default ToDoList;
