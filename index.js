#!/usr/bin/env node


'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = splitSVG;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _svgfont2glyphs = require('svgfont2glyphs');

var _svgfont2glyphs2 = _interopRequireDefault(_svgfont2glyphs);

var _mkdirp = require('mkdirp');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadAliases(less) {
  const re = /@fa-var-([a-z0-9-]+)\s*:\s*"\\([0-9a-f]+)";/g;
  const m = {}; // unicode hex -> [alias0, alias1, alias2, ...]

  let match;
  while (null !== (match = re.exec(less))) {
    const alias = match[1];
    const unicode_hex = match[2];

    if (!(unicode_hex in m)) {
      m[unicode_hex] = [];
    }
    m[unicode_hex].push(alias);
  }

  return m;
}

function loadFile(path) {
  return _fs2.default.readFileSync(require.resolve(`@fortawesome/fontawesome-free-webfonts/${path}`), 'utf8');
}

function extractGlyphs(path, aliases, { dir, color, verbose }) {
  let glyphs = (0, _svgfont2glyphs2.default)(loadFile(path));

  (0, _mkdirp.sync)(dir);

  for (let g of glyphs) {
    for (let alias of aliases[g.unicode_hex] || []) {
      const path = `${dir}/fa-${alias}.svg`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${g.width} ${g.height}"><path fill="${color}" d="${g.path}" /></svg>`;
      _fs2.default.writeFileSync(path, svg);

      if (verbose) {
        console.log(`Extracted ${path}`);
      }
    }
  }
}

function splitSVG(dir, color = 'currentColor', verbose = false) {
  const aliases = loadAliases(loadFile('less/_variables.less'));

  extractGlyphs('webfonts/fa-regular-400.svg', aliases, { dir, color, verbose });
  extractGlyphs('webfonts/fa-brands-400.svg', aliases, { dir: `${dir}/brands`, color, verbose });
  extractGlyphs('webfonts/fa-solid-900.svg', aliases, { dir: `${dir}/solid`, color, verbose });
}

function run() {
  const args = (0, _minimist2.default)(process.argv.slice(2));
  const usage = `Usage: ${process.argv[1]} --dir OUTPUT_DIR [--color '#000'] [--verbose]`;

  if (args.help || args.h) {
    console.log(usage);
    return;
  }

  if (!args.dir) {
    console.log(usage);
    return;
  }

  splitSVG(args.dir || args.d, args.color || args.c, args.verbose || args.v);
}

if (require.main === module) {
  run();
}

