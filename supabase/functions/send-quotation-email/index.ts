
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import puppeteer from "npm:puppeteer-core@21.5.0";
import chromium from "npm:@sparticuz/chromium-min@119.0.2";

// Setup CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailQuotationRequest {
  quotationId: string;
  quotationNumber: string;
  clientEmail: string;
  clientName: string;
  senderEmail: string;
  senderName: string;
  quotationHtml: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the RESEND_API_KEY from environment variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set");
      throw new Error("Missing API key configuration");
    }

    const resend = new Resend(resendApiKey);
    
    // Parse the request body
    const requestData: EmailQuotationRequest = await req.json();
    console.log("Request data received:", {
      quotationId: requestData.quotationId,
      quotationNumber: requestData.quotationNumber,
      clientEmail: requestData.clientEmail,
      senderEmail: requestData.senderEmail,
      senderName: requestData.senderName
    });
    
    // Validate required fields
    if (!requestData.quotationId || !requestData.clientEmail || !requestData.quotationHtml) {
      console.error("Missing required fields:", {
        hasQuotationId: Boolean(requestData.quotationId),
        hasClientEmail: Boolean(requestData.clientEmail),
        hasQuotationHtml: Boolean(requestData.quotationHtml)
      });
      throw new Error("Missing required fields for email sending");
    }

    if (!requestData.senderEmail) {
      console.error("Missing sender email address");
      throw new Error("Missing sender email address");
    }

    console.log(`Preparing to send quotation ${requestData.quotationNumber} to ${requestData.clientEmail} from ${requestData.senderEmail}`);

    // Convert HTML to PDF without using Puppeteer
    // We'll use a simpler approach by sending the HTML directly
    
    try {
      // Prepare email content
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #2d1e2f; margin-bottom: 20px;">Estimado/a ${requestData.clientName},</h2>
          
          <p>Esperamos que este mensaje le encuentre bien.</p>
          
          <p>Nos complace enviarle la cotización <strong>${requestData.quotationNumber}</strong> que ha solicitado para nuestros servicios.</p>
          
          <p>En el documento adjunto encontrará todos los detalles de los productos y servicios incluidos, así como los términos y condiciones aplicables.</p>
          
          <p>Si tiene alguna pregunta o requiere clarificación sobre algún aspecto de la cotización, no dude en contactarnos. Estamos a su disposición para brindarle toda la información adicional que pueda necesitar.</p>
          
          <p>Agradecemos su interés en nuestros servicios y esperamos poder colaborar con usted pronto.</p>
          
          <p style="margin-top: 30px;">Saludos cordiales,</p>
          <p><strong>${requestData.senderName}</strong></p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
            <p>Este correo electrónico contiene información confidencial. Si usted no es el destinatario previsto, por favor notifique al remitente y elimine este mensaje.</p>
          </div>
        </div>
      `;

      // Clean up the quotation HTML for attachment
      const cleanHtml = requestData.quotationHtml
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, "")
        .replace(/class="print:hidden[^"]*"/gi, 'style="display:none"');

      // Send email with HTML content
      console.log(`Sending email from "${requestData.senderName}" <${requestData.senderEmail}> to ${requestData.clientEmail}`);
      
      const emailResponse = await resend.emails.send({
        from: `${requestData.senderName} <${requestData.senderEmail}>`,
        to: [requestData.clientEmail],
        subject: `Cotización de servicios - ${requestData.quotationNumber}`,
        html: emailContent,
        attachments: [
          {
            filename: `Cotizacion-${requestData.quotationNumber}.html`,
            content: Buffer.from(cleanHtml).toString('base64'),
            content_type: "text/html",
          },
        ],
      });

      console.log("Email sent successfully:", emailResponse);
      return new Response(JSON.stringify({ success: true, data: emailResponse }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      throw new Error(`Error al enviar el correo: ${emailError.message}`);
    }
  } catch (error) {
    console.error("Error sending quotation email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Error al enviar el correo electrónico",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
