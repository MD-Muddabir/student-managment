// Post Controller

function index(req, res) {
    const post = "Posts list"
    res.send(post);
}

module.exports = {
    index: index
}