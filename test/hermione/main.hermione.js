const { assert } = require('chai');

let bug_id = '';
let add_url= ``
if (process.env.BUG_ID !== undefined) {
    bug_id = process.env.BUG_ID
    add_url=`/?bug_id=${bug_id}`; 
}
let base_url=`http://localhost:3000/hw/store`;
let bug_url=`http://localhost:3000/hw/store?bug_id=${bug_id}`;
let main_url=base_url+add_url; 



describe('Общие требования:', async function() {
    it('в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(`http://localhost:3000/hw/store?bug_id=${process.env.BUG_ID}`);
        await page.waitForSelector(".navbar", { timeout: 5000});
        const headerLinks = await page.evaluate(() => {
            const header = document.querySelector('.navbar');
            const links = header.querySelectorAll('a');
            const hrefs = Array.from(links).map(link => link.getAttribute('href'));
            return hrefs;
        });
        expect(headerLinks).toContain('/hw/store/cart');
    });
    it('название магазина в шапке должно быть ссылкой на главную страницу', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(`http://localhost:3000/hw/store?bug_id=${process.env.BUG_ID}`);
        await page.waitForSelector(".navbar", { timeout: 5000});
        const navbarBrandTitle = await page.evaluate(() => {
            const navbarBrand = document.querySelector('.navbar-brand');
            return navbarBrand.getAttribute('href');
        });
        console.log(navbarBrandTitle,'navbarBrandTitle')
        expect(navbarBrandTitle).toEqual('/hw/store/');
    });
    it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async function({browser}) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(`http://localhost:3000/hw/store?bug_id=${process.env.BUG_ID}`);
        await page.setViewport({ width: 575, height: 800 });
        const isMenuHidden = await page.evaluate(() => {
            const navbarButton = document.querySelector('.navbar-toggler');
            const navbarButtonStyle = getComputedStyle(navbarButton);
            const navbarButtonIsVisible = navbarButtonStyle.getPropertyValue('display') !== 'none';
            return true && navbarButtonIsVisible;
        });
        assert.isTrue(isMenuHidden, 'Меню не скрывается за "гамбургером" на узком экране');
    });
    it('при выборе элемента из меню "гамбургера", меню должно закрываться', async function({ browser }) {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(`http://localhost:3000/hw/store?bug_id=${process.env.BUG_ID}`);
        await page.setViewport({ width: 575, height: 800 });
        await page.click('.navbar-toggler');
        await page.click('.nav-link');
        await page.waitForTimeout(500);
        const isMenuVisible = await page.evaluate(() => {
            const menu = document.querySelector('.Application-Menu');
            const menuStyle = getComputedStyle(menu);
            return menuStyle.getPropertyValue('display') !== 'none';
        });
        assert.isFalse(isMenuVisible, 'Меню не закрывается при выборе элемента из меню "гамбургера"');
    });
    describe("Тест информации продукта (BUG_ID=2,3,5,6,9,10)", async function () {
        it("Тест информации продукта", async function ({ browser }) {
            const puppeteer = await browser.getPuppeteer();
            const [page] = await puppeteer.pages();
    
            await browser.url("http://localhost:3000/hw/store" + add_url);
    
            await page.goto("http://localhost:3000/hw/store/catalog" + add_url);
    
            const searchResultSelector = ".ProductItem-DetailsLink";
            await page.waitForSelector(searchResultSelector, { timeout: 1000 });
            await page.click(searchResultSelector);
    
            const detailsSelector = ".ProductDetails";
            await page.waitForSelector(detailsSelector, { timeout: 1000 });
    
            const nameSelector = ".ProductDetails-Name";
            await page.waitForSelector(nameSelector, { timeout: 1000 });
    
            const descSelector = ".ProductDetails-Description";
            await page.waitForSelector(descSelector, { timeout: 1000 });
    
            const priceSelector = ".ProductDetails-Price";
            await page.waitForSelector(priceSelector, { timeout: 1000 });
    
            const colorSelector = ".ProductDetails-Color";
            await page.waitForSelector(colorSelector, { timeout: 1000 });
    
            const materialSelector = ".ProductDetails-Material";
            await page.waitForSelector(materialSelector, { timeout: 1000 });
    
            const buttonSelector = ".ProductDetails-AddToCart";
            await page.waitForSelector(buttonSelector, { timeout: 1000 });
    
            const imageSelector = ".Image";
            await page.waitForSelector(imageSelector, { timeout: 1000 });
    
            await browser.assertView("product_details_content", ".ProductDetails", {
                ignoreElements: [
                    ".ProductDetails-Name",
                    ".ProductDetails-Description",
                    ".ProductDetails-Price",
                    ".ProductDetails-Color",
                    ".ProductDetails-Material",
                    ".Image",
                ],
            });
        });
    });
});
