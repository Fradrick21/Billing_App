const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/products", require("./routes/productRoutes"));
app.use("/bills", require("./routes/billingRoutes"));
app.use("/reports", require("./routes/reportRoutes"));
app.use("/auth", require("./routes/authRoutes"));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
