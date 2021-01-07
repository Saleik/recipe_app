import React, { useState } from "react"
import propTypes from "prop-types"
import { ApiErrors, apiFetch } from '../utils/api'
import { Button } from '../ui/Button'

export function LoginForm({ onConnect }) {

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        setError(null)
        setLoading(true)
        e.preventDefault()
        const data = new FormData(e.target)
        try {
            const user = await apiFetch('/login', {
                method: 'POST',
                body: data,
            })
            onConnect(user)
        } catch (e) {
            if (e instanceof ApiErrors) {
                setError(e.errors[0].message)
            } else {
                console.error(e)
            }
            setLoading(false)
        }

    }

    return <form onSubmit={handleSubmit} className="container mt-4">
        <h2>Se connecter</h2>
        {error && <Alert>{error}</Alert>}
        <div className="form-group">
            <label htmlFor="email">Nom d'utilisateur</label>
            <input className="form-control" type="text" id="email" name="email" />
        </div>
        <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input className="form-control" type="password" id="password" name="password" />
        </div>
        <Button loading={loading} type="submit">Se connecter</Button>
    </form>
}

LoginForm.propTypes = {
    onConnect: propTypes.func.isRequired
}

function Alert({ children }) {
    return <div className="alert alert-danger">
        {children}
    </div>
}


