import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yltzmclhtqylaaycrvxw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsdHptY2xodHF5bGFheWNydnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MzQyNDEsImV4cCI6MjA3NTExMDI0MX0.VJceIUfknjeMbg2FeM0bwsdpg6pH67_gKXxVTI21vGA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
