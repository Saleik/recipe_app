import React, { useState, memo } from 'react'
import { Loader } from '../../ui/Loader'
import { Button } from '../../ui/Button'
import { Upload, Trash } from '../../ui/Icon'
import { ApiErrors } from '../../utils/api'
import { Field } from '../../ui/Field'

export function Ingredients({ ingredients, onDelete, onUpdate, onCreate }) {
    return <div>
        <h1>Ingrédients</h1>
        <CreateIngredientForm onSubmit={onCreate} />
        {ingredients === null ? <Loader /> : <IngredientsList ingredients={ingredients} onDelete={onDelete} onUpdate={onUpdate} />}
    </div>
}

function IngredientsList({ ingredients, onDelete, onUpdate }) {
    return <div>
        {ingredients.map(ingredient => <Ingredient onDelete={onDelete} onUpdate={onUpdate}
            id={ingredient.id} ingredient={ingredient} />)}
    </div>
}

function CreateIngredientForm({ onSubmit }) {

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])

    const handleSubmit = async (e) => {
        const form = e.target
        e.preventDefault()
        setErrors([])
        setLoading(true)
        try {
            await onSubmit(new FormData(e.target))
            form.reset()
            form.querySelector('input').focus()
        } catch (e) {
            if (e instanceof ApiErrors) {
                setErrors(e.errors)
            } else {
                throw e
            }
        }
        setLoading(false)

    }
    const errorFor = (field) => {
        const error = errors.find(e => e.field === field)
        if (error) {
            return error.message
        }
        return null
    }
    return <form className="d-flex align-items-start" onSubmit={handleSubmit}>
        <Field placeholder="Nom de l'ingrédient" name="title" className="mr-2" error={errorFor('title')} />
        <Field placeholder="Unité de mesure" name="unit" className="mr-2" error={errorFor('unit')} />
        <Button type="submit" loading={loading}>Créer</Button>
    </form>
}

const Ingredient = memo(function ({ ingredient, onDelete, onUpdate }) {

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])

    const handleDelete = async (e) => {
        e.preventDefault()
        setLoading(true)
        await onDelete(ingredient)
        setLoading(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([])
        setLoading(true)
        try {
            await onUpdate(ingredient, new FormData(e.target))
        } catch (e) {
            if (e instanceof ApiErrors) {
                setErrors(e.errors)
            } else {
                throw e
            }
        }
        setLoading(false)

    }
    const errorFor = (field) => {
        const error = errors.find(e => e.field === field)
        if (error) {
            return error.message
        }
        return null
    }
    return <form className="d-flex align-items-start" onSubmit={handleSubmit}>
        <Field defaultValue={ingredient.title} name="title" className="mr-2" error={errorFor('title')} />
        <Field defaultValue={ingredient.unit} name="unit" className="mr-2" error={errorFor('unit')} />
        <Button type="submit" loading={loading}><Upload /></Button>
        <Button type="danger" onClick={handleDelete} loading={loading}><Trash /></Button>
    </form>
})

