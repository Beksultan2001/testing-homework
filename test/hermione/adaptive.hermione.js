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

describe('Адаптивность', async () => {
    const windowSizes = [1399, 1199, 991, 767, 575];
    windowSizes.forEach((w) => adaptivePage(w));
  
    function adaptivePage(width) {
      it(`Адаптивность ${width + 1}`, async ({ browser }) => {
        await browser.setWindowSize(width, 1080);
        await browser.url(main_url);
  
        const page = await browser.$('.Application');
        await page.waitForExist();
  
        await browser.assertView(`plain${width + 1}`, '.Application', {
          screenshotDelay: 1000,
          compositeImage: true,
        });
      });
    }
  });
