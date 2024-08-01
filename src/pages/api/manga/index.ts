import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'mangas.json');
const counterPath = path.join(process.cwd(), 'data', 'counter.json');

function readMangas() {
  const fileData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(fileData);
}

function writeMangas(data: any) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function readCounter() {
  const fileData = fs.readFileSync(counterPath, 'utf8');
  return JSON.parse(fileData);
}

function writeCounter(data: any) {
  fs.writeFileSync(counterPath, JSON.stringify(data, null, 2));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, description, image } = req.body;

    if (typeof title !== 'string' || typeof description !== 'string' || typeof image !== 'string') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const mangas = readMangas();
      const counter = readCounter();
      const newId = counter.mangaId + 1;

      const newManga = { id: newId, title, description, image };
      mangas.push(newManga);
      writeMangas(mangas);

      // Update the counter
      counter.mangaId = newId;
      writeCounter(counter);

      res.status(201).json(newManga);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create manga' });
    }
  } else if (req.method === 'GET') {
    try {
      const mangas = readMangas();
      res.status(200).json(mangas);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch mangas' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
