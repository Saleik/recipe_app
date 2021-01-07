import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from '../../ui/Loader'
import Modal from '../../ui/Modal'
import { useToggle } from '../../hooks'
import { EditRecipeForm } from './RecipeForm'
import { Button } from '../../ui/Button'

export function Recipe({ recipe, onClose, onEdit, ingredients, onDelete, onUpdate }) {
    return (
        <Modal title={recipe.title} onClose={onClose}>
            <h1>{recipe.title}</h1>
            {!recipe.ingredients ? <Loader /> : <RecipeDetail recipe={recipe}
                onEdit={onEdit}
                ingredients={ingredients}
                onUpdate={onUpdate} />}
            <Button type="danger" onClick={() => onDelete(recipe)}>Supprimer</Button>
        </Modal>
    )
}

function RecipeDetail({ recipe, ingredients, onEdit, onUpdate }) {

    const htmlContent = { __html: recipe.content.split("\n").join("<br/>") }
    const [editMode, toggleEditMode] = useToggle(false)

    const handleUpdate = async (data) => {
        await onUpdate(recipe, data)
        toggleEditMode()
    }

    const handleEditMode = () => {
        toggleEditMode()
        onEdit()
    }
    return editMode ? <EditRecipeForm
        ingredients={ingredients}
        recipe={recipe}
        onSubmit={handleUpdate} /> : <>
            <div dangerouslySetInnerHTML={htmlContent}></div>
            <h4 className="mt-4">Ingrédients</h4>
            <ul>
                {recipe.ingredients.map(i => <IngredientRow ingredient={i} key={i.id} />)}
            </ul>
            <Button type="warning" onClick={handleEditMode}>Editer</Button>
        </>
}

function IngredientRow({ ingredient }) {
    return <li>
        <strong>{ingredient.quantity} {ingredient.unit}</strong> {ingredient.title}
    </li>
}

Recipe.propTypes = {
    recipe: PropTypes.object.isRequired,
}
