package project.productmanagement.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import project.productmanagement.entity.Product;
import project.productmanagement.service.ProductServiceImplementation;


@RestController
public class ProductController {
	
    ProductServiceImplementation prodService;

    
	public ProductController(ProductServiceImplementation prodService) {
		super();
		this.prodService = prodService;
	}
    
	@PostMapping("/addProduct")
	public String addProduct(@RequestBody Product prod) {
		return prodService.addProduct(prod);
	}
	
	@PatchMapping("/updateProduct")
	public String updateProduct(@RequestBody Product prod) {
		return prodService.updateProduct(prod);
	}

	@DeleteMapping("/deleteProduct/{prodId}")
	public String deleteProduct(@PathVariable Long prodId) {
		return prodService.deleteProduct(prodId);
	}

	@GetMapping("/viewProduct/{prodId}")
	public Product viewProduct(@PathVariable Long prodId) {
		return prodService.viewProduct(prodId);
	}

	@GetMapping("/viewAllProducts")
	public List<Product> viewAllProducts() {
		return prodService.viewAllProducts();
	}
}

