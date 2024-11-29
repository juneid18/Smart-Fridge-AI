const { GoogleGenerativeAI } = require("@google/generative-ai");

const GenerateContent = async (prompt) => {
    try {
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBcajbdnspcW_xNqkeu4mjHTzB_FT0YO7Q';

      if (!apiKey) {
        throw new Error("API key is missing.");
      }
  
      const genAI = new GoogleGenerativeAI(apiKey);
  
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
        const result = await model.generateContent([prompt]);
        
        return(result.response.text()); // return the response state
      } catch (error) {
        console.error("Error generating content:", error);
      }
}

export default GenerateContent;