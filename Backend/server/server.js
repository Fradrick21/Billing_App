const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", require("../routes/productRoutes"));
app.use("/bills", require("../routes/billingRoutes"));
app.use("/reports", require("../routes/reportRoutes"));

app.listen(5000, () => console.log("Server running on 5000"));
