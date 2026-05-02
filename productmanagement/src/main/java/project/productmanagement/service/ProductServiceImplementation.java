package project.productmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project.productmanagement.entity.Product;
import project.productmanagement.repository.ProductRepository;

@Service
public class ProductServiceImplementation implements ProductService{
  
	ProductRepository prodRepo;
	
	@Autowired
	public ProductServiceImplementation(ProductRepository prodRepo) {
		super();
		this.prodRepo = prodRepo;
	}
	

	@Override
	public String addProduct(Product prod) {
		prodRepo.save(prod);
		return "Product Added Successfully...";
	}

	@Override
	public String updateProduct(Product prod) {
		prodRepo.save(prod);
		return "Product Updated Successfully...";
	}

	@Override
	public String deleteProduct(Long prodId) {
		prodRepo.deleteById(prodId);
		return "Product deleted Successfully...";
	}

	@Override
	public Product viewProduct(Long prodId) {
		return prodRepo.findById(prodId).orElse(null);
	}

	@Override
	public List<Product> viewAllProducts() {
		return prodRepo.findAll();
	}


	
	
	

}
