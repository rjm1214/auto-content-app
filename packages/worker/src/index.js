import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { connection } from '../../backend/src/queue.js';  // shared config
dotenv.config();

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const jobWorker = new Worker(
  'content',
  async job => {
    const { title, keywords } = job.data;

    // Call OpenAI (simple prompt)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a concise blog writer.' },
        {
          role: 'user',
          content: `Write a 200-word blog post titled "${title}" covering keywords: ${keywords.join(
            ', '
          )}.`
        }
      ]
    });

    const body = completion.choices[0].message.content.trim();

    // Save to Postgres
    await prisma.post.create({ data: { title, body } });
  },
  { connection }
);

jobWorker.on('completed', j => console.log(`Job ${j.id} done`));
jobWorker.on('failed', (j, e) => console.error(`Job ${j.id} failed`, e));
console.log('Worker listening for jobs...');
