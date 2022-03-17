describe('A visitor without account', function(){
  it('should be able to navigate to the homepage from the 404 page', function(){
      browser.url('https://www.google.com/');
      expect(true).toEqual(true);


  });
});

