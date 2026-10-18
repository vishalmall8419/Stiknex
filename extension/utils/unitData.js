/**
 * Stiknex Unit Conversion Data Constants
 */

export const LENGTH_UNITS = [
  { id: "mm", label: "Millimeters (mm)", factor: 0.001 },
  { id: "cm", label: "Centimeters (cm)", factor: 0.01 },
  { id: "m", label: "Meters (m)", factor: 1 },
  { id: "km", label: "Kilometers (km)", factor: 1000 },
  { id: "in", label: "Inches (in)", factor: 0.0254 },
  { id: "ft", label: "Feet (ft)", factor: 0.3048 },
  { id: "yd", label: "Yards (yd)", factor: 0.9144 },
  { id: "mi", label: "Miles (mi)", factor: 1609.344 },
];

export const AREA_UNITS = [
  { id: "sqm", label: "Sq. Meters (m²)", factor: 1 },
  { id: "sqkm", label: "Sq. Kilometers (km²)", factor: 1_000_000 },
  { id: "sqft", label: "Sq. Feet (ft²)", factor: 0.092903 },
  { id: "sqyd", label: "Sq. Yards (yd²)", factor: 0.836127 },
  { id: "acre", label: "Acres", factor: 4046.8564224 },
  { id: "hectare", label: "Hectares", factor: 10000 },
];

export const VOLUME_UNITS = [
  { id: "ml", label: "Milliliters (ml)", factor: 0.001 },
  { id: "l", label: "Liters (L)", factor: 1 },
  { id: "m3", label: "Cubic Meters (m³)", factor: 1000 },
  { id: "tsp", label: "Teaspoons (tsp)", factor: 0.00492892 },
  { id: "tbsp", label: "Tablespoons (tbsp)", factor: 0.0147868 },
  { id: "cup", label: "Cups", factor: 0.24 },
  { id: "galus", label: "Gallons (US)", factor: 3.78541 },
];

export const WEIGHT_UNITS = [
  { id: "mg", label: "Milligrams (mg)", factor: 0.001 },
  { id: "g", label: "Grams (g)", factor: 1 },
  { id: "kg", label: "Kilograms (kg)", factor: 1000 },
  { id: "tonne", label: "Metric Tons", factor: 1_000_000 },
  { id: "oz", label: "Ounces (oz)", factor: 28.3495 },
  { id: "lb", label: "Pounds (lbs)", factor: 453.592 },
];

export const SPEED_UNITS = [
  { id: "mps", label: "Meters/sec (m/s)", factor: 1 },
  { id: "kph", label: "Kilometers/h (km/h)", factor: 0.277778 },
  { id: "mph", label: "Miles/h (mph)", factor: 0.44704 },
  { id: "knot", label: "Knots", factor: 0.514444 },
  { id: "fps", label: "Feet/sec (ft/s)", factor: 0.3048 },
];

export const PRESSURE_UNITS = [
  { id: "pa", label: "Pascals (Pa)", factor: 1 },
  { id: "kpa", label: "Kilopascals (kPa)", factor: 1000 },
  { id: "bar", label: "Bar", factor: 100000 },
  { id: "atm", label: "Atmospheres (atm)", factor: 101325 },
  { id: "psi", label: "PSI", factor: 6894.76 },
  { id: "mmhg", label: "mmHg", factor: 133.322 },
];

export const POWER_UNITS = [
  { id: "w", label: "Watts (W)", factor: 1 },
  { id: "kw", label: "Kilowatts (kW)", factor: 1000 },
  { id: "mw", label: "Megawatts (MW)", factor: 1_000_000 },
  { id: "hp", label: "Horsepower (hp)", factor: 745.7 },
  { id: "btu", label: "BTU/hour", factor: 0.293071 },
];

export const DATA_UNITS = [
  { id: "b", label: "Bytes (B)", factor: 1 },
  { id: "kb", label: "Kilobytes (KB)", factor: 1024 },
  { id: "mb", label: "Megabytes (MB)", factor: 1024 ** 2 },
  { id: "gb", label: "Gigabytes (GB)", factor: 1024 ** 3 },
  { id: "tb", label: "Terabytes (TB)", factor: 1024 ** 4 },
  { id: "pb", label: "Petabytes (PB)", factor: 1024 ** 5 },
];

export const UNIT_CATEGORIES = {
  length: { label: "Length", units: LENGTH_UNITS },
  area: { label: "Area", units: AREA_UNITS },
  volume: { label: "Volume", units: VOLUME_UNITS },
  weight: { label: "Weight", units: WEIGHT_UNITS },
  speed: { label: "Speed", units: SPEED_UNITS },
  pressure: { label: "Pressure", units: PRESSURE_UNITS },
  power: { label: "Power", units: POWER_UNITS },
  data: { label: "Data Storage", units: DATA_UNITS },
};

