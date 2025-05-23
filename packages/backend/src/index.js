import Fastify from 'fastify';
import { prisma } from './prisma.js';
import { contentQueue } from './queue.js';

const app = Fastify();
app.get('/health', async () => ({ ok: true }));

app.get('/posts', async () => {
  return prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
});

app.post('/posts', async (req, reply) => {
  const { title, body } = req.body;
  const post = await prisma.post.create({ data: { title, body } });
  reply.code(201).send(post);
});

app.post('/generate', async (req, reply) => {
  const { title, keywords = [] } = req.body;
  if (!title) return reply.code(400).send({ error: 'title is required' });

  await contentQueue.add('generate-post', { title, keywords });
  reply.code(202).send({ queued: true });
});

app.listen({ port: 3000, host: '0.0.0.0' })
  .then(() => console.log('API listening on http://localhost:3000'))
  .catch(console.error);
