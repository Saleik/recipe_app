import {
    useReducer,
    useCallback
} from 'react'
import {
    apiFetch
} from "../utils/api"

function reducer(state, action) {

    console.log('INGREDIENTS REDUCE', action.type, action)

    switch (action.type) {

        case 'FETCHING_RECIPES':
            return {
                ...state, loading: true
            }
            case 'SET_RECIPES':
                return {
                    ...state, loading: false, recipes: action.payload
                }
                case 'ADD_RECIPE':
                    return {
                        ...state, recipes: [action.payload, ...state.recipes]
                    }
                    case 'DELETE_RECIPE':
                        return {
                            ...state, recipes: state.recipes.filter(i => i !== action.payload)
                        }
                        case 'FETCHING_RECIPE':
                            return {
                                ...state, recipeId: action.payload.id
                            }
                            case 'SET_RECIPE':
                                return {
                                    ...state, recipes: state.recipes.map(r => r.id === action.payload.id ? action.payload : r)
                                }
                                case 'DESELECT_RECIPE':
                                    return {
                                        ...state, recipeId: null
                                    }
                                    default:
                                        throw new Error('Action inconnue ' + action.type)
    }

}

export function useRecipes() {
    const [state, dispatch] = useReducer(reducer, {
        recipes: null,
        loading: false,
        recipeId: null
    })

    const recipe = state.recipes ? state.recipes.find(r => r.id === state.recipeId) : null

    return {
        recipes: state.recipes,
        recipe: recipe,
        fetchRecipes: async () => {
            if (state.loading || state.recipes) {
                return;
            }

            dispatch({
                type: 'FETCHING_RECIPES'
            })
            const recipes = await apiFetch('/recipes')
            dispatch({
                type: 'SET_RECIPES',
                payload: recipes
            })

        },
        fetchRecipe: useCallback(async function (recipe) {
            dispatch({
                type: 'FETCHING_RECIPE',
                payload: recipe
            })
            if (!recipe.ingredients) {
                recipe = await apiFetch('/recipes/' + recipe.id)
                dispatch({
                    type: 'SET_RECIPE',
                    payload: recipe
                })
            }
        }, []),
        createRecipe: useCallback(async (data) => {
            const recipe = await apiFetch('/recipes', {
                method: 'POST',
                body: data
            })
            dispatch({
                type: 'ADD_RECIPE',
                payload: recipe
            })
        }, []),
        updateRecipe: useCallback(async (recipe, data) => {
            recipe = await apiFetch('/recipes/' + recipe.id, {
                method: 'PUT',
                body: data
            })
            dispatch({
                type: 'SET_RECIPE',
                payload: recipe
            })
        }, []),
        deleteRecipe: useCallback(async (recipe) => {
            await apiFetch('/recipes/' + recipe.id, {
                method: 'DELETE',
            })
            dispatch({
                type: 'DELETE_RECIPE',
                payload: recipe
            })
        }, []),
        deselectRecipe: async function () {
            dispatch({
                type: 'DESELECT_RECIPE'
            })
        }
    }
}