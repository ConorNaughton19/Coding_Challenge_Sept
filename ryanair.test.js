const {
    Builder,
    By,
    until
 } = require('selenium-webdriver');
 const HomePage = require('./HomePage');
 
 describe('Ryanair Test Suite', () => {
    let driver;
    let homePage;
 
    beforeAll(async () => {
       driver = await new Builder().forBrowser('chrome').build();
       homePage = new HomePage(driver);
    });
 
    afterAll(async () => {
       await driver.quit();
    });
 
    it('Should load the ryanair homepage', async () => {
       try {
          await homePage.open();
       } catch (error) {
          console.error('Test failed with error:', error);
          throw error;
       }
    });
 
    it('Should fill in flight information and search for flight', async () => {
       try {
          await homePage.acceptCookies();
          await homePage.fillDepartureCity('Dublin');
          await homePage.fillDestinationCity('BCN');
          await homePage.selectDepartureDate('2023-09-22');
          await homePage.selectReturnDate('2023-09-30');
          await homePage.incrementAdults();
          await homePage.clickSearch();
 
        //waits to make sure an element of the expected next page appears before concluding 
          await driver.wait(until.elementLocated(By.css('body > app-root > flights-root > div > div > div > div > flights-breadcrumbs > ry-breadcrumb > ul > li:nth-child(2) > span')), 4000);
 
       } catch (error) {
          console.error('Test failed with error:', error);
          throw error;
       }
    });
 
    it('Should select flight by code', async () => {
       await homePage.selectFlightByCode("FR 3977");
       await homePage.selectFlightByCode("FR 3976");
       await homePage.clickFareButton();
    });
 
    it('Should click Log in later', async () => {
       await homePage.clickLoginLaterButton();
    });
 
    it('Should fill out the passenger information', async () => {
        try {
          await homePage.fillPassengerForm('Mr', 'Conor', 'Naughton');
          await homePage.fillSecondPassengerForm('Ms', 'Mary', 'Ann');
        } catch (error) {
          console.error('Test failed:', error);
          throw error;
        }
      });

    it('Should choose seats for the trip thee and the trip back', async () => {
        try {
          await homePage.selectSeatsForFirstFlight('seat-32B', 'seat-32C');
          await homePage.selectSeatsForSecondFlight('seat-35B', 'seat-35C');
        } catch (error) {
          console.error('Test failed with error:', error);
          throw error;
        }
      });
      
      it('Dismiss Pop up and navigate to final page', async () => {
        try {
          await homePage.dismissPopupsAndContinue();
        } catch (error) {
          console.error('Test failed with error:', error);
          throw error;
        }
      });      
 });