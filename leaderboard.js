const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../leaderboard.json");

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    const data = JSON.parse(fs.readFileSync(filePath));
    return { statusCode: 200, body: JSON.stringify(data) };
  }

  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);
    const data = JSON.parse(fs.readFileSync(filePath));

    data.push(body);
    data.sort((a, b) => b.score - a.score);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return { statusCode: 200, body: "Saved" };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
