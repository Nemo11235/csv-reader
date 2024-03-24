const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.static("public"));

app.post("/response", (req, res) => {
  res.send("hi");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
