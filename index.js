// --------------- Importing Other Files --------------- //
import { app } from "./src/app.js";
import { envProvider } from "./src/constants.js";
import { connectDB } from "./src/database/database.js";

const PORT = envProvider.PORT || 3000;
const BASE_URL = envProvider.BASE_URL || `http://localhost:${PORT}`;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at ${BASE_URL}`);
  });
});