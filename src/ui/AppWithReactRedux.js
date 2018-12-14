import React, { Component, Fragment } from "react";
import { connect, Provider } from "react-redux";
import { combineReducers, createStore } from "redux";

/** Example with react-redux
 *
 *
 * Redux is only another way to manage your application state.
 * The main goal is to let the user dispatch actions to the store and the store will safely and in a predictible way update the state.
 *
 * But we still need to pass the store to every component ourselves.
 * Fortunately, React as a Context API, it behaves like the props but you don't have to explecitely pass the data to the children components.
 *
 * react-redux is a binding of redux with the context API. Read more here: https://react-redux.js.org
 *
 * Instead of storing our store in the App component, we can store it in the "Provider" component.
 * then when you want to access the store, you can use the "connect" function to connect the store to your component.
 *
 * connect is a function that takes two functions:
 * - mapStateToProps: you'll receive the store.getState() object as argument and the return value will be merged to the component's props
 * - mapDispatchToProps: you'll receive the store.dispatch function as argument and the return value will be merged to the component's props.
 *
 * connect will return another function (usually called "enhance" function). This function accepts a React Component and will return a Wrapper Component.
 * The Wrapper Component will render the base Component and inject the result of mapStateToProps and mapDispatchToProps as props in the baseComponent.
 *
 * simplified example:
 *
 * function connect(mapStateToProps, mapDispatchToProps) {
 *
 * return function enhance(BaseComponent) {
 *
 *   return class WrapperComponent extends Component {
 * 		render() {
 *   		const store = this.context.store;
 * 			const stateProps = mapStateToProps(store.getState());
 * 			const dispatchProps = mapDispatchToProps(store.dispatch);
 *
 *			return <BaseComponent {...this.props} {...stateProps} {...dispatchProps} />
 * 		}
 *   }
 * 	}
 * }
 *
 *
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

const store = createStore(rootReducer);

/** Components */

class App extends Component {
	render() {
		return (
			<div>
				<Provider store={store}>
					<Cart />
					<ProductList />
				</Provider>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		products: state.products,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		fetchProducts: products =>
			dispatch({
				type: "FETCH_PRODUCTS",
				payload: products,
			}),
		addToCart: product =>
			dispatch({
				type: "ADD_TO_CART",
				payload: product.id,
			}),
	};
};

const enhance = connect(
	mapStateToProps,
	mapDispatchToProps
);

const ProductList = enhance(
	class extends Component {
		componentDidMount() {
			const { fetchProducts } = this.props;

			import("../data/products")
				.then(c => c.default)
				.then(products => {
					fetchProducts(products);
				});
		}

		render() {
			const { products, addToCart } = this.props;
			return (
				<div>
					<ul>
						{products.map(p => (
							<li key={p.id}>
								{p.title} <button onClick={() => addToCart(p)}>add to cart</button>
							</li>
						))}
					</ul>
				</div>
			);
		}
	}
);

const mapStateToCartProps = state => {
	return {
		cart: state.cart,
	};
};

const enhanceCart = connect(mapStateToCartProps);

const Cart = enhanceCart(function(props) {
	const { cart } = props;

	return (
		<Fragment>
			<div>shopping list count: {cart.length}</div>
		</Fragment>
	);
});

export default App;
