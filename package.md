#### The vue section: publicPath

``
"vue": {
  "publicPath"; '/TimelineView/'
}
``
specifies that the built app will be served from ruml.com/TimelineView/

The issue is apparently how the JS files are fetched: without this publicPath
they are not found so the fetch must not be relative to the index.html page.

#### Local testing of built app

With the serve package globally installed:
   npm install -g serve
the app can be served from the studio1 directory with:
   serve -s dist

#### Size of built app

"npm run build" output:
 File                                 Size               Gzipped

  dist/css/app.cc448f2a.css            1.84 KiB           0.79 KiB
  dist/js/app.60c52aab.js              16.14 KiB          5.79 KiB
  dist/js/chunk-vendors.8cc0b4ef.js    207.52 KiB         69.88 KiB


dist directory: 246KB

app.cc448f2a.css            file:   2KB  download:  1.1KB
app.4cf3c93f.js             file:  17KB  download:  6.1KB
chunk-vendors.8cc0b4ef.js   file: 212KB  download: 70.3KB