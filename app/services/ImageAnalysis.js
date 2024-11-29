import axios from "axios";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

export default async function analyzeImageWithGemini(imageUri) {
  try {
    // Retrieve API key from environment configuration
    const apiKey = Constants.expoConfig?.extra?.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not configured");
    }

    // Resolve the image file URI
    // const imageAsset = Asset.fromModule(require("../../assets/images/fridge-inline-today-160428.jpg"));
    // await imageAsset.downloadAsync();
    // const imageUri = imageAsset.localUri || imageAsset.uri;

    // Convert the image to Base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Updated endpoint using gemini-1.5-flash model
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Construct the request payload
    const requestPayload = {
      contents: [
        {
          parts: [
            {
              text: "Analyze the image and identify the items in it along with their quantities. Only include items that are edible or can be stored in the fridge. Provide the results in a JSON format with Item_name and quantity.",
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    // Send the POST request
    const response = await axios.post(geminiEndpoint, requestPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log the entire response to inspect its structure
    // console.log("Gemini API Full Response:", JSON.stringify(response.data, null, 2));

    // Extract the text response and strip Markdown code block formatting
    const textResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (textResponse) {
      try {
        // Remove the Markdown code block formatting ( json ...  )
        const cleanedTextResponse = textResponse
          .replace(/^```json\s*|\s*```$/g, "")
          .trim();
        // Parse the cleaned JSON string
        const analysisResult = JSON.parse(cleanedTextResponse);

        return analysisResult; // Return the parsed result (should contain 'items' array)
      } catch (parseError) {
        console.error("Failed to parse the text response as JSON", parseError);
        return "Error: Unable to parse the analysis response.";
      }
    } else {
      return "No valid response from Gemini API";
    }
  } catch (error) {
    // Comprehensive error logging
    console.error("Full Error Details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    throw error;
  }
}
