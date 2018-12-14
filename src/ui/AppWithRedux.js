import React, { Component, Fragment } from "react";
import { combineReducers, createStore } from "redux";

/** Example using redux
 *
 * redux is a library following the flux data structure : https://facebook.github.io/flux/
 *
 * Flux is a pattern to architecture your data and data flow.
 * The main goal is to protect you state from being modified from anywhere (and causing unpredictable results.)
 *
 * Flux work by inverting the control over data. Instead of having all the state and being able to update all of it manually, Flux uses "actions" that can be "dispatched".
 * Once the "store" receives the action, it can update itself and the broadcast the changes to the "view"
 *
 * Redux follows the Flux architecture with leverage of the reduce function (a function that takes many arguments and reduces it to one result.)
 * i.e: function sum(mark1, mark2, ...., markn) => totalMark
 *
 * Read more here: https://redux.js.org/
 *
 *
 * In Redux, we store our application state in an object called "store". This store let you access (read) the state but not modify it.
 * If you want to update the state, you need to "dispatch" an "action" : store.dispatch(action)
 *
 * When creating the store, you'll design the state object but also how to modify the state when an action is dispatched.
 * The fuctions responsible to update part of the state are called reducers function.
 *
 * for example, I create my store this way in redux:
 * const store = createStore({ counter: function counterReducer(count = 0, action) { if (action.type === "INCREMENT") return count + 1; else return count; } })
 *
 * I can then do:
 *  store.getState() // { count: 0 }
 *  store.setState //undefined
 *  store.dispatch({ type: "INCREMENT" })
 *  store.getState() // { count: 1 }
 *
 *
 * Below you'll see two reducers, one for the products and one for the cart.
 * I'll create my store and store it in the App state. Then I can pass down the store to my children component and access the store's state and dispatch method.
 *
 *
 * We need to save the store and have some overhead to use it with react. In the component AppWithReactRedux, we will see the same store but combined with react-redux.
 * It uses the React Context API so we don't have to pass the store to every single component of our application.
 */

/** Create the reducers */

const productReducer = (products = [], action) => {
	switch (action.type) {
		case "FETCH_PRODUCTS":
			return action.payload;
		default:
			return products;
	}
};

const cartReducer = (cart = [], action) => {
	switch (action.type) {
		case "ADD_TO_CART":
			return [...cart, action.payload];
		default:
			return cart;
	}
};

const rootReducer = combineReducers({
	products: productReducer,
	cart: cartReducer,
});

/** Components */

class App extends Component {
	state = {
		store: createStore(rootReducer),
	};

	componentDidMount() {
		const { store } = this.state;

		//subscribe to the store so when it updates, we update our component;
		store.subscribe(() => {
			this.setState({
				storeState: store.getState(),
			});
		});
	}

	render() {
		const { store } = this.state;

		return (
			<div>
				<Cart store={store} />
				<ProductList store={store} />
			</div>
		);
	}
}

class ProductList extends Component {
	componentDidMount() {
		const { store } = this.props;

		import("../data/products")
			.then(p => p.default)
			.then(products => {
				store.dispatch({ type: "FETCH_PRODUCTS", payload: products });
			});
	}

	handleAddToCart = product => {
		const { store } = this.props;

		store.dispatch({ type: "ADD_TO_CART", payload: product.id });
	};

	render() {
		const { store } = this.props;
		const { products } = store.getState();

		return (
			<div>
				<ul>
					{products.map(p => (
						<li key={p.id}>
							{p.title}{" "}
							<button onClick={() => this.handleAddToCart(p)}>add to cart</button>
						</li>
					))}
				</ul>
			</div>
		);
	}
}

function Cart(props) {
	const { store } = props;
	const { cart } = store.getState();

	return (
		<Fragment>
			<div>shopping list count: {cart.length}</div>
		</Fragment>
	);
}

export default App;
