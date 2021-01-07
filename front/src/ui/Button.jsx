import React from "react"
import propTypes from "prop-types"
import { Loader } from "./Loader"

export function Button({ children, type = 'primary', loading = false, ...props }) {
    let className = 'btn '
    let htmlType = null
    if (type === 'submit') {
        className += 'btn-primary'
    } else {
        className += 'btn-' + type
    }

    if (type === 'submit') {
        htmlType = 'submit'
    }
    return <button className={className} type={htmlType} disabled={loading}{...props}>
        {loading ? <><Loader size='sm' />Chargement...</> : children}
    </button>
}

Button.propTypes = {
    children: propTypes.node.isRequired,
    type: propTypes.string,
    loading: propTypes.bool
}