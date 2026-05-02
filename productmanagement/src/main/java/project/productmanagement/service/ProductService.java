package project.productmanagement.service;

import java.util.List;

import project.productmanagement.entity.Product;

public interface ProductService {
    
	String addProduct(Product prod);
	String updateProduct(Product prod);
	String deleteProduct(Long prodId);
	Product viewProduct(Long prodId);
	List<Product> viewAllProducts();
}
