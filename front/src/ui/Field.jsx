import React from 'react'
import propTypes from 'prop-types'

export function Field({ name, children, type = 'text', error, className, ...props }) {
    return <div className={`form-group ${className}`}>
        {children && <label htmlFor={name}>{children}</label>}
        {type === "textarea" ?
            <textarea name={name} className={`form-control${error ? ' is-invalid' : ''}`} {...props} /> :
            <input type={type} name={name} className={`form-control${error ? ' is-invalid' : ''}`} {...props} />
        }
        {error && <div className="invalid-feedback">{error}</div>}
    </div>
}

Field.propTypes = {
    name: propTypes.string,
    Children: propTypes.node,
    type: propTypes.string,
    error: propTypes.string,
    className: propTypes.string
}