const { remote } = require('webdriverio');



describe('webdriver test', () => {
    it('webdriver', async () => {
    
        const browser = await remote({
            capabilities: {
                browserName: 'chrome'
            }
        })
        
        browser.url('http://localhost:3000')
        
           
        
        
    });
});
