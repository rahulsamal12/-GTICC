import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ResponsiveSlider from '../components/ResponsiveSlider';
import { getApiUrl } from '../api/client';

export default function MemberDirectory() {
  // SEO Metadata
  useEffect(() => {
    document.title = "GTICC Member Directory | Global Trade & Investment Collaboration Consortium";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Explore businesses, professionals, institutions, and sector participants connected through the GTICC membership network.");
    }
  }, []);

  // Filter States
  const [country, setCountry] = useState('All');
  const [city, setCity] = useState('All');
  const [sector, setSector] = useState('All');
  const [tier, setTier] = useState('All');
  const [orgType, setOrgType] = useState('All');
  const [service, setService] = useState('All');
  const [interest, setInterest] = useState('All');

  // Dynamic Members State from Live Database
  const [membersList, setMembersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(getApiUrl('/member-directory'))
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.members && Array.isArray(data.members)) {
          const formatted = data.members.map(m => ({
            id: m.id,
            applicationId: m.applicationId,
            orgName: m.org_name || 'Enterprise Member',
            logo: m.logo || '/gticc_logo_new.webp',
            memberName: m.member_name || 'Corporate Representative',
            designation: m.designation || 'Director',
            country: m.country || 'Global',
            city: m.city || 'Global',
            sector: m.sector || 'Trade & Investment',
            tier: m.tier || 'Corporate Member',
            orgType: m.org_type || 'Enterprise Corporation',
            services: m.services || '',
            interests: m.interests || '',
            description: m.description || '',
            website: m.website || '',
            linkedIn: m.linkedin || '',
            showPublicContact: Boolean(m.show_public_contact)
          }));
          setMembersList(formatted);
          setLoadError(null);
        } else {
          setMembersList([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch dynamic members directory:', err);
        setLoadError('Failed to load the active member directory. Please check your connection.');
        setMembersList([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Derive unique values for dropdowns based on database data
  const countries = useMemo(() => ['All', ...new Set(membersList.map(m => m.country))], [membersList]);
  const cities = useMemo(() => ['All', ...new Set(membersList.map(m => m.city))], [membersList]);
  const sectors = useMemo(() => ['All', ...new Set(membersList.map(m => m.sector))], [membersList]);
  const tiersList = useMemo(() => ['All', ...new Set(membersList.map(m => m.tier))], [membersList]);
  const orgTypes = useMemo(() => ['All', ...new Set(membersList.map(m => m.orgType))], [membersList]);

  // Services and Interests lists (splitting comma-separated values)
  const servicesList = useMemo(() => {
    const all = membersList.flatMap(m => m.services ? m.services.split(',').map(s => s.trim()) : []);
    return ['All', ...new Set(all)];
  }, [membersList]);

  const interestsList = useMemo(() => {
    const all = membersList.flatMap(m => m.interests ? m.interests.split(',').map(i => i.trim()) : []);
    return ['All', ...new Set(all)];
  }, [membersList]);

  // Reset Filters
  const handleResetFilters = () => {
    setCountry('All');
    setCity('All');
    setSector('All');
    setTier('All');
    setOrgType('All');
    setService('All');
    setInterest('All');
  };

  // Filter Logic
  const filteredMembers = useMemo(() => {
    return membersList.filter(member => {
      if (country !== 'All' && member.country !== country) return false;
      if (city !== 'All' && member.city !== city) return false;
      if (sector !== 'All' && member.sector !== sector) return false;
      if (tier !== 'All' && member.tier !== tier) return false;
      if (orgType !== 'All' && member.orgType !== orgType) return false;
      if (service !== 'All' && !member.services.toLowerCase().includes(service.toLowerCase())) return false;
      if (interest !== 'All' && !member.interests.toLowerCase().includes(interest.toLowerCase())) return false;
      return true;
    });
  }, [country, city, sector, tier, orgType, service, interest]);

  return (
    <div className="site-content gticc-member-directory-page">
      <style>{`
        .gticc-member-directory-page .gticc-filter-panel {
          background: rgba(8, 22, 48, 0.6);
          border: 1px solid rgba(200, 162, 74, 0.25);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 40px;
        }

        .gticc-member-directory-page .filter-select {
          background-color: #030d1e;
          color: #ffffff;
          border: 1px solid rgba(200, 162, 74, 0.3);
          border-radius: 6px;
          padding: 10px 14px;
          width: 100%;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .gticc-member-directory-page .filter-select:focus {
          border-color: #C8A24A;
          outline: none;
          box-shadow: 0 0 10px rgba(200, 162, 74, 0.2);
        }

        .gticc-member-directory-page .filter-label {
          color: #C8A24A;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 8px;
          display: block;
        }

        .gticc-member-directory-page .gticc-member-card {
          background: rgba(8, 22, 48, 0.4);
          border: 1px solid rgba(200, 162, 74, 0.15);
          border-radius: 12px;
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
          position: relative;
          overflow: hidden;
        }

        .gticc-member-directory-page .gticc-member-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 223, 137, 0.8);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4), 0 0 28px rgba(200, 162, 74, 0.3);
        }

        .gticc-member-directory-page .gticc-member-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }

        .gticc-member-directory-page .gticc-member-logo-wrapper {
          width: 64px;
          height: 64px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(200, 162, 74, 0.2);
        }

        .gticc-member-directory-page .gticc-member-logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .gticc-member-directory-page .gticc-member-tier-badge {
          font-size: 11px;
          font-weight: 700;
          color: #030d1e;
          background-color: #C8A24A;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
          margin-bottom: 8px;
        }

        .gticc-member-directory-page .contact-links-wrapper {
          display: flex;
          gap: 12px;
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .gticc-member-directory-page .contact-link {
          font-size: 14px;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.3s ease;
        }

        .gticc-member-directory-page .contact-link:hover {
          color: #C8A24A;
        }

        .gticc-member-directory-page .contact-link i {
          color: #C8A24A;
        }
      `}</style>

      {/* Hero Section */}
      <section
        className="gticc-hero gticc-network-member-hero"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(8, 22, 48, 0.64), rgba(13, 17, 23, 0.78)), url("/network_banner.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 46%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container text-center">
          <span className="sub-title"></span>
          <h1 className="title" style={{ fontSize: '48px', fontWeight: '800' }}>GTICC Member Directory</h1>
          <p className="responsive-lead-text text-white-50" style={{ maxWidth: '800px', margin: '15px auto 0 auto' }}>
            Explore businesses, professionals, institutions, and sector participants connected through the GTICC membership network.
          </p>
          <p className="gticc-small-disclaimer mt-3" style={{ maxWidth: '750px', margin: '0 auto' }}>
            The directory is designed to support visibility, discovery, and responsible business networking. Members are responsible for their own due diligence before engaging in any business discussion or transaction.
          </p>
        </div>
      </section>

      {/* Filter and Directory Grid Section */}
      <section className="space-ptb gticc-section" style={{ backgroundImage: 'linear-gradient(rgba(8, 22, 48, 0.9), rgba(8, 22, 48, 0.9)), url("/bg10.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="container">
          
          {/* 7 Dropdown Filters */}
          <div className="gticc-filter-panel">
            <div className="row g-3">
              <div className="col-lg-3 col-md-6 col-sm-6">
                <label className="filter-label">Country</label>
                <select className="filter-select" value={country} onChange={(e) => setCountry(e.target.value)}>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <label className="filter-label">City</label>
                <select className="filter-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <label className="filter-label">Sector</label>
                <select className="filter-select" value={sector} onChange={(e) => setSector(e.target.value)}>
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <label className="filter-label">Membership Tier</label>
                <select className="filter-select" value={tier} onChange={(e) => setTier(e.target.value)}>
                  {tiersList.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <label className="filter-label">Organization Type</label>
                <select className="filter-select" value={orgType} onChange={(e) => setOrgType(e.target.value)}>
                  {orgTypes.map(ot => <option key={ot} value={ot}>{ot}</option>)}
                </select>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <label className="filter-label">Services Offered</label>
                <select className="filter-select" value={service} onChange={(e) => setService(e.target.value)}>
                  {servicesList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <label className="filter-label">Collaboration Interest</label>
                <select className="filter-select" value={interest} onChange={(e) => setInterest(e.target.value)}>
                  {interestsList.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="col-lg-3 col-md-12 col-sm-12 d-flex align-items-end">
                <button className="btn btn-ghost w-100" onClick={handleResetFilters}>Reset Filters</button>
              </div>
            </div>
          </div>

          {/* Results count & loading/error state */}
          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status" style={{ color: '#C8A24A' }}>
                <span className="visually-hidden">Loading Member Directory...</span>
              </div>
              <p className="text-white-50 mt-3" style={{ fontSize: '15px' }}>Loading verified members from consortium database...</p>
            </div>
          )}

          {loadError && !isLoading && (
            <div className="gticc-card p-4 mb-4 text-center" style={{ border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)' }}>
              <p className="text-white mb-2">{loadError}</p>
              <button className="btn btn-sm" onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {!isLoading && (
            <div className="mb-4 text-white-50">
              Showing <strong>{filteredMembers.length}</strong> matching members
            </div>
          )}

          {/* Grid of members */}
          {!isLoading && filteredMembers.length > 0 && (
            <ResponsiveSlider desktopClass="grid-wrapper grid-xl-3 grid-md-2 grid-xs-1">
              {filteredMembers.map((member, idx) => (
                <article className="gticc-member-card" key={idx}>
                  <div className="gticc-member-header">
                    <div className="gticc-member-logo-wrapper">
                      <img className="gticc-member-logo-img" src={member.logo} alt={`${member.orgName} logo`} />
                    </div>
                    <div>
                      <span className="gticc-member-tier-badge">{member.tier}</span>
                      <h3 className="text-white mb-0" style={{ fontSize: '20px', fontWeight: '700' }}>{member.orgName}</h3>
                      <div className="text-white-50" style={{ fontSize: '13px' }}>{member.orgType}</div>
                    </div>
                  </div>

                  <div className="mb-3 text-white-50" style={{ fontSize: '14px' }}>
                    <div className="mb-1">
                      <strong>Representative:</strong> {member.memberName} ({member.designation})
                    </div>
                    <div className="mb-1">
                      <strong>Location:</strong> {member.city}, {member.country}
                    </div>
                    <div className="mb-1">
                      <strong>Sector:</strong> {member.sector}
                    </div>
                  </div>

                  <p className="text-white-50 mb-3" style={{ fontSize: '14px', flexGrow: 1 }}>{member.description}</p>

                  <div className="mb-3 text-white-50" style={{ fontSize: '13px' }}>
                    <div className="mb-1">
                      <strong>Services Offered:</strong> <span style={{ color: '#ffffff' }}>{member.services}</span>
                    </div>
                    <div className="mb-1">
                      <strong>Collaboration Interests:</strong> <span style={{ color: '#C8A24A' }}>{member.interests}</span>
                    </div>
                  </div>

                  <div className="contact-links-wrapper">
                    {member.showPublicContact ? (
                      <>
                        {member.website && (
                          <a href={member.website.startsWith('http') ? member.website : `https://${member.website}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                            <i className="fa-solid fa-globe"></i> Website
                          </a>
                        )}
                        {member.linkedIn && (
                          <a href={member.linkedIn.startsWith('http') ? member.linkedIn : `https://${member.linkedIn}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                            <i className="fa-brands fa-linkedin"></i> LinkedIn
                          </a>
                        )}
                        {!member.website && !member.linkedIn && (
                          <span className="text-white-50" style={{ fontSize: '13px' }}>Verified GTICC Member</span>
                        )}
                      </>
                    ) : (
                      <span className="text-white-50" style={{ fontSize: '13px', fontStyle: 'italic' }}>
                        Contact information private. Contact GTICC for introductions.
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </ResponsiveSlider>
          )}

          {!isLoading && filteredMembers.length === 0 && !loadError && (
            <div className="gticc-card p-5 text-center" style={{ border: '1px dashed rgba(200, 162, 74, 0.3)' }}>
              <h4 className="text-white mb-2">No Matching Members Found</h4>
              <p className="text-white-50 mb-3">Adjust your filters to see more members in the consortium.</p>
              <button className="btn" onClick={handleResetFilters}>Clear All Filters</button>
            </div>
          )}

          {/* Legal disclaimer at the bottom of the page */}
          <div className="gticc-card gticc-disclaimer-card mt-3" style={{ background: 'rgba(8, 22, 48, 0.4)', border: '1px solid rgba(200, 162, 74, 0.15)' }}>
            <p className="gticc-small-disclaimer" style={{ fontSize: '17px', color: '#a4b0be', margin: 0 }}>
              <strong>Disclaimer:</strong> GTICC is a facilitator and connector. GTICC membership provides access to networking, visibility, events, introductions, and collaboration opportunities. GTICC does not guarantee investment, funding, sales, contracts, approvals, or business outcomes. Members are responsible for their own due diligence and final decisions.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
