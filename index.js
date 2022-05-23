const expess = require("express");
const app = expess();
const joi = require("joi");

const helmet = require("helmet")
const morgan = require("morgan")

// Dot securtiy
require("dotenv").config()

// middleweres callbacks
const authMiddlewere = require("./middlewere/auth.js")
const logerMiddlewere = require("./middlewere/logger.js");
const express = require("express");
app.use(logerMiddlewere)
app.use(authMiddlewere)

// req.body ni json qip beradi
app.use(expess.json());
// urelcoded request
app.use(express.urlencoded({extended: true}));

// http header security middlewere
app.use(helmet())

// Logger
if(app.get("env") === "development"){
app.use(morgan("tiny"))
}




const products = [
  { name: "tarvuz", id: 1 },
  { name: "qovun", id: 2 },
  { name: "qovoq", id: 3 },
];

app.get("/products/:id", (req, res) => {
  console.log(req.params.id);
  let product = products.find((product) => product.id == req.params.id);
  if (!product) {
    res.status(400).send("Bu id li maxsulot topilmadi ");
    return;
  }
  res.status(200).send(product);
});
app.get("/products", (req, res) => {
  res.status(200).send(products);
});
// post methot
app.post("/products/add", (req, res) => {
  const schema = joi.object({
    name: joi.string().min(3).required(),
  });

  let result = schema.validate(req.body);
  if (result.error) {
    res.send(result.error.message).status(400);
  }
  const newProduct = {
    name: req.body.name,
    id: products.length + 1,
  };
  products.push(newProduct);
  res.status(201).send(products);
});
// put methot
app.put("/products/update/:id", (req, res) => {
  const idx = products.findIndex((product) => product.id == req.params.id);
  const schema = joi.object({
    name: joi.string().min(3).required(),
  });
  let result = schema.validate(req.body);
  if (result.error) {
    res.send(result.error.message).status(400);
  }
  const updateProduct = {
    name: req.body.name,
    id: req.params.id,
  };

  const product = products[idx] = updateProduct;

  res.send(product).status(201);
});
// delete methot
app.delete("/products/delete/:id", (req, res)=>{
    const idx = products.findIndex((product) => product.id == req.params.id);
    if (idx == -1) {
        res.status(400).send("Bu id li maxsulot topilmadi ");
        return;
      }
      const sum = products.splice(idx, 1)
      res.status(200).send(sum)
})

try {
  const port = process.env.port || 3000;
  app.listen(port, () => {
    console.log(`server working on port ${port}`);
  });
} catch (error) {
  console.log(error);
}
