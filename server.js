var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();


var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.findbyid = function(id) {
   var found = this.items.filter(function(item){
     
    return item.id === Number(id)
    });
    if (found.length) {
      return found[0]
    }else{
      return null
    }
};

Storage.prototype.findindex = function(id) {
   var index = -1
   this.items.forEach(function(item, i){
     
    if (item.id === Number(id)){
      index = i
    }
    });
    return index
};


Storage.prototype.delete = function(id) {
  var index = this.findindex(id)
  if (index > -1) {
    this.items.splice(index,1)
    return true
  }
 
};


Storage.prototype.put = function(item) {
  var index = this.findindex(item.id)
  if (index > -1) {
    this.items.splice(index,1,item)
    return true
  }
  this.items.push(item)
  return true
};


var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
    var item = storage.findbyid(req.params.id)
    if (!item) {
        return res.sendStatus(400);
    }
    storage.delete(item.id)
    res.status(200).json(item);
});

app.put('/items/:id', jsonParser, function(req, res) {
    storage.put(req.body)
    res.status(200).json(req.body);
});


app.listen(process.env.PORT || 8080);