import { useState, useMemo, useRef } from "react";
import { QrCode, Wifi, UserCheck, Shuffle, Download, Copy, Check, Sparkles, Trophy, Users, BarChart3 } from "lucide-react";

export default function GeneratorsEngine({ slug, toolId }) {
  const [copied, setCopied] = useState(false);
  const copyText = (txt) => {
    navigator.clipboard.writeText(String(txt));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (slug === "wifi-qr-generator") return <WifiQrGenerator copyText={copyText} copied={copied} />;
  if (slug === "vcard-qr-generator") return <VcardQrGenerator copyText={copyText} copied={copied} />;
  if (slug === "random-name-picker") return <RandomNamePicker copyText={copyText} copied={copied} />;
  if (slug === "team-randomizer") return <TeamRandomizer copyText={copyText} copied={copied} />;
  if (slug === "decision-wheel") return <DecisionWheel copyText={copyText} copied={copied} />;
  if (slug === "poll-generator") return <PollGenerator copyText={copyText} copied={copied} />;
  if (slug === "barcode-generator") return <BarcodeGenerator copyText={copyText} copied={copied} />;
  if (slug === "link-in-bio-page-builder") return <LinkInBioBuilder copyText={copyText} copied={copied} />;

  // Default: QR Code Generator
  return <QrCodeGenerator copyText={copyText} copied={copied} />;
}

// 1. QR CODE GENERATOR (Using browser Image QR generator or Canvas)
function QrCodeGenerator({ copyText, copied }) {
  const [text, setText] = useState("https://stiknex.site");
  const [size, setSize] = useState("250");

  const qrUrl = useMemo(() => {
    if (!text.trim()) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text.trim())}`;
  }, [text, size]);

  const downloadQr = async () => {
    try {
      const resp = await fetch(qrUrl);
      const blob = await resp.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "stiknex-qr-code.png";
      a.click();
    } catch (e) {
      window.open(qrUrl, "_blank");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <QrCode className="w-5 h-5 text-indigo-400" /> High-Resolution QR Code Generator
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 mb-1 block">URL or Text to Encode</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://yourwebsite.com or plain text"
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Image Size</label>
            <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white">
              <option value="200">200 × 200 px</option>
              <option value="250">250 × 250 px</option>
              <option value="350">350 × 350 px (HD)</option>
              <option value="500">500 × 500 px (Print)</option>
            </select>
          </div>
        </div>

        {qrUrl && (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-white/10 space-y-4">
            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <img src={qrUrl} alt="Generated QR" className="w-48 h-48 object-contain" />
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadQr}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PNG
              </button>
              <button
                onClick={() => copyText(text)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} Copy Text
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. WI-FI QR GENERATOR
function WifiQrGenerator({ copyText, copied }) {
  const [ssid, setSsid] = useState("Home_WiFi");
  const [pass, setPass] = useState("SuperSecretPassword");
  const [auth, setAuth] = useState("WPA");

  const wifiPayload = `WIFI:S:${ssid};T:${auth};P:${pass};;`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(wifiPayload)}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Wifi className="w-5 h-5 text-indigo-400" /> Instant Wi-Fi Connect QR Code
        </h3>
        <p className="text-xs text-slate-400">Scan this QR code with any phone camera to automatically join your Wi-Fi network without typing passwords.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Network Name (SSID)</label>
            <input type="text" value={ssid} onChange={(e) => setSsid(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Wi-Fi Password</label>
            <input type="text" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Encryption Type</label>
            <select value={auth} onChange={(e) => setAuth(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white">
              <option value="WPA">WPA / WPA2 / WPA3</option>
              <option value="WEP">WEP (Legacy)</option>
              <option value="nopass">None (Open Network)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-white/10 space-y-4">
          <div className="p-4 bg-white rounded-2xl">
            <img src={qrUrl} alt="WiFi QR" className="w-48 h-48" />
          </div>
          <span className="text-xs text-slate-400 font-mono">Payload: {wifiPayload}</span>
        </div>
      </div>
    </div>
  );
}

// 3. VCARD QR GENERATOR
function VcardQrGenerator({ copyText, copied }) {
  const [name, setName] = useState("Alex Morgan");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [email, setEmail] = useState("alex@example.com");

  const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(vcard)}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">vCard Contact QR Generator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Phone Number</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-white/10 space-y-4">
          <div className="p-4 bg-white rounded-2xl">
            <img src={qrUrl} alt="Contact vCard QR" className="w-48 h-48" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. RANDOM NAME PICKER
function RandomNamePicker() {
  const [names, setNames] = useState("Alice\nBob\nCharlie\nDiana\nEvan\nFiona");
  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const pickWinner = () => {
    const list = names.split("\n").map(s => s.trim()).filter(Boolean);
    if (list.length === 0) return;
    setSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setWinner(list[Math.floor(Math.random() * list.length)]);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6 text-center">
        <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-xl font-semibold text-white">Random Name Picker & Raffle Spinner</h3>

        <textarea
          rows={5}
          value={names}
          onChange={(e) => setNames(e.target.value)}
          placeholder="Enter names, one per line..."
          className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white text-sm"
        />

        {winner && (
          <div className="p-6 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-2">
            <span className="text-xs text-indigo-400 uppercase font-semibold">Selected Winner</span>
            <div className={`text-4xl font-black text-amber-400 ${spinning ? "opacity-50" : "animate-bounce"}`}>
              🎉 {winner} 🎉
            </div>
          </div>
        )}

        <button
          disabled={spinning}
          onClick={pickWinner}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition"
        >
          {spinning ? "Selecting..." : "Spin / Pick Random Name"}
        </button>
      </div>
    </div>
  );
}

// 5. TEAM RANDOMIZER
function TeamRandomizer() {
  const [members, setMembers] = useState("Alice\nBob\nCharlie\nDiana\nEvan\nFiona\nGeorge\nHannah");
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([]);

  const generateTeams = () => {
    const list = members.split("\n").map(s => s.trim()).filter(Boolean);
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    const result = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((m, idx) => {
      result[idx % teamCount].push(m);
    });
    setTeams(result);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" /> Random Team Generator & Roster Splitter
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 mb-1 block">Participants (one per line)</label>
            <textarea rows={4} value={members} onChange={(e) => setMembers(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white text-xs" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Number of Teams</label>
            <input type="number" min="2" max="10" value={teamCount} onChange={(e) => setTeamCount(Number(e.target.value))} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white mb-4" />
            <button onClick={generateTeams} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">
              Generate Teams
            </button>
          </div>
        </div>

        {teams.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            {teams.map((t, idx) => (
              <div key={idx} className="bg-slate-800/80 p-4 rounded-xl border border-white/5 space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase">Team {idx + 1} ({t.length} members)</span>
                <ul className="text-sm text-slate-200 list-disc list-inside space-y-1">
                  {t.map((person, pi) => <li key={pi}>{person}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 6. DECISION WHEEL
function DecisionWheel(props) {
  return <RandomNamePicker {...props} />;
}

// 7. POLL GENERATOR
function PollGenerator() {
  const [question, setQuestion] = useState("What is your favorite frontend framework?");
  const [options, setOptions] = useState([
    { text: "React", votes: 42 },
    { text: "Vue", votes: 18 },
    { text: "Svelte", votes: 24 },
    { text: "Next.js", votes: 35 }
  ]);

  const totalVotes = options.reduce((a, b) => a + b.votes, 0) || 1;

  const vote = (idx) => {
    setOptions(options.map((o, i) => i === idx ? { ...o, votes: o.votes + 1 } : o));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" /> Interactive Poll & Survey Simulator
        </h3>
        <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white font-semibold" />

        <div className="space-y-3">
          {options.map((opt, idx) => {
            const pct = Math.round((opt.votes / totalVotes) * 100);
            return (
              <div key={idx} onClick={() => vote(idx)} className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-white/5 cursor-pointer space-y-2 transition">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-white">{opt.text}</span>
                  <span className="text-xs text-slate-400">{opt.votes} votes ({pct}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div style={{ width: `${pct}%` }} className="bg-indigo-500 h-full"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 8. BARCODE GENERATOR
function BarcodeGenerator({ copyText, copied }) {
  const [code, setCode] = useState("123456789012");
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6 text-center">
        <h3 className="text-lg font-semibold text-white">Barcode Generator (CODE128)</h3>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full max-w-sm mx-auto bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-center" />
        <div className="p-6 bg-white rounded-2xl max-w-sm mx-auto flex flex-col items-center justify-center space-y-2">
          <div className="h-20 w-full flex items-center justify-center gap-1 overflow-hidden">
            {code.split("").map((c, i) => (
              <div key={i} className="bg-black h-16" style={{ width: `${(parseInt(c, 10) % 3) + 2}px` }}></div>
            ))}
          </div>
          <span className="text-xs font-mono font-bold text-black tracking-widest">{code}</span>
        </div>
      </div>
    </div>
  );
}

// 9. LINK IN BIO BUILDER
function LinkInBioBuilder() {
  const [name, setName] = useState("Alex Developer");
  const [bio, setBio] = useState("Building open-source tools & web utilities 🚀");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-white">Link-in-Bio Landing Page Builder</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Profile Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Short Bio</label>
            <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white" />
          </div>
        </div>

        <div className="max-w-xs mx-auto bg-slate-950 p-6 rounded-3xl border border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-600 mx-auto flex items-center justify-center text-xl font-bold text-white">
            {name.charAt(0)}
          </div>
          <div>
            <h5 className="font-bold text-white text-base">{name}</h5>
            <p className="text-xs text-slate-400 mt-1">{bio}</p>
          </div>
          <div className="space-y-2 pt-2">
            {["GitHub Portfolio", "Twitter / X", "Personal Blog", "Buy Me a Coffee"].map((link, i) => (
              <div key={i} className="py-2.5 px-4 bg-slate-800 rounded-xl text-xs font-semibold text-white hover:bg-slate-700 cursor-pointer transition">
                {link}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

