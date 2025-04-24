import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://faalxpglzjelaijyubis.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhYWx4cGdsemplbGFpanl1YmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTQ2MTEsImV4cCI6MjA2MDczMDYxMX0.AeTrJnHT8taozCdxmEN2tiR0d2Erm_skbMOPXRe01nc'

export const supabase = createClient(supabaseUrl, supabaseKey);
