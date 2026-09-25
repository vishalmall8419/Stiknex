const fs = require('fs');

function replaceInFile(filePath, search, replacement) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(replacement.trim())) {
        console.log(`Already has changes: ${filePath}`);
        return;
    }
    content = content.replace(search, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
}

// 1. AppShell.jsx
replaceInFile(
    'src/Component/Layout/AppShell.jsx',
    '{ name: "Tools", path: "/tools", icon: "fa-solid fa-screwdriver-wrench" },',
    '{ name: "Tools", path: "/tools", icon: "fa-solid fa-screwdriver-wrench" },\n    { name: "Blog", path: "/blog", icon: "fa-solid fa-blog" },'
);

// 2. App.jsx - Import
replaceInFile(
    'src/App.jsx',
    'const BuyMeACoffee = lazy(() => import("./Pages/BuyMeACoffee/BuyMeACoffee"));',
    'const BuyMeACoffee = lazy(() => import("./Pages/BuyMeACoffee/BuyMeACoffee"));\nconst Blog = lazy(() => import("./Pages/Blog/Blog"));'
);

// 3. App.jsx - Route array
replaceInFile(
    'src/App.jsx',
    'const validAppRoutes = ["/notes", "/notebook", "/whiteboard", "/tools", "/about", "/buy-me-a-coffee"];',
    'const validAppRoutes = ["/notes", "/notebook", "/whiteboard", "/tools", "/about", "/buy-me-a-coffee", "/blog"];'
);

// 4. App.jsx - Route component
replaceInFile(
    'src/App.jsx',
    '<Route path="/buy-me-a-coffee" element={<BuyMeACoffee />} />',
    '<Route path="/buy-me-a-coffee" element={<BuyMeACoffee />} />\n        <Route path="/blog" element={<Blog />} />'
);

// 5. Navbar.jsx
replaceInFile(
    'src/Component/Navbar/Navbar.jsx',
    `          <li>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={\`\${Style.navLink} \${
                pathname === "/about"
                  ? Style.navLinkActive
                  : ""
              }\`}
            >
              About
            </Link>
          </li>`,
    `          <li>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={\`\${Style.navLink} \${
                pathname === "/about"
                  ? Style.navLinkActive
                  : ""
              }\`}
            >
              About
            </Link>
          </li>

          <li>
            <Link
              to="/blog"
              onClick={() => setMenuOpen(false)}
              className={\`\${Style.navLink} \${
                pathname === "/blog"
                  ? Style.navLinkActive
                  : ""
              }\`}
            >
              Blog
            </Link>
          </li>`
);

// 6. LandingPage.jsx
replaceInFile(
    'src/Pages/Landing/LandingPage.jsx',
    '<a href="#creator" className="hidden min-[350px]:block text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors">Creator</a>',
    '<a href="#creator" className="hidden min-[350px]:block text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors">Creator</a>\n          <Link to="/blog" className="hidden min-[350px]:block text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors">Blog</Link>'
);

console.log('All files processed.');
