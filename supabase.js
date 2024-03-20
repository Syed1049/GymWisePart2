import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rjuibysbrnwraxvzavtk.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdWlieXNicm53cmF4dnphdnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2MjQ3NTYsImV4cCI6MjAyMDIwMDc1Nn0.CiJnaPdlOFS17nF4zz3iePJnpEVd0skjRK1Q9wR9XKQ";

export const supabase = createClient(supabaseUrl, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
