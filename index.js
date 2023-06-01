const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();


// Connect to MongoDB


cors("import")
const url=process.env.ATLAS_URL;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log("Database connection successful")

app.listen(8001,()=>{

    console.log("app running Successfuy")
})
}).catch((error) => {
    console.error("Database connection error:", error);
  })

// Create a Mongoose schema for Skill
const skillSchema = new mongoose.Schema({
  name: String,
  archived: Boolean,
  tags: [String]
});

// Create a Mongoose model for Skill
const Skill = mongoose.model('Skill', skillSchema);

// Create a Mongoose schema for Tag
const tagSchema = new mongoose.Schema({
  name: String,
  archived: Boolean,
});

// Create a Mongoose model for Tag
const Tag = mongoose.model('Tag', tagSchema);

// Create a Mongoose schema for Employee
const employeeSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  doj: Date,
  dob: Date,
  skills: [String],
  

 
});

// Create a Mongoose model for Employee
const Employee = mongoose.model('Employee', employeeSchema);

// Create an Express app
const app = express();

// Parse JSON request bodies
app.use(bodyParser.json());

// Skills CRUD

// Create a skill
app.post('/skills', async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// Read all skills
app.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve skills' });
  }
});

// Update a skill
app.put('/skills/:id', async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// Delete a skill
app.delete('/skills/:id', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// Tags CRUD

// Create a tag
app.post('/tags', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tag' });
  }
});

// Read all tags
app.get('/tags', async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tags' });
  }
});

// Employees CRUD

// Create an employee
app.post('/employees', async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

//Read The All Empolyee 
app.get('/employees', async (req, res) => {
  try {
    const employee = await Employee.find();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve skills' });
  }
});

// Update The All Empolyee 
app.put('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});


// Delete a Employee
app.delete('/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

employeeSchema.virtual('age').get(function () {
  const dob = this.dob;
  const now = new Date();
  const ageTime = now.getTime() - dob.getTime();
  const ageYears = Math.floor(ageTime / (1000 * 60 * 60 * 24 * 365));
  return ageYears;
});


// Filter employees by skills
app.get('/employees', async (req, res) => {
  try {
    const skills = req.query.skills.split(',');
    const employees = await Employee.find({ skills: { $in: skills } });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve employees' });
  }
});

// Sort employees by name
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve employees' });
  }
});

// Dashboard API

// Total employees count
app.get('/dashboard', async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    res.json({ totalEmployees });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve total employees count' });
  }
});

// Top 5 tags with employee count
app.get('/dashboard', async (req, res) => {
  try {
    const tagCounts = await Employee.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $lookup: { from: 'tags', localField: '_id', foreignField: 'name', as: 'tag' } },
      { $unwind: '$tag' },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.json(tagCounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve top tags with employee count' });
  }
});

// Top 5 skills with employee count
app.get('/dashboard', async (req, res) => {
  try {
    const skillCounts = await Employee.aggregate([
      // { $unwind: '$skills' },
      // { $group: { _id: '$skills', count: { $sum: 1 } } },
      // { $sort: { count: -1 } },
      // { $limit: 5 },
      {
        '$count': 'string'
      }
    ]);
    res.json(skillCounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve top skills with employee count' });
  }
});





