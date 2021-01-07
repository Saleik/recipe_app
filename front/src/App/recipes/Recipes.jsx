import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Loader } from '../../ui/Loader'
import { Button } from '../../ui/Button'

export function Recipes({ recipes, onClick }) {
    if (recipes === null) {
        return <Loader />
    }

    return <div className="row">
        {recipes.map(recipe => <div className="col-md-4 my-4" key={recipe.id}>
            <Recipe recipe={recipe} onClick={onClick} />
        </div>)}
    </div>
}

Recipes.propTypes = {
    recipes: PropTypes.array,
    onClick: PropTypes.func.isRequired
}

const Recipe = memo(({ recipe, onClick }) => {
    return <div className="card">
        <div className="card-body">
            <div className="card-title">{recipe.title}</div>
            <p className="card-text">{recipe.short}</p>
            <Button onClick={() => onClick(recipe)}>Voir la recette</Button>
        </div>

    </div>
})