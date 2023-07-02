const axios = require("axios");
const { assert } = require('chai');

describe('Cart', () => {
    it('При оформлении заказа с сообщение с валидным номером заказа', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        await page.goto(`http://localhost:3000/hw/store/catalog/0?bug_id=${process.env.BUG_ID}`);

        await page.waitForXPath("//*[text()='Add to Cart']");
        const addToCartButton = await page.$x("//*[text()='Add to Cart']");
        await addToCartButton[0].click();
        await page.goto(`http://localhost:3000/hw/store/cart?bug_id=${process.env.BUG_ID}`);

        await page.type('#f-name', 'Ivan Ivanov');

        await page.type('#f-phone', '9999999999');

        await page.type('#f-address', 'Address');
        await page.waitForTimeout(2000);

        await page.click('.Form-Submit');

        await page.waitForTimeout(2000);

        const phoneErrorMsg = await page.$('.invalid-feedback');
        assert.isNull(phoneErrorMsg,'Phone is invalid');

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
