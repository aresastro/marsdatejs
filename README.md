# MarsDate.js
A Javascript Date object for Mars timekeeping and Earth-Mars date/time conversion.

## Modifications

* Added `Data.prototype.marsDate` to allow easy conversion between `Date` and `MarsDate` objects.
* Added the placeholder `N` to get the ISO 8601 numeric representation of the day of the week

## Installation

```bash
$ npm install --save marsdatejs
```

## Usage

The MarsDate object can be used in a similar fashion to the standard Javascript `Date` object. You can initialise it:

```js

//As undefined which will assume the current date and time.
var now = new MarsDate();

//With a standard Date object.
var dateFromEarthDate = new MarsDate(new Date(1230812388499));

//With a standard Mars Solar Date (MSD) from the Mars24 equations,
var dateFromMSD = new MarsDate(172387.12398);
//or by setting the 2nd parameter to 1, a Mars Telescopic Solar Date (MTSD) which implements the telescopic epoch as used in the Darian calendar.
var dateFromMTSD = new MarsDate(172387.12398, 1);

//With a standard Mars Solar Date expressed in milliseconds.
var dateFromMillis = new MarsDate(1239182398766);

//Or with a properly formatted Mars date (year*, month*, date*, hour, minute, second, millisecond) * = required.
var dateFromParams = new MarsDate(217, 3, 14, 12, 16, 18, 261);

```

### Formatting options

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
