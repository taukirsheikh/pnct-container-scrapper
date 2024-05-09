const puppeteer = require('puppeteer');
const fs = require('fs');
//Scraping pnct data
(async (id1, id2, id3) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://pnct.net/');
    await page.waitForSelector('form');
    await page.click('.select-dropdown')
    await page.waitForSelector('ul.dropdown-content.select-dropdown');


    await page.click('ul.dropdown-content.select-dropdown li:nth-child(2)');
    await page.type('textarea', `${id1}, ${id2},${id3}`)
    await page.click('#btnTosInquiry')

    
    // Wait for the table to appear
    // await page.waitForSelector('table.table');
    await page.waitForSelector('tbody tr.ng-scope')

    const containerData = await page.evaluate(() => {
        const headers = Array.from(document.querySelectorAll('th')).map(head => head.textContent);
        const rows = Array.from(document.querySelectorAll('table.table tbody tr'));
        
        const rowData = rows.map(row => {
            const rData = Array.from(row.querySelectorAll('td'));
            const rowDataObj = {};
            rData.forEach((tdData, index) => {
                rowDataObj[headers[index]] = tdData.textContent;
            });
            return rowDataObj;
        });
    
        return rowData;
    });
    
    const containerDatas = JSON.stringify(containerData,null,1);
    console.log(containerDatas)
    fs.writeFileSync('containerData.json', containerDatas);
 
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds 

    await browser.close();
})("ACLU9830414", "GCNU1280758", "FCIU5964083");