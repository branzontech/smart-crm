
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
        
        // En el modo de prueba de Resend, solo podemos enviar a la dirección del remitente
        // Usaremos el senderEmail como destinatario también
        const recipientEmail = requestData.senderEmail;
        
        console.log(`- From: "${requestData.senderName}" <${requestData.senderEmail}>`);
        console.log(`- To: ${recipientEmail} (modo de prueba - solo se puede enviar al remitente)`);
        console.log(`- Cc: Ninguno (cliente: ${requestData.clientEmail} recibirá copia cuando se verifique el dominio)`);
        console.log(`- Subject: Cotización de servicios - ${requestData.quotationNumber}`);
        console.log(`- Attachment: Cotizacion-${requestData.quotationNumber}.html (HTML size: ${cleanHtml.length} bytes)`);

        try {
          // Convert HTML content to base64 using TextEncoder (Deno compatible)
          const encoder = new TextEncoder();
          const htmlBytes = encoder.encode(cleanHtml);
          const base64Content = btoa(String.fromCharCode(...htmlBytes));
          
          // IMPORTANTE: Estamos en modo de prueba de Resend, así que debemos enviar
          // al mismo correo del remitente
          const emailResponse = await resend.emails.send({
            from: `${requestData.senderName} <${requestData.senderEmail}>`,
            to: [recipientEmail],
            subject: `[PRUEBA] Cotización de servicios - ${requestData.quotationNumber}`,
            html: `
              <div style="background-color: #fffaf0; padding: 15px; margin-bottom: 20px; border-left: 4px solid #ffa500; border-radius: 4px;">
                <p style="margin: 0; font-weight: bold;">MODO DE PRUEBA</p>
                <p style="margin: 10px 0 0 0;">
                  Esta es una copia de prueba enviada a ${recipientEmail}.<br/>
                  El correo real se enviaría a: ${requestData.clientEmail}<br/>
                  <span style="color: #dc3545;">Para enviar a otros destinatarios, verifica tu dominio en Resend.</span>
                </p>
              </div>
            ` + emailContent,
            attachments: [
              {
                filename: `Cotizacion-${requestData.quotationNumber}.html`,
                content: base64Content,
                content_type: "text/html",
              },
            ],
          });

          // Añadir información sobre las limitaciones de prueba en la respuesta
          const responseData = {
            success: true,
            data: emailResponse,
            testMode: true,
            testModeInfo: "En modo de prueba de Resend, solo se pueden enviar correos al remitente. El correo se ha enviado a " + recipientEmail + " en lugar de a " + requestData.clientEmail
          };

          console.log("Email sent successfully:", responseData);
          return new Response(
            JSON.stringify(responseData), 
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
            JSON.stringify({ 
              success: false, 
              error: errorMessage,
              testModeInfo: "En modo de prueba de Resend, solo se pueden enviar correos al remitente (" + requestData.senderEmail + "). Por favor verifica tu dominio en Resend."
            }),
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
