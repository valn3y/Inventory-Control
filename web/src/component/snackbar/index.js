import React from 'react'
import SnackbarContent from '@material-ui/core/SnackbarContent'

import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { green } from '@material-ui/core/colors'

const style = makeStyles(theme => ({
    Success: {
        backgroundColor: green[600]
    },
    Error: {
        backgroundColor: theme.palette.error.dark
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    },
    margin: {
        margin: theme.spacing(1)
    }
}))

const Snack = (props) => {
    const styles = style()

    const variantIcon = (icon) => {
        if (icon === 'Success')
            return <CheckCircleIcon className={clsx(styles.icon, styles.iconVariant)} />
        if (icon === 'Error')
            return <ErrorIcon className={clsx(styles.icon, styles.iconVariant)} />
    }

    const classStyle = (variant) => {
        if (variant === 'Success')
            return styles.Success
        if (variant === 'Error')
            return styles.Error
    }

    return (
        <SnackbarContent
            className={clsx(classStyle(props.variant), styles.margin)}
            message={
                <span className={styles.message}>
                    {variantIcon(props.variant)}
                    {props.message}
                </span>
            }
        />
    )

}

export default Snack