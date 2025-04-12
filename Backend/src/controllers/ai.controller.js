const aiServices = require("../services/ai.services");

module.exports.getReview = async (req, res) => {
  const code = req.body.code; // ✅ changed to req.body.code to get the code from the request body

  if (!code) {
    return res.status(400).send({ error: "code is required" });
  }

  try {
    const response = await aiServices.generateContent(code); // ✅ fixed this line
    res.send({ response });
  } catch (error) {
    console.error("AI Service Error:", error);
    res.status(500).send({ error: "Something went wrong with AI generation" });
  }
};
