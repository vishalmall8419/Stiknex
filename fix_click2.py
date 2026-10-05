import re

with open('src/Pages/Notebook/NotebookTopbar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_hook = '''const useClickOutside = (onOutside, extraRefs = []) => {
  const ref = useRef(null);
  const onOutsideRef = useRef(onOutside);
  const extraRefsRef = useRef(extraRefs);
  
  useEffect(() => {
    onOutsideRef.current = onOutside;
    extraRefsRef.current = extraRefs;
  });

  useEffect(() => {
    const handler = (e) => {
      const insideMain = ref.current && ref.current.contains(e.target);
      const insideExtra = extraRefsRef.current.some(
        (r) => r.current && r.current.contains(e.target)
      );
      if (!insideMain && !insideExtra) {
        onOutsideRef.current();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  
  return ref;
};'''

content = re.sub(r'const useClickOutside =.*?return ref;\n};', new_hook, content, flags=re.DOTALL)

with open('src/Pages/Notebook/NotebookTopbar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
