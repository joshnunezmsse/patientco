window.addEventListener("load", function () {

    window.CountryData = null;
    window.CurrentcyData = null;
    window.PortfolioData = null;

    var loadLocalResource = function(fileName, callback) {
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

    loadLocalResource("ForExInputs/Country.json", function(d) {
        print(d);
        window.CountryData = JSON.parse(d);
    });

    loadLocalResource("ForExInputs/CurrencyCode.json", function(d) {
        print(d);
    });

    loadLocalResource("ForExInputs/portfolio.json", function(d) {
        print(d);
    });
})