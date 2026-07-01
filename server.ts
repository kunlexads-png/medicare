import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry user-agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy_key",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for AI symptom checking
app.post("/api/symptom-checker", async (req, res) => {
  try {
    const { symptoms, age, gender, duration } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms are required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        advice: `### ⚠️ API Key Missing
Please configure your **GEMINI_API_KEY** in the Secrets panel of Google AI Studio to enable the live AI Symptom Checker.

#### 🩺 Preliminary Self-Care Guidance (Simulation Mode):
You reported symptoms: **"${symptoms}"** for a duration of **"${duration || 'unspecified'}"**.

**General Guidelines:**
1. **Monitor Closely**: Watch for worsening of your reported issues or development of new symptoms.
2. **Rest & Hydration**: Ensure you get adequate rest and drink plenty of water.
3. **Seek Professional Advice**: We strongly recommend scheduling an appointment with one of our specialists at MediCare Pro (e.g., General Medicine or Internal Medicine) for an accurate assessment.
4. **Emergency Warning**: If you experience chest pain, severe shortness of breath, sudden numbness, or extremely high fever, please proceed to the nearest Emergency Room immediately.

*Disclaimer: This is a fallback notification because the Gemini API key is not currently set up in the environment.*`
      });
    }

    const prompt = `You are a professional AI medical assistant and symptom checker at MediCare Pro Hospital. 
Analyze the following user-reported symptoms and provide a comprehensive guidance report. 

User Profile:
- Age: ${age || "Unspecified"}
- Gender: ${gender || "Unspecified"}
- Duration of symptoms: ${duration || "Unspecified"}
- Symptoms reported: "${symptoms}"

Please structure your response beautifully with elegant Markdown, utilizing headings, bold text, bulleted lists, and a highlighted warning or disclaimer box. 

Provide:
1. **Potential Explanations**: What these symptoms could indicate (always present these as possibilities, never as a firm diagnosis).
2. **Triage & Urgency Level**: Classify the urgency clearly (e.g., Low, Medium, High / Emergency).
3. **Recommended Next Steps**: Recommended self-care or scheduling steps (e.g., consult a physician, schedule blood work, rest).
4. **Suggested Medical Specialist**: Suggest which department at MediCare Pro (e.g., Cardiology, Pediatrics, General Medicine, Neurology, Orthopedics, etc.) is best suited for this.
5. **A Highly Visible Disclaimer**: Include a strong, professional medical disclaimer emphasizing that this is an AI tool and does not replace a doctor's examination.

Keep the tone highly compassionate, professional, and clear.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ advice: response.text });
  } catch (error: any) {
    console.error("Symptom Checker Error:", error);
    res.status(500).json({ error: "Failed to generate symptom analysis. " + (error?.message || "") });
  }
});

// Serve Vite files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
