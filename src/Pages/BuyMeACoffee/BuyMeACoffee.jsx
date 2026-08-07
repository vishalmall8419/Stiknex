import { useEffect, useState } from "react";
import Layout from "../../Component/Layout/Layout";
import AboutStyle from "../About/About.module.css";
import Style from "./BuyMeACoffee.module.css";
import { loadRazorpayScript } from "../../utils/loadRazorpay";
import { API_BASE_URL } from "../../config/api";
import PageSEO from "../../Component/SEO/PageSEO";

const MIN_AMOUNT = 10;
const PRESET_AMOUNTS = [10, 20, 50, 100, 200, 500];

const BuyMeACoffee = () => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [supporterCount, setSupporterCount] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE_URL}/supporters`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSupporterCount(data.totalSupporters);
      })
      .catch(() => {
        if (!cancelled) setSupporterCount(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const getFinalAmount = () => {
    if (isCustom) return Number(customAmount);
    return selectedAmount;
  };

  const handlePresetClick = (amount) => {
    setIsCustom(false);
    setSelectedAmount(amount);
    setError("");
  };

  const handleCustomChange = (e) => {
    setIsCustom(true);
    setCustomAmount(e.target.value.replace(/[^0-9]/g, ""));
    setError("");
  };

  const handleDonate = async () => {
    const amount = getFinalAmount();

    if (!amount || amount < MIN_AMOUNT) {
      setError(`Minimum donation amount is ₹${MIN_AMOUNT}.`);
      return;
    }

    setError("");
    setStatus("loading");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Could not load payment gateway. Check your internet connection.");
        setStatus("idle");
        return;
      }

      const orderRes = await fetch(`${API_BASE_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setError(orderData.error || "Could not create order. Please try again.");
        setStatus("idle");
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Stiknex",
        description: "Buy Me A Coffee",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setStatus("success");
              setSupporterCount(verifyData.totalSupporters);
            } else {
              setError(verifyData.error || "Payment verification failed.");
              setStatus("idle");
            }
          } catch {
            setError("Network error while verifying payment.");
            setStatus("idle");
          }
        },
        modal: {
          ondismiss: () => {
            setStatus("idle");
          },
        },
        theme: { color: "#4F5CFF" },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setStatus("idle");
      });

      razorpayInstance.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <Layout>
      {(darkMode) => (
        <div className={AboutStyle.wrapper}>
          <PageSEO
            title="Buy Me A Coffee — Support Stiknex"
            description="Stiknex is free to use. If it's helped you stay organized, you can support its development with a small coffee."
            path="/buy-me-a-coffee"
          />
          <section className={AboutStyle.hero}>
            <div
              className={`${AboutStyle.heroIcon} ${
                darkMode ? AboutStyle.darkHeroIcon : ""
              } ${Style.coffeeIconWrap}`}
            >
              <i className="fa-solid fa-mug-hot"></i>
            </div>

            <h1
              className={`${AboutStyle.heroTitle} bg-linear-to-r from-[#8B2CF5] via-[#4F5CFF] to-[#2EB8FF] bg-clip-text text-transparent`}
            >
              Buy Me A Coffee
            </h1>

            <p className={AboutStyle.heroDesc}>
              Stiknex is free for everyone, forever. Your support covers
              hosting, fuels new features, and keeps this little app
              growing — one coffee at a time.
            </p>
          </section>

          <section className={`${Style.donateSection} ${AboutStyle.section}`}>
            <div
              className={`${Style.card} ${darkMode ? Style.darkCard : ""}`}
            >
              <p className={Style.sectionLabel}>Choose an amount</p>

              <div className={Style.amountGrid}>
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`${Style.amountBtn} ${
                      darkMode ? Style.darkAmountBtn : ""
                    } ${
                      !isCustom && selectedAmount === amount
                        ? Style.amountActive
                        : ""
                    }`}
                    onClick={() => handlePresetClick(amount)}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              <div className={Style.customWrap}>
                <label className={Style.customLabel} htmlFor="customAmount">
                  Or enter a custom amount (₹)
                </label>
                <input
                  id="customAmount"
                  type="text"
                  inputMode="numeric"
                  placeholder={`Minimum ₹${MIN_AMOUNT}`}
                  value={customAmount}
                  onFocus={() => setIsCustom(true)}
                  onChange={handleCustomChange}
                  className={`${Style.customInput} ${
                    darkMode ? Style.darkCustomInput : ""
                  }`}
                />
              </div>

              {error && <p className={Style.errorText}>{error}</p>}

              {status === "success" ? (
                <div className={Style.successBox}>
                  <i className="fa-solid fa-circle-check"></i>
                  Thank you for fuelling Stiknex! ☕
                </div>
              ) : (
                <button
                  type="button"
                  className={Style.donateBtn}
                  onClick={handleDonate}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Processing…
                    </>
                  ) : (
                    <>☕ Buy Me A Coffee</>
                  )}
                </button>
              )}
            </div>

            <div
              className={`${Style.supporterCard} ${
                darkMode ? Style.darkCard : ""
              }`}
            >
              <i className={`fa-solid fa-heart ${Style.heartIcon}`}></i>
              <div>
                <p className={Style.supporterCount}>
                  {supporterCount === null ? "—" : supporterCount}{" "}
                  People Supported Stiknex
                </p>
                <p className={Style.supporterSub}>
                  Every coffee keeps Stiknex free and growing.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
};

export default BuyMeACoffee;
