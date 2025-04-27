// Initialisation de Supabase avec un nom différent pour éviter la confusion
const supabaseUrl = 'https://faalxpglzjelaijyubis.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhYWx4cGdsemplbGFpanl1YmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTQ2MTEsImV4cCI6MjA2MDczMDYxMX0.AeTrJnHT8taozCdxmEN2tiR0d2Erm_skbMOPXRe01nc';

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey); 

// Fonction de connexion
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Authentification avec email et mot de passe
  const { user, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Erreur de connexion : " + error.message);
  } else {
    alert("Connexion réussie !");
    window.location.href = "./create_recipe.html";
  }
});

