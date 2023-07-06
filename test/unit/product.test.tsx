import { screen, render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AxiosResponse } from "axios";
import type { Product as ProductType } from "../../src/common/types";

import React from "react";
import { BrowserRouter, MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";

import { Product } from "../../src/client/pages/Product";
import { ExampleApi, CartApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";


const basename = "";
type ApiProductByIdReturnValue = jest.Mocked<AxiosResponse<ProductType>>;

const fakeProduct: ProductType = {
  id: 1,
  name: "Ugly Pants",
  description: "Keep your ass warm and ugly",
  price: 500,
  color: "random",
  material: "unique",
};

const api = new ExampleApi(basename);

const mockGetProductById = async (
  id: number
): Promise<ApiProductByIdReturnValue> => {
  return new Promise((resolve) =>
    resolve({
      data: { ...fakeProduct, id },
      status: 200,
      statusText: "OK",
      headers: { "": "" },
      config: {},
    })
  );
};

describe("Страничка продукта", () => {
  it("на странице с подробной информацией отображается название товара", async () => {
    api.getProductById = mockGetProductById;
    const cart = new CartApi();
    const store = initStore(api, cart);

    const TestApp = () => {
      return (
        <MemoryRouter initialEntries={[`/catalog/${fakeProduct.id}`]}>
          <Provider store={store}>
            <Route path="/catalog/:id" component={Product}></Route>
          </Provider>
        </MemoryRouter>
      );
    };
    const { container } = render(<TestApp />, { wrapper: BrowserRouter });
    await screen.findByText(fakeProduct.name).then(() => {
      const productName = container.querySelector(".ProductDetails-Name");
      expect(productName.textContent).toEqual(fakeProduct.name);
    });
  });

  it("на странице с подробной информацией отображается описание товара", async () => {
    api.getProductById = mockGetProductById;
    const cart = new CartApi();
    const store = initStore(api, cart);

    const TestApp = () => {
      return (
        <MemoryRouter initialEntries={[`/catalog/${fakeProduct.id}`]}>
          <Provider store={store}>
            <Route path="/catalog/:id" component={Product}></Route>
          </Provider>
        </MemoryRouter>
      );
    };
    const { container } = render(<TestApp />, { wrapper: BrowserRouter });
    await screen.findByText(fakeProduct.name).then(() => {
      const productDescription = container.querySelector(
        ".ProductDetails-Description"
      );
      expect(productDescription.textContent).toEqual(fakeProduct.description);
    });
  });

  it("на странице с подробной информацией отображается цена товара", async () => {
    api.getProductById = mockGetProductById;
    const cart = new CartApi();
    const store = initStore(api, cart);

    const TestApp = () => {
      return (
        <MemoryRouter initialEntries={[`/catalog/${fakeProduct.id}`]}>
          <Provider store={store}>
            <Route path="/catalog/:id" component={Product}></Route>
          </Provider>
        </MemoryRouter>
      );
    };
    const { container } = render(<TestApp />, { wrapper: BrowserRouter });
    await screen.findByText(fakeProduct.name).then(() => {
      const productPrice = container.querySelector(".ProductDetails-Price");
      expect(Number(productPrice.textContent.slice(1))).toEqual(
        fakeProduct.price
      );
    });
  });

  it("на странице с подробной информацией отображается цвет товара", async () => {
    api.getProductById = mockGetProductById;
    const cart = new CartApi();
    const store = initStore(api, cart);

    const TestApp = () => {
      return (
        <MemoryRouter initialEntries={[`/catalog/${fakeProduct.id}`]}>
          <Provider store={store}>
            <Route path="/catalog/:id" component={Product}></Route>
          </Provider>
        </MemoryRouter>
      );
    };
    const { container } = render(<TestApp />, { wrapper: BrowserRouter });
    await screen.findByText(fakeProduct.name).then(() => {
      const productColor = container.querySelector(".ProductDetails-Color");
      expect(productColor.textContent).toEqual(fakeProduct.color);
    });
  });

  it("на странице с подробной информацией отображается материал", async () => {
    api.getProductById = mockGetProductById;
    const cart = new CartApi();
    const store = initStore(api, cart);

    const TestApp = () => {
      return (
        <MemoryRouter initialEntries={[`/catalog/${fakeProduct.id}`]}>
          <Provider store={store}>
            <Route path="/catalog/:id" component={Product}></Route>
          </Provider>
        </MemoryRouter>
      );
    };
    const { container } = render(<TestApp />, { wrapper: BrowserRouter });
    await screen.findByText(fakeProduct.name).then(() => {
      const productMaterial = container.querySelector(
        ".ProductDetails-Material"
      );
      expect(productMaterial.textContent).toEqual(fakeProduct.material);
    });
  });

  it("на странице с подробной информацией отображается кнопка для добавления в корзину", async () => {
    api.getProductById = mockGetProductById;
    const cart = new CartApi();
    const store = initStore(api, cart);

    const TestApp = () => {
      return (
        <MemoryRouter initialEntries={[`/catalog/${fakeProduct.id}`]}>
          <Provider store={store}>
            <Route path="/catalog/:id" component={Product}></Route>
          </Provider>
        </MemoryRouter>
      );
    };
    const { container } = render(<TestApp />, { wrapper: BrowserRouter });
    await screen.findByText(fakeProduct.name).then(() => {
      const addToCartBtn = container.querySelector(
        ".ProductDetails-AddToCart.btn.btn-primary.btn-lg"
      );
      expect(addToCartBtn).not.toBeNull();
    });
  });
});

