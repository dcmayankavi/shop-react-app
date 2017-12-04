import React from 'react';
import ReactDom from 'react-dom';
import jquery from 'jquery';
import Select2 from './components/Select2/Select2';
import './components/Select2/Select2.css';
import './index.css';
import Products from './products.json';

const ProductList = ( props ) => {
	return(
		<tr>
			<td>{props.index + 1}</td>
			<td>{props.product.text}</td>
			<td>&#x20b9; {props.product.price}</td>
			<td>{props.product.quantity}</td>
			<td>&#x20b9; {props.product.price * props.product.quantity}</td>
			<td><button type="button" 
				onClick={() => { 
					props.removeProduct(props.index);
				}}>X</button></td>
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
const TotalAmount = ( props ) => {
	var products = props.products;
	var total = 0;

	for ( var i = 0; i < products.length; i++ ) {
		total += ( products[i].price * products[i].quantity );
	}
	return(
		<tr>
			<td colSpan="4">Total</td>
			<td width="20%" colSpan="2" className="total-price">&#x20b9; {total}</td>
		</tr>
	)
}

class MainWrapper extends React.Component {
	
	constructor(){
		super();
		this.addProduct = this.addProduct.bind(this);
		this.removeProduct = this.removeProduct.bind(this);
		this.state = {
			products: []
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
		var products = this.state.products;
		products.push(product);
		this.setState({
			products
		})
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
			<div>
				<ProductForm 
					addProduct={this.addProduct} 
				/>

				<table id="print-screen" className="product-list">
					<thead>
						<tr>
							<th width="5%">Id</th>
							<th width="*">Name</th>
							<th width="15%">Price</th>
							<th width="15%">Quantity</th>
							<th width="15%">Total</th>
							<th width="5%">&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						{this.state.products.map((product, index) => {
							return (
								<ProductList removeProduct={this.removeProduct} index={index} key={product.id} product={product} />
							)
						})}
					</tbody>
					<tfoot>
						<TotalAmount products={this.state.products} />
					</tfoot>
				</table>
				<div className="print-wrap">
					<button type="button" onClick={this.printBill}>Print</button>
				</div>
			</div>
		)
	}
}

ReactDom.render(<MainWrapper />, document.getElementById('root') );