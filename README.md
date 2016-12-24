# MarsDate.js
A Javascript Date object for Mars timekeeping and Earth-Mars date/time conversion.

## Updates in 0.0.4
* Completed setTimezone() function.
* Implemented String input.
* Added the placeholder `N` to get the ISO 8601 numeric representation of the sol of the week.
* Now translation friendly.
* Added minified version.
* Better Documentation.

## Todo
* Add `Date.prototype.marsDate` to allow easy conversion between `Date` and `MarsDate` objects.

## Usage

The MarsDate object can be used in a similar fashion to the standard Javascript `Date` object. 

### Initialisation
You may initialise a `MarsDate` object in one of the following ways:
```js

//As undefined which will assume the current date and time in MTC.
var now = new MarsDate();

//With a standard Date object which will convert from a date on Earth to a Mars date.
var dateFromEarthDate = new MarsDate(new Date(1230812388499));

//With a Mars Solar Date MSD based upon the telescopic epoch of 1609.
var dateFromMSD = new MarsDate("172387.12398");

//With Mars milliseconds elapsed since Unix epoch.
var dateFromMillis = new MarsDate(1239182398766);

//With a properly formatted Mars date (year*, month*, date*, hour, minute, second, millisecond) * = required.
var dateFromParams = new MarsDate(217, 3, 14, 12, 16, 18, 261);

//Or with a properly formatted Mars date and time string
var dateFromString = "Jov Sag 12 154";
var dateTimeFromString = "Jov Sag 12 154 12:34:50";

```

###Usage
After initialiing a MarsDate object, you can then do a variety of things with it:

```js

//Let's set a date first - In this case, Elon Musk's birthday.
var d = new MarsDate(new Date(1971, 6, 28));

//We can now export this date in a variety of formats:
console.log(d);  //Mer Kar 25 192 14:23:45 AMT+0000 (AMT) 
console.log(d*1); //48151066900
console.log(a.toJSON()); //192-15-25T14:23:45.787A
console.log(a.toString()); //Mer Kar 25 192 14:23:45 AMT+0000 (AMT)
console.log(a.toDateString()); //Mer Kar 25 192
console.log(a.toISOString()); //192-15-25T14:23:45.787A
console.log(a.toMTCString()); //Mer, 25 Kar 192 14:23:45 AMT

```

###Timezones
You can set your `MarsDate` object to one of many timezones between "-1100" to "+1200". For a full list of timezones,  see: http://www.aresastro.com/2016/03/ares-time-zone-system

```js

d.setTimezone("+1100");
console.log(d); //Jov Kar 26 192 01:23:45 AMT+1100 (CET)

```

### Custom Formatting
There are also a variety of options for custom date formatting. 

```js

//We can also use a custom format like so:
console.log(a.formatDate("yyy mm dd HH:MM:ss")); //192 15 25 14:23:45

```

Custom date formats may consist of the following elements:

Mask | Description
---- | -----------
`d` | Sol of the month as digits; no leading zero for single-digit days.
`dd` | Sol of the month as digits; leading zero for single-digit days.
`ddd` | Sol of the week as a three-letter abbreviation.
`dddd` | Sol of the week as its full name.
`m` | Month as digits; no leading zero for single-digit months.
`mm` | Month as digits; leading zero for single-digit months.
`mmm` | Month as a three-letter abbreviation.
`mmmm` | Month as its full name.
`y` | Year as digits; no leading zero for less than four-digit years.
`yy` | Year as last two digits; leading zero for years less than 10.
`yyyy` | Year represented by four digits; leading zero for years less than 1000.
`h` | Hours; no leading zero for single-digit hours (12-hour clock).
`hh` | Hours; leading zero for single-digit hours (12-hour clock).
`H` | Hours; no leading zero for single-digit hours (24-hour clock).
`HH` | Hours; leading zero for single-digit hours (24-hour clock).
`M` | Minutes; no leading zero for single-digit minutes.
`MM` | Minutes; leading zero for single-digit minutes.
`N` | ISO 8601 numeric representation of the sol of the week.
`o` | AMT/MTC timezone offset, e.g. -0700 or +0300.
`s` | Seconds; no leading zero for single-digit seconds.
`ss` | Seconds; leading zero for single-digit seconds.
`l` |  Milliseconds; gives 3 digits.
`L` | Milliseconds; gives 2 digits.
`t`	| Lowercase, single-character time marker string: a or p.
`tt` | Lowercase, two-character time marker string: am or pm.
`T` | Uppercase, single-character time marker string: A or P.
`TT` | Uppercase, two-character time marker string: AM or PM.
`W` | ISO 8601 week number of the year, e.g. 63
`Z` | Ares timezone abbreviation, e.g. AMT or COT.

(c) 2016 Ares Astro [aresastro.com][areasastro], MIT license.
