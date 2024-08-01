import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'chapters.json');

function readChapters() {
  const fileData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(fileData);
}

function writeChapters(data: any) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      const chapters = readChapters();
      const chapter = chapters.find((chapter: any) => chapter.id === parseInt(id));
      if (chapter) {
        res.status(200).json(chapter);
      } else {
        res.status(404).json({ error: 'Chapter not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chapter' });
    }
  } else if (req.method === 'PUT') {
    const { title, chapterNumber, imageUrls, mangaId } = req.body;

    if (
      typeof title !== 'string' ||
      typeof chapterNumber !== 'number' ||
      !Array.isArray(imageUrls) ||
      typeof mangaId !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const chapters = readChapters();
      const index = chapters.findIndex((chapter: any) => chapter.id === parseInt(id));
      if (index > -1) {
        chapters[index] = { ...chapters[index], title, chapterNumber, imageUrls, mangaId };
        writeChapters(chapters);
        res.status(200).json(chapters[index]);
      } else {
        res.status(404).json({ error: 'Chapter not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update chapter' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const chapters = readChapters();
      const filteredChapters = chapters.filter((chapter: any) => chapter.id !== parseInt(id));
      writeChapters(filteredChapters);
      res.status(204).end(); // No Content
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete chapter' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
