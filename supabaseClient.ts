import { createClient } from '@supabase/supabase-js';
import { SUPANON, SUPAURL } from "supaconfig";

if (!SUPAURL || !SUPANON) {
    throw new Error("Missing Supabase environment variables!");
}
export const supabase = createClient(SUPAURL, SUPANON, {
    auth: {
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});