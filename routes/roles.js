const express = require('express');
const router = express.Router();
const { dataRole, dataUser } = require('../utils/data2');

// helper to generate next role id like r<number>
function genRoleId() {
  let max = 0;
  dataRole.forEach(r => {
    const n = parseInt(r.id.replace(/^r/, ''), 10);
    if (!isNaN(n) && n > max) max = n;
  });
  return 'r' + (max + 1);
}


router.get('/', (req, res) => {
  const result = dataRole.filter(r => !r.isDeleted);
  res.send(result);
});

// get role by id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const found = dataRole.filter(r => r.id == id && !r.isDeleted);
  if (found.length) {
    res.send(found[0]);
  } else {
    res.status(404).send({ message: 'ID NOT FOUND' });
  }
});

// get users with role
router.get('/:id/users', (req, res) => {
  const id = req.params.id;
  const roleExists = dataRole.some(r => r.id == id && !r.isDeleted);
  if (!roleExists) {
    return res.status(404).send({ message: 'ROLE NOT FOUND' });
  }
  const users = dataUser.filter(u => u.role && u.role.id == id && !u.isDeleted);
  res.send(users);
});

// create role
router.post('/', (req, res) => {
  const newRole = {
    id: genRoleId(),
    name: req.body.name,
    description: req.body.description,
    creationAt: new Date(),
    updatedAt: new Date(),
  };
  dataRole.push(newRole);
  res.send(newRole);
});

// update role
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const found = dataRole.filter(r => r.id == id && !r.isDeleted);
  if (found.length) {
    const role = found[0];
    Object.keys(req.body).forEach(key => {
      if (key !== 'id' && role.hasOwnProperty(key)) {
        role[key] = req.body[key];
      }
    });
    role.updatedAt = new Date();
    res.send(role);
  } else {
    res.status(404).send({ message: 'ID NOT FOUND' });
  }
});

// delete role (soft delete)
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const found = dataRole.filter(r => r.id == id && !r.isDeleted);
  if (found.length) {
    const role = found[0];
    role.isDeleted = true;
    role.updatedAt = new Date();
    res.send(role);
  } else {
    res.status(404).send({ message: 'ID NOT FOUND' });
  }
});

module.exports = router;
