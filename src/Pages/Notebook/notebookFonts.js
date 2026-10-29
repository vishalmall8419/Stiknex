// Stiknex 200+ Curated Fonts System
// Includes Standard Office Fonts, Google Web Fonts, Lazy Loader, and Metadata Resolver

export const FONT_CATEGORIES = [
  { id: 'all', label: 'All Fonts (240+)' },
  { id: 'office', label: 'Office & Standard' },
  { id: 'sans-serif', label: 'Sans-Serif' },
  { id: 'serif', label: 'Serif' },
  { id: 'handwriting', label: 'Handwriting' },
  { id: 'display', label: 'Display & Modern' },
  { id: 'monospace', label: 'Monospace' },
];

export const NOTEBOOK_FONTS = [
  // ==========================================
  // 1. OFFICE & STANDARD SYSTEM FONTS (25 fonts)
  // ==========================================
  { id: 'aptos', name: 'Aptos', family: "Aptos, Calibri, 'Segoe UI', sans-serif", category: 'office', isGoogle: false },
  { id: 'calibri', name: 'Calibri', family: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif", category: 'office', isGoogle: false },
  { id: 'arial', name: 'Arial', family: "Arial, 'Helvetica Neue', Helvetica, sans-serif", category: 'office', isGoogle: false },
  { id: 'times-new-roman', name: 'Times New Roman', family: "'Times New Roman', Times, Baskerville, Georgia, serif", category: 'office', isGoogle: false },
  { id: 'cambria', name: 'Cambria', family: "Cambria, Georgia, serif", category: 'office', isGoogle: false },
  { id: 'georgia', name: 'Georgia', family: "Georgia, 'Times New Roman', serif", category: 'office', isGoogle: false },
  { id: 'verdana', name: 'Verdana', family: "Verdana, Geneva, sans-serif", category: 'office', isGoogle: false },
  { id: 'tahoma', name: 'Tahoma', family: "Tahoma, Verdana, Segoe, sans-serif", category: 'office', isGoogle: false },
  { id: 'courier-new', name: 'Courier New', family: "'Courier New', Courier, Lucida Sans Typewriter, monospace", category: 'office', isGoogle: false },
  { id: 'trebuchet-ms', name: 'Trebuchet MS', family: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif", category: 'office', isGoogle: false },
  { id: 'segoe-ui', name: 'Segoe UI', family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", category: 'office', isGoogle: false },
  { id: 'garamond', name: 'Garamond', family: "Garamond, Baskerville, 'Baskerville Old Face', 'Hoefler Text', 'Times New Roman', serif", category: 'office', isGoogle: false },
  { id: 'palatino', name: 'Palatino', family: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", category: 'office', isGoogle: false },
  { id: 'century-gothic', name: 'Century Gothic', family: "'Century Gothic', AppleGothic, sans-serif", category: 'office', isGoogle: false },
  { id: 'franklin-gothic', name: 'Franklin Gothic', family: "'Franklin Gothic Medium', 'Arial Narrow Bold', Arial, sans-serif", category: 'office', isGoogle: false },
  { id: 'helvetica', name: 'Helvetica', family: "'Helvetica Neue', Helvetica, Arial, sans-serif", category: 'office', isGoogle: false },
  { id: 'lucida-console', name: 'Lucida Console', family: "'Lucida Console', 'Lucida Sans Typewriter', Monaco, monospace", category: 'office', isGoogle: false },
  { id: 'lucida-sans', name: 'Lucida Sans', family: "'Lucida Sans', 'Lucida Grande', 'Lucida Sans Unicode', sans-serif", category: 'office', isGoogle: false },
  { id: 'book-antiqua', name: 'Book Antiqua', family: "'Book Antiqua', Palatino, serif", category: 'office', isGoogle: false },
  { id: 'comic-sans-ms', name: 'Comic Sans MS', family: "'Comic Sans MS', 'Comic Sans', cursive, sans-serif", category: 'office', isGoogle: false },
  { id: 'impact', name: 'Impact', family: "Impact, Haettenschweiler, 'Franklin Gothic Bold', Charcoal, sans-serif", category: 'office', isGoogle: false },
  { id: 'consolas', name: 'Consolas', family: "Consolas, 'Lucida Console', Monaco, monospace", category: 'office', isGoogle: false },
  { id: 'optima', name: 'Optima', family: "Optima, Segoe, 'Segoe UI', Candara, Calibri, Arial, sans-serif", category: 'office', isGoogle: false },
  { id: 'baskerville', name: 'Baskerville', family: "Baskerville, 'Baskerville Old Face', 'Hoefler Text', Garamond, serif", category: 'office', isGoogle: false },
  { id: 'copperplate', name: 'Copperplate', family: "'Copperplate Gothic Light', Copperplate, sans-serif", category: 'office', isGoogle: false },

  // ==========================================
  // 2. SANS-SERIF GOOGLE FONTS (55 fonts)
  // ==========================================
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'roboto', name: 'Roboto', family: "'Roboto', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'open-sans', name: 'Open Sans', family: "'Open Sans', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'lato', name: 'Lato', family: "'Lato', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'oswald', name: 'Oswald', family: "'Oswald', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'raleway', name: 'Raleway', family: "'Raleway', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'nunito', name: 'Nunito', family: "'Nunito', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'nunito-sans', name: 'Nunito Sans', family: "'Nunito Sans', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'rubik', name: 'Rubik', family: "'Rubik', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'ubuntu', name: 'Ubuntu', family: "'Ubuntu', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'work-sans', name: 'Work Sans', family: "'Work Sans', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'dm-sans', name: 'DM Sans', family: "'DM Sans', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'plus-jakarta-sans', name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'quicksand', name: 'Quicksand', family: "'Quicksand', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'manrope', name: 'Manrope', family: "'Manrope', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'kanit', name: 'Kanit', family: "'Kanit', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'barlow', name: 'Barlow', family: "'Barlow', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'mukta', name: 'Mukta', family: "'Mukta', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'heebo', name: 'Heebo', family: "'Heebo', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'prompt', name: 'Prompt', family: "'Prompt', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'mulish', name: 'Mulish', family: "'Mulish', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'titillium-web', name: 'Titillium Web', family: "'Titillium Web', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'pt-sans', name: 'PT Sans', family: "'PT Sans', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'assistant', name: 'Assistant', family: "'Assistant', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'cabin', name: 'Cabin', family: "'Cabin', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'karla', name: 'Karla', family: "'Karla', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'dosis', name: 'Dosis', family: "'Dosis', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'oxygen', name: 'Oxygen', family: "'Oxygen', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'fira-sans', name: 'Fira Sans', family: "'Fira Sans', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'hind', name: 'Hind', family: "'Hind', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'noto-sans', name: 'Noto Sans', family: "'Noto Sans', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'source-sans-3', name: 'Source Sans 3', family: "'Source Sans 3', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'exo-2', name: 'Exo 2', family: "'Exo 2', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'overpass', name: 'Overpass', family: "'Overpass', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'archivo', name: 'Archivo', family: "'Archivo', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'outfit', name: 'Outfit', family: "'Outfit', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'figtree', name: 'Figtree', family: "'Figtree', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'jost', name: 'Jost', family: "'Jost', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'red-hat-display', name: 'Red Hat Display', family: "'Red Hat Display', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'urbanist', name: 'Urbanist', family: "'Urbanist', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'lexend', name: 'Lexend', family: "'Lexend', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'albert-sans', name: 'Albert Sans', family: "'Albert Sans', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'public-sans', name: 'Public Sans', family: "'Public Sans', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'be-vietnam-pro', name: 'Be Vietnam Pro', family: "'Be Vietnam Pro', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'space-grotesk', name: 'Space Grotesk', family: "'Space Grotesk', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'syne', name: 'Syne', family: "'Syne', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'asap', name: 'Asap', family: "'Asap', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'catamaran', name: 'Catamaran', family: "'Catamaran', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'signika', name: 'Signika', family: "'Signika', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'chivo', name: 'Chivo', family: "'Chivo', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'questrial', name: 'Questrial', family: "'Questrial', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'sen', name: 'Sen', family: "'Sen', sans-serif", category: 'sans-serif', isGoogle: true },
  { id: 'sarabun', name: 'Sarabun', family: "'Sarabun', sans-serif", category: 'sans-serif', isGoogle: true },

  // ==========================================
  // 3. SERIF GOOGLE FONTS (45 fonts)
  // ==========================================
  { id: 'playfair-display', name: 'Playfair Display', family: "'Playfair Display', serif", category: 'serif', isGoogle: true },
  { id: 'merriweather', name: 'Merriweather', family: "'Merriweather', serif", category: 'serif', isGoogle: true },
  { id: 'lora', name: 'Lora', family: "'Lora', serif", category: 'serif', isGoogle: true },
  { id: 'pt-serif', name: 'PT Serif', family: "'PT Serif', serif", category: 'serif', isGoogle: true },
  { id: 'cinzel', name: 'Cinzel', family: "'Cinzel', serif", category: 'serif', isGoogle: true },
  { id: 'crimson-text', name: 'Crimson Text', family: "'Crimson Text', serif", category: 'serif', isGoogle: true },
  { id: 'libre-baskerville', name: 'Libre Baskerville', family: "'Libre Baskerville', serif", category: 'serif', isGoogle: true },
  { id: 'cormorant-garamond', name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", category: 'serif', isGoogle: true },
  { id: 'bitter', name: 'Bitter', family: "'Bitter', serif", category: 'serif', isGoogle: true },
  { id: 'eb-garamond', name: 'EB Garamond', family: "'EB Garamond', serif", category: 'serif', isGoogle: true },
  { id: 'bodoni-moda', name: 'Bodoni Moda', family: "'Bodoni Moda', serif", category: 'serif', isGoogle: true },
  { id: 'spectral', name: 'Spectral', family: "'Spectral', serif", category: 'serif', isGoogle: true },
  { id: 'frank-ruhl-libre', name: 'Frank Ruhl Libre', family: "'Frank Ruhl Libre', serif", category: 'serif', isGoogle: true },
  { id: 'domine', name: 'Domine', family: "'Domine', serif", category: 'serif', isGoogle: true },
  { id: 'cardo', name: 'Cardo', family: "'Cardo', serif", category: 'serif', isGoogle: true },
  { id: 'arvo', name: 'Arvo', family: "'Arvo', serif", category: 'serif', isGoogle: true },
  { id: 'rokkitt', name: 'Rokkitt', family: "'Rokkitt', serif", category: 'serif', isGoogle: true },
  { id: 'prata', name: 'Prata', family: "'Prata', serif", category: 'serif', isGoogle: true },
  { id: 'tinos', name: 'Tinos', family: "'Tinos', serif", category: 'serif', isGoogle: true },
  { id: 'vollkorn', name: 'Vollkorn', family: "'Vollkorn', serif", category: 'serif', isGoogle: true },
  { id: 'biorhyme', name: 'BioRhyme', family: "'BioRhyme', serif", category: 'serif', isGoogle: true },
  { id: 'castoro', name: 'Castoro', family: "'Castoro', serif", category: 'serif', isGoogle: true },
  { id: 'faustina', name: 'Faustina', family: "'Faustina', serif", category: 'serif', isGoogle: true },
  { id: 'alegreya', name: 'Alegreya', family: "'Alegreya', serif", category: 'serif', isGoogle: true },
  { id: 'alice', name: 'Alice', family: "'Alice', serif", category: 'serif', isGoogle: true },
  { id: 'old-standard-tt', name: 'Old Standard TT', family: "'Old Standard TT', serif", category: 'serif', isGoogle: true },
  { id: 'newsreader', name: 'Newsreader', family: "'Newsreader', serif", category: 'serif', isGoogle: true },
  { id: 'besley', name: 'Besley', family: "'Besley', serif", category: 'serif', isGoogle: true },
  { id: 'marcellus', name: 'Marcellus', family: "'Marcellus', serif", category: 'serif', isGoogle: true },
  { id: 'dm-serif-display', name: 'DM Serif Display', family: "'DM Serif Display', serif", category: 'serif', isGoogle: true },
  { id: 'dm-serif-text', name: 'DM Serif Text', family: "'DM Serif Text', serif", category: 'serif', isGoogle: true },
  { id: 'fraunces', name: 'Fraunces', family: "'Fraunces', serif", category: 'serif', isGoogle: true },
  { id: 'young-serif', name: 'Young Serif', family: "'Young Serif', serif", category: 'serif', isGoogle: true },
  { id: 'instrument-serif', name: 'Instrument Serif', family: "'Instrument Serif', serif", category: 'serif', isGoogle: true },
  { id: 'petrona', name: 'Petrona', family: "'Petrona', serif", category: 'serif', isGoogle: true },
  { id: 'quattrocento', name: 'Quattrocento', family: "'Quattrocento', serif", category: 'serif', isGoogle: true },
  { id: 'rozha-one', name: 'Rozha One', family: "'Rozha One', serif", category: 'serif', isGoogle: true },
  { id: 'ultra', name: 'Ultra', family: "'Ultra', serif", category: 'serif', isGoogle: true },
  { id: 'noto-serif', name: 'Noto Serif', family: "'Noto Serif', serif", category: 'serif', isGoogle: true },
  { id: 'source-serif-4', name: 'Source Serif 4', family: "'Source Serif 4', serif", category: 'serif', isGoogle: true },
  { id: 'cinzel-decorative', name: 'Cinzel Decorative', family: "'Cinzel Decorative', serif", category: 'serif', isGoogle: true },
  { id: 'sorts-mill-goudy', name: 'Sorts Mill Goudy', family: "'Sorts Mill Goudy', serif", category: 'serif', isGoogle: true },
  { id: 'lustria', name: 'Lustria', family: "'Lustria', serif", category: 'serif', isGoogle: true },
  { id: 'zen-antique', name: 'Zen Antique', family: "'Zen Antique', serif", category: 'serif', isGoogle: true },
  { id: 'aboreto', name: 'Aboreto', family: "'Aboreto', serif", category: 'serif', isGoogle: true },

  // ==========================================
  // 4. HANDWRITING & SCRIPT GOOGLE FONTS (45 fonts)
  // ==========================================
  { id: 'caveat', name: 'Caveat', family: "'Caveat', cursive", category: 'handwriting', isGoogle: true },
  { id: 'dancing-script', name: 'Dancing Script', family: "'Dancing Script', cursive", category: 'handwriting', isGoogle: true },
  { id: 'patrick-hand', name: 'Patrick Hand', family: "'Patrick Hand', cursive", category: 'handwriting', isGoogle: true },
  { id: 'shadows-into-light', name: 'Shadows Into Light', family: "'Shadows Into Light', cursive", category: 'handwriting', isGoogle: true },
  { id: 'indie-flower', name: 'Indie Flower', family: "'Indie Flower', cursive", category: 'handwriting', isGoogle: true },
  { id: 'kalam', name: 'Kalam', family: "'Kalam', cursive", category: 'handwriting', isGoogle: true },
  { id: 'great-vibes', name: 'Great Vibes', family: "'Great Vibes', cursive", category: 'handwriting', isGoogle: true },
  { id: 'sacramento', name: 'Sacramento', family: "'Sacramento', cursive", category: 'handwriting', isGoogle: true },
  { id: 'yellowtail', name: 'Yellowtail', family: "'Yellowtail', cursive", category: 'handwriting', isGoogle: true },
  { id: 'alex-brush', name: 'Alex Brush', family: "'Alex Brush', cursive", category: 'handwriting', isGoogle: true },
  { id: 'allura', name: 'Allura', family: "'Allura', cursive", category: 'handwriting', isGoogle: true },
  { id: 'amatic-sc', name: 'Amatic SC', family: "'Amatic SC', cursive", category: 'handwriting', isGoogle: true },
  { id: 'bad-script', name: 'Bad Script', family: "'Bad Script', cursive", category: 'handwriting', isGoogle: true },
  { id: 'berkshire-swash', name: 'Berkshire Swash', family: "'Berkshire Swash', cursive", category: 'handwriting', isGoogle: true },
  { id: 'courgette', name: 'Courgette', family: "'Courgette', cursive", category: 'handwriting', isGoogle: true },
  { id: 'covered-by-your-grace', name: 'Covered By Your Grace', family: "'Covered By Your Grace', cursive", category: 'handwriting', isGoogle: true },
  { id: 'damion', name: 'Damion', family: "'Damion', cursive", category: 'handwriting', isGoogle: true },
  { id: 'gloria-hallelujah', name: 'Gloria Hallelujah', family: "'Gloria Hallelujah', cursive", category: 'handwriting', isGoogle: true },
  { id: 'gochi-hand', name: 'Gochi Hand', family: "'Gochi Hand', cursive", category: 'handwriting', isGoogle: true },
  { id: 'grand-hotel', name: 'Grand Hotel', family: "'Grand Hotel', cursive", category: 'handwriting', isGoogle: true },
  { id: 'homemade-apple', name: 'Homemade Apple', family: "'Homemade Apple', cursive", category: 'handwriting', isGoogle: true },
  { id: 'just-another-hand', name: 'Just Another Hand', family: "'Just Another Hand', cursive", category: 'handwriting', isGoogle: true },
  { id: 'kaushan-script', name: 'Kaushan Script', family: "'Kaushan Script', cursive", category: 'handwriting', isGoogle: true },
  { id: 'marck-script', name: 'Marck Script', family: "'Marck Script', cursive", category: 'handwriting', isGoogle: true },
  { id: 'nanum-pen-script', name: 'Nanum Pen Script', family: "'Nanum Pen Script', cursive", category: 'handwriting', isGoogle: true },
  { id: 'neucha', name: 'Neucha', family: "'Neucha', cursive", category: 'handwriting', isGoogle: true },
  { id: 'nothing-you-could-do', name: 'Nothing You Could Do', family: "'Nothing You Could Do', cursive", category: 'handwriting', isGoogle: true },
  { id: 'reenie-beanie', name: 'Reenie Beanie', family: "'Reenie Beanie', cursive", category: 'handwriting', isGoogle: true },
  { id: 'rock-salt', name: 'Rock Salt', family: "'Rock Salt', cursive", category: 'handwriting', isGoogle: true },
  { id: 'rouge-script', name: 'Rouge Script', family: "'Rouge Script', cursive", category: 'handwriting', isGoogle: true },
  { id: 'satisfy', name: 'Satisfy', family: "'Satisfy', cursive", category: 'handwriting', isGoogle: true },
  { id: 'sedgwick-ave', name: 'Sedgwick Ave', family: "'Sedgwick Ave', cursive", category: 'handwriting', isGoogle: true },
  { id: 'tangerine', name: 'Tangerine', family: "'Tangerine', cursive", category: 'handwriting', isGoogle: true },
  { id: 'waiting-for-the-sunrise', name: 'Waiting for the Sunrise', family: "'Waiting for the Sunrise', cursive", category: 'handwriting', isGoogle: true },
  { id: 'zeyada', name: 'Zeyada', family: "'Zeyada', cursive", category: 'handwriting', isGoogle: true },
  { id: 'la-belle-aurore', name: 'La Belle Aurore', family: "'La Belle Aurore', cursive", category: 'handwriting', isGoogle: true },
  { id: 'walter-turncoat', name: 'Walter Turncoat', family: "'Walter Turncoat', cursive", category: 'handwriting', isGoogle: true },
  { id: 'shantell-sans', name: 'Shantell Sans', family: "'Shantell Sans', cursive", category: 'handwriting', isGoogle: true },
  { id: 'cookie', name: 'Cookie', family: "'Cookie', cursive", category: 'handwriting', isGoogle: true },
  { id: 'parisienne', name: 'Parisienne', family: "'Parisienne', cursive", category: 'handwriting', isGoogle: true },
  { id: 'pinyon-script', name: 'Pinyon Script', family: "'Pinyon Script', cursive", category: 'handwriting', isGoogle: true },
  { id: 'italiana', name: 'Italiana', family: "'Italiana', cursive", category: 'handwriting', isGoogle: true },
  { id: 'calligraffitti', name: 'Calligraffitti', family: "'Calligraffitti', cursive", category: 'handwriting', isGoogle: true },
  { id: 'architects-daughter', name: "Architects Daughter", family: "'Architects Daughter', cursive", category: 'handwriting', isGoogle: true },
  { id: 'sniglet', name: 'Sniglet', family: "'Sniglet', cursive", category: 'handwriting', isGoogle: true },

  // ==========================================
  // 5. DISPLAY & MODERN GOOGLE FONTS (45 fonts)
  // ==========================================
  { id: 'bebas-neue', name: 'Bebas Neue', family: "'Bebas Neue', sans-serif", category: 'display', isGoogle: true },
  { id: 'abril-fatface', name: 'Abril Fatface', family: "'Abril Fatface', serif", category: 'display', isGoogle: true },
  { id: 'righteous', name: 'Righteous', family: "'Righteous', sans-serif", category: 'display', isGoogle: true },
  { id: 'comfortaa', name: 'Comfortaa', family: "'Comfortaa', sans-serif", category: 'display', isGoogle: true },
  { id: 'lobster', name: 'Lobster', family: "'Lobster', sans-serif", category: 'display', isGoogle: true },
  { id: 'anton', name: 'Anton', family: "'Anton', sans-serif", category: 'display', isGoogle: true },
  { id: 'poiret-one', name: 'Poiret One', family: "'Poiret One', sans-serif", category: 'display', isGoogle: true },
  { id: 'bungee', name: 'Bungee', family: "'Bungee', sans-serif", category: 'display', isGoogle: true },
  { id: 'fredoka', name: 'Fredoka', family: "'Fredoka', sans-serif", category: 'display', isGoogle: true },
  { id: 'alfa-slab-one', name: 'Alfa Slab One', family: "'Alfa Slab One', serif", category: 'display', isGoogle: true },
  { id: 'shrikhand', name: 'Shrikhand', family: "'Shrikhand', serif", category: 'display', isGoogle: true },
  { id: 'creepster', name: 'Creepster', family: "'Creepster', display", category: 'display', isGoogle: true },
  { id: 'faster-one', name: 'Faster One', family: "'Faster One', display", category: 'display', isGoogle: true },
  { id: 'monoton', name: 'Monoton', family: "'Monoton', display", category: 'display', isGoogle: true },
  { id: 'permanent-marker', name: 'Permanent Marker', family: "'Permanent Marker', cursive", category: 'display', isGoogle: true },
  { id: 'ruslan-display', name: 'Ruslan Display', family: "'Ruslan Display', serif", category: 'display', isGoogle: true },
  { id: 'rye', name: 'Rye', family: "'Rye', serif", category: 'display', isGoogle: true },
  { id: 'sancreek', name: 'Sancreek', family: "'Sancreek', serif", category: 'display', isGoogle: true },
  { id: 'sigmar', name: 'Sigmar', family: "'Sigmar', sans-serif", category: 'display', isGoogle: true },
  { id: 'silkscreen', name: 'Silkscreen', family: "'Silkscreen', monospace", category: 'display', isGoogle: true },
  { id: 'titan-one', name: 'Titan One', family: "'Titan One', sans-serif", category: 'display', isGoogle: true },
  { id: 'yeseva-one', name: 'Yeseva One', family: "'Yeseva One', serif", category: 'display', isGoogle: true },
  { id: 'zen-dots', name: 'Zen Dots', family: "'Zen Dots', sans-serif", category: 'display', isGoogle: true },
  { id: 'audiowide', name: 'Audiowide', family: "'Audiowide', sans-serif", category: 'display', isGoogle: true },
  { id: 'black-ops-one', name: 'Black Ops One', family: "'Black Ops One', sans-serif", category: 'display', isGoogle: true },
  { id: 'carter-one', name: 'Carter One', family: "'Carter One', sans-serif", category: 'display', isGoogle: true },
  { id: 'chango', name: 'Chango', family: "'Chango', display", category: 'display', isGoogle: true },
  { id: 'fugaz-one', name: 'Fugaz One', family: "'Fugaz One', sans-serif", category: 'display', isGoogle: true },
  { id: 'graduate', name: 'Graduate', family: "'Graduate', serif", category: 'display', isGoogle: true },
  { id: 'kelly-slab', name: 'Kelly Slab', family: "'Kelly Slab', serif", category: 'display', isGoogle: true },
  { id: 'modak', name: 'Modak', family: "'Modak', display", category: 'display', isGoogle: true },
  { id: 'press-start-2p', name: 'Press Start 2P', family: "'Press Start 2P', monospace", category: 'display', isGoogle: true },
  { id: 'racing-sans-one', name: 'Racing Sans One', family: "'Racing Sans One', sans-serif", category: 'display', isGoogle: true },
  { id: 'russo-one', name: 'Russo One', family: "'Russo One', sans-serif", category: 'display', isGoogle: true },
  { id: 'trade-winds', name: 'Trade Winds', family: "'Trade Winds', display", category: 'display', isGoogle: true },
  { id: 'cinzel-decorative', name: 'Cinzel Decorative', family: "'Cinzel Decorative', serif", category: 'display', isGoogle: true },
  { id: 'lobster-two', name: 'Lobster Two', family: "'Lobster Two', cursive", category: 'display', isGoogle: true },
  { id: 'pacifico', name: 'Pacifico', family: "'Pacifico', cursive", category: 'display', isGoogle: true },
  { id: 'luckiest-guy', name: 'Luckiest Guy', family: "'Luckiest Guy', sans-serif", category: 'display', isGoogle: true },
  { id: 'special-elite', name: 'Special Elite', family: "'Special Elite', cursive", category: 'display', isGoogle: true },
  { id: 'tourney', name: 'Tourney', family: "'Tourney', display", category: 'display', isGoogle: true },
  { id: 'wallpoet', name: 'Wallpoet', family: "'Wallpoet', display", category: 'display', isGoogle: true },
  { id: 'vt323', name: 'VT323', family: "'VT323', monospace", category: 'display', isGoogle: true },
  { id: 'vast-shadow', name: 'Vast Shadow', family: "'Vast Shadow', serif", category: 'display', isGoogle: true },
  { id: 'bungee-shade', name: 'Bungee Shade', family: "'Bungee Shade', display", category: 'display', isGoogle: true },

  // ==========================================
  // 6. MONOSPACE GOOGLE FONTS (25 fonts)
  // ==========================================
  { id: 'fira-code', name: 'Fira Code', family: "'Fira Code', monospace", category: 'monospace', isGoogle: true },
  { id: 'jetbrains-mono', name: 'JetBrains Mono', family: "'JetBrains Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'source-code-pro', name: 'Source Code Pro', family: "'Source Code Pro', monospace", category: 'monospace', isGoogle: true },
  { id: 'roboto-mono', name: 'Roboto Mono', family: "'Roboto Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'space-mono', name: 'Space Mono', family: "'Space Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'inconsolata', name: 'Inconsolata', family: "'Inconsolata', monospace", category: 'monospace', isGoogle: true },
  { id: 'ibm-plex-mono', name: 'IBM Plex Mono', family: "'IBM Plex Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'courier-prime', name: 'Courier Prime', family: "'Courier Prime', monospace", category: 'monospace', isGoogle: true },
  { id: 'share-tech-mono', name: 'Share Tech Mono', family: "'Share Tech Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'anonymous-pro', name: 'Anonymous Pro', family: "'Anonymous Pro', monospace", category: 'monospace', isGoogle: true },
  { id: 'cutive-mono', name: 'Cutive Mono', family: "'Cutive Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'major-mono-display', name: 'Major Mono Display', family: "'Major Mono Display', monospace", category: 'monospace', isGoogle: true },
  { id: 'nanum-gothic-coding', name: 'Nanum Gothic Coding', family: "'Nanum Gothic Coding', monospace", category: 'monospace', isGoogle: true },
  { id: 'nova-mono', name: 'Nova Mono', family: "'Nova Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'overpass-mono', name: 'Overpass Mono', family: "'Overpass Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'red-hat-mono', name: 'Red Hat Mono', family: "'Red Hat Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'spline-sans-mono', name: 'Spline Sans Mono', family: "'Spline Sans Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'ubuntu-mono', name: 'Ubuntu Mono', family: "'Ubuntu Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'dm-mono', name: 'DM Mono', family: "'DM Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'fragment-mono', name: 'Fragment Mono', family: "'Fragment Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'martian-mono', name: 'Martian Mono', family: "'Martian Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'victor-mono', name: 'Victor Mono', family: "'Victor Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'syne-mono', name: 'Syne Mono', family: "'Syne Mono', monospace", category: 'monospace', isGoogle: true },
  { id: 'sono', name: 'Sono', family: "'Sono', monospace", category: 'monospace', isGoogle: true },
  { id: 'chivo-mono', name: 'Chivo Mono', family: "'Chivo Mono', monospace", category: 'monospace', isGoogle: true },
];

// In-memory set of loaded Google font names to avoid duplicate network requests
const loadedGoogleFonts = new Set();

/**
 * Dynamically lazy-loads a font family from Google Web Fonts API if not already loaded
 */
export function lazyLoadFont(fontName) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return Promise.resolve();
  if (!fontName) return Promise.resolve();

  // Strip quotes and trim
  const cleanName = fontName.replace(/['"]/g, '').split(',')[0].trim();
  const fontObj = NOTEBOOK_FONTS.find(
    (f) => f.name.toLowerCase() === cleanName.toLowerCase() || f.id.toLowerCase() === cleanName.toLowerCase()
  );

  // If system/office font or already loaded, return immediately
  if (!fontObj || !fontObj.isGoogle || loadedGoogleFonts.has(fontObj.name)) {
    return Promise.resolve();
  }

  loadedGoogleFonts.add(fontObj.name);

  return new Promise((resolve) => {
    try {
      const linkId = `google-font-${fontObj.id}`;
      if (document.getElementById(linkId)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      const encoded = encodeURIComponent(fontObj.name).replace(/%20/g, '+');
      link.href = `https://fonts.googleapis.com/css2?family=${encoded}:ital,wght@0,300..900;1,300..900&display=swap`;
      link.onload = () => resolve();
      link.onerror = () => {
        // Fallback with standard weight if variable font fails
        const fallbackLink = document.createElement('link');
        fallbackLink.rel = 'stylesheet';
        fallbackLink.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;700&display=swap`;
        fallbackLink.onload = () => resolve();
        fallbackLink.onerror = () => resolve(); // Graceful fallback
        document.head.appendChild(fallbackLink);
      };
      document.head.appendChild(link);
    } catch {
      resolve();
    }
  });
}

/**
 * Resolves any font-family string (from Word/Excel paste or user input) into a matching notebook font
 */
export function resolveFontFamily(rawFamily) {
  if (!rawFamily || typeof rawFamily !== 'string') return null;

  const candidateNames = rawFamily
    .split(',')
    .map((s) => s.replace(/['"]/g, '').trim())
    .filter(Boolean);

  for (const name of candidateNames) {
    const match = NOTEBOOK_FONTS.find(
      (f) => f.name.toLowerCase() === name.toLowerCase() || f.id.toLowerCase() === name.toLowerCase()
    );
    if (match) {
      if (match.isGoogle) lazyLoadFont(match.name);
      return match;
    }
  }

  return null;
}
