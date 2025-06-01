const bannerService = require("../services/banner.service");

async function getAll(req, res) {
    try {
        const banners = await bannerService.getAllBanners(req.server.mysql);
        res.send(banners);
    } catch (err) {
        console.error("Error fetching banners:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
async function getAllIsDelete(req, res) {
    try {
        const banners = await bannerService.getAllBannersIsDelete(req.server.mysql);
        res.send(banners);
    } catch (err) {
        console.error("Error fetching banners:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function getOne(req, res) {
    try {
        const { id } = req.params;
        const banner = await bannerService.getOneBanner(req.server.mysql, id);

        if (!banner) {
            return res.status(404).send({ error: "Banner not found" });
        }
        res.send(banner);
    } catch (err) {
        console.error("Error fetching banner:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function create(req, res) {
    try {
        const bannerData = req.body;
        const newBanner = await bannerService.createBanner(req.server.mysql, bannerData);
        res.status(201).send(newBanner);
    } catch (err) {
        console.error("Error creating banner:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        const bannerData = req.body;

        const result = await bannerService.updateBanner(req.server.mysql, id, bannerData);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Banner not found" });
        }

        res.send({ message: "Banner updated successfully" });
    } catch (err) {
        console.error("Error updating banner:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function remove(req, res) {
    try {
        const { id } = req.params;

        const result = await bannerService.deleteBanner(req.server.mysql, id);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: "Banner not found" });
        }

        res.send({ message: "Banner deleted successfully" });
    } catch (err) {
        console.error("Error deleting banner:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
async function IsDelete(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid banner ID' });
    }

    const result = await bannerService.softDelete(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'banner not found or already deleted' });
    }

    res.send({ message: 'banner soft-deleted successfully' });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
async function restore(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ error: 'Invalid banner ID' });
    }

    const result = await bannerService.restore(req.server.mysql, id);

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'banner not found or already deleted' });
    }

    res.send({ message: 'banner soft-deleted successfully' });
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
    IsDelete,
    restore
};
