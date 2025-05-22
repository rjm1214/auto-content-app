import Fastify from 'fastify';
import { prisma } from './prisma.js';

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

app.listen({ port: 3000, host: '0.0.0.0' })
  .then(() => console.log('API listening on http://localhost:3000'))
  .catch(console.error);
