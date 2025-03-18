
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import puppeteer from "npm:puppeteer-core@21.5.0";
import chromium from "npm:@sparticuz/chromium-min@119.0.2";

// Setup CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const requestData: EmailQuotationRequest = await req.json();
    
    // Validate required fields
    if (!requestData.quotationId || !requestData.clientEmail || !requestData.quotationHtml) {
      throw new Error("Missing required fields for email sending");
    }

    console.log(`Preparing to send quotation ${requestData.quotationNumber} to ${requestData.clientEmail}`);

    // Generate PDF from HTML
    console.log("Launching browser to generate PDF...");
    chromium.setGraphicsMode = false;
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    console.log("Browser launched, creating page...");
    const page = await browser.newPage();
    
    // Set viewport and content
    await page.setViewport({ width: 1200, height: 1600 });
    await page.setContent(requestData.quotationHtml, { waitUntil: "networkidle0" });
    
    // Add print styles inline to ensure they're applied in the PDF
    await page.addStyleTag({
      content: `
        @page {
          size: letter portrait;
          margin: 0.7cm;
        }
        body {
          font-family: "Helvetica", "Arial", sans-serif;
        }
        @media print {
          body { visibility: visible; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `,
    });

    console.log("Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0.7cm", right: "0.7cm", bottom: "0.7cm", left: "0.7cm" },
    });

    await browser.close();
    console.log("PDF generation complete");

    // Base64 encode the PDF for attachment
    const base64Pdf = pdfBuffer.toString("base64");

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

    // Send email with attachment
    console.log("Sending email...");
    const emailResponse = await resend.emails.send({
      from: `${requestData.senderName} <${requestData.senderEmail}>`,
      to: [requestData.clientEmail],
      subject: "Nueva cotización de servicios de Branzontech",
      html: emailContent,
      attachments: [
        {
          filename: `Cotizacion-${requestData.quotationNumber}.pdf`,
          content: base64Pdf,
        },
      ],
    });

    console.log("Email sent successfully");
    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
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
