/**
 * @fileoverview This file is rendering the TodoList on the page (appending and fetching URL)
 */
const BACKEND_ROOT_URL = 'https://todo-backend-4kqy.onrender.com'

import { Task } from "./class/Task.js"
import { Todo } from "./class/Todo.js"
const todos = new Todo(BACKEND_ROOT_URL)

const list = <HTMLUListElement>document.getElementById('todolist')
const input = <HTMLInputElement>document.getElementById('newtodo')
const input_button = <HTMLButtonElement>document.getElementById('input-btn')

const standardTheme = document.querySelector('.standart-theme')
const lightTheme = document.querySelector('.light-theme')
const darkTheme = document.querySelector('.dark-theme')

input.disabled = true

todos.getTasks().then((tasks: Array<Task>) => {
    tasks.forEach(task => {
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
