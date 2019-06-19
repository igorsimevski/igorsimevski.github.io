var UglifyJS = require('uglify-js');
var CleanCSS = require('clean-css');
var fs = require('fs');
require('shelljs/global');
require('colors');

var fileConf = require('./files.conf.js')
var CSSJSfiles = fileConf.CSSJSfiles;

nowDate = new Date();
nowDateStr = nowDate.toISOString().slice(0, 10).replace(/-/g, "");

// remove preceding compressed files
rm('-rf', 'static/assets/*.min.js');
rm('-rf', 'static/assets/*.min.css');

// change link/src files to new file path
sed('-i', /(.*)[0-9]{8}(.*)/, '$1' + nowDateStr + '$2', '_includes/index_head.html');
sed('-i', /(.*)[0-9]{8}(.*)/, '$1' + nowDateStr + '$2', '_includes/head.html');
sed('-i', /(.*)[0-9]{8}(.*)/, '$1' + nowDateStr + '$2', '_includes/category.html');
sed('-i', /(.*)[0-9]{8}(.*)/, '$1' + nowDateStr + '$2', '404.html');

cp('-f', 'node_modules/components-font-awesome/webfonts/*', 'static/assets/webfonts/');

// compress js files function
function compressjs(pagename, filename, filelist) {
    console.log('Now compress ' + pagename + ' js files to ' + filename + ' ...')
    let filesMap = new Map()
    filelist.forEach(filename => {
        if (filename) {
            filesMap[filename.substring(filename.lastIndexOf("/") + 1)] = fs.readFileSync(filename, "utf8")
        }
    })
    var result = UglifyJS.minify(filesMap, {
        mangle: true,
        compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true
        },
    });

    fs.writeFileSync('static/assets/' + filename, result.code);
    console.log(pagename.green + " js files compress succeed. You can find it at \"static/assets\".\n".green);
}

// compress css files function
function compresscss(pagename, filename, filelist) {
    console.log('Now compress ' + pagename + ' css files to ' + filename + ' ...')
    var result = new CleanCSS().minify(filelist);
    var output = new CleanCSS({
        level: {
            1: {
                transform: function(propertyName, propertyValue) {
                    if (propertyName == 'src' && propertyValue.indexOf('node_modules/bootstrap/dist/') > -1) {
                        return propertyValue.replace('node_modules/bootstrap/dist/', '');
                    }
                    if (propertyName == 'src' && propertyValue.indexOf('node_modules/components-font-awesome/') > -1) {
                        return propertyValue.replace('node_modules/components-font-awesome/', '');
                    }
                    if (propertyName == 'background' && propertyValue.indexOf('static/img/') > -1) {
                        return propertyValue.replace('static/', '');
                    }
                    if (propertyName == 'background-image' && propertyValue.indexOf('static/img/') > -1) {
                        return propertyValue.replace('static/', '');
                    }
                }
            }
        }
    }).minify(result.styles);

    fs.writeFileSync('static/assets/' + filename, output.styles);
    console.log(pagename.green + " css files compress succeed. You can find it at \"static/assets\".\n".green);
}

for (i = 0; i < CSSJSfiles.length; i++) {
    if (CSSJSfiles[i].type == 'css') {
        var filename = CSSJSfiles[i].prefix + nowDateStr + '.min.css'
        compresscss(CSSJSfiles[i].name, filename, CSSJSfiles[i].list)
    }
    if (CSSJSfiles[i].type == 'js') {
        var filename = CSSJSfiles[i].prefix + nowDateStr + '.min.js'
        compressjs(CSSJSfiles[i].name, filename, CSSJSfiles[i].list)
    }
}

// Purify-css
exec(
    "node_modules/purify-css/bin/purifycss",
    "static/assets/app-" + nowDateStr + ".min.css",
    "static/assets/app-" + nowDateStr + ".min.js",
    'static/assets/i18-' + nowDateStr + ".min.js",
    'static/assets/blog-' + nowDateStr + ".min.js",
    "--min",
    "--info",
    "--out",
    "static/assets/app-" + nowDateStr + ".min.css")
