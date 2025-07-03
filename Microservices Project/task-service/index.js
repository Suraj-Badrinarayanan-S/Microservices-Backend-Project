const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/tasks')
.then(()=>console.log('Connected to mongodb')).catch((err)=> console.log(err));

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: String,
  date: {
    type: Date,
    default: Date.now
  }
});
const Task = mongoose.model('Task', taskSchema);

let channel, connection;
async function connectRabbitMQWithRetry(retries = 5, delay = 3000) {
  while (retries) {
    try {
      connection = await amqp.connect('amqp://rabbitmq');
      channel = await connection.createChannel();
      await channel.assertQueue('task_created');
      console.log('Connected to RabbitMQ');
    }
    catch(err) {
      console.error(err);
      retries--;
      console.log(`Failed to connect to RabbitMQ. Retries left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
app.get('/tasks', async (req,res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  }
  catch(err) {
    res.status(500).json({message: 'Error fetching users'});
  }
});

app.post('/tasks', async (req,res) => {
  const { title, description, completed, date } = req.body;
  try {
    const task = new Task({ title, description, completed, date });
    await task.save();
    const message = { taskId: task._id, title, description, completed, date };
    if(!channel) {
      return res.status(503).json({
        message: 'Service unavailable. RabbitMQ connection not established.'
      });
    }
    channel.sendToQueue('task_created', Buffer.from(JSON.stringify(message)));
    res.status(201).json(task);
  }
  catch(err){
    console.error(err);
    res.status(400).send({ message: 'Invalid request' });
  }
})
app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`);
  connectRabbitMQWithRetry();
});