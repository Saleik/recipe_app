import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Ingredients } from './ingredients/Ingredients'
import { useIngredients } from '../hooks/ingredients'
import { Recipes } from './recipes/Recipes'
import { useRecipes } from '../hooks/recipes'
import { Recipe } from './recipes/Recipe'
import { useToggle } from '../hooks'
import { CreateRecipeForm } from './recipes/RecipeForm'
import Modal from '../ui/Modal'


export function Site() {

    const [page, setPage] = useState('recipes')
    const [add, toggleAdd] = useToggle(false)

    const { ingredients,
        fetchIngredients,
        deleteIngredient,
        updateIngredient,
        createIngredient,
    } = useIngredients()

    const { recipes,
        recipe,
        fetchRecipes,
        fetchRecipe,
        deselectRecipe,
        createRecipe,
        updateRecipe,
        deleteRecipe } = useRecipes()

    let content = null
    if (page === 'ingredients') {
        content = <Ingredients
            ingredients={ingredients}
            onDelete={deleteIngredient}
            onUpdate={updateIngredient}
            onCreate={createIngredient}
        />
    } else if (page === 'recipes') {
        content = <Recipes
            recipes={recipes}
            onClick={fetchRecipe} />
    }

    useEffect(() => {
        if (page === 'ingredients' || add === true) {
            fetchIngredients()
        }
        if (page === 'recipes') {
            fetchRecipes()
        }
    }, [page, fetchIngredients, fetchRecipes, add])

    return <>
        <Navbar currentPage={page} onClick={setPage} onButtonClick={toggleAdd} />
        <div className="container">
            {recipe ? <Recipe recipe={recipe}
                ingredients={ingredients}
                onClose={deselectRecipe}
                onEdit={fetchIngredients}
                onUpdate={updateRecipe}
                onDelete={deleteRecipe}
            /> : null}
            {add && <Modal title="Créer une recette" onClose={toggleAdd}>
                <CreateRecipeForm ingredients={ingredients} onSubmit={createRecipe} />
            </Modal>}
            {content}
        </div>
    </>
}

function Navbar({ currentPage, onClick, onButtonClick }) {

    const navClass = (page) => {
        let className = 'nav-item'

        if (page === currentPage) {
            className = " active"
        }

        return className
    }

    return <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
        <a href="#recipes" className="navbar-brand" onClick={() => onClick('recipes')}>Recettes</a>
        <ul className="navbar-nav mr-auto">
            <li className={navClass('recipes')}>
                <a href="#recipes" onClick={() => onClick('recipes')} className="nav-link">Recettes</a>
            </li>
            <li className={navClass('ingredients')}>
                <a href="#ingredients" onClick={() => onClick('ingredients')} className="nav-link">Ingrédients</a>
            </li>

        </ul>
        <button onClick={onButtonClick} className="btn btn-outline-light">Ajouter</button>
    </nav>
}