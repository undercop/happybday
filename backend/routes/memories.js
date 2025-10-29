const express = require('express');
const router = express.Router();
const Memory = require('../models/Memory');

// Get all memories
router.get('/', async (req, res) => {
  try {
    const memories = await Memory.find().sort({ date: -1 });
    res.json(memories);
  } catch (error) {
    console.error('Error fetching memories:', error);
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
});

// Get single memory
router.get('/:id', async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    res.json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memory' });
  }
});

// Create new memory
router.post('/', async (req, res) => {
  try {
    const { imageUrl, caption, date } = req.body;
    
    const newMemory = new Memory({
      imageUrl,
      caption,
      date: new Date(date)
    });

    await newMemory.save();
    res.status(201).json(newMemory);
  } catch (error) {
    console.error('Error creating memory:', error);
    res.status(500).json({ error: 'Failed to create memory' });
  }
});

// Delete memory
router.delete('/:id', async (req, res) => {
  try {
    await Memory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});

module.exports = router;