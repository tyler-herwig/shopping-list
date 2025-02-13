const { ListItem } = require('../models');

exports.createListItem = async (req, res) => {
    try {
        const listItem = await ListItem.create(req.body);
        res.json({ message: "List item created successfully!", listItem });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

exports.getListItems = async (req, res) => {
    try {
        const listItems = await ListItem.findAll({ where: { listId: req.query.listId } });
        res.json({ listItems });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

exports.getListItemById = async (req, res) => {
    try {
        const listItem = await ListItem.findByPk(req.params.id);
        if (!listItem) return res.sendStatus(404);

        res.json({ listItem });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

exports.updateListItem = async (req, res) => {
    try {
        const listItem = await ListItem.findByPk(req.params.id);
        if (!listItem) return res.sendStatus(404);

        Object.assign(listItem, req.body);
        await listItem.save();

        res.json({ message: "Item updated successfully!", listItem });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

exports.deleteListItem = async (req, res) => {
    try {
        const listItem = await ListItem.findByPk(req.params.id);
        if (!listItem) return res.sendStatus(404);

        await listItem.destroy();
        res.json({ message: "List item deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};