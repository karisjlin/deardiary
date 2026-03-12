import { app } from "./app.js";
import { checkDatabaseConnection } from "./config/db.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  void checkDatabaseConnection()
    .then(() => {
      console.log("Database connection established");
    })
    .catch((error: Error & { code?: string }) => {
      if (error.code === "ECONNREFUSED") {
        console.error("Database unavailable on the configured host/port.");
        return;
      }

      console.error("Database connection failed", error);
    });
});
