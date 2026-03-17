import { GoogleGenAI, Type } from "@google/genai";
import { db, doc, getDoc, setDoc, increment } from "../firebase";
import { toast } from "react-hot-toast";

const DAILY_LIMIT = 5;

export async function suggestArchitecture(prompt: string, userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const usageRef = doc(db, 'usage', `${userId}_${today}`);
  
  try {
    const usageSnap = await getDoc(usageRef);
    const currentCount = usageSnap.exists() ? usageSnap.data().count : 0;
    
    if (currentCount >= DAILY_LIMIT) {
      const limitMessage = `Daily generation limit reached (${DAILY_LIMIT}/day). Please come back tomorrow to design more architectures!`;
      toast.error(limitMessage, {
        duration: 6000,
        icon: '⏳'
      });
      throw new Error('DAILY_LIMIT_REACHED');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    const toastId = toast.loading("AI is designing your architecture...");
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `You are a world-class system design expert. Based on the prompt: "${prompt}", suggest a production-ready distributed system architecture.
      
      Follow these best practices:
      1. Use Load Balancers to distribute traffic to multiple instances.
      2. Use API Gateways for request routing and authentication.
      3. Use Caches (Redis) to reduce database load for frequently accessed data.
      4. Use Message Queues (Kafka) and Workers for asynchronous processing.
      5. Use CDNs for static content and global low latency.
      6. Ensure high availability by having multiple instances of critical services.
      7. Connect nodes logically: CDN -> Load Balancer -> API Gateway -> Microservices -> Database/Cache/Queue.
      
      Return a JSON object with:
      - nodes: array of { id: string, type: string, label: string, x: number, y: number, instances: number }
      - edges: array of { source: string, target: string }
      
      Types available: api-gateway, load-balancer, microservice, database, cache, queue, worker, cdn, auth-service.
      Position nodes logically (y-coordinates: CDN: 50, LB: 150, Gateway: 250, Services: 400, DB/Cache: 600).
      Ensure all node IDs used in edges exist in the nodes array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  label: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  instances: { type: Type.NUMBER },
                },
                required: ["id", "type", "label", "x", "y", "instances"],
              },
            },
            edges: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  target: { type: Type.STRING },
                },
                required: ["source", "target"],
              },
            },
          },
          required: ["nodes", "edges"],
        },
      },
    });

      if (!response.text) {
        throw new Error("No response text from Gemini");
      }

      // Increment usage count after successful generation
      try {
        await setDoc(usageRef, {
          userId,
          date: today,
          count: increment(1)
        }, { merge: true });
      } catch (dbError) {
        console.error("Failed to update usage count:", dbError);
      }

      toast.success("Architecture generated!", { id: toastId });
      
      // Clean JSON string in case model wraps it in markdown blocks
      let cleanJson = response.text.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      
      return JSON.parse(cleanJson);
    } catch (genError: any) {
      console.error("Gemini Generation Error:", genError);
      let userFriendlyMessage = "Generation failed. Please try again.";
      
      if (genError.message?.includes('API key not valid')) {
        userFriendlyMessage = "AI API key is invalid. Please check your configuration.";
      } else if (genError.message?.includes('quota')) {
        userFriendlyMessage = "AI quota exceeded. Please try again later.";
      } else if (genError.message?.includes('model not found')) {
        userFriendlyMessage = "AI model not found. Falling back...";
      }
      
      toast.error(userFriendlyMessage, { id: toastId });
      throw genError;
    }
  } catch (error: any) {
    if (error.message === 'DAILY_LIMIT_REACHED') throw error;
    
    if (error.message?.includes('insufficient permissions')) {
      console.error("Firestore Permission Error. Check rules for 'usage' collection.", error);
    }
    
    console.error("Gemini API Error:", error);
    throw error;
  }
}
