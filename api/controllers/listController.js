const { List, sequelize } = require('../models');

exports.createList = async (req, res) => {
    const { name, description, userId } = req.body;

    if (!name || !userId) {
        return res.status(400).json({ error: "Name and User ID are required." });
    }

    try {
        const existingList = await List.findOne({ where: { name } });
        if (existingList) {
            return res.status(409).json({
                error: "A list with this name already exists. Please choose a different name."
            });
        }

        const list = await List.create({ name, description, userId });
        return res.status(201).json({
            message: "List created successfully!",
            list,
        });
    } catch (err) {
        console.error(err);
        
        if (err.name === "SequelizeValidationError") {
            return res.status(400).json({
                error: err.errors.map((e) => e.message)
            });
        }

        return res.status(500).json({
            error: "An unexpected error occurred. Please try again later.",
            details: err.message,
        });
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