import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "sonner";

/**
 * Type guard to check if an object is a PostgrestError
 */
export function isPostgrestError(obj: any): obj is PostgrestError {
  return obj && typeof obj === 'object' && 'code' in obj && 'message' in obj && 'details' in obj;
}

/**
 * Safely handle Supabase query results with proper type checking
 * @param dataOrError The data or error object from a Supabase query
 * @param fallbackValue A fallback value to return if there's an error
 * @returns The data or fallback value
 */
export function safeQueryResult<T>(dataOrError: T | PostgrestError, fallbackValue: T): T {
  if (isPostgrestError(dataOrError)) {
    console.error("Supabase query error:", dataOrError);
    return fallbackValue;
  }
  return dataOrError;
}

/**
 * Extract a specific property from a Supabase query result safely
 * @param dataOrError The data or error object from a Supabase query
 * @param propertyName The name of the property to extract
 * @param fallbackValue A fallback value to return if there's an error or the property doesn't exist
 * @returns The property value or fallback value
 */
export function safePropertyExtract<T, K extends keyof T>(
  dataOrError: T | PostgrestError | null | undefined,
  propertyName: K,
  fallbackValue: T[K]
): T[K] {
  if (!dataOrError || isPostgrestError(dataOrError)) {
    return fallbackValue;
  }
  
  return dataOrError[propertyName] !== undefined && dataOrError[propertyName] !== null
    ? dataOrError[propertyName]
    : fallbackValue;
}

/**
 * Handle common Supabase error patterns and display a toast message
 */
export function handleSupabaseError(error: unknown, customMessage?: string): void {
  const message = customMessage || "Error en la operación";
  
  if (isPostgrestError(error)) {
    console.error("Supabase error:", error);
    toast.error(`${message}: ${error.message}`);
  } else if (error instanceof Error) {
    console.error("Error:", error);
    toast.error(`${message}: ${error.message}`);
  } else {
    console.error("Unknown error:", error);
    toast.error(message);
  }
}

/**
 * Test the Supabase connection and provide detailed error information
 * @returns A promise that resolves to a boolean indicating if the connection was successful
 */
export async function testConnection() {
  try {
    console.log("Testing Supabase connection...");
    
    // Check if supabase client is defined
    const { supabase } = await import("@/integrations/supabase/client");
    if (!supabase) {
      console.error("Supabase client is not defined");
      return false;
    }
    
    // Try to get the current auth session
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log("Auth session check:", authError ? "Error" : "Success", 
      authError ? authError : "Session: " + (authData.session ? "Active" : "None"));
    
    // Try a simple query to check database access
    const { data: queryData, error: queryError } = await supabase
      .from("profiles")
      .select("count", { count: "exact", head: true });
      
    console.log("Database query check:", queryError ? "Error" : "Success", 
      queryError ? queryError : "Query worked");
    
    if (authError || queryError) {
      console.error("Connection test failed with errors:", { authError, queryError });
      return false;
    }
    
    console.log("Supabase connection test successful");
    return true;
  } catch (error) {
    console.error("Unhandled error testing Supabase connection:", error);
    return false;
  }
}
