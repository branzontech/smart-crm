
import { supabase } from "@/integrations/supabase/client";
import { Cotizacion } from "@/types/cotizacion";

/**
 * Service for sending emails
 */
export const emailService = {
  /**
   * Send a quotation as PDF via email
   * @param quotation The quotation data
   * @param htmlContent The HTML content of the quotation to convert to PDF
   * @returns Object indicating success or failure with message
   */
  async sendQuotationEmail(
    quotation: Cotizacion,
    htmlContent: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log("Preparing to send quotation email", {
        quotationId: quotation.id,
        quotationNumber: quotation.numero,
        clientEmail: quotation.cliente?.email,
        senderEmail: quotation.empresaEmisor?.email
      });

      // Validate quotation ID and client email
      if (!quotation.id || !quotation.cliente?.email) {
        const missingFields = [];
        if (!quotation.id) missingFields.push("ID de cotización");
        if (!quotation.cliente?.email) missingFields.push("correo del cliente");
        
        const errorMsg = `No se puede enviar el correo: falta ${missingFields.join(" y ")}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Check if we have a sender email, if not, try to get it from the database
      let senderEmail = quotation.empresaEmisor?.email;
      let senderName = quotation.empresaEmisor?.nombre;

      console.log("Initial sender email check:", { senderEmail });

      // If the sender email is missing, try to fetch it from the latest company config
      if (!senderEmail) {
        console.log("Sender email missing, fetching from config_empresas table");
        const { data: configData, error: configError } = await supabase
          .from("config_empresas")
          .select("razon_social, email")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
          
        if (configError) {
          console.error("Error fetching company config:", configError);
          // Don't throw an error here, continue checking if email exists
        } else if (configData) {
          console.log("Retrieved config data:", configData);
          if (configData.email) {
            senderEmail = configData.email;
            // Only update the sender name if it was not already set
            if (!senderName) {
              senderName = configData.razon_social;
            }
            console.log("Retrieved sender email from config:", senderEmail);
          } else {
            console.error("Email field exists in config but is empty or null");
          }
        } else {
          console.error("No company config found in the database");
        }
      }

      // Final check if sender email exists
      if (!senderEmail) {
        console.error("Missing sender email, checked both quotation and database");
        throw new Error(
          "No se puede enviar el correo: falta el correo del emisor. Por favor configure un correo electrónico en la sección de Configuración."
        );
      }

      // Clean up HTML for the PDF generation
      // Remove any script tags and UI components not needed in the PDF
      const cleanHtml = htmlContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, "")
        .replace(/class="print:hidden[^"]*"/gi, 'style="display:none"');

      // Prepare the request data
      const requestData = {
        quotationId: quotation.id,
        quotationNumber: quotation.numero,
        clientEmail: quotation.cliente.email,
        clientName: quotation.cliente.nombre,
        senderEmail: senderEmail,
        senderName: senderName || quotation.empresaEmisor.nombre,
        quotationHtml: cleanHtml,
      };

      console.log("Calling send-quotation-email function with:", {
        quotationNumber: requestData.quotationNumber,
        clientEmail: requestData.clientEmail, 
        senderEmail: requestData.senderEmail
      });
      
      // Call the Supabase Edge Function to send the email with PDF attachment
      const { data, error } = await supabase.functions.invoke(
        "send-quotation-email",
        {
          body: requestData,
        }
      );

      if (error) {
        console.error("Error invoking send-quotation-email function:", error);
        throw new Error(
          `Error al enviar el correo: ${error.message || "Error desconocido"}`
        );
      }

      if (!data || !data.success) {
        const errorMsg = data?.error || "Error desconocido al enviar el correo";
        console.error("Error sending email:", errorMsg);
        throw new Error(`Error al enviar el correo: ${errorMsg}`);
      }

      console.log("Email sent successfully:", data);
      return {
        success: true,
        message: "Cotización enviada por correo electrónico con éxito",
      };
    } catch (error) {
      console.error("Error in sendQuotationEmail:", error);
      return {
        success: false,
        message: error.message || "Error al enviar el correo electrónico",
      };
    }
  },
};
