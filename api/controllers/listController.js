const { List } = require('../models');

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
    try {
        const lists = await List.findAll({ where: { userId } });
        if (!lists.length) return res.sendStatus(404);

        res.json({ lists });
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