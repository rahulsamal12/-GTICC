import { Link } from 'react-router-dom';

const members = [
  {
    name: 'Approved Member Profile',
    category: 'Business Member',
    sector: 'Trade & Investment',
    region: 'Canada / International',
    description: 'Representative placeholder for an approved GTICC member profile. Replace with verified organization details, sector focus, country interests, and approved public information before launch.',
    interests: 'Market entry, introductions, delegation participation',
  },
  {
    name: 'Global Partner Profile',
    category: 'Global Partner Member',
    sector: 'Institutional Collaboration',
    region: 'International',
    description: 'Representative placeholder for an institutional or ecosystem partner participating in GTICC collaboration pathways, forums, or sector engagement.',
    interests: 'Co-hosted programs, roundtables, partner visibility',
  },
  {
    name: 'Strategic Council Profile',
    category: 'Strategic Council Member',
    sector: 'Advisory & Leadership',
    region: 'Global',
    description: 'Representative placeholder for senior leaders, advisors, or sector contributors who support high-level dialogue and credible collaboration development.',
    interests: 'Leadership roundtables, sector conversations, strategic visibility',
  },
];

export default function Members() {
  return (
    <div className="site-content">
      <section
        className="gticc-hero gticc-network-member-hero"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.64), rgba(13, 17, 23, 0.78)), url("/network_banner.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 46%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container">
          <span className="sub-title"></span>
          <h1 className="title">GTICC Member Network</h1>
          <p className="responsive-lead-text">
            Explore approved members, organizations, and partners participating in GTICC's global collaboration network.
          </p>
        </div>
      </section>

      <section className="space-ptb gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.85), rgba(8, 22, 48, 0.85)), url("/bg10.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="container">
          <div className="grid-wrapper grid-xl-3 grid-md-2 grid-xs-1">
            {members.map((member) => (
              <article className="gticc-card gticc-member-card" key={member.name}>
                <div className="gticc-member-logo">
                  <img src="/gticc_logo_new.webp" alt={`${member.name} logo placeholder`} />
                </div>
                <h3>{member.name}</h3>
                <p><strong>Sector:</strong> {member.sector}</p>
                <p><strong>Country / Region:</strong> {member.region}</p>
                <p>{member.description}</p>
                <p><strong>Collaboration interests:</strong> {member.interests}</p>
                <Link to="/contact-us" className="btn">Start a Strategic Collaboration</Link>
              </article>
            ))}
          </div>

          <div className="gticc-card gticc-disclaimer-card mt-5">
            <p>
              Member listings are provided for visibility and networking purposes only. GTICC does not endorse, guarantee, verify, or assume responsibility for any member's products, services, claims, financial standing, legal compliance, or commercial performance. Members and visitors must conduct their own due diligence before entering into any communication, agreement, transaction, or business relationship.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
