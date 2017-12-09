import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
import jquery from 'jquery';
import Select2 from './components/Select2/Select2';
import './components/Select2/Select2.css';
import './index.css';
import Products from './products.json';

const ProductList = ( props ) => {
	return(
		<tr>
			<td>{props.index}</td>
			<td>{props.product.text}</td>
			<td>&#x20b9; {props.product.price}</td>
			<td>{props.product.quantity}</td>
			<td>&#x20b9; {props.product.price * props.product.quantity}<button type="button" className="close" 
				onClick={() => { 
					props.removeProduct(props.index);
				}}><span aria-hidden="true">&times;</span></button></td>
		</tr>
	)
}

class ProductForm extends React.Component {

	constructor( props ){
		super( props );
		this.fetchProduct = this.fetchProduct.bind(this);
		this.updateProduct = this.updateProduct.bind(this);
		this.resetProduct = this.resetProduct.bind(this);
		
		var ProductsLength = Object.keys(Products).length,
			products = [];
		for ( var i = 1; i <= ProductsLength; i++ ) {
			products.push( Products['product-'+i] );
		}

		this.state = {
			products: products,
			product: {
				id: '',
				text: '',
				price: '',
				quantity: ''
			}
		}
	}

	resetProduct() {
		this.setState({
			product: {
				id: '',
				text: '',
				price: '',
				quantity: ''
			}
		});
	}

	fetchProduct( event ) {
		var index = event.target.value;
		var new_product = Products['product-'+index];
		this.setState({
			product : {
				id : new_product.id,
				text : new_product.text,
				price : new_product.price,
				quantity : 0
			}
		});
	}

	updateProduct( event ){
		var quantity = event.target.value;
		var product = this.state.product;

		product.quantity = quantity;
		this.setState({
			product
		});
	}

	render(){
		return(
			<form onSubmit={ (event) => {
				event.preventDefault();
				document.getElementById('select2-name').focus();
				if( this.state.product.id != 0 && this.state.product.quantity > 0 ) {
					this.props.addProduct( this.state.product );
					this.resetProduct();
				}
			}} >
				<table className="add-record">
					<tbody>
						<tr>
							<td width="*">
								<Select2
									data={this.state.products}
									onSelect={this.fetchProduct}
									id="select2-name"
									value={this.state.product.id}
									options={
										{
											placeholder: 'Search product...',
											minimumInputLength: 1,
										}
									}
								/>
							</td>
							<td width="15%"><label className="product-price">&#x20b9; {this.state.product.price}</label></td>
							<td width="15%"><input type="number" placeholder="Quantity" name="quantity" value={this.state.product.quantity} onChange={this.updateProduct} /></td>
							<td width="25%"><button type="submit">Add Product</button></td>
						</tr>
					</tbody>
				</table>
			</form>
		)
	}
}

const AddNewProduct = () => {
	return (
		<div className="container">
			<ul className="nav nav-tabs">
				<li><NavLink activeClassName="active" className="link-to-new-product" to="/">Home</NavLink></li>
				<li className="active"><NavLink activeClassName="active" className="link-to-new-product" to="/new">New Products</NavLink></li>
			</ul>
			<h2>Add New Product</h2>
		</div>
	)
}

const TotalAmount = ( props ) => {
	var products = props.products;
	var total = 0;

	products.forEach(( product, index ) => {
		total += ( product.price * product.quantity );
	});

	return(
		<tr>
			<td colSpan="4">Total</td>
			<td width="20%" className="total-price">&#x20b9; {total}</td>
		</tr>
	)
}

class MainWrapper extends React.Component {
	
	constructor(){
		super();
		this.addProduct = this.addProduct.bind(this);
		this.removeProduct = this.removeProduct.bind(this);
		this.state = {
			products: [],
			number: 0
		}
	}

	removeProduct( index ) {
		var products = this.state.products;
		products.splice( index, 1 );
		
		this.setState({
			products
		});
	}

	addProduct( product ) {
		var products = this.state.products,
			new_number = this.state.number + 1;

		if( 'undefined' == typeof products[product.id] ) {
			products[product.id] = product;
			products[product.id].number = new_number;
		} else {
			products[product.id].quantity = parseInt( products[product.id].quantity ) + parseInt( product['quantity'] );
		}
		this.setState({
			products,
			number: new_number
		});
	}

	printBill() {
		var divToPrint = document.getElementById("print-screen"),
			newWin= window.open("");

		newWin.document.write(divToPrint.outerHTML);
		newWin.print();
		newWin.close();
	}
	
	render() {

		return (
			<div className="container">
				<ul className="nav nav-tabs">
					<li className="active"><NavLink activeClassName="active" className="link-to-new-product" to="/">Home</NavLink></li>
					<li><NavLink activeClassName="active" className="link-to-new-product" to="/new">New Products</NavLink></li>
				</ul>
				<h2>My Shop App</h2>
				<ProductForm 
					addProduct={this.addProduct} 
				/>

				<table id="print-screen" className="product-list table">
					<thead>
						<tr>
							<th width="5%">Id</th>
							<th width="*">Name</th>
							<th width="15%">Price</th>
							<th width="15%">Quantity</th>
							<th width="15%">Total</th>
						</tr>
					</thead>
					<tbody>
						{this.state.products.map((product, index) => {
							return (
								<ProductList removeProduct={this.removeProduct} index={product.number} key={product.id} product={product} />
							)
						})}
					</tbody>
					<tfoot>
						<TotalAmount products={this.state.products} />
					</tfoot>
				</table>
				<div className="print-wrap">
					<button type="button" className="btn btn-primary" onClick={this.printBill}>Print</button>
				</div>
			</div>
		)
	}
}

ReactDom.render(<BrowserRouter>
	<div>
		<Route exact path='/' component={MainWrapper} />
		<Route path='/new' component={AddNewProduct} />
	</div>
</BrowserRouter>, document.getElementById('root') );