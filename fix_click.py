import re

with open('src/Pages/Notebook/NotebookTopbar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_hook = '''const useClickOutside = (onOutside, extraRefs = []) => {
  const ref = useRef(null);
  const onOutsideRef = useRef(onOutside);
  
  useEffect(() => {
    onOutsideRef.current = onOutside;
  }, [onOutside]);

  useEffect(() => {
    const handler = (e) => {
      const insideMain = ref.current && ref.current.contains(e.target);
      const insideExtra = extraRefs.some(
        (r) => r.current && r.current.contains(e.target),
      );
      if (!insideMain && !insideExtra) {
        onOutsideRef.current();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, extraRefs);
  
  return ref;
};'''

content = re.sub(r'const useClickOutside =.*?return ref;\n};', new_hook, content, flags=re.DOTALL)

with open('src/Pages/Notebook/NotebookTopbar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
