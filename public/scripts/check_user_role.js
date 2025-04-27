import { createClient } from '@supabase/supabase-js';

// Initialisation de Supabase
const supabaseUrl = 'https://faalxpglzjelaijyubis.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhYWx4cGdsemplbGFpanl1YmlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTQ2MTEsImV4cCI6MjA2MDczMDYxMX0.AeTrJnHT8taozCdxmEN2tiR0d2Erm_skbMOPXRe01nc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Vérification de la session
    const { data: session, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Erreur de session :", sessionError.message);
      return;
    }

    const user = session?.user;

    if (!user) {
      // Si l'utilisateur n'est pas connecté, afficher un message ou rediriger
      alert("Vous devez être connecté pour accéder à cette page.");
      window.location.href = "login.html"; // Redirige vers la page de connexion
      return;
    }

    // Si l'utilisateur est connecté, récupérer son rôle
    const { data, error } = await supabase
      .from('Users')
      .select('role')
      .eq('id', user.id) // Utiliser l'ID de l'utilisateur connecté
      .single();

    if (error) {
      console.log("Erreur lors de la récupération du rôle :", error.message);
      alert("Une erreur est survenue lors de la récupération du rôle.");
      return;
    }

    // Vérification du rôle de l'utilisateur
    if (data.role !== 'admin') {
      console.log("Vous devez être un administrateur pour soumettre une recette.");
      alert("Vous devez être un administrateur pour soumettre une recette.");
      window.location.href = "index.html"; // Rediriger vers la page d'accueil ou une autre page
      return;
    }

    // Si l'utilisateur est un admin, afficher le formulaire
    document.getElementById("recipe-form").style.display = "block";  // Afficher le formulaire

    // Afficher un message de bienvenue (optionnel)
    console.log("Bienvenue, " + user.email);

  } catch (error) {
    console.error("Erreur lors de la vérification du rôle :", error.message);
  }
});
