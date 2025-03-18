
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing API key configuration"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const resend = new Resend(resendApiKey);
    
    try {
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
        return new Response(
          JSON.stringify({
            success: false,
            error: "Missing required fields for email sending"
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      console.log(`Preparing to send quotation ${requestData.quotationNumber} to ${requestData.clientEmail}`);
      
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

        // Log debugging information
        console.log("Preparing email with the following parameters:");
        console.log(`- From: TEMP "onboarding@resend.dev" (usando correo temporal de Resend)`);
        console.log(`- To: ${requestData.clientEmail}`);
        console.log(`- Subject: Cotización de servicios - ${requestData.quotationNumber}`);
        console.log(`- Attachment: Cotizacion-${requestData.quotationNumber}.html (HTML size: ${cleanHtml.length} bytes)`);

        try {
          // Send email with HTML content
          console.log("Calling Resend API to send email...");
          
          // Convert HTML content to base64 using TextEncoder (Deno compatible)
          const encoder = new TextEncoder();
          const htmlBytes = encoder.encode(cleanHtml);
          const base64Content = btoa(String.fromCharCode(...htmlBytes));
          
          const emailResponse = await resend.emails.send({
            // Usar temporalmente el correo de prueba de Resend mientras se verifica el dominio
            from: `${requestData.senderName} <onboarding@resend.dev>`,
            to: [requestData.clientEmail],
            subject: `Cotización de servicios - ${requestData.quotationNumber}`,
            html: emailContent,
            attachments: [
              {
                filename: `Cotizacion-${requestData.quotationNumber}.html`,
                content: base64Content,
                content_type: "text/html",
              },
            ],
          });

          console.log("Email sent successfully:", emailResponse);
          return new Response(
            JSON.stringify({ success: true, data: emailResponse }), 
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        } catch (resendError) {
          console.error("Resend API error:", resendError);
          let errorMessage = "Error al enviar el correo através de Resend API";
          
          if (resendError instanceof Error) {
            errorMessage += `: ${resendError.message}`;
            console.error("Error details:", resendError.stack);
          } else {
            console.error("Unknown error format:", resendError);
          }
          
          return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      } catch (emailProcessingError) {
        console.error("Email processing error:", emailProcessingError);
        return new Response(
          JSON.stringify({
            success: false,
            error: `Error al procesar el email: ${emailProcessingError.message || "Error desconocido"}`
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    } catch (parseError) {
      console.error("Error parsing request data:", parseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Error al procesar la solicitud: ${parseError.message || "Error desconocido"}`
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error) {
    console.error("Unhandled error in edge function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido al enviar el correo electrónico",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
