const fs = require('fs');
let content = fs.readFileSync('src/Component/DownloadAppModal.jsx', 'utf8');

const regex = /<motion\.div initial=\{\{ opacity: 0, y: 15 \}\} animate=\{\{ opacity: 1, y: 0 \}\} transition=\{\{ delay: 0\.6 \}\}\s*className="flex gap-4 pt-6 border-t border-slate-200\/60 mt-auto mb-2">\s*<motion\.button[\s\S]*?App Store[\s\S]*?<\/motion\.button>\s*<motion\.button[\s\S]*?Google Play[\s\S]*?<\/motion\.button>\s*<\/motion\.div>/;

const newStr = `                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="flex gap-4 pt-6 border-t border-slate-200/60 mt-auto mb-2">
                    <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = '/Stiknex.apk';
                        link.download = 'Stiknex.apk';
                        link.click();
                        onClose();
                      }}
                      className="h-[52px] min-w-[155px] px-5 bg-black hover:bg-slate-900 text-white rounded-[14px] flex items-center justify-center gap-3 shadow-[0_8px_16px_rgba(0,0,0,0.15)] transition-all border border-slate-800">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot text-[#3DDC84]"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                      <div className="flex flex-col items-start justify-center leading-[1.1]">
                        <span className="text-[10px] text-slate-300 font-semibold tracking-wide">Download</span>
                        <span className="text-[16px] font-bold">Android App</span>
                      </div>
                    </motion.button>
  
                    <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                      onClick={async () => {
                        if (window.deferredPWA) {
                          window.deferredPWA.prompt();
                          const { outcome } = await window.deferredPWA.userChoice;
                          if (outcome === 'accepted') window.deferredPWA = null;
                        } else {
                          alert('PWA installation is not supported or already installed.');
                        }
                        onClose();
                      }}
                      className="h-[52px] min-w-[155px] px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[14px] flex items-center justify-center gap-3 shadow-[0_8px_16px_rgba(79,70,229,0.3)] transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-laptop-minimal"><rect width="18" height="12" x="3" y="4" rx="2"/><line x1="2" x2="22" y1="20" y2="20"/></svg>
                      <div className="flex flex-col items-start justify-center leading-[1.1]">
                        <span className="text-[10px] text-indigo-200 font-semibold tracking-wide">Install</span>
                        <span className="text-[16px] font-bold">PWA App</span>
                      </div>
                    </motion.button>
                  </motion.div>`;

content = content.replace(regex, newStr);
fs.writeFileSync('src/Component/DownloadAppModal.jsx', content);
console.log('Fixed');
