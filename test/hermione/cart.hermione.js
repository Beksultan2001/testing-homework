const axios = require("axios");
const { assert } = require('chai');

describe('Cart', () => {
    it('При оформлении заказа с сообщение с валидным номером заказа', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.goto(`http://localhost:3000/hw/store/catalog/0?bug_id=${process.env.BUG_ID}`);

        await page.waitForTimeout(2000);

        await page.waitForSelector('.ProductDetails-AddToCart', { timeout: 5000 });
        await page.click('.ProductDetails-AddToCart');
  
        await page.waitForTimeout(2000);

        const addToCartButton = await page.$x("//*[text()='Add to Cart']");
        await addToCartButton[0].click();
        await page.waitForTimeout(2000);

        const CartBadge = await page.$('.CartBadge'); 
        assert.isNotNull(CartBadge, 'Продукт не добавляется');
        await page.click('.navbar-nav a[href="/hw/store/cart"]');        
        await page.type('#f-name', 'Ivan Ivanov');

        await page.type('#f-phone', '87716120025');

        await page.type('#f-address', 'Address');
        await page.waitForTimeout(2000);
        await page.click('.Form-Submit');
        await page.waitForTimeout(2000);  

        const phoneErrorMsg = await page.$('.invalid-feedback');
        assert.isNull(phoneErrorMsg,'Не удалось оформить заказ');

        const SuccessMessage = await page.$('.Cart-SuccessMessage');
        const successMessageClass = await page.evaluate(el => el.className, SuccessMessage);
        
        assert.include(successMessageClass, 'alert-success', 'Success message does not contain "alert-success" class');
        await page.waitForTimeout(2000);

        const orderNumberElement = await page.waitForSelector('.Cart-Number'); 
        const orderNumber = await page.evaluate(el => el.textContent, orderNumberElement);

        const response = await axios.get(`http://localhost:3000/hw/store/api/orders?bug_id=${process.env.BUG_ID}`);
        const latestOrders = response.data;
        
        assert.equal(orderNumber, latestOrders[latestOrders.length-1]?.id?.toString());
    });
});
