import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { connectMongoDB } from "@/lib/mongodb";
import { getSpecialties } from "@/lib/specialties";
import { Article } from "@/models/Article";
import { InterviewQuestion } from "@/models/InterviewQuestion";
import { Term } from "@/models/Term";

export const dynamic = "force-dynamic";

const icons = ["</>", "{ }", "✓", "⌁", "◎", "#"];

export default async function Home() {
  await connectMongoDB();
  const [specialties, articles, terms, questions] = await Promise.all([
    getSpecialties(), Article.countDocuments({ published: true }), Term.countDocuments(), InterviewQuestion.countDocuments(),
  ]);

  return <main className="itHome">
    <PublicHeader overlay />

    <section className="itHero">
      <div className="itHeroNoise" /><div className="itHeroOrb orbBlue" /><div className="itHeroOrb orbViolet" />
      <div className="shell itHeroGrid">
        <div className="itHeroCopy">
          <div className="itBadge"><i /> IT KNOWLEDGE SYSTEM <span>2026</span></div>
          <h1>Một nơi để<br />hiểu sâu về <em>IT.</em></h1>
          <p>Từ hạ tầng mạng đến lập trình, kiểm thử và phỏng vấn — kiến thức được hệ thống hóa để bạn học đúng trọng tâm và tiến bộ mỗi ngày.</p>
          <div className="itHeroActions"><Link className="itPrimary" href="/articles">Bắt đầu khám phá <span>↗</span></Link><Link className="itGhost" href="/interview"><i>▶</i> Luyện phỏng vấn</Link></div>
          <div className="itHeroStats"><div><b>{articles}</b><span>Bài viết</span></div><div><b>{terms}</b><span>Thuật ngữ</span></div><div><b>{questions}</b><span>Câu hỏi</span></div><div><b>{specialties.length}</b><span>Chuyên ngành</span></div></div>
        </div>

        <div className="itSystem" aria-label="Hệ sinh thái kiến thức IT">
          <div className="systemTop"><span><i /> SYSTEM ONLINE</span><b>NETWISE.OS</b></div>
          <div className="systemCore"><span>N</span><i /><i /><i /></div>
          <div className="systemRing ringOne" /><div className="systemRing ringTwo" />
          <div className="systemModule moduleFrontend"><i>&lt;/&gt;</i><span><b>Frontend</b><small>UI · WEB · REACT</small></span></div>
          <div className="systemModule moduleBackend"><i>{`{ }`}</i><span><b>Backend</b><small>API · DATABASE</small></span></div>
          <div className="systemModule moduleTester"><i>✓</i><span><b>Tester</b><small>QA · AUTOMATION</small></span></div>
          <div className="systemModule moduleNetwork"><i>⌁</i><span><b>IT Network</b><small>TCP/IP · SECURITY</small></span></div>
          <div className="systemPulse pulseOne" /><div className="systemPulse pulseTwo" />
        </div>
      </div>
      <div className="heroTicker"><div><span>FRONTEND</span><i>◆</i><span>BACKEND</span><i>◆</i><span>TESTING</span><i>◆</i><span>NETWORK</span><i>◆</i><span>DATABASE</span><i>◆</i><span>DEVOPS</span></div></div>
    </section>

    <section className="itExplore">
      <div className="shell">
        <header className="itSectionHead"><div><small>CHỌN HƯỚNG ĐI CỦA BẠN</small><h2>Khám phá thế giới<br /><span>công nghệ thông tin.</span></h2></div><p>Mỗi chuyên ngành là một lộ trình kiến thức riêng. Chọn lĩnh vực bạn quan tâm và bắt đầu từ những nội dung phù hợp nhất.</p></header>
        <div className="specialtyShowcase">
          {specialties.map((item, index) => { const name = String(item.name); return <Link className={`specialtyTile specialtyTone${index % 4}`} href={`/articles?type=${encodeURIComponent(name)}`} key={String(item._id)}>
            <div className="specialtyTileTop"><span>{String(index + 1).padStart(2, "0")}</span><i>↗</i></div><div className="specialtyIcon">{icons[index % icons.length]}</div><div><h3>{name}</h3><p>{String(item.description || "Khám phá bài viết, thuật ngữ và kiến thức thực hành trong chuyên ngành này.")}</p></div><small>XEM KIẾN THỨC <b>→</b></small>
          </Link>; })}
        </div>
        <div className="learningStrip"><div><span className="stripIcon">◇</span><div><small>HỌC THEO CÁCH CỦA BẠN</small><h3>Đọc. Ghi nhớ. Thực hành. Phỏng vấn.</h3></div></div><nav><Link href="/terms">Tra thuật ngữ <span>→</span></Link><Link href="/learn">Học flashcard <span>→</span></Link><Link href="/interview">Ôn phỏng vấn <span>→</span></Link></nav></div>
      </div>
    </section>
  </main>;
}
