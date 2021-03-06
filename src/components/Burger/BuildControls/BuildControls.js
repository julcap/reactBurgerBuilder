import React from 'react';
import PropTypes from 'prop-types';

import classes from './BuildControls.css'
import BuildControl from './BuildControl/BuildControl'

const controls = [
    {label: 'Salad', type: 'salad'},
    {label: 'Cheese', type: 'cheese'},
    {label: 'Bacon', type: 'bacon'},
    {label: 'Meat', type: 'meat'},
]
const BuildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
        {controls.map(ctrl => {
            return <BuildControl
                key={ctrl.label}
                label={ctrl.label}
                added={() => props.ingredientAdded(ctrl.type)}
                removed={() => props.ingredientRemoved(ctrl.type)}
                disabled={props.disabledIngredients[ctrl.type]}
            />
        })}
        <button
            className={classes.OrderButton}
            disabled={!props.purchasable}
            onClick={props.purchase}
        >Order Now!
        </button>
    </div>
)

export default BuildControls;

BuildControls.propTypes = {
    disabledIngredients: PropTypes.object.isRequired,
    ingredientAdded: PropTypes.func.isRequired,
    ingredientRemoved: PropTypes.func.isRequired,
    price: PropTypes.number.isRequired,
    purchasable: PropTypes.bool.isRequired,
    purchase: PropTypes.func.isRequired
}