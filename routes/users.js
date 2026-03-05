const express = require('express');
const router = express.Router();
const { dataRole, dataUser } = require('../utils/data2');

// list all users (skip deleted)
router.get('/', (req, res) => {
  const result = dataUser.filter(u => !u.isDeleted);
  res.send(result);
});

// get single user by username
router.get('/:username', (req, res) => {
  const username = req.params.username;
  const found = dataUser.filter(u => u.username == username && !u.isDeleted);
  if (found.length) {
    res.send(found[0]);
  } else {
    res.status(404).send({ message: 'USER NOT FOUND' });
  }
});

// create new user
router.post('/', (req, res) => {
  // simple duplicate check
  if (dataUser.some(u => u.username === req.body.username)) {
    return res.status(400).send({ message: 'USERNAME ALREADY EXISTS' });
  }
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl || '',
    status: req.body.status === undefined ? true : req.body.status,
    loginCount: req.body.loginCount || 0,
    role: req.body.role || null,
    creationAt: new Date(),
    updatedAt: new Date(),
  };
  dataUser.push(newUser);
  res.send(newUser);
});

// update user
router.put('/:username', (req, res) => {
  const username = req.params.username;
  const found = dataUser.filter(u => u.username == username && !u.isDeleted);
  if (found.length) {
    const user = found[0];
    Object.keys(req.body).forEach(key => {
      if (key !== 'username' && user.hasOwnProperty(key)) {
        user[key] = req.body[key];
      }
    });
    user.updatedAt = new Date();
    res.send(user);
  } else {
    res.status(404).send({ message: 'USER NOT FOUND' });
  }
});

// delete user (soft)
router.delete('/:username', (req, res) => {
  const username = req.params.username;
  const found = dataUser.filter(u => u.username == username && !u.isDeleted);
  if (found.length) {
    const user = found[0];
    user.isDeleted = true;
    user.updatedAt = new Date();
    res.send(user);
  } else {
    res.status(404).send({ message: 'USER NOT FOUND' });
  }
});

module.exports = router;
