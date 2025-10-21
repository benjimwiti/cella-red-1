
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  email: string;
  token: string;
  type: 'signup' | 'recovery' | 'email_change';
}

const getEmailTemplate = (token: string, type: string) => {
  const subject = type === 'recovery' ? 'Reset Your Cella Password' : 'Your Cella Verification Code';
  const heading = type === 'recovery' ? 'Password Reset' : 'Welcome to Cella';
  const message = type === 'recovery' 
    ? 'To reset your password, please use the verification code below:' 
    : 'To complete your sign-up, please use the verification code below:';

  return {
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; border-radius: 8px; color: #333; max-width: 480px; margin: auto; border: 1px solid #eee;">
        <div style="text-align: center; padding-bottom: 10px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #e91e63, #f06292); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <span style="color: white; font-size: 24px; font-weight: bold;">C</span>
          </div>
        </div>
        <h2 style="color: #e91e63; text-align: center; margin-top: 0; margin-bottom: 20px;">${heading}</h2>
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 10px;">Hi there,</p>
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">${message}</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background-color: #f5f5f5; padding: 15px 25px; font-size: 24px; border-radius: 6px; letter-spacing: 4px; font-weight: bold; color: #e91e63; border: 2px solid #e91e63;">
            ${token}
          </span>
        </div>
        <p style="font-size: 14px; color: #555; line-height: 1.5; margin-bottom: 20px;">This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.</p>
        <br>
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 5px;">Thank you for choosing Cella!</p>
        <p style="font-weight: bold; margin-bottom: 0;">— The Cella Team</p>
      </div>
    `,
    text: `
      Hi there,

      Welcome to Cella – your companion for tracking and managing sickle cell care.

${message}

${token}

This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.

Thank you for choosing Cella!

— The Cella Team
    `.trim()
  };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { email, token, type = 'signup' }: AuthEmailRequest = await req.json();

    if (!email || !token) {
      return new Response(
        JSON.stringify({ error: "Email and token are required" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const template = getEmailTemplate(token, type);

    const emailResponse = await resend.emails.send({
      from: "Cella <onboarding@resend.dev>",
      to: [email],
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
