# Patientco Coding Sample
This is a Web page which displays a list of names, the person's nationality, thier home currency symbol, and the total value of the person's currency holding in USD.

Access the web page at https://joshnunezmsse.github.io/patientco

---
## Approach
The web application is split into three parts:
- The HTML which defines which visual components will be presented
- The CSS which defines what the visual compenets will look like
- The Javascript which ties the data to the visual components and definds behaviours

----
## Possible enhancements
- Additional seperation of concerns could be persued by moving the data pieces into specific objects.
- Lazy loading of AJAX resources
- Better sorting algorithm

----
## Deviations
All total portfolio values are presented in USD because the openexchangerates.org account provided only has USD base currency available.  If multiple base currencies were available there would have been a call added to retrieve the exchange rates for the currency of the current client.  The base exchange rates would also have been cached so multiple calls would not be required as clients from the same base currency are processed.