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
  if (req.method === 'POST') {
    const { title, chapterNumber, imageUrls, mangaId } = req.body;
    
    if (typeof title !== 'string' || typeof chapterNumber !== 'number' || !Array.isArray(imageUrls) || typeof mangaId !== 'number') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const chapters = readChapters();
      const newId = Date.now(); // استخدام معرف طويل

      const newChapter = { id: newId, title, chapterNumber, imageUrls, mangaId };
      chapters.push(newChapter);
      writeChapters(chapters);

      res.status(201).json(newChapter);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create chapter' });
    }
  } else if (req.method === 'GET') {
    try {
      const chapters = readChapters();
      res.status(200).json(chapters);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chapters' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
