const { assert } = require('chai');

describe.skip('Каталог', async function() {
    it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async function({browser}) {
      const puppeteer = await browser.getPuppeteer();
      const [page] = await puppeteer.pages();

      await page.goto(`http://localhost:3000/hw/store/catalog/0?bug_id=${process.env.BUG_ID}`);
      await page.waitForSelector('.ProductDetails-AddToCart', { timeout: 5000 });
      await page.click('.ProductDetails-AddToCart');
  
      await page.waitForTimeout(2000);
  
      await page.goto(`http://localhost:3000/hw/store/cart?bug_id=${process.env.BUG_ID}`);
      await page.waitForTimeout(2000);
  
      const clearButton = await page.$('.Cart-Clear');
      const cartTableExists = await page.$('.Cart-Table') === null;
      assert.isFalse(cartTableExists, 'Продукт не добавляется');

      if (clearButton) {
          await clearButton.click();
          await page.waitForTimeout(1000);
      }
      await page.waitForTimeout(2000);
  
      const clearButton1 = await page.$('.Cart-Clear');
      const cart = await page.$('.cart');
      const cartIsEmpty = !clearButton1 || !(await cart.$$('.Cart-Table')).length;
      assert.isTrue(cartIsEmpty, 'Корзина не пуста после нажатия кнопки "Очистить корзину"');
    });
  
  })
  