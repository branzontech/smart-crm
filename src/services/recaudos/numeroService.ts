
import { supabase } from "@/integrations/supabase/client";

// Get the next recaudo number from the database
export const getNextRecaudoNumber = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('get_next_recaudo_numero');
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching next recaudo number:", error);
    return "R000001"; // Fallback default
  }
};
