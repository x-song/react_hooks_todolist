import React, { useState,useRef,useCallback,useEffect,memo} from 'react';
import './ToDoList.css'
let idSeq  = Date.now();
const LS_KEY = '$_key'
function Control(props) {
    const {dispatch} = props ;
    const inputRef = useRef();
    const onSubmit = (e)=>{
        e.preventDefault();
        const newText = inputRef.current.value.trim();
        if(newText.length === 0){
            return ;
        }
        dispatch({
            type:'add',
            payload: {
                        id:++idSeq,
                            text:newText,
                        complete: false
                    }
        })

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
        dispatch,

    } = props ;
    const onChange = () => {
        dispatch({
            type:'toggle',
            payload:id
        })
    }
    const onRemove = () => {
        dispatch({
            type:'remove',
            payload:id
        })
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
     const {todos,dispatch} =props ;
     return (
        <ul>
             {
                 todos.map(item=>{
                     return (<TodoItem
                         key={item.id}
                         todo={item}
                         dispatch={dispatch}

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
        dispatch({type:"set",payload:todos})
    },[])
    useEffect(()=>{
        localStorage.setItem(LS_KEY,JSON.stringify(todos))
    },[todos])
  return (
    <div className="todo-list">
        <Control dispatch={dispatch}/>
        <Todos dispatch={dispatch}  todos={todos}/>
    </div>
  );
}

export default ToDoList;
