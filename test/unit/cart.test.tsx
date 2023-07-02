import {render, screen, within} from '@testing-library/react';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import { ExampleApi, CartApi } from '../../src/client/api';
import {initStore } from '../../src/client/store';
import {setupServer} from 'msw/node';
import { rest } from 'msw';
import {createStore} from 'redux';
import configureStore from 'redux-mock-store'; 

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


describe('Корзина', () => {
    it('в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', () => {
      const mockStore = createStore((state) => state, {
        cart: {
          '1': { id: 1, name: 'Product 1', price: 100, count: 1 },
          '2': { id: 2, name: 'Product 2', price: 200, count: 1 },
          '3': { id: 2, name: 'Product 3', price: 432, count: 1 },
        },
      });
  
      render(
        <MemoryRouter initialEntries={['/catalog']}>
          <Provider store={mockStore}>
            <Application />
          </Provider>
        </MemoryRouter>,
      );
  
      const cartCounter = screen.getByTestId('cart-counter');
      expect(cartCounter.textContent).toContain('3');
    }),
    it('в корзине должна отображаться таблица с добавленными в нее товарами', () => {
      const mockState = {
        cart: {
          1: {
            id: 1,
            name: 'Product 1',
            price: 100,
            count: 2,
            total: 200,
          },
          2: {
            id: 2,
            name: 'Product 2',
            price: 200,
            count: 1,
            total: 200,
          },
        },
      };
  
      const mockStore = createStore(() => mockState);
  
      render(
        <MemoryRouter initialEntries={['/cart']}>
          <Provider store={mockStore}>
            <Application />
          </Provider>
        </MemoryRouter>,
      );    
  
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(Object.keys(mockState.cart).length + 2);
  
    })
    it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться  ', () => {
      const mockState = {
        cart: {
          1: {
            id: 1,
            name: 'Product 1',
            price: 100,
            count: 2,
            total: 200,
          },
          2: {
            id: 2,
            name: 'Product 2',
            price: 200,
            count: 1,
            total: 200,
          },
        },
      };
      const mockStore = createStore(() => mockState);
      render(
        <MemoryRouter initialEntries={['/cart']}>
          <Provider store={mockStore}>
            <Application />
          </Provider>
        </MemoryRouter>,
      );    
      const rows = screen.getAllByRole('row');
      rows.forEach((row, index) => {
        if (index > 0 && index < rows.length - 1) { 
          const id = row.getAttribute('data-testid')?.split('-')[1]; 
          const product = Object.values(mockState.cart)[index - 1]; 
          expect(within(row).getByTestId(`row-${id}-cell-1`).textContent).toBe(String(index));
          expect(within(row).getByTestId(`row-${id}-cell-2`).textContent).toBe(product.name);
          expect(within(row).getByTestId(`row-${id}-cell-3`).textContent).toBe(`$${product.price}`);
          expect(within(row).getByTestId(`row-${id}-cell-4`).textContent).toBe(String(product.count));
          expect(within(row).getByTestId(`row-${id}-cell-5`).textContent).toBe(`$${product.count * product.price}`);
        }
      });
    }),
    it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
      
      const initialState = {
        cart: {},
    };
  
    const mockStore = configureStore();
    const store = mockStore(initialState);
      
      render(
        <MemoryRouter initialEntries={['/cart']}>
          <Provider store={store}>
            <Application />
          </Provider>
        </MemoryRouter>,
      );    
  
      const catalogLink = await screen.findByTestId('linktomain');
      expect(catalogLink).toBeTruthy();
  
    })
  
  });
  
  