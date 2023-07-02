const { assert } = require('chai');

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
});
