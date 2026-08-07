import { useState } from "react";
import Layout from "../../Component/Layout/Layout";
import ToolModal from "../../Component/Tools/Toolsmodal";
import PageSEO from "../../Component/SEO/PageSEO";
import useGsapReveal from "../../hooks/useGsapReveal";
import AboutStyle from "../About/About.module.css";
import Style from "./Tools.module.css";

import SimpleCalculator from "./Simplecalculator/Simplecalculator";
import ScientificCalculator from "./Scientificcalculator/Scientificcalculator";
import DateTimeCalculator from "./Datetimecalculator/Datetimecalculator";
import DataConverter from "./Dataconverter/Dataconverter";
import UnitConverter from "./UnitConverter/UnitConverter";
import TemperatureConverter from "./UnitConverter/TemperatureConverter";
import {
  LENGTH_UNITS,
  AREA_UNITS,
  VOLUME_UNITS,
  WEIGHT_UNITS,
  SPEED_UNITS,
  PRESSURE_UNITS,
  POWER_UNITS,
} from "./UnitConverter/unitData";
import CurrencyConverter from "./CurrencyConverter/CurrencyConverter";
import QRCodeGenerator from "./QRCodeGenerator/QRCodeGenerator";
import PasswordGenerator from "./PasswordGenerator/PasswordGenerator";
import ColorPicker from "./ColorPicker/ColorPicker";

const tools = [
  {
    id: "simple",
    icon: "fa-solid fa-calculator",
    title: "Simple Calculator",
    desc: "Quick everyday arithmetic — add, subtract, multiply, divide.",
  },
  {
    id: "scientific",
    icon: "fa-solid fa-square-root-variable",
    title: "Scientific Calculator",
    desc: "Trigonometry, logarithms, powers, roots, and more.",
  },
  {
    id: "datetime",
    icon: "fa-solid fa-calendar-days",
    title: "Date & Time Calculator",
    desc: "Age, days between dates, time difference, countdowns.",
  },
  {
    id: "converter",
    icon: "fa-solid fa-arrows-turn-to-dots",
    title: "Data Converter",
    desc: "Bytes, KB, MB, GB, TB, Bits, Binary, Decimal, Hex.",
  },
  {
    id: "currency",
    icon: "fa-solid fa-money-bill-transfer",
    title: "Currency Converter",
    desc: "Convert between major world currencies with live rates.",
  },
  {
    id: "length",
    icon: "fa-solid fa-ruler",
    title: "Length Converter",
    desc: "Millimeters to miles and everything in between.",
  },
  {
    id: "area",
    icon: "fa-solid fa-vector-square",
    title: "Area Converter",
    desc: "Square meters, acres, hectares, and more.",
  },
  {
    id: "volume",
    icon: "fa-solid fa-flask",
    title: "Volume Converter",
    desc: "Liters, cups, gallons, cubic meters, and more.",
  },
  {
    id: "weight",
    icon: "fa-solid fa-weight-hanging",
    title: "Weight / Mass Converter",
    desc: "Grams, kilograms, pounds, ounces, and more.",
  },
  {
    id: "temperature",
    icon: "fa-solid fa-temperature-half",
    title: "Temperature Converter",
    desc: "Celsius, Fahrenheit, and Kelvin, instantly.",
  },
  {
    id: "speed",
    icon: "fa-solid fa-gauge-high",
    title: "Speed Converter",
    desc: "Km/h, mph, knots, meters per second, and more.",
  },
  {
    id: "pressure",
    icon: "fa-solid fa-compress",
    title: "Pressure Converter",
    desc: "Pascals, bar, PSI, atmospheres, and more.",
  },
  {
    id: "power",
    icon: "fa-solid fa-bolt",
    title: "Power Converter",
    desc: "Watts, kilowatts, horsepower, BTU/hour, and more.",
  },
  {
    id: "qrcode",
    icon: "fa-solid fa-qrcode",
    title: "QR Code Generator",
    desc: "Turn any text or link into a scannable QR code.",
  },
  {
    id: "password",
    icon: "fa-solid fa-key",
    title: "Password Generator",
    desc: "Create strong, random passwords in one click.",
  },
  {
    id: "color",
    icon: "fa-solid fa-palette",
    title: "Color Picker",
    desc: "Pick a color and get its HEX, RGB, and HSL values.",
  },
];

const toolMeta = {
  simple: {
    title: "Simple Calculator",
    subtitle: "Fast everyday arithmetic.",
  },
  scientific: {
    title: "Scientific Calculator",
    subtitle: "Trigonometry, logs, powers & roots.",
  },
  datetime: {
    title: "Date & Time Calculator",
    subtitle: "Age, differences, countdowns & more.",
  },
  converter: {
    title: "Data Converter",
    subtitle: "Storage units & number base conversion.",
  },
  currency: {
    title: "Currency Converter",
    subtitle: "Live exchange rates for major currencies.",
  },
  length: {
    title: "Length Converter",
    subtitle: "Millimeters to miles, instantly.",
  },
  area: {
    title: "Area Converter",
    subtitle: "Square meters, acres, hectares & more.",
  },
  volume: {
    title: "Volume Converter",
    subtitle: "Liters, cups, gallons & more.",
  },
  weight: {
    title: "Weight / Mass Converter",
    subtitle: "Grams, kilograms, pounds & more.",
  },
  temperature: {
    title: "Temperature Converter",
    subtitle: "Celsius, Fahrenheit & Kelvin.",
  },
  speed: {
    title: "Speed Converter",
    subtitle: "Km/h, mph, knots & more.",
  },
  pressure: {
    title: "Pressure Converter",
    subtitle: "Pascals, bar, PSI & more.",
  },
  power: {
    title: "Power Converter",
    subtitle: "Watts, horsepower, BTU/hour & more.",
  },
  qrcode: {
    title: "QR Code Generator",
    subtitle: "Turn text or a link into a QR code.",
  },
  password: {
    title: "Password Generator",
    subtitle: "Strong, random passwords in one click.",
  },
  color: {
    title: "Color Picker",
    subtitle: "HEX, RGB & HSL, instantly.",
  },
};

const Tools = () => {
  const [activeTool, setActiveTool] = useState(null);
  const heroRef = useGsapReveal();
  const gridRef = useGsapReveal();

  return (
    <Layout>
      {(darkMode) => (
        <div className={AboutStyle.wrapper}>
          <PageSEO
            title="Free Online Tools — Calculators & Converters"
            description="Simple calculator, scientific calculator, date & time calculator, currency and unit converters, QR code generator, password generator, and more — free and instant."
            path="/tools"
          />
          <section className={AboutStyle.hero} ref={heroRef}>
            <div
              className={`${AboutStyle.heroIcon} ${
                darkMode ? AboutStyle.darkHeroIcon : ""
              }`}
            >
              <i className="fa-solid fa-screwdriver-wrench"></i>
            </div>

            <h1
              className={`${AboutStyle.heroTitle} bg-linear-to-r from-[#8B2CF5] via-[#4F5CFF] to-[#2EB8FF] bg-clip-text text-transparent`}
            >
              Tools
            </h1>

            <p className={AboutStyle.heroDesc}>
              A handy set of everyday tools, built right into Stiknex —
              no extra apps, no clutter.
            </p>
          </section>

          <section className={AboutStyle.section}>
            <div className={AboutStyle.grid} ref={gridRef}>
              {tools.map((t) => (
                <div
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveTool(t.id)}
                  onKeyDown={(e) => e.key === "Enter" && setActiveTool(t.id)}
                  className={`${AboutStyle.featureCard} ${Style.toolCard} ${
                    darkMode ? AboutStyle.darkFeatureCard : ""
                  }`}
                >
                  <div className={AboutStyle.featureIcon}>
                    <i className={t.icon}></i>
                  </div>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {activeTool && (
            <ToolModal
              title={toolMeta[activeTool].title}
              subtitle={toolMeta[activeTool].subtitle}
              darkMode={darkMode}
              onClose={() => setActiveTool(null)}
            >
              {activeTool === "simple" && (
                <SimpleCalculator darkMode={darkMode} />
              )}
              {activeTool === "scientific" && (
                <ScientificCalculator darkMode={darkMode} />
              )}
              {activeTool === "datetime" && (
                <DateTimeCalculator darkMode={darkMode} />
              )}
              {activeTool === "converter" && (
                <DataConverter darkMode={darkMode} />
              )}
              {activeTool === "currency" && (
                <CurrencyConverter darkMode={darkMode} />
              )}
              {activeTool === "length" && (
                <UnitConverter
                  darkMode={darkMode}
                  units={LENGTH_UNITS}
                  defaultUnit="m"
                />
              )}
              {activeTool === "area" && (
                <UnitConverter
                  darkMode={darkMode}
                  units={AREA_UNITS}
                  defaultUnit="sqm"
                />
              )}
              {activeTool === "volume" && (
                <UnitConverter
                  darkMode={darkMode}
                  units={VOLUME_UNITS}
                  defaultUnit="l"
                />
              )}
              {activeTool === "weight" && (
                <UnitConverter
                  darkMode={darkMode}
                  units={WEIGHT_UNITS}
                  defaultUnit="kg"
                />
              )}
              {activeTool === "temperature" && (
                <TemperatureConverter darkMode={darkMode} />
              )}
              {activeTool === "speed" && (
                <UnitConverter
                  darkMode={darkMode}
                  units={SPEED_UNITS}
                  defaultUnit="kph"
                />
              )}
              {activeTool === "pressure" && (
                <UnitConverter
                  darkMode={darkMode}
                  units={PRESSURE_UNITS}
                  defaultUnit="pa"
                />
              )}
              {activeTool === "power" && (
                <UnitConverter
                  darkMode={darkMode}
                  units={POWER_UNITS}
                  defaultUnit="w"
                />
              )}
              {activeTool === "qrcode" && (
                <QRCodeGenerator darkMode={darkMode} />
              )}
              {activeTool === "password" && (
                <PasswordGenerator darkMode={darkMode} />
              )}
              {activeTool === "color" && <ColorPicker darkMode={darkMode} />}
            </ToolModal>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Tools;