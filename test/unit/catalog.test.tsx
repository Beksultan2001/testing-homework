import {render, screen} from '@testing-library/react';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import { ExampleApi, CartApi, LOCAL_STORAGE_CART_KEY } from '../../src/client/api';
import {addToCart, initStore } from '../../src/client/store';
import {setupServer} from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
    rest.get('/hw/store/api/products', (req, res, ctx) => {
      return res(ctx.json([
        { id: 0, name: 'testProduct1', price: 59 },
        { id: 1, name: 'testProduct2', price: 60 },
      ]));
    }),
    rest.get('/hw/store/api/products/0', (req, res, ctx) => {
      return res(ctx.json({ id: 0, name: 'testProduct1', price: 59 }));
    }),
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const basename = '/hw/store';
const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

describe('Каталог', () => {
  it('в каталоге должны отображаться товары, список которых приходит с сервера', async () => {
    render(
      <MemoryRouter initialEntries={['/catalog']}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>,
    );
    const items = await screen.findAllByText(/testProduct/);
    expect(items.length).toBeGreaterThan(1);

    for (let item of items) {
      const name = item.getElementsByTagName('h5');  
      const price = item.getElementsByTagName('p');
      const link = item.getElementsByTagName('a');
      expect(name).toBeTruthy();
      expect(price).toBeTruthy();
      expect(link).toBeTruthy();
    }
  });
  it('для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async () => {
    render(
      <MemoryRouter initialEntries={['/catalog/0']}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
   
    const productName = await screen.findByTestId('product-name');

    expect(productName).toBeTruthy();

    const productDescription = await screen.findByTestId('product-description');
    expect(productDescription).toBeTruthy();

    const productPrice = await screen.findByTestId('product-price');

    expect(productPrice).toBeTruthy();

    const productColor = await screen.findByText('Color');
    expect(productColor).toBeTruthy();

    const productMaterial = await screen.findByText('Material');
    expect(productMaterial).toBeTruthy();

    const addToCartButton = screen.getByText(/add to cart/i);

    const classNames = addToCartButton.className.split(/\s+/);

    expect(classNames).toContain('btn-lg');

    expect(addToCartButton).toBeTruthy();
  });
  it('если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', async () => {
      const product = { id: 123, name: 'testProduct1', price: 59,description: 'sdf',color: 'sfsd',material: 'sdfsdagsdg'};

      store.dispatch(addToCart(product));

      const state = store.getState();
      expect(state.cart[product.id]).toBeTruthy();
      expect(state.cart[product.id].name).toBe('testProduct1');
      expect(state.cart[product.id].price).toBe(59);
      expect(state.cart[product.id].count).toBe(1);
  });
  it('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async () => {
      const product = { id: 1234, name: 'testProduct1', price: 59,description: 'sdf',color: 'sfsd',material: 'sdfsdagsdg',count: 0};

      store.dispatch(addToCart(product));
      store.dispatch(addToCart(product));
  
      const state = store.getState();
      expect(state.cart[product.id].count).toBe(2);
  });
  it('содержимое корзины должно сохраняться между перезагрузками страницы', () => {
      let mockLocalStorage: Record<string, string> = {};
      jest.spyOn(window.localStorage.__proto__, 'setItem');
      window.localStorage.__proto__.setItem = jest.fn((key, value) => {
          mockLocalStorage[key] = value;
      });
      const api = new CartApi();
      const mockCartState = {
          '1': {
              id: 1,
              name: 'Product 1',
              price: 100,
              count: 2,
          },
          '2': {
              id: 2,
              name: 'Product 2',
              price: 200,
              count: 1,
          },
      };
      api.setState(mockCartState);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
          LOCAL_STORAGE_CART_KEY,
          JSON.stringify(mockCartState)
      );
      expect(mockLocalStorage[LOCAL_STORAGE_CART_KEY]).toEqual(JSON.stringify(mockCartState));
  });
});
