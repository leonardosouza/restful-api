module.exports = function(app, TodoModel) {
  app.get('/todos', (req, res) => {
    TodoModel.find({}, (err, docs) => {
      if (err) res.sendStatus(404)
      res.json(docs)
    })
  })

  app.get('/todos/:id', (req, res) => {
    TodoModel.findById(req.params.id, (err, docs) => {
      if (err) res.sendStatus(404)
      res.status(200).json(docs)
    })
  })

  app.post('/todos', (req, res) => {
    TodoModel.create(req.body, (err, docs) => {
      if (err) res.sendStatus(412)
      res.status(201).json(docs)
    })
  })

  app.put('/todos/:id', (req, res) => {
    TodoModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
      if (err) res.sendStatus(404)
      res.sendStatus(204)
    })
  })
  
  app.delete('/todos/:id', (req, res) => {
    TodoModel.findByIdAndRemove(req.params.id, (err) => {
      if (err) res.sendStatus(404)
      res.sendStatus(204)
    })
  })
}
