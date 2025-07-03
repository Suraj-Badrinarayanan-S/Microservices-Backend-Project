const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/users')
.then(()=>console.log('Connected to mongodb')).catch((err)=> console.log(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String
});
const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', async (req,res) => {
  try {
    const users = await User.find();
    res.json(users);
  }
  catch(err) {
    res.status(500).json({message: 'Error fetching users'});
  }
});

app.post('/users', async (req,res) => {
  const { name, email } = req.body;
  try {
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  }
  catch(err){
    console.error(err);
    res.status(400).send({ message: 'Invalid request' });
  }
})

app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`);
});