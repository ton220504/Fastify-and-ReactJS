const categoryService = require('../services/category.service');

async function getAll(req, res) {
  try {
    const result = await categoryService.getAll(req.server.mysql);
    res.send(result);
  } catch (err) {
    console.error('Database error: ', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
async function getAllIsDelete(req, res) {
  try {
    const result = await categoryService.getAllIsDelete(req.server.mysql);
    res.send(result);
  } catch (err) {
    console.error('Database error: ', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
function getOne(req, res) {
  const id = req.params.id;
  categoryService.getOne(this.mysql, id)
    .then((result) => {
      if (!result) {
        res.status(404).send({ error: 'Not found' });
        return;
      }
      res.send(result);
    })
    .catch((err) => {
      console.error('Database error: ', err);
      res.status(500).send({ error: 'Internal Server Error' });
    });
}
async function createCategory(req, res) {
  const { name } = req.body;
  if (!name) {
    res.status(400).send({ error: 'Missing required field: name' });
    return;
  }

  try {
    const result = await categoryService.createCategory(req.server.mysql, name);
    res.status(201).send({ message: 'category created successfully', id: result.id });
  } catch (err) {
    console.error('Database error:', err);

      if (err.message === 'category already exists') {
          res.status(400).send({ error: 'Tên Danh mục đã tồn tại' });
      } else {
          res.status(500).send({ error: 'Internal Server Error' });
      }
  }
}
async function updateCategory(req, res) {
  const { name } = req.body;
  const id = req.params.id;

  if (!name) {
    res.status(400).send({ error: 'Missing required field: name' });
    return;
  }

  try {
    const result = await categoryService.updateCategory(req.server.mysql, id, name);
    if (!result) {
      res.status(404).send({ error: 'category not found' });
      return;
    }
    res.send({ message: 'category updated successfully', id: result.id });
  } catch (err) {
    console.error('Database error:', err);
    if (err.message === 'category already exists') {
      res.status(400).send({ error: 'Tên Danh mục đã tồn tại' });
    } else {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}

async function deleteCategory(req, res) {
  const id = req.params.id;

  try {
    const result = await categoryService.deleteCategory(req.server.mysql, id);
    if (!result) {
      res.status(404).send({ error: 'category not found' });
      return;
    }
    res.send(result);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
async function IsDelete(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid category ID' });
    }

    const result = await categoryService.softDelete(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'category not found or already deleted' });
    }

    res.send({ message: 'category soft-deleted successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
async function restore(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid category ID' });
    }

    const result = await categoryService.restore(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'category not found or already deleted' });
    }

    res.send({ message: 'category soft-deleted successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getAll,
  getOne,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllIsDelete,
  IsDelete,
  restore
};
