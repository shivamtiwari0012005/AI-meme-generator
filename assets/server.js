const express = require('express');
const cors = require('cors');
const { GoogleGenAI, Modality } = require('@google/genai');
const fs = require('node:fs'); // Only needed if you want to save the image on the server

const app = express();
const port = 3000;

// Replace with your actual Gemini API key
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyAJjblPirWGTx3O2r47aaxZhwozhsWAngU" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

await main()

app.use(cors());
app.use(express.json()); // to parse JSON request bodies

app.post('/generate-image', async (req, res) => {
    const inputText = req.body.text;

    if (!inputText) {
        return res.status(400).send({ error: 'Please provide text for image generation.' });
    }

    try {
        const response = await model.generateContent({
            contents: inputText,
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        if (response.candidates && response.candidates.length > 0 && response.candidates[0].content.parts && response.candidates[0].content.parts[0].inlineData) {
            const imageData = response.candidates[0].content.parts[0].inlineData.data;
            const mimeType = response.candidates[0].content.parts[0].inlineData.mimeType;
            res.send({ imageData: `data:${mimeType};base64,${imageData}` });
        } else {
            res.status(500).send({ error: 'Image generation failed or no image data received.' });
        }
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).send({ error: 'Failed to generate image.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
        const imagePromptInput = document.getElementById("image-prompt");
        const generateButton = document.getElementById("generate-button");
        const generatedImage = document.getElementById("generated-image");
        const loadingMessage = document.getElementById("loading-message");
        const errorMessage = document.getElementById("error-message");

        generateButton.addEventListener("click", async () => {
            const promptText = imagePromptInput.value.trim();

            if (!promptText) {
                errorMessage.textContent = "Please enter text to generate an image.";
                errorMessage.style.display = "block";
                generatedImage.style.display = "none";
                loadingMessage.style.display = "none";
                return;
            }

            loadingMessage.style.display = "block";
            generatedImage.style.display = "none";
            errorMessage.style.display = "none";

            try {
                const response = await fetch('http://localhost:3000/generate-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: promptText }),
                });

                const data = await response.json();

                loadingMessage.style.display = "none";

                if (data && data.imageData) {
                    generatedImage.src = data.imageData;
                    generatedImage.style.display = "block";
                } else if (data && data.error) {
                    errorMessage.textContent = data.error;
                    errorMessage.style.display = "block";
                } else {
                    errorMessage.textContent = "Failed to generate image. Please try again.";
                    errorMessage.style.display = "block";
                }

            } catch (error) {
                console.error("Error generating image:", error);
                loadingMessage.style.display = "none";
                errorMessage.textContent = "An error occurred while generating the image.";
                errorMessage.style.display = "block";
            }
        });
