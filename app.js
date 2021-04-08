

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-uddesh:P0o9i8u7y6y5@cluster0.6noej.mongodb.net/todolistDB",{useNewUrlParser: true, useUnifiedTopology: true} );

const itemsSchema = ({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Hit the + button to add a new item"
});
const item2 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {


    Item.find({}, function(err, foundItems){

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("SUCCESSFULLY SAVED DEFAULT ITEMS TO DB.");
                }
            });
            res.redirect("/")
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });
});

/*app.get("/:customListName", function (req, res) {
    const customListName = req.params.customListName;

    List.findOne({name: customListName}, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                    });
            
                list.save();
            }else{
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    })

    
});*/

app.post("/", function (req, res) {

    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
    

});

app.post("/delete", function (req, res) {
    const checkedid = req.body.checkbox;

    Item.findByIdAndRemove(checkedid, function(err) {
        if (!err){
            console.log("deleted");
            res.redirect("/");
        }
    });
});

app.listen(3000, function () {
  console.log('This app listening on port 3000!');
});