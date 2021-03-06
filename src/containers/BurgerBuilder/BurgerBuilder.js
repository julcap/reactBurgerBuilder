import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
}

/*
const BurgerBuilder = (props) => {
    const [state,setState] = useState({
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false
    });

    const checkPurchasableState = (ingredients) => {
        console.log(ingredients)
        let total = Object.keys(ingredients).map(igKey => ingredients[igKey])
            .reduce((total, amount) => total + amount, 0);
        setState({...state, purchasable: total > 0});
    }

    const addIngredientHandler = (type) => {
        console.log(type)
        let updatedIngredients = {...state.ingredients};
        updatedIngredients[type] += 1;
        setState({ ...state,
            ingredients: updatedIngredients,
            totalPrice: state.totalPrice + INGREDIENT_PRICES[type]
        });
        checkPurchasableState(updatedIngredients);
    }

    const removeIngredientHandler = (type) => {
        let updatedIngredients = {...state.ingredients};
        if (!updatedIngredients[type]) return;
        updatedIngredients[type] -= 1;
        setState({ ...state,
            ingredients: updatedIngredients,
            totalPrice: state.totalPrice - INGREDIENT_PRICES[type]
        });
        checkPurchasableState(updatedIngredients);
    }
    const purchaseHandler = () => {
        setState({...state,
            purchasing: true
        })
    }
    const purchaseCancelHandler = () => {
        setState({...state,purchasing: false})
    }

    const purchaseContinueHandler = () => {
        alert("Continue purchase request");
    }

        const disabledIngredients = {...state.ingredients};
        for (let key in disabledIngredients) {
            disabledIngredients[key] = disabledIngredients[key] <= 0;
        }

        return (
            <Aux>
                <Modal show={state.purchasing} modalClose={purchaseCancelHandler}>
                    <OrderSummary
                        ingredients={state.ingredients}
                        cancel={purchaseCancelHandler}
                        continue={purchaseContinueHandler}
                        price={state.totalPrice}
                    />
                </Modal>
                <Burger ingredients={state.ingredients}/>
                <BuildControls
                    ingredientAdded={addIngredientHandler}
                    price={state.totalPrice}
                    ingredientRemoved={removeIngredientHandler}
                    disabledIngredients={disabledIngredients}
                    purchase={purchaseHandler}
                    purchasable={state.purchasable}
                />
            </Aux>
        );
}
*/

class BurgerBuilder extends Component {

    state = {
        /*ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },*/
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false,
    }

    componentDidMount() {
        axios.get('/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            }).catch(error => {
            this.setState({error: true});
        });
    }

    checkPurchasableState(ingredients) {
        let total = Object.keys(ingredients).map(igKey => ingredients[igKey])
            .reduce((total, amount) => total + amount, 0);
        this.setState({purchasable: total > 0});
    }

    addIngredientHandler = (type) => {
        let updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] += 1;
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: this.state.totalPrice + INGREDIENT_PRICES[type]
        });
        this.checkPurchasableState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        let updatedIngredients = {...this.state.ingredients};
        if (!updatedIngredients[type]) return;
        updatedIngredients[type] -= 1;
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: this.state.totalPrice - INGREDIENT_PRICES[type]
        });
        this.checkPurchasableState(updatedIngredients);
    }
    purchaseHandler = () => {
        this.setState({
            purchasing: true
        })
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        const queryParams = [];
        for (let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            // state: {order}
            search: '?' + queryString

        });

    }

    render() {
        const disabledIngredients = {...this.state.ingredients};
        for (let key in disabledIngredients) {
            disabledIngredients[key] = disabledIngredients[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p style={{textAlign: 'center'}}>Ingredients can not be loaded</p> : <Spinner/>;

        if (this.state.ingredients) {
            burger = (<Aux><Burger ingredients={this.state.ingredients}/>
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    price={this.state.totalPrice}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabledIngredients={disabledIngredients}
                    purchase={this.purchaseHandler}
                    purchasable={this.state.purchasable}
                /></Aux>);
            orderSummary = (<OrderSummary
                loading={this.state.loading}
                ingredients={this.state.ingredients}
                cancel={this.purchaseCancelHandler}
                continue={this.purchaseContinueHandler}
                price={this.state.totalPrice}
            />);
        }

        if (this.state.loading) {
            orderSummary = <Spinner/>;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClose={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}


export default withErrorHandler(BurgerBuilder, axios);