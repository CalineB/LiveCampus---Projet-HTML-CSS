document.addEventListener('DOMContentLoaded', async function () {
  const { data: session, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    console.error("Erreur de session :", sessionError?.message || "Pas de session utilisateur");
    alert("Vous devez être connecté pour accéder à cette page.");
    window.location.href = "login.html"; // Redirige vers la page de connexion si non connecté
    return;
  }

  // Si l'utilisateur est connecté, tu peux continuer avec le reste de ton code
  console.log("Bienvenue, " + session.user.email);

  // Ajoute ici le code pour vérifier le rôle de l'utilisateur et afficher le formulaire
  const { data, error } = await supabase
    .from('Users')
    .select('role')
    .eq('id', session.user.id) // Utiliser l'ID de l'utilisateur connecté
    .single();

  if (error || data.role !== 'admin') {
    console.log("Vous devez être un administrateur pour soumettre une recette.");
    alert("Vous devez être un administrateur pour soumettre une recette.");
    window.location.href = "index.html"; // Rediriger vers la page d'accueil ou une autre page
    return;
  }

  // Si l'utilisateur est un admin, afficher le formulaire
  document.getElementById("recipe-form").style.display = "block";  // Afficher le formulaire
});
