/**
 * @fileoverview This file is rendering the TodoList on the page (appending and fetching URL)
 */
const BACKEND_ROOT_URL = 'https://todo-backend-4kqy.onrender.com'

//import { InterfaceTypeWithDeclaredMembers } from "typescript"
import { Task } from "./class/Task.js"
import { Todo } from "./class/Todo.js"
const todos = new Todo(BACKEND_ROOT_URL)

const list = <HTMLUListElement>document.querySelector('#todolist')
const input = <HTMLInputElement>document.querySelector('#todo-input')
const input_button = <HTMLButtonElement>document.querySelector('#todo-btn')

const standardTheme = <HTMLElement>document.querySelector('.standard-theme')
const lightTheme = <HTMLElement>document.querySelector('.light-theme')
const darkerTheme = <HTMLElement>document.querySelector('.darker-theme')
// Event listeners to change the theme
standardTheme.addEventListener('click', () => changeTheme('standard'))
lightTheme.addEventListener('click', () => changeTheme('light'))
darkerTheme.addEventListener('click', () => changeTheme('darker'))

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));



input.disabled = true

todos.getTasks()
    .then((tasks: Array<Task> | any) => {
        tasks.forEach((task: Task) => {
            renderTask(task)


        })
        input.disabled = false
    }).catch(error => {
        alert(error)
    })


input.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        const text = input.value.trim()
        if (text !== '') {
            todos.addTask(text)
                .then((task: any) => {
                    input.value = ''
                    input.focus()
                    renderTask(<Task>task)
                })
        } else {
            alert("You must write something!")
        }
        event.preventDefault()
    }
})
input_button.addEventListener('click', event => {
    const text = input.value.trim()
    if (text !== '') {
        todos.addTask(text)
            .then((task: any) => {
                input.value = ''
                input.focus()
                renderTask(<Task>task)
            })
    } else {
        alert("You must write something!")
    }
    event.preventDefault()
}
)



// render of task 
const renderTask = (task: Task) => {
    const list_item: HTMLLIElement = document.createElement('li')
    list_item.setAttribute('class', 'list-group-item col mx-auto')
    renderSpan(list_item, task.text)
    renderLink(list_item, task.id)

    list.append(list_item)
}
// render a span for task text
const renderSpan = (list_item: HTMLLIElement, text: string) => {
    const span = list_item.appendChild(document.createElement('span'))
    span.innerHTML = text
}
// render a link for deleting tasks
const renderLink = (list_item: HTMLLIElement, id: number) => {
    const link = list_item.appendChild(document.createElement('a'))
    link.innerHTML = '<i class ="bi bi-trash></i>'
    link.setAttribute('style', 'float: right')

    link.addEventListener('click', event => {
        todos.removeTask(id).then((id) => {
            const removeElement = document.querySelector(`[data-key=${id}]`)
            if (removeElement) {
                list.removeChild(removeElement)
            }
        }).catch(error => {
            alert(error)
        })
    })

}

// Change theme function:
function changeTheme(color: any) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    // Change blinking cursor for darker theme:
    color === 'dark' ?
        document.getElementById('title')!.classList.add('darker-title')
        : document.getElementById('title')!.classList.remove('darker-title');

    document.getElementById('todo-input')!.className = `${color}-input`;
    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ?
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check or delete):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`;
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}
