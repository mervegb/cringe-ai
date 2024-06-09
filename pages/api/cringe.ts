// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt missing' });
  }

  if (prompt.length > 100) {
    return res.status(400).json({ error: 'Prompt too long' });
  }

  const completion = await openai.completions.create({
    model: 'text-davinci-003',
    prompt: `Create a cringy motivational quote based on the following topic.\n
    Topic: ${prompt}\n
    Cringy motivational quote:`,
    max_tokens: 500,
    temperature: 1,
    presence_penalty: 0, 
    frequency_penalty: 0,
  });

  //Temperature => controls the randomness of the output, value of 1 means the output will be fairly random
  //Prompt => input text that model uses as starting point to generate response
  //Presence penalty => adjusts the model's likelihood to talk about new topics, higher values encourage the model to explore new topics more frequently, lower values make it stick to given topics more closely
  //Frequency penalty => adjusts the model's likelihood to repeat the same phrases

  const quote = completion.choices[0].text;
  res.status(200).json({ quote });
}
