import React from 'react';
import ReactDom from 'react-dom';
import './index.css';

const ProductList = ( props ) => {
	return(
		<tr>
			<td>{props.index + 1}</td>
			<td>{props.product.name}</td>
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

const ProductForm = ( props ) => {
	return(
		<form onSubmit={ (event) => {
			event.preventDefault();
			document.getElementsByName('name')[0].focus();
			if ( props.product.name && 0 != props.product.price && 0 != props.product.quantity ) {
				props.addProduct(event);
			}
		}} >
			<table className="add-record">
				<tbody>
					<tr>
						<td width="*"><input type="text" placeholder="Name" name="name" value={props.product.name} onChange={props.updateProduct} /></td>
						<td width="15%"><input type="number" placeholder="Price" name="price" value={props.product.price} onChange={props.updateProduct} /></td>
						<td width="15%"><input type="number" placeholder="Quantity" name="quantity" value={props.product.quantity} onChange={props.updateProduct} /></td>
						<td width="25%"><button type="submit">Add Product</button></td>
					</tr>
				</tbody>
			</table>
		</form>
	)
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
		this.updateProduct = this.updateProduct.bind(this);
		this.addProduct = this.addProduct.bind(this);
		this.removeProduct = this.removeProduct.bind(this);
		this.state = {
			products: [],
			newProduct: {
				id: 1,
				name: '',
				price: '',
				quantity: ''
			}
		}
	}

	removeProduct( index ) {
		var products = this.state.products;
		products.splice( index, 1 );
		
		this.setState({
			products
		});
	}

	updateProduct( product ) {
		var newProduct = this.state.newProduct,
			name = product.target.name;

		newProduct[name] = product.target.value;
		
		this.setState({
			newProduct
		})
	}

	addProduct() {
		var products = this.state.products,
			new_id = this.state.newProduct.id + 1;

		products.push(this.state.newProduct);

		this.setState({
			products,
			newProduct: {
				id: new_id,
				name: '',
				price: '',
				quantity: ''
			}
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
					product={this.state.newProduct}
					updateProduct={this.updateProduct}
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