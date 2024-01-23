import { render, screen, fireEvent } from '@testing-library/react';
import Home, { Banner, Product, ProductList, CategoryContainer } from "../../components/pages/Home";

describe('Banner', () => {

  test('renders Banner', () => {
      
      const banner = {
        id: "1",
        name: "test1",
        price: 1,
        image: "test1",
        description: "test1"
      };
  
      render(<Banner product={banner} />);
    });

});

describe('Product', () => {

  test('renders Product', () => {

    const product = {
      id: "1",
      name: "test1",
      price: 1,
      image: "test1",
      description: "test1"
    };

    render(<Product product={product} />);
  });

  /* test('renders Add to Cart button on click', () => {
      
      const product = {
        id: "1",
        name: "test1",
        price: 1,
        image: "test1",
        description: "test1"
      };
  
      render(<Product product={product} />);
      // click on product
      const productElement = screen.getByTestId("product");
      fireEvent.click(productElement);
      // check if add to cart button is visible
      const addToCartButton = screen.getByText("Add to Cart");
      expect(addToCartButton).toBeVisible();
  }); */

});

describe('ProductList', () => {

  test('renders ProductList', () => {

    const products = [
      {
        id: "1",
        name: "test1",
        price: 1,
        image: "test1",
        description: "test1"
      },
      {
        id: "2",
        name: "test2",
        price: 2,
        image: "test2",
        description: "test2"
      }
    ];

    render(<ProductList products={products} />);
  });

  /* test('scrollbar on hover', () => {

    const products = [
      {
        id: "1",
        name: "test1",
        price: 1,
        image: "test1",
        description: "test1"
      },
      {
        id: "2",
        name: "test2",
        price: 2,
        image: "test2",
        description: "test2"
      }
    ];

    render(<ProductList products={products} />);
    const scroll = screen.getByTestId("scroll");
    fireEvent.mouseOver(scroll);
    expect(scroll).toHaveStyle("overflow-x: auto");
  }); */

});

describe('CategoryContainer', () => {

  test('renders CategoryContainer', () => {

    const category = {
      name: "test1",
      products: [
        {
          id: "1",
          name: "test1",
          price: 1,
          image: "test1",
          description: "test1"
        },
        {
          id: "2",
          name: "test2",
          price: 2,
          image: "test2",
          description: "test2"
        }
      ]
    };

    render(<CategoryContainer category={category} />);
  });

});

describe('Home', () => {

  test('renders Home', () => {
    render(<Home />);
  });

});
