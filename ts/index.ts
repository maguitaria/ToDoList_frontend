/**
 * @fileoverview This file is rendering the TodoList on the page (appending and fetching URL)
 */
const BACKEND_ROOT_URL = 'http://localhost:4000'

import { Task } from "./class/Task"
import { Todo } from "./class/Todo"
const todos = new Todo(BACKEND_ROOT_URL)

const list = <HTMLUListElement>document.querySelector('#todolist')

const input = <HTMLInputElement>document.querySelector('#newtodo')

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
        }
        event.preventDefault()
    }
})



// render of task 
const renderTask = (task: Task) => {
    const list_item: HTMLLIElement = document.createElement('li')
    list_item.setAttribute('class', 'list-group-item')
    renderSpan(list_item, task.text)
    renderLink(list_item, task.id)
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
