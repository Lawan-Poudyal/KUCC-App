import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});
