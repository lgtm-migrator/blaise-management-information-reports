import app from "./Server";

const port: string = process.env.PORT || "5004";

app.listen(port);

console.log("App is listening on port " + port);

