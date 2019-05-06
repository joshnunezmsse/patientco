window.addEventListener("load", function () {

    /**
     * this is the "constructor" function of the PortfolioList and is used to create
     * the display elements of the PortfolioList and add any behaviours needed 
     */
    var PortfolioList = function (e) {
        // there two variables are used to ensure processing of data doesn't happen
        //   until all the data has been loaded into memory
        var requiredSources = 4;
        var sourceCount = 0;

        // loadResource calls are used to import data from sources specified on the
        // PortfolioList configuration in the HTML
        loadResource(e.attributes["data-countryList"].value, function(d) {
            e.CountryData = JSON.parse(d.responseText);
            sourceCount++;
            if (sourceCount >= requiredSources) {
                loadUI(e);
            }
        });
    
        loadResource(e.attributes["data-currencyList"].value, function(d) {
            e.CurrencyData = JSON.parse(d.responseText);
            sourceCount++;
            if (sourceCount >= requiredSources) {
                loadUI(e);
            }
        });
    
        loadResource(e.attributes["data-clientList"].value, function(d) {
            e.ClientData = JSON.parse(d.responseText).portfolios;
            sourceCount++;
            if (sourceCount >= requiredSources) {
                loadUI(e);
            }
        });

        loadResource(e.attributes["data-exchangeRateList"].value, function(d) {
            e.ExchangeRates = JSON.parse(d.responseText).rates;
            sourceCount++;
            if (sourceCount >= requiredSources) {
                loadUI(e);
            }            
        })
    }

    /**
     * Update the UI based on the data that has been loaded
     */
    var loadUI = function (e) {
        var newClient = e.querySelector(".client");
        var clientTemplate = newClient.cloneNode(true);
        var usdSymbol = getCountryCurrency(e, "USD").symbol;

        for(var i=0; i < e.ClientData.length; i++) {
            newClient.countryInfo = getCountry(e, e.ClientData[i].countryCode);
            newClient.countryInfo.currency = getCountryCurrency(e, newClient.countryInfo.currencyCode);
            newClient.portfolioValue = calculatePortfolioValue(e, e.ClientData[i]);
            newClient.querySelector("#client-name").innerHTML = e.ClientData[i].name;
            newClient.querySelector("#client-nationality").innerHTML = newClient.countryInfo.name;
            newClient.querySelector("#portfolio-value").innerHTML = newClient.countryInfo.currency.symbol + " " +
                                                                    Math.round(newClient.portfolioValue * e.ExchangeRates[newClient.countryInfo.currencyCode]);
            insertClient(e, newClient);
            newClient = clientTemplate.cloneNode(true);
        }
    }

    /**
     * simple binary insert to find the correct place place the new client so the list
     * is ordered.  Clients will be inserted into the list based on the value of thier 
     * portfolio in USD.  Could be enhances with a different algorithm.
     */
    var insertClient = function(e, client) {
        var done = false;
        var clientList = e.querySelectorAll(".client");
        var listLength = clientList.length;

        if (listLength <= 0) {
            e.appendChild(client);
            done = true;
        } else if (clientList[0].portfolioValue > client.portfolioValue) {
            clientList[0].insertAdjacentElement("beforebegin", client);
            done = true;
        } else if (listLength == 1) {
            clientList[0].insertAdjacentElement("afterend", client);
            done = true;
        }

        for (var i=0; i < listLength - 1 && !done; i++) {
            if (clientList[i].portfolioValue <= client.portfolioValue &&
                client.portfolioValue < clientList[i+1].portfolioValue) {
                clientList[i].insertAdjacentElement("afterend", client);
                done = true;
            }
        }

        if (!done) {
            if (clientList[i].portfolioValue > client.portfolioValue) {
                clientList[i].insertAdjacentElement("beforebegin", client)
            } else {
                clientList[i].insertAdjacentElement("afterend", client)
            }
            done = true;
        }
    }

    var calculatePortfolioValue = function (e, client) {
        var returnValue = 0;
        for (var i=0; i < client.fxAssets.length; i++) {
            var factor = e.ExchangeRates[client.fxAssets[i].currencyCode]
            returnValue += client.fxAssets[i].amount / factor;
        }
        return Math.round(returnValue);
    }

    var getCountry = function (e, code) {
        var returnCountry = null;
        for (var i=0; i < e.CountryData.length && !returnCountry; i++) {
            if (e.CountryData[i].code === code) {
                returnCountry = e.CountryData[i];
            }
        }
        return returnCountry;
    }

    var getCountryCurrency = function(e, code) {
        var returnCurrency = null;
        for (var i=0; i < e.CurrencyData.length && !returnCurrency; i++) {
            if (e.CurrencyData[i].isoCode === code) {
                returnCurrency = e.CurrencyData[i];
            }
        }
        return returnCurrency;
    }

    var loadResource = function(fileName, callback) {
        var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open("GET", fileName, true);
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == "200") {
                callback(request)
            }
        }
        request.send();
    };

    // only the first portfoliolist on the document will get functionality
    var portfolioElement = document.querySelector(".PortfolioList");
    if (portfolioElement) {
        PortfolioList(portfolioElement);
    }
});