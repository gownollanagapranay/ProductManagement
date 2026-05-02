package project.productmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import project.productmanagement.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
