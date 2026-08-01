import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";

const networkNodes = [
  { label: "Internet", sub: "WAN", className: "internet", icon: "◎" },
  { label: "Firewall", sub: "Security", className: "firewall", icon: "◇" },
  { label: "Core Router", sub: "Gateway", className: "router", icon: "⌁" },
  { label: "Switch", sub: "Layer 2", className: "switch", icon: "⌘" },
  { label: "Server", sub: "10.0.0.10", className: "server", icon: "▤" },
  { label: "Laptop", sub: "10.0.0.21", className: "laptop", icon: "▱" },
  { label: "Mobile", sub: "10.0.0.24", className: "mobile", icon: "▯" },
];

export default function Home() {
  return (
    <main className="homeModern">
      <PublicHeader overlay />

      <section className="homeHero shell">
        <div className="heroGlow glowOne" />
        <div className="heroGlow glowTwo" />
        <div className="homeHeroContent">
          <div className="eyebrow"><i /> Nền tảng kiến thức mạng máy tính</div>
          <h1>Hiểu mạng máy tính.<br /><span>Kết nối tương lai.</span></h1>
          <p>Khám phá cách dữ liệu di chuyển, thiết bị giao tiếp và Internet vận hành qua những bài viết ngắn gọn, trực quan và dễ hiểu.</p>
          <div className="homeHeroActions">
            <Link className="heroPrimary" href="/articles">Khám phá bài viết <span>→</span></Link>
            <Link className="heroSecondary" href="/terms">Xem thuật ngữ <span>→</span></Link>
          </div>
        </div>
        <div className="heroCodeCard" aria-hidden="true">
          <div className="codeHead"><span /><span /><span /><b>packet.trace</b></div>
          <div className="codeBody">
            <p><i>01</i><span className="codeBlue">source</span> 192.168.1.10</p>
            <p><i>02</i><span className="codeBlue">destination</span> 8.8.8.8</p>
            <p><i>03</i><span className="codePurple">protocol</span> TCP / IP</p>
            <p><i>04</i><span className="codeGreen">status</span> connected</p>
            <div className="packetProgress"><span /></div>
          </div>
        </div>
      </section>

      <section className="networkSection" id="network-model">
        <div className="shell">
          <header className="networkSectionHead">
            <div><small>NETWORK TOPOLOGY</small><h2>Một hành trình của<br />gói dữ liệu.</h2></div>
            <p>Mỗi lần bạn mở một trang web, dữ liệu đi qua nhiều lớp thiết bị. Mô hình dưới đây minh họa cách một mạng hiện đại được kết nối.</p>
          </header>

          <div className="topologyBoard">
            <div className="topologyStatus"><span><i /> NETWORK ONLINE</span><b>7 DEVICES</b></div>
            <svg className="topologyLines" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="flow" x1="0" x2="1"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs>
              <path d="M500 70 L500 150" /><path d="M500 230 L500 300" /><path d="M500 380 L500 445" />
              <path d="M500 380 C500 420 220 400 220 465" /><path d="M500 380 C500 420 780 400 780 465" />
              <path className="flowLine" d="M500 70 L500 150 L500 300 L500 445" />
            </svg>
            {networkNodes.map((node) => <div className={`topologyNode ${node.className}`} key={node.label}>
              <div className="nodeIcon">{node.icon}<span /></div><div><b>{node.label}</b><small>{node.sub}</small></div>
            </div>)}
            <div className="dataPacket packetOne">DATA</div><div className="dataPacket packetTwo">01</div>
          </div>
        </div>
      </section>
    </main>
  );
}
