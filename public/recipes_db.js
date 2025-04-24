import { supabase } from './supabase'

async function getRecipes() {
  const { data, error } = await supabase
    .from('Recipes')
    .select('*')

  if (error) console.error(error)
  else console.log(data)
}
