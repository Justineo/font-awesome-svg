# fa2svg

Split [Font Awesome](https://fontawesome.com/icons) icons into
individual SVG files.



## Installation

```sh
npm install -g fa2svg
```



## CLI Usage


```sh
fa2svg --dir OUTPUT_DIR [--color '#000' ] [--verbose]
```


## API Usage


```JavaScript
var fa2svg = require('fa2svg');
var dir = 'fa-svg';
var color = '#fff';
ver verbose = true;
fa2svg(dir, color, verbose);
```



## Development


Transpile source code from ES6 to ES5 for distribution.


```sh
npm run build
```
