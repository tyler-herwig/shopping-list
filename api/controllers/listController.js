const { List, sequelize } = require('../models');

exports.createList = async (req, res) => {
    const { name, description, userId } = req.body;

    try {
        const existingList = await List.findOne({ where: { name } });
        if (existingList) return res.sendStatus(409);

        const list = await List.create({ name, description, userId });
        res.json({ message: "List created successfully!", list });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

exports.getLists = async (req, res) => {
    const { userId } = req.query;
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const total = await List.count({
            where: { userId }
        });

        const lists = await List.findAll({
            where: { userId },
            attributes: [
                'id', 'name', 'description', 'userId',
                [sequelize.literal(`(SELECT COUNT(*) FROM listitems WHERE listitems.listId = List.id)`), 'listItemCount']
            ],
            limit,
            offset,
            group: ['List.id']
        });

        if (!lists || lists.length === 0) {
            return res.sendStatus(404);
        }

        res.json({
            lists,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

exports.getListById = async (req, res) => {
    try {
        const list = await List.findByPk(req.params.id);
        if (!list) return res.sendStatus(404);

        res.json({ list });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

exports.updateList = async (req, res) => {
    try {
        const list = await List.findByPk(req.params.id);
        if (!list) return res.sendStatus(404);

        Object.assign(list, req.body);
        await list.save();

        res.json({ message: "List updated successfully!", list });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

exports.deleteList = async (req, res) => {
    try {
        const list = await List.findByPk(req.params.id);
        if (!list) return res.sendStatus(404);

        await list.destroy();
        res.json({ message: "List deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};