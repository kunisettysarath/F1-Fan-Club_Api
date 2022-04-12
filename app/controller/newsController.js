const News = require('../models/news');

exports.news = (req, res) => {
    News.find({}, (err, data) => {
        if (err) {
            res.send({
                err
            });
        }
        res.send({
            data: data
        });
    })
}
exports.newsDetails = (req, res) => {
    let newsId = req.query.newsId;
    let news = News.findOne({
        "_id": newsId
    }, (err, data) => {
        res.send({
            data: data
        })
    });
}