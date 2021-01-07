/* eslint-disable default-case */
import {
    useReducer,
    useCallback
} from "react";
import {
    apiFetch
} from "../utils/api";

function reducer(state, action) {

    console.log('INGREDIENTS REDUCE', action.type, action)

    switch (action.type) {
        case 'FETCHING_INGREDIENTS':
            return {
                ...state, loading: true
            }
            case 'SET_INGREDIENTS':
                return {
                    ...state, ingredients: action.payload, loading: false
                }
                case 'DELETE_INGREDIENT':
                    return {
                        ...state, ingredients: state.ingredients.filter(i => i !== action.payload)
                    }
                    case 'ADD_INGREDIENT':
                        return {
                            ...state, ingredients: [action.payload, ...state.ingredients]
                        }
                        case 'UPDATE_INGREDIENT':
                            return {
                                ...state, ingredients: state.ingredients.map(i => i === action.target ? action.payload : i)
                            }
                            default:
                                throw new Error('Action inconnue ' + action.type)

    }
}

export function useIngredients() {
    const [state, dispatch] = useReducer(reducer, {
        ingredients: null,
        loading: false
    })

    return {
        ingredients: state.ingredients,
        fetchIngredients: async () => {
            if (state.loading || state.ingredients) {

                return;
            }
            dispatch({
                type: 'FETCHING_INGREDIENTS'
            })
            const ingredients = await apiFetch('/ingredients')
            dispatch({
                type: 'SET_INGREDIENTS',
                payload: ingredients
            })
        },

        deleteIngredient: useCallback(async function (ingredient) {
            await apiFetch('/ingredients/' + ingredient.id, {
                method: 'DELETE'
            })
            dispatch({
                type: 'DELETE_INGREDIENT',
                payload: ingredient
            })
        }, []),
        updateIngredient: useCallback(async function (ingredient, data) {
            const newIngredient = await apiFetch('/ingredients/' + ingredient.id, {
                method: 'PUT',
                //Si l'api back-end ne comprend le FormData(), on utilise la méthode
                // Object.fromEntries(data) en envoi et JSON.Stringify(data) en retour
                body: data
            })
            dispatch({
                type: 'UPDATE_INGREDIENT',
                payload: newIngredient
            })
        }, []),
        createIngredient: useCallback(async function (data) {

            const newIngredient = await apiFetch('/ingredients', {
                method: 'POST',
                body: data
            })
            dispatch({
                type: 'ADD_INGREDIENT',
                payload: newIngredient
            })
        }, [])
    }
}