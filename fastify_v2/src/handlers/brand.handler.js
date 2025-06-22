const brandService = require('../services/brand.service');

async function getAll(req, res) {
  try {
    const result = await brandService.getAll(req.server.mysql);
    res.send(result);
  } catch (err) {
    console.error('Database error: ', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
async function getAllIsDelete(req, res) {
  try {
    const result = await brandService.getAllIsDelete(req.server.mysql);
    res.send(result);
  } catch (err) {
    console.error('Database error: ', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
function getOne(req, res) {
  const id = req.params.id;
  brandService.getOne(this.mysql, id)
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
async function createBrand(req, res) {
  const { name } = req.body;
  if (!name) {
      res.status(400).send({ error: 'Missing required field: name' });
      return;
  }

  try {
      const result = await brandService.createBrand(req.server.mysql, name);
      res.status(201).send({ message: 'Brand created successfully', id: result.id });
  } catch (err) {
      console.error('Database error:', err);

      if (err.message === 'Brand already exists') {
          res.status(400).send({ error: 'Tên Thương hiệu đã tồn tại' });
      } else {
          res.status(500).send({ error: 'Internal Server Error' });
      }
  }
}

async function updateBrand(req, res) {
  const { name } = req.body;
  const id = req.params.id;

  if (!name) {
    res.status(400).send({ error: 'Missing required field: name' });
    return;
  }

  try {
    const result = await brandService.updateBrand(req.server.mysql, id, name);

    if (!result) {
      res.status(404).send({ error: 'Brand not found' });
      return;
    }

    res.send({ message: 'Brand updated successfully', id: result.id });
    
  } catch (err) {
    console.error('Database error:', err);
    if (err.message === 'Brand already exists') {
      res.status(400).send({ error: 'Tên Thương hiệu đã tồn tại' });
    } else {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}


async function deleteBrand(req, res) {
  const id = req.params.id;

  try {
    const result = await brandService.deleteBrand(req.server.mysql, id);
    if (!result) {
      res.status(404).send({ error: 'Brand not found' });
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
      return res.status(400).send({ error: 'Invalid Brand ID' });
    }

    const result = await brandService.softDelete(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'Brand not found or already deleted' });
    }

    res.send({ message: 'Brand soft-deleted successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

async function restore(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid Brand ID' });
    }

    const result = await brandService.restore(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'Brand not found or already deleted' });
    }

    res.send({ message: 'Brand soft-deleted successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getAll,
  getOne,
  createBrand,
  updateBrand,
  deleteBrand,
  getAllIsDelete,
  restore,
  IsDelete
};
