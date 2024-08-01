import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'mangas.json');

function readMangas() {
  const fileData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(fileData);
}

function writeMangas(data: any) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      const mangas = readMangas();
      const manga = mangas.find((manga: any) => manga.id === parseInt(id));
      if (manga) {
        res.status(200).json(manga);
      } else {
        res.status(404).json({ error: 'Manga not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch manga' });
    }
  } else if (req.method === 'PUT') {
    const { title, description, image } = req.body;

    if (typeof title !== 'string' || typeof description !== 'string' || typeof image !== 'string') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const mangas = readMangas();
      const index = mangas.findIndex((manga: any) => manga.id === parseInt(id));
      if (index > -1) {
        mangas[index] = { ...mangas[index], title, description, image };
        writeMangas(mangas);
        res.status(200).json(mangas[index]);
      } else {
        res.status(404).json({ error: 'Manga not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update manga' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const mangas = readMangas();
      const filteredMangas = mangas.filter((manga: any) => manga.id !== parseInt(id));
      writeMangas(filteredMangas);
      res.status(204).end(); // No Content
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete manga' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
