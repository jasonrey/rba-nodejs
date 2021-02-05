const supertest = require('supertest');
const mongoose = require('mongoose');
const Task = require('../models/task');
const app = require('../app');

afterAll(async () => {
  await mongoose.disconnect();
});

const taskSaveSpy = jest.spyOn(Task.prototype, 'save');

afterEach(() => {
  taskSaveSpy.mockClear();
});

describe('task', () => {
  describe('POST /task', () => {
    test('create task', async () => {
      const res = await supertest(app).post('/task').send({
        title: 'milk',
      });

      expect(res.status).toBe(200);
      expect(typeof res.body.id).toBe('string');
      expect(taskSaveSpy.mock.calls.length).toBe(1);
    });

    test('missing title', async () => {
      const res = await supertest(app).post('/task').send();

      expect(res.status).toBe(400);
      expect(taskSaveSpy.mock.calls.length).toBe(1);
    });
  });

  describe('GET /task/:id', () => {
    test('get task', async () => {
      const task = await Task.findOne();

      const res = await supertest(app).get(`/task/${task._id}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(task._id.toString());
      expect(res.body.title).toBe(task.title);
    });

    test('no task item', async () => {
      const res = await supertest(app).get(`/task/0123456789abcdef01234567`);

      expect(res.status).toBe(200);
      expect(res.body).toBe(null);
    });
  });

  describe('PUT /task/:id', () => {
    test('update task', async () => {
      const task = await Task.findOne();
      const newTitle = Math.random().toString();

      const res = await supertest(app).put(`/task/${task._id}`).send({
        title: newTitle,
      });

      const updatedTask = await Task.findOne({
        _id: task._id,
      });

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(task._id.toString());
      expect(updatedTask.title).toBe(newTitle);
      expect(taskSaveSpy.mock.calls.length).toBe(1);
    });

    test('no task item', async () => {
      const res = await supertest(app)
        .put(`/task/0123456789abcdef01234567`)
        .send({
          title: Math.random().toString(),
        });

      expect(res.status).toBe(400);
      expect(taskSaveSpy.mock.calls.length).toBe(0);
    });
  });

  describe('DELETE /task/:id', () => {
    test('delete task', async () => {
      const task = await Task.findOne();

      const res = await supertest(app).delete(`/task/${task._id}`);

      expect(res.status).toBe(200);
      expect(res.body.state).toBe(true);
    });
  });
});
