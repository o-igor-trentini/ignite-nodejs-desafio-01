import {Database} from "./database.js";
import {randomUUID} from 'node:crypto';
import {buildRoutePath} from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
    // Cria uma nova tarefa
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {title, description} = req.body;
            const now = new Date();
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: now,
                updated_at: now
            };

            database.insert('tasks', task);

            return res.writeHead(201).end(JSON.stringify(task));
        }
    },
    // Lista todas as tarefas
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {search} = req.query;
            const searchPayload = search ? {
                title: search,
                description: search,
            } : null;

            const tasks = database.select('tasks', searchPayload);

            return res.end(JSON.stringify(tasks));
        }
    },
    // Atualiza uma tarefa
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params;

            if (!id) return res.writeHead(400).end('Código da tarefa não informado');

            const {title, description} = req.body;
            const searchPayload = {id};
            const [task] = database.select('tasks', searchPayload);

            if (!task) return res.writeHead(404).end('Tarefa não encontrada');

            const now = new Date();
            const payload = {
                ...task,
                title: title || task.title,
                description: description || task.description,
                updated_at: now,
            };

            database.update('tasks', id, payload);

            return res.writeHead(204).end();
        }
    },
    // Remove uma tarefa
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params;
            const searchPayload = {id};
            const task = database.select('tasks', searchPayload);

            if (!task || !task.length) return res.writeHead(404).end('Tarefa não encontrada');

            database.delete('tasks', id);

            return res.writeHead(204).end();
        }
    },
    // Marca a tarefa como concluída
    {
        method: 'PATCH', path: buildRoutePath('/tasks/:id/complete'), handler: (req, res) => {
            const {id} = req.params;
            const searchPayload = {id};
            const [task] = database.select('tasks', searchPayload);

            if (!task) return res.writeHead(404).end('Tarefa não encontrada');

            const now = new Date();
            const payload = {
                ...task,
                completed_at: !!task.completed_at ? null : now,
                updated_at: now
            };

            database.update('tasks', id, payload);

            return res.writeHead(204).end();
        }
    },
];
