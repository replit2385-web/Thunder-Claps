import { Router } from "express";
import { GenerateBlendBody } from "@workspace/api-zod";

const router = Router();

router.post("/blend", async (req, res) => {
  const body = GenerateBlendBody.parse(req.body);

  const style = body.style ?? "romantic impressionist painting";
  const prompt = `A beautiful artistic portrait of two people in love, ${body.partner1} and ${body.partner2}, ${style}, warm golden light, intimate moment, soft bokeh background`;
  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 99999)}`;

  res.json({ imageUrl, prompt });
});

export default router;
