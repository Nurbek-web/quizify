const express = require("express");
require("dotenv").config();

const app = express();
const port = 3001;
var cors = require("cors");

app.use(express.json()); // for the body of the request
app.use(cors());

const API_KEY = "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";
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: API_KEY });

app.post("/api", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        { role: "user", content: req.body.message },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });
    console.log(completion.choices[0].message.content);
    res.json({ results: completion.choices[0].message.content });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
