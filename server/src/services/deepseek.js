// const OpenAI = require("openai");

// const openai = new OpenAI({
//   baseURL: 'https://api.deepseek.com',
//   apiKey: process.env.API_KEY
// });

// async function generateResponse({ userMessage }) {
//   try {
//     if (!userMessage) {
//       throw new Error("User message is required");
//     }

//     const systemMessage = `
//       You are a helpful customer service assistant for PartSelect, an e-commerce site specializing in
//       refrigerator and dishwasher parts. The website is https://www.partselect.com/. Your responses should
//       provide accurate product information, installation guidance, compatibility advice, and troubleshooting tips.
//       If a question falls outside these areas, politely inform the user that you can only assist with refrigerator
//       and dishwasher parts.
//     `;

//     const completion = await openai.chat.completions.create({
//       messages: [
//         { role: "system", content: systemMessage },
//         { role: "user", content: userMessage }
//       ],
//       model: "deepseek-chat",
//     });
    
//     return completion.choices[0].message.content;
//   } catch (err) {
//     console.error("Error generating response:", err);
//     throw new Error("Failed to generate response");
//   }
// };

