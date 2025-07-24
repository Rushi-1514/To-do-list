import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client ({
  user:"postgres",
  database: "permalist",
  host:"localhost",
  password:"rushi_1514@R",
  port:5432,
})
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get("/",async (req, res) => {
  
let data = await db.query("SELECT * FROM items");
  console.log(data.rows)



  res.render("index.ejs", {
    listTitle: "Today",
    listItems: data.rows,
  });
});

app.post("/add",async  (req, res) => {
  const item = req.body.newItem;
  const data= await db.query("INSERT INTO items (title) VALUES($1) RETURNING *;",[item]);
  res.redirect("/");
});

app.post("/edit",async  (req, res) => {
  
const update_id = req.body.updatedItemId;
const update_title = req.body.updatedItemTitle;
const data= await db.query("UPDATE items SET title = $1 WHERE id = $2",[update_title,update_id]);
console.log(data.rows)
res.redirect("/");


});

app.post("/delete", (req, res) => {
const delete_id =  req.body.deleteItemId;
db.query("DELETE FROM items where id = $1",[delete_id]);
res.redirect("/")


});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
