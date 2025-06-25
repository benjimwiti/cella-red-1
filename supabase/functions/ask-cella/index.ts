
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  userId: string;
  question: string;
  messageType: 'question' | 'emergency' | 'general';
}

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const SICKLE_CELL_SYSTEM_PROMPT = `You are Cella, an AI health assistant specialized in sickle cell disease support. You provide helpful, accurate, and empathetic guidance for sickle cell warriors and their caregivers.

Key Guidelines:
1. Always provide medically accurate information about sickle cell disease
2. Emphasize the importance of professional medical care
3. Be empathetic and understanding of the daily challenges
4. Provide practical tips for pain management, hydration, and crisis prevention
5. If discussing emergency situations, always recommend seeking immediate medical attention
6. Be encouraging and supportive while remaining realistic
7. Focus on evidence-based recommendations

For emergencies: Always prioritize getting immediate medical help and provide basic comfort measures.

Remember: You are a supportive companion, not a replacement for professional medical care.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, question, messageType }: RequestBody = await req.json();

    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    // Enhanced system prompt based on message type
    let systemPrompt = SICKLE_CELL_SYSTEM_PROMPT;
    
    if (messageType === 'emergency') {
      systemPrompt += "\n\nIMPORTANT: This appears to be an emergency situation. Prioritize immediate medical attention recommendations while providing supportive guidance.";
    }

    // Call OpenAI API
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const response = openAIData.choices[0]?.message?.content || "I'm sorry, I couldn't process your question right now. Please try again.";

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in ask-cella function:", error);
    
    // Fallback response for errors
    const fallbackResponse = messageType === 'emergency' 
      ? "I'm experiencing technical difficulties, but this sounds urgent. Please call 911 or go to your nearest emergency room immediately if you're having a sickle cell crisis."
      : "I'm sorry, I'm having trouble right now. Please try asking your question again, or contact your healthcare provider if it's urgent.";

    return new Response(
      JSON.stringify({ 
        response: fallbackResponse,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
