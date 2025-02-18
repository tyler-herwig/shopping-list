const { ListItem } = require('../models');

exports.createListItem = async (req, res) => {
    try {
        const list_item = await ListItem.create(req.body);
        res.json({ message: "List item created successfully!", list_item });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

exports.getListItems = async (req, res) => {
    try {
        const activeItems = await ListItem.findAll({
            where: {
                list_id: req.query.list_id,
                purchased: false
            }
        });

        const completedItems = await ListItem.findAll({
            where: {
                list_id: req.query.list_id,
                purchased: true
            }
        });

        const totalCost = await ListItem.sum('cost', {
            where: { list_id: req.query.list_id }
        });

        res.json({
            list_items: {
                active: activeItems,
                completed: completedItems
            },
            total_cost: totalCost || 0
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

exports.getListItemById = async (req, res) => {
    try {
        const list_item = await ListItem.findByPk(req.params.id);
        if (!list_item) return res.sendStatus(404);

        res.json({ list_item });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

exports.updateListItem = async (req, res) => {
    try {
        const list_item = await ListItem.findByPk(req.params.id);
        if (!list_item) return res.sendStatus(404);

        Object.assign(list_item, req.body);
        await list_item.save();

        res.json({ message: "Item updated successfully!", list_item });
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