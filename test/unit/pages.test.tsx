import {render, screen} from '@testing-library/react';
import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import { ExampleApi, CartApi } from '../../src/client/api';
import {initStore } from '../../src/client/store';
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



describe('в магазине должны быть страницы: главная, каталог, условия доставки, контакты && страницы главная, условия доставки, контакты должны иметь статическое содержимое', () => {
    it('главная', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Provider store={store}>
            <Application />
          </Provider>
        </MemoryRouter>,
      );
      expect(screen.getByText('Welcome to Example store!')).toBeTruthy();
    });
  
    it('каталог', () => {
      render(
        <MemoryRouter initialEntries={['/catalog']}>
          <Provider store={store}>
            <Application />
          </Provider>
        </MemoryRouter>,
      );
      expect(screen.getByRole('heading', { name: /catalog/i })).toBeTruthy();
    });
    it('условия доставки', () => {
      render(
        <MemoryRouter initialEntries={['/delivery']}>
          <Provider store={store}>
            <Application />
          </Provider>
        </MemoryRouter>,
      );
      expect(screen.getByRole('heading', { name: /delivery/i })).toBeTruthy();
    });
    it('контакты', () => {
      render(
        <MemoryRouter initialEntries={['/contacts']}>
          <Provider store={store}>
            <Application />
          </Provider>
        </MemoryRouter>,
      );
      expect(screen.getByRole('heading', { name: /contacts/i })).toBeTruthy();
    });
    it('доставки', () => {
      render(
        <MemoryRouter initialEntries={['/cart']}>
          <Provider store={store}>
            <Application />
          </Provider>
        </MemoryRouter>,
      );
      expect(screen.getByRole('heading', { name: /cart/i })).toBeTruthy();
    });
  });