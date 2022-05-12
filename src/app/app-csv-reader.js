import MODULE_NAME from './app.js';

angular.module(MODULE_NAME)
    .run([
        run
    ]);

function run() {
    String.prototype.csv_reader = function() {

        // http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
        // Check to see if the delimiter is defined. If not, then default to comma.
        let strDelimiter = "\t";
        let strData = this;

        // @todo Hack: If first cell is empty, add a dash to avoid fuckup
        if (strData.substr(0, 1) == strDelimiter)
            strData = '-' + strData;

        // Hack2: Remove trailing newline
        if (strData.slice(-2) == "\r\n")
            strData = strData.substring(0, strData.length - 2);
        else if (strData.slice(-1) == "\r")
            strData = strData.substring(0, strData.length - 1);
        else if (strData.slice(-1) == "\n")
            strData = strData.substring(0, strData.length - 1);


        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp((
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]‌*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );


        // Create an array to hold our data. Give the array a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern matching groups.
        var arrMatches = null;

        // Keep looping over the regular expression matches until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];

            // Check to see if the given delimiter has a length (is not the start of string) and if it matches field delimiter. If id does not, then we know that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
            ) {

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );
            }
            else {
                // We found a non-quoted value.
                var strMatchedValue = arrMatches[3];
            }

            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }

        // Return the parsed data.
        return (arrData);
    }
}