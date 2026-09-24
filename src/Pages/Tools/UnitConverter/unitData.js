export const LENGTH_UNITS = [
  { id: "mm", label: "Millimeters", factor: 0.001 },
  { id: "cm", label: "Centimeters", factor: 0.01 },
  { id: "m", label: "Meters", factor: 1 },
  { id: "km", label: "Kilometers", factor: 1000 },
  { id: "in", label: "Inches", factor: 0.0254 },
  { id: "ft", label: "Feet", factor: 0.3048 },
  { id: "yd", label: "Yards", factor: 0.9144 },
  { id: "mi", label: "Miles", factor: 1609.344 },
];

export const AREA_UNITS = [
  { id: "sqm", label: "Sq. Meters", factor: 1 },
  { id: "sqkm", label: "Sq. Kilometers", factor: 1_000_000 },
  { id: "sqft", label: "Sq. Feet", factor: 0.092903 },
  { id: "sqyd", label: "Sq. Yards", factor: 0.836127 },
  { id: "acre", label: "Acres", factor: 4046.8564224 },
  { id: "hectare", label: "Hectares", factor: 10000 },
];

export const VOLUME_UNITS = [
  { id: "ml", label: "Milliliters", factor: 0.001 },
  { id: "l", label: "Liters", factor: 1 },
  { id: "m3", label: "Cubic Meters", factor: 1000 },
  { id: "tsp", label: "Teaspoons", factor: 0.00492892 },
  { id: "tbsp", label: "Tablespoons", factor: 0.0147868 },
  { id: "cup", label: "Cups", factor: 0.24 },
  { id: "galus", label: "Gallons (US)", factor: 3.78541 },
];

export const WEIGHT_UNITS = [
  { id: "mg", label: "Milligrams", factor: 0.001 },
  { id: "g", label: "Grams", factor: 1 },
  { id: "kg", label: "Kilograms", factor: 1000 },
  { id: "tonne", label: "Metric Tons", factor: 1_000_000 },
  { id: "oz", label: "Ounces", factor: 28.3495 },
  { id: "lb", label: "Pounds", factor: 453.592 },
];

export const SPEED_UNITS = [
  { id: "mps", label: "Meters/sec", factor: 1 },
  { id: "kph", label: "Km/h", factor: 0.277778 },
  { id: "mph", label: "Miles/h", factor: 0.44704 },
  { id: "knot", label: "Knots", factor: 0.514444 },
  { id: "fps", label: "Feet/sec", factor: 0.3048 },
];

export const PRESSURE_UNITS = [
  { id: "pa", label: "Pascals", factor: 1 },
  { id: "kpa", label: "Kilopascals", factor: 1000 },
  { id: "bar", label: "Bar", factor: 100000 },
  { id: "atm", label: "Atmospheres", factor: 101325 },
  { id: "psi", label: "PSI", factor: 6894.76 },
  { id: "mmhg", label: "mmHg", factor: 133.322 },
];

export const POWER_UNITS = [
  { id: "w", label: "Watts", factor: 1 },
  { id: "kw", label: "Kilowatts", factor: 1000 },
  { id: "mw", label: "Megawatts", factor: 1_000_000 },
  { id: "hp", label: "Horsepower", factor: 745.7 },
  { id: "btu", label: "BTU/hour", factor: 0.293071 },
];
