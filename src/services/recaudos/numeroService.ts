
import { supabase } from "@/integrations/supabase/client";

// Get the next recaudo number from the database
export const getNextRecaudoNumber = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('get_next_recaudo_numero');
    
    if (error) throw error;
    
    // Return the data directly without any manipulation
    return data;
  } catch (error: any) {
    console.error("Error fetching next recaudo number:", error);
    return "R000001"; // Fallback default
  }
};

// Get the actual recaudo number instead of the next one
export const getCurrentRecaudoNumber = async (): Promise<string | null> => {
  try {
    // Get the current sequence value without incrementing it
    const { data, error } = await supabase
      .from('recaudos')
      .select('numero')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    return data ? data.numero : null;
  } catch (error: any) {
    console.error("Error fetching current recaudo number:", error);
    return null;
  }
};
