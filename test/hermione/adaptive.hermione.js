
async function checkingAdaptive(browser,width,height,path){
    const puppeteer=await browser.getPuppeteer();
    const [page]=await puppeteer.pages();
    await page.viewport({
        width,height
    });
    await page.goto('http://localhost:3000/hw/store'+path+`?bug_id=${process.env.BUG_ID}`);
    await browser.assertView('plain','.Application',{
        screenhotDelay: 200,
    })
}

describe.skip('Вёрстка должна адаптироваться под ширину экрана в странице Home', async function() {
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1920px', async function({browser}) {
        await checkingAdaptive(browser, 1920,1080,'/');
    }),
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1280px', async function({browser}) {
        await checkingAdaptive(browser, 1280,720,'/');
    }),
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1024px', async function({browser}) {
        await checkingAdaptive(browser, 1024,768,'/');
    })
    it('Верстка главноый страницы должна быть корректной при ширине экрана 820px', async function({browser}) {
        await checkingAdaptive(browser, 820,1180,'/');
    })
    it('Верстка главноый страницы должна быть корректной при ширине экрана 768', async function({browser}) {
        await checkingAdaptive(browser, 768,1024,'/');
    })
})
describe.skip('Вёрстка должна адаптироваться под ширину экрана в странице Catalog', async function() {
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1920px', async function({browser}) {
        await checkingAdaptive(browser, 1920,1080,'/catalog');
    }),
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1280px', async function({browser}) {
        await checkingAdaptive(browser, 1280,720,'/catalog');
    }),
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1024px', async function({browser}) {
        await checkingAdaptive(browser, 1024,768,'/catalog');
    })
    it('Верстка главноый страницы должна быть корректной при ширине экрана 820px', async function({browser}) {
        await checkingAdaptive(browser, 820,1180,'/catalog');
    })
    it('Верстка главноый страницы должна быть корректной при ширине экрана 768', async function({browser}) {
        await checkingAdaptive(browser, 768,1024,'/catalog');
    })
})

describe.skip('Вёрстка должна адаптироваться под ширину экрана в странице Delivery', async function() {
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1920px', async function({browser}) {
        await checkingAdaptive(browser, 1920,1080,'/delivery');
    }),
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1280px', async function({browser}) {
        await checkingAdaptive(browser, 1280,720,'/delivery');
    }),
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1024px', async function({browser}) {
        await checkingAdaptive(browser, 1024,768,'/delivery');
    })
    it('Верстка главноый страницы должна быть корректной при ширине экрана 820px', async function({browser}) {
        await checkingAdaptive(browser, 820,1180,'/delivery');
    })
    it('Верстка главноый страницы должна быть корректной при ширине экрана 768', async function({browser}) {
        await checkingAdaptive(browser, 768,1024,'/delivery');
    })
})
describe.skip('Вёрстка должна адаптироваться под ширину экрана в странице Contacts', async function() {
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1920px', async function({browser}) {
        await checkingAdaptive(browser, 1920,1080,'/contacts');
    }),
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1280px', async function({browser}) {
        await checkingAdaptive(browser, 1280,720,'/contacts');
    }),
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1024px', async function({browser}) {
        await checkingAdaptive(browser, 1024,768,'/contacts');
    })
    it('Верстка главноый страницы должна быть корректной при ширине экрана 820px', async function({browser}) {
        await checkingAdaptive(browser, 820,1180,'/contacts');
    })
    it('Верстка главноый страницы должна быть корректной при ширине экрана 768', async function({browser}) {
        await checkingAdaptive(browser, 768,1024,'/contacts');
    })
})
describe.skip('Вёрстка должна адаптироваться под ширину экрана в странице Cart', async function() {
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1920px', async function({browser}) {
        await checkingAdaptive(browser, 1920,1080,'/cart');
    }),
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1280px', async function({browser}) {
        await checkingAdaptive(browser, 1280,720,'/cart');
    }),
    it('Верстка главноый страницы должна быть корректной при ширине экрана 1024px', async function({browser}) {
        await checkingAdaptive(browser, 1024,768,'/cart');
    })
    it('Верстка главноый страницы должна быть корректной при ширине экрана 820px', async function({browser}) {
        await checkingAdaptive(browser, 820,1180,'/cart');
    })
    it('Верстка главноый страницы должна быть корректной при ширине экрана 768', async function({browser}) {
        await checkingAdaptive(browser, 768,1024,'/cart');
    })
})