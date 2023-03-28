/**
 * @fileoverview This file includes the functionality for adding tasks on the frontend side.
 * 
 */


import { Task } from "./Task.js"
class Todo {
    tasks: Array<Task> = []
    #backend_url = ''
    constructor(url: any) {
        this.#backend_url = url
    }
    getTasks = async () => {
        return new Promise(async (resolve, reject) => {
            fetch(this.#backend_url)
                .then(response => response.json())
                .then((response) => {
                    this.#readJson(response)
                    resolve(this.tasks)
                }, (error: Error) => {
                    reject(error)
                })
        })
    }
    addTask = async (text: string) => {
        return new Promise(async (resolve, reject) => {
            const json = JSON.stringify({ description: text })
            fetch(this.#backend_url + '/new', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: json
            })
                .then(response => response.json())
                .then((response) => {
                    resolve(this.#addToArray(response.id, text))
                }),
                (error: Error) => {
                    reject(error)
                }
        })
    }

    removeTask = async (id: number) => {
        return new Promise(async (resolve, reject) => {
            fetch(this.#backend_url + '/delete/' + id, {
                method: 'delete',
            })
                .then(response => response.json())
                .then(response => {
                    this.#removeFromArray(id)
                    resolve(response.id)
                }),
                (error: Error) => {
                    reject(error)
                }
        })
    }
    #readJson(taskAsJson: any): void {
        taskAsJson.forEach((node: { id: number; description: string }) => {
            const task = new Task(node.id, node.description)
            this.tasks.push(task)
        })
    }
    #addToArray(id: number, text: string) {

        const task = new Task(id, text)
        this.tasks.push(task)
        return task
    }
    #removeFromArray(id: number): void {
        const arrayWithoutRemoved = this.tasks.filter(task => task.id !== id)
        this.tasks = arrayWithoutRemoved
    }

}
export { Todo }