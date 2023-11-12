import fs from 'node:fs';
import {parse} from 'csv-parse';

const csvPath = new URL('./tasks.csv', import.meta.url);
const stream = fs.createReadStream(csvPath);
const parsedCsv = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2 // ignora a primeira linha do arquivo para não ler o cabeçalho
});

async function importCsvTasks() {
    const lines = stream.pipe(parsedCsv);

    for await (const line of lines) {
        const [title, description] = line;

        await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({title, description})
        });
    }

}

importCsvTasks().then();
