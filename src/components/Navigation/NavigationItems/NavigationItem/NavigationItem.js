import React from 'react';
import {NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';

import classes from './NavigationItem.css'

const NavigationItem = (props) => (
    <li className={classes.NavigationItem}
    ><NavLink
        to={props.link}
        exact
        activeClassName={classes.active}
    >{props.children}</NavLink>
    </li>
);

NavigationItem.propTypes = {
    link: PropTypes.string.isRequired,
    active: PropTypes.bool
}

export default NavigationItem;