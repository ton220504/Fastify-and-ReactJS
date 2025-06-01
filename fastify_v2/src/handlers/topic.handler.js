const topicService = require("../services/topic.service");

async function getAll(req, res) {
    try {
        const topics = await topicService.getAllTopics(req.server.mysql);
        res.send(topics);
    } catch (err) {
        console.error("Error fetching topics:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
async function getAllIsDelete(req, res) {
    try {
        const topics = await topicService.getAllTopicsIsDelete(req.server.mysql);
        res.send(topics);
    } catch (err) {
        console.error("Error fetching topics:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
async function getOne(req, res) {
    try {
        const { id } = req.params;
        const topic = await topicService.getOneTopic(req.server.mysql, id);

        if (!topic) {
            return res.status(404).send({ error: "Topic not found" });
        }
        res.send(topic);
    } catch (err) {
        console.error("Error fetching topic:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function create(req, res) {
    try {
        const topicData = req.body;
        const newTopic = await topicService.createTopic(req.server.mysql, topicData);
        res.status(201).send(newTopic);
    } catch (err) {
        console.error("Error creating topic:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        const topicData = req.body;

        const result = await topicService.updateTopic(req.server.mysql, id, topicData);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Topic not found" });
        }

        res.send({ message: "Topic updated successfully" });
    } catch (err) {
        console.error("Error updating topic:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function remove(req, res) {
    try {
        const { id } = req.params;

        const result = await topicService.deleteTopic(req.server.mysql, id);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Topic not found" });
        }

        res.send({ message: "Topic deleted successfully" });
    } catch (err) {
        console.error("Error deleting topic:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
async function IsDelete(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid topic ID' });
    }

    const result = await topicService.softDelete(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'topic not found or already deleted' });
    }

    res.send({ message: 'topic soft-deleted successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
async function restore(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid topic ID' });
    }

    const result = await topicService.restore(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'topic not found or already deleted' });
    }

    res.send({ message: 'topic soft-deleted successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
    getAllIsDelete,
    restore,
    IsDelete
};
