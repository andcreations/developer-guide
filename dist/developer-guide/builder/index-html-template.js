"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexHTMLTemplate = void 0;
/** */
exports.indexHTMLTemplate = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="description" content="{{description}}">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <title>{{title}}</title>
  <link href="https://fonts.googleapis.com/css?family=Ubuntu&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/docsify-themeable/dist/css/theme-simple.css">
	<style>
    :root {
      --base-font-family: 'Ubuntu', sans-serif;

      --sidebar-width: 24rem;
      --sidebar-nav-link-before-content-l1: '';
      --sidebar-nav-link-before-content-l2: '';
      --sidebar-nav-link-before-content-l3: '';
      
      /* Hide chevron in the side bar. */
      --sidebar-nav-pagelink-background-image: '';
      --sidebar-nav-pagelink-background-image--active: '';
      --sidebar-nav-pagelink-background-image--collapse: '';
      --sidebar-nav-pagelink-background-image--loaded: '';

    }

    /** Hide the table of contents in the side bar. */
    .app-sub-sidebar {
      display: none;
    }

    /** Table of contents. */
    .page_toc {
      top: 3rem;
    }
    .nav .page_toc p.title {
      color: #4d4d4d;
      font-size: 1rem;
    }
    .page_toc div[class^="lv"] a.anchor {
      color: #4d4d4d;
    }
    .nav .page_toc div[class^="lv"] a:hover span {
      color: #4d4d4d;
      text-decoration: underline;
    }

    main .markdown-section code {
      font-size: 0.875rem;
    }
    main .markdown-section pre[data-lang] code {
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    window.$docsify = {
      name: '{{name}}',
      repo: '',
      loadSidebar: true,
      subMaxLevel: 2,
      homepage: 'README.md',

      requestHeaders: {
        'cache-control': 'max-age=600',
      },

      search: {
        maxAge: 0,
        paths: 'auto',
        placeholder: 'Type to search',
        noData: 'No results',
        depth: 4 // headline depth 1-6
      },

      themeable: {
        readyTransition : true, // default
        responsiveTables: true  // default
      }
    }
  </script>

	<script src="https://unpkg.com/docsify/lib/docsify.min.js"></script>
	<script src="https://unpkg.com/docsify-themeable"></script>

  <script src="https://unpkg.com/docsify/lib/plugins/search.js"></script>
  <script src="//unpkg.com/docsify-page-toc/dist/docsify-page-toc.js"></script>
  <script src="//unpkg.com/prismjs/components/prism-bash.min.js"></script>
  <script src="//unpkg.com/prismjs/components/prism-c.min.js"></script>
  <script src="//unpkg.com/prismjs/components/prism-cpp.min.js"></script>
  <script src="//unpkg.com/prismjs/components/prism-javascript.min.js"></script>
  <script src="//unpkg.com/prismjs/components/prism-jsx.min.js"></script>
  <script src="//unpkg.com/prismjs/components/prism-typescript.min.js"></script>
  <script src="//unpkg.com/prismjs/components/prism-tsx.min.js"></script>
</body>
</html>
`;
