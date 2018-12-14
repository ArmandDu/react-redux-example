import React, { Component, Fragment } from "react";

/**
 * Example using state
 *
 *
 * this example is the classic react way to manage your state (dynamic data that can change over time and need to be saved between updates)
 *
 * Because react is one way data flow (parent to children), we need to lift the state to the correct component and then pass the data down as props
 * You also need to pass callback function so when an event occur (componentDidMount, onClick, ...), we can update the state by calling setState()
 *
 * One issue with this dataflow is when you have really complex application with lot of data that need to be shared in the app, you'll need to pass down the state from parent to children.
 *
 * For complex state manipulation and sharing, we have two solutions, the most popular one is using redux. (see AppWithRedux and AppWithReactRedux).
 * Since React16, we can now also use the Context API (https://reactjs.org/docs/context.html) but we'll learn about redux in this repository.
 *
 *
 * Below you can see a simple implementation of a shop with a list of products and a shopping cart. You can select and add the products to your cart.
 * The data is fetched from an external source and saved in the state for further interaction.
 *
 * App component holds the state and is responsible to update the state.
 *
 * ProductList expects to receive the list of products and a method to add a product to the cart.
 * Cart shows the number of items on the cart.
 *
 */
class App extends Component {
	state = {
		cart: [],
		products: [],
	};

	componentDidMount() {
		import("../data/products")
			.then(p => p.default)
			.then(products => {
				this.setState({ products });
			});
	}

	handleAddToCart = product => {
		this.setState(prev => ({
			cart: [...prev.cart, product.id],
		}));
	};

	render() {
		const { products, cart } = this.state;

		return (
			<div>
				<Cart cart={cart} />
				<ProductList products={products} onAddToCart={this.handleAddToCart} />
			</div>
		);
	}
}

class ProductList extends Component {
	render() {
		const { products, onAddToCart } = this.props;
		return (
			<div>
				<ul>
					{products.map(p => (
						<li key={p.id}>
							{p.title} <button onClick={() => onAddToCart(p)}>add to cart</button>
						</li>
					))}
				</ul>
			</div>
		);
	}
}

function Cart(props) {
	const { cart } = props;

	return (
		<Fragment>
			<div>shopping list count: {cart.length}</div>
		</Fragment>
	);
}

export default App;
