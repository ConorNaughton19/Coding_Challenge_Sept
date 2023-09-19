const {
  By,
  until,
  Key
} = require('selenium-webdriver');

class HomePage {
  constructor(driver) {
     this.driver = driver;
  }
//link to ryanair website 
  async open() {
     await this.driver.get('https://www.ryanair.com/');
  }


  //accepts pop up cookies so elements are no longer blocked
  async acceptCookies() {
     try {
        await this.driver.sleep(1000);
        const cookiePopup = await this.driver.findElement(By.className('cookie-popup-with-overlay__box'));
        const isDisplayed = await cookiePopup.isDisplayed();

        if (isDisplayed) {
           const acceptButton = await this.driver.findElement(By.className('cookie-popup-with-overlay__button'));
           await acceptButton.click();
        }
     } catch (error) {
        console.error('Error handling cookie popup:', error);
     }
  }

  //clears depaturebox of SHANNON before entering the relevent one 
  async fillDepartureCity(city) {
     const departureInput = await this.driver.wait(until.elementLocated(By.id('input-button__departure')), 10000);
     const initialValue = await departureInput.getAttribute('value');
     const backspaces = Array(initialValue.length).fill(Key.BACK_SPACE).join('');
     await departureInput.sendKeys(backspaces);
     await departureInput.sendKeys(city);
  }


  async fillDestinationCity(city) {
     const destinationInput = await this.driver.wait(until.elementLocated(By.id('input-button__destination')), 10000);
     const initialValue = await destinationInput.getAttribute('value');
     const backspaces = Array(initialValue.length).fill(Key.BACK_SPACE).join('');
     await destinationInput.sendKeys(backspaces);
     await destinationInput.sendKeys(city);

     await this.driver.wait(until.elementLocated(By.css(`span[data-id="${city}"]`)), 10000);
     const cityOption = await this.driver.findElement(By.css(`span[data-id="${city}"]`));
     await cityOption.click();
  }

  async selectDepartureDate(date) {
     await this.driver.sleep(3000);
     const departureDateElement = await this.driver.wait(until.elementLocated(By.css(`div[data-id="${date}"]`)), 10000);
     await departureDateElement.click();
  }

  async selectReturnDate(date) {
     await this.driver.sleep(1000);
     const returnDateElement = await this.driver.wait(until.elementLocated(By.css(`div[data-id="${date}"]`)), 10000);
     await returnDateElement.click();
  }

  async incrementAdults() {
     const adultIncrementButton = await this.driver.wait(
        until.elementLocated(By.xpath('//ry-counter-button[contains(@class, "counter__button") and @tabindex="0"]')),
        2000
     );
     await this.driver.executeScript("arguments[0].click();", adultIncrementButton);
  }

  async clickSearch() {
     const searchButton = await this.driver.findElement(By.css('button[data-ref="flight-search-widget__cta"]'));
     await searchButton.click();
  }

  async waitForNextPage(selector) {
     await this.driver.wait(until.elementLocated(By.css(selector)), 10000);
  }

  async selectFlightByCode(flightCode) {
     try { 
        // Locates relevant flight by flight code "FR3396" for example
        const flightElement = await this.driver.wait(until.elementLocated(By.xpath(`//div[@data-ref='${flightCode}']`)), 10000);
        await flightElement.click();

        // Wait for UI to update
        await this.driver.sleep(1000);
     } catch (error) {
        console.log('Error in selecting flight:', error);
     }
  }

  async clickFareButton() {
     try {
      //wait for UI to update
        await this.driver.sleep(3000);
        // Locates element
        const regularFareButton = await this.driver.findElement(By.css("[data-e2e='fare-card--regular'] button.fare-header__submit-btn"));
        // JavaScript click
        await this.driver.executeScript("arguments[0].click();", regularFareButton);
        console.log("Successfully clicked Regular fare button.");
        await this.driver.sleep(1000);
     } catch (error) {
        console.log("Error clicking Regular fare button:", error);
     }
  }

  async clickLoginLaterButton() {
     try {

        await this.driver.sleep(3000); 
        const loginLaterButton = await this.driver.findElement(By.css('.login-touchpoint__login-later'));
        // Clicks Button
        await loginLaterButton.click();//log made while testing code
        console.log("Successfully clicked Log in Later button.");
        await this.driver.sleep(3000);

     } catch (error) {
        console.log("Error in clicking the Log in Later button:", error);
     }
  }

  async fillPassengerForm(title, firstName, lastName) {
     try {
        // Wait for the title dropdown click to open
        const titleDropdown = await this.driver.wait(until.elementLocated(By.css('button.dropdown__toggle')), 10000);
        await titleDropdown.click();

        // Wait for the title option
        const titleOption = await this.driver.wait(until.elementLocated(By.xpath(`//div[contains(text(), '${title}')]`)), 10000);
        await titleOption.click();

        // Locate and fill in first name field
        const firstNameInput = await this.driver.wait(until.elementLocated(By.css('input[name="form.passengers.ADT-0.name"]')), 10000);
        await firstNameInput.sendKeys(firstName);

        // Locate & fill in last name field
        const lastNameInput = await this.driver.wait(until.elementLocated(By.css('input[name="form.passengers.ADT-0.surname"]')), 10000);
        await lastNameInput.sendKeys(lastName);

     } catch (error) {
        console.error('Error filling out the passenger form:', error);
     }
  }

  async fillSecondPassengerForm(title, firstName, lastName) {
     try {
        const titleDropdowns = await this.driver.wait(
           until.elementsLocated(By.css('button.dropdown__toggle')),
           10000
        );

        // Click the second passenger's title dropdown (assuming it's the second dropdown in the DOM)
        //had to use DOM since both dropdown boxes had exact same element and would override the first title selection here
        await titleDropdowns[1].click();

        const titleOption = await this.driver.wait(
           until.elementLocated(By.xpath(`//div[contains(text(), '${title}')]`)),
           10000
        );
        await titleOption.click();

        // Locate & fill in first name field for second passenger
        const firstNameInput = await this.driver.wait(
           until.elementLocated(By.css('input[name="form.passengers.ADT-1.name"]')),
           10000
        );
        await firstNameInput.sendKeys(firstName);

        // Locate & fill in last name field for second passenger
        const lastNameInput = await this.driver.wait(
           until.elementLocated(By.css('input[name="form.passengers.ADT-1.surname"]')),
           10000
        );
        await lastNameInput.sendKeys(lastName);
         //"Continue" button
      const continueButton = await this.driver.wait(
        until.elementLocated(By.css('button.continue-flow__button')),
        10000
      );
      await continueButton.click();
    } catch (error) {
      console.error('Error filling out the second passenger form:', error);
    }
  }
  async selectSeatsForFirstFlight(seat1, seat2) {
    try {
      console.log('Selecting seats for first flight');
      await this.driver.wait(until.elementLocated(By.id(seat1)), 10000);
      const selectedSeat1 = await this.driver.findElement(By.id(seat1));
      const selectedSeat2 = await this.driver.findElement(By.id(seat2));
      await selectedSeat1.click();
      await selectedSeat2.click();
      //sleeps to make sure UI updates and elements arent blocked
      await this.driver.sleep(5000);
  
      console.log('Clicking Next flight button for first flight');
      await this.driver.wait(until.elementLocated(By.css('button[data-ref="seats-action__button-next"]')), 10000);
      const nextFlightButton = await this.driver.findElement(By.css('button[data-ref="seats-action__button-next"]'));
      await nextFlightButton.click();
      await this.driver.sleep(5000);

    } catch (error) {
      console.error('Error selecting seats for first flight:', error);
      throw error;
    }
  }
  
  async selectSeatsForSecondFlight(seat3, seat4) {
    try {
      console.log('Selecting seats for second flight');
      await this.driver.wait(until.elementLocated(By.id(seat3)), 10000);
      const selectedSeat1 = await this.driver.findElement(By.id(seat3));
      const selectedSeat2 = await this.driver.findElement(By.id(seat4));
      await selectedSeat1.click();
      await selectedSeat2.click();
      await this.driver.sleep(5000);
  
      console.log('Clicking Continue button for second flight');
      await this.driver.wait(until.elementLocated(By.css('button[data-ref="seats-action__button-continue"]')), 10000);
      const continueButton = await this.driver.findElement(By.css('button[data-ref="seats-action__button-continue"]'));
      await continueButton.click();
    } catch (error) {
      console.error('Error selecting seats for second flight:', error);
      throw error;
    }
  }
  
  
  async dismissPopupsAndContinue() {
    try {
      await this.driver.wait(until.elementLocated(By.css('button[data-ref="enhanced-takeover-beta-desktop__dismiss-cta"]')), 10000);
      const noThanksButton = await this.driver.findElement(By.css('button[data-ref="enhanced-takeover-beta-desktop__dismiss-cta"]'));
      await noThanksButton.click();
    } catch (error) {
      console.warn('Could not find "No Thanks" option', error);
    }
  
    try {
      await this.driver.wait(until.elementLocated(By.css('button[data-ref="bags-continue-button"]')), 10000);
      const continueButton = await this.driver.findElement(By.css('button[data-ref="bags-continue-button"]'));
      await continueButton.click();
    } catch (error) {
      this.handleError(error, 'Error in clicking the bags continue button');
    }
  }
  
  handleError(error, message) {
    console.error(`${message}: ${error}`);
  }
  }
module.exports = HomePage;