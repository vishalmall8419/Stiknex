import os
import re

tools_dir = 'src/Pages/Tools'
seo_import_statement = 'import PageSEO from "../../../Component/SEO/PageSEO";\n'

seo_configs = {
    'ColorPicker.jsx': {
        'title': 'Free Online Color Picker & Converter | Stiknex',
        'desc': 'Pick colors, convert HEX to RGB and HSL, and copy Tailwind CSS classes instantly. Free online color picker tool with eyedropper support.',
        'path': '/tools/color-picker',
        'keywords': 'color picker, hex to rgb, rgb to hsl, online color picker, tailwind color generator, eyedropper tool'
    },
    'CurrencyConverter.jsx': {
        'title': 'Live Currency Converter & Exchange Rates | Stiknex',
        'desc': 'Convert currencies with live exchange rates. Free, fast and accurate online currency converter for USD, EUR, INR, GBP and 150+ fiat currencies.',
        'path': '/tools/currency-converter',
        'keywords': 'currency converter, exchange rates, live currency, usd to inr, eur to usd, forex calculator'
    },
    'Dataconverter.jsx': {
        'title': 'Data Unit Converter (MB, GB, TB) | Stiknex',
        'desc': 'Convert digital data storage units between Bytes, Kilobytes, Megabytes, Gigabytes, Terabytes, and Petabytes instantly.',
        'path': '/tools/data-converter',
        'keywords': 'data converter, megabytes to gigabytes, mb to gb, byte converter, digital storage calculator'
    },
    'Datetimecalculator.jsx': {
        'title': 'Date & Time Calculator | Stiknex',
        'desc': 'Calculate duration between two dates, add or subtract days, and find exact age in years, months and days. Free online date calculator.',
        'path': '/tools/date-calculator',
        'keywords': 'date calculator, time calculator, days between dates, age calculator, add days to date'
    },
    'PasswordGenerator.jsx': {
        'title': 'Strong Random Password Generator | Stiknex',
        'desc': 'Generate strong, secure and random passwords instantly. Customize length, symbols, numbers, and uppercase letters. 100% free and local.',
        'path': '/tools/password-generator',
        'keywords': 'password generator, random password, strong password, secure password maker, online password generator'
    },
    'QRCodeGenerator.jsx': {
        'title': 'Free Custom QR Code Generator | Stiknex',
        'desc': 'Create, customize and download free QR codes for URLs, text, and contacts. Customize colors, add your logo and download as PNG or SVG.',
        'path': '/tools/qr-generator',
        'keywords': 'qr code generator, free qr code, create qr code, custom qr code, qr maker with logo'
    },
    'Scientificcalculator.jsx': {
        'title': 'Free Online Scientific Calculator | Stiknex',
        'desc': 'Advanced scientific calculator with trigonometry, logarithms, fractions, and history. Evaluate complex math expressions free online.',
        'path': '/tools/scientific-calculator',
        'keywords': 'scientific calculator, online math calculator, trigonometry calculator, online scientific calculator'
    },
    'Simplecalculator.jsx': {
        'title': 'Simple Online Calculator | Stiknex',
        'desc': 'A fast, easy-to-use basic online calculator with history and dark mode. Add, subtract, multiply, and divide instantly.',
        'path': '/tools/simple-calculator',
        'keywords': 'simple calculator, online calculator, basic calculator, math calculator'
    },
    'TemperatureConverter.jsx': {
        'title': 'Temperature Converter (Celsius, Fahrenheit) | Stiknex',
        'desc': 'Convert temperatures between Celsius, Fahrenheit, and Kelvin. Fast and accurate online temperature conversion tool.',
        'path': '/tools/temperature-converter',
        'keywords': 'temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin converter'
    },
    'UnitConverter.jsx': {
        'title': 'Length & Weight Unit Converter | Stiknex',
        'desc': 'Convert length, weight, area, and volume units. Convert meters, feet, kilograms, pounds, miles, kilometers, and more.',
        'path': '/tools/unit-converter',
        'keywords': 'unit converter, length converter, weight converter, meters to feet, kg to lbs'
    }
}

for root, _, files in os.walk(tools_dir):
    for filename in files:
        if filename.endswith('.jsx') and filename in seo_configs:
            filepath = os.path.join(root, filename)
            config = seo_configs[filename]
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Remove existing PageSEO if any
            content = re.sub(r'<PageSEO[\s\S]*?/>', '', content)

            # Insert import if missing
            if 'import PageSEO' not in content:
                content = seo_import_statement + content

            seo_tag = f"""<PageSEO
        title="{config['title']}"
        description="{config['desc']}"
        path="{config['path']}"
        type="webapp"
        keywords="{config['keywords']}"
      />"""

            # Find the first return (<tag... >) inside the functional component
            # Since React functional components usually have one main return
            # We'll match `return (` or `return \n\s*<`
            
            # Simple approach: locate the component declaration line, then the first `return (\s*<[a-zA-Z]+.*?>)`
            
            # Or just match `return (` and inject right after it if followed by `<` 
            match = re.search(r'return\s*\(\s*(<[a-zA-Z]+[^>]*>)', content)
            if match:
                tag = match.group(1)
                replacement = f"return (\n    {tag}\n      {seo_tag}"
                content = content[:match.start()] + replacement + content[match.end():]
            else:
                # Fallback if there is no `return (`
                pass
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filename}")
