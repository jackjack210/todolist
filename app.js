
const dotenv = require('dotenv'); 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

dotenv.config({path:'./config.env'});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const db = process.env.database;
mongoose.connect(db,{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true} );

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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
  console.log('SERVER IS RUNNING');
});