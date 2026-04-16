import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Filter,
  Globe,
  Landmark,
  Scale,
  Search,
  ShieldAlert,
} from 'lucide-react';

const resourceCards = [
  {
    id: 'nalsa-legal-aid',
    title: 'Free Legal Aid Through NALSA',
    domain: 'Legal Aid',
    type: 'Website',
    source: 'NALSA',
    url: 'https://nalsa.gov.in/legal-aid/?locale=bg',
    description:
      'Learn who is eligible for free legal aid, what services are covered, and how to apply through the legal services authorities.',
    highlight: 'Best starting point for people who need a lawyer but cannot afford one.',
  },
  {
    id: 'nalsa-application',
    title: 'Apply Online for Legal Aid',
    domain: 'Legal Aid',
    type: 'Service Portal',
    source: 'NALSA / Supreme Court App Services',
    url: 'https://scourtapp.nic.in/lsams/nologin/applicationFiling.action?requestLocale=en',
    description:
      'Official online application portal for requesting legal aid assistance.',
    highlight: 'Useful when the user is ready to take action immediately.',
  },
  {
    id: 'nalsa-women',
    title: 'Women\'s Assistance and POSH Resources',
    domain: 'Women & Children',
    type: 'Website',
    source: 'NALSA',
    url: 'https://nalsa.gov.in/womens-assistance/',
    description:
      'A collection of women-focused legal aid guidance, POSH awareness material, district officer lists, and support pathways.',
    highlight: 'Strong entry point for workplace harassment and women\'s rights support.',
  },
  {
    id: 'posh-handbook',
    title: 'Speak Up: POSH Handbook (English)',
    domain: 'Workplace',
    type: 'Handbook',
    source: 'NALSA',
    url: 'https://cdnbbsr.s3waas.gov.in/s32e45f93088c7db59767efef516b306aa/uploads/2025/05/2025050513649359.pdf',
    description:
      'A plain-language handbook on the Prevention of Sexual Harassment at Workplace framework and redressal process.',
    highlight: 'Helpful for employees, students, and internal committee awareness.',
  },
  {
    id: 'nalsa-asha',
    title: 'NALSA ASHA: Child Marriage SOP',
    domain: 'Women & Children',
    type: 'Guide PDF',
    source: 'NALSA',
    url: 'https://cdnbbsr.s3waas.gov.in/s32e45f93088c7db59767efef516b306aa/uploads/2025/04/202504161553497187.pdf',
    description:
      'An official SOP focused on prevention, protection, rehabilitation, and legal support around child marriage.',
    highlight: 'Good for community workers, teachers, and families handling child marriage risks.',
  },
  {
    id: 'nari-ki-udaan',
    title: 'Nari Ki Udaan',
    domain: 'Women & Children',
    type: 'Booklet',
    source: 'NALSA',
    url: 'https://nalsa.gov.in/nari-ki-kahani/',
    description:
      'A women-focused legal awareness publication from NALSA with accessible guidance and support-oriented material.',
    highlight: 'Useful for general awareness of women\'s legal protections and remedies.',
  },
  {
    id: 'dv-act',
    title: 'Protection of Women from Domestic Violence Act, 2005',
    domain: 'Women & Children',
    type: 'Bare Act',
    source: 'India Code',
    url: 'https://www.indiacode.nic.in/bitstream/123456789/2021/5/A2005-43.pdf',
    description:
      'Official text of the Domestic Violence Act for users who want the statute itself.',
    highlight: 'Best for verifying the actual legal provisions and remedies.',
  },
  {
    id: 'india-code',
    title: 'India Code',
    domain: 'General Rights',
    type: 'Website',
    source: 'India Code',
    url: 'https://www.indiacode.nic.in/about.jsp?locale=en',
    description:
      'Official database of central and state enactments, rules, and subordinate legislation in force.',
    highlight: 'Use this to search acts, rules, and updated statutory text.',
  },
  {
    id: 'ecourts',
    title: 'eCourts Services',
    domain: 'Court Procedure',
    type: 'Service Portal',
    source: 'eCommittee / Supreme Court of India',
    url: 'https://ecourts.gov.in/ecourts2.0/',
    description:
      'Find case status, cause lists, judgments, virtual court services, eFiling links, and payment tools.',
    highlight: 'Best for checking what is happening in an existing case.',
  },
  {
    id: 'consumer-helpline',
    title: 'National Consumer Helpline',
    domain: 'Consumer',
    type: 'Service Portal',
    source: 'Department of Consumer Affairs',
    url: 'https://consumerhelpline.gov.in/public/contact/',
    description:
      'Official consumer grievance support portal with phone, web, app, WhatsApp, and UMANG options.',
    highlight: 'Useful for refunds, defective products, service failures, and billing disputes.',
  },
  {
    id: 'cybercrime-portal',
    title: 'National Cyber Crime Reporting Portal',
    domain: 'Cybercrime',
    type: 'Service Portal',
    source: 'Government of India',
    url: 'https://www.cybercrime.gov.in/Webform/Accept.aspx',
    description:
      'Official portal to report cyber offences, with special focus on crimes against women and children.',
    highlight: 'Pair this with helpline 1930 for urgent cyber financial fraud cases.',
  },
  {
    id: 'green-verdicts',
    title: 'Green Verdicts: Environmental Law Digest',
    domain: 'Environment',
    type: 'Digest PDF',
    source: 'NALSA',
    url: 'https://cdnbbsr.s3waas.gov.in/s32e45f93088c7db59767efef516b306aa/uploads/2025/04/202504162045428805.pdf',
    description:
      'A digest of recent environmental law cases and trends, useful for legal awareness and reference.',
    highlight: 'Helpful for students, researchers, and users exploring environmental litigation themes.',
  },
  {
    id: 'ragging-resource',
    title: 'Student Awareness Resource on Ragging, 2026',
    domain: 'Student Rights',
    type: 'Guide',
    source: 'NALSA',
    url: 'https://nalsa.gov.in/document/student-awareness-resource-on-ragging-2026/',
    description:
      'Awareness material aimed at helping students understand ragging-related rights, risks, and redress options.',
    highlight: 'Useful for students, parents, and institutions dealing with campus harassment issues.',
  },
];

const domainOptions = ['All Domains', ...new Set(resourceCards.map((resource) => resource.domain))];
const typeOptions = ['All Types', ...new Set(resourceCards.map((resource) => resource.type))];

const iconForType = {
  Website: Globe,
  'Service Portal': Landmark,
  Handbook: BookOpen,
  Booklet: BookOpen,
  'Guide PDF': FileText,
  Guide: FileText,
  'Digest PDF': FileText,
  'Bare Act': Scale,
};

export default function Resources() {
  const [query, setQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [selectedType, setSelectedType] = useState('All Types');
  const [sortBy, setSortBy] = useState('featured');

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = resourceCards.filter((resource) => {
      const matchesDomain =
        selectedDomain === 'All Domains' || resource.domain === selectedDomain;
      const matchesType =
        selectedType === 'All Types' || resource.type === selectedType;
      const matchesQuery =
        !normalizedQuery ||
        [
          resource.title,
          resource.domain,
          resource.type,
          resource.source,
          resource.description,
          resource.highlight,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesDomain && matchesType && matchesQuery;
    });

    if (sortBy === 'title') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === 'domain') {
      return [...filtered].sort((a, b) => {
        const domainCompare = a.domain.localeCompare(b.domain);
        return domainCompare || a.title.localeCompare(b.title);
      });
    }

    if (sortBy === 'type') {
      return [...filtered].sort((a, b) => {
        const typeCompare = a.type.localeCompare(b.type);
        return typeCompare || a.title.localeCompare(b.title);
      });
    }

    return filtered;
  }, [query, selectedDomain, selectedType, sortBy]);

  return (
    <div className="container" style={{ padding: '4rem 0 5rem 0' }}>
      <section
        className="animate-fade-in-up"
        style={{
          background:
            'linear-gradient(135deg, rgba(15,31,61,0.98) 0%, rgba(36,52,89,0.94) 65%, rgba(201,168,76,0.18) 100%)',
          borderRadius: '28px',
          padding: '3rem',
          color: 'white',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ maxWidth: '760px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.8rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}
          >
            <ShieldAlert size={16} />
            Curated legal help library
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginBottom: '1rem', color: 'white' }}>
            Free Resources
          </h1>

          <p style={{ fontSize: '1.08rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.82)', marginBottom: 0 }}>
            Explore official portals, awareness handbooks, bare acts, and practical guides across
            legal aid, consumer issues, cybercrime, workplace rights, court procedure, and more.
          </p>
        </div>
      </section>

      <section
        className="animate-fade-in-up delay-100"
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: '22px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid rgba(0,0,0,0.05)',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            alignItems: 'end',
          }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Search
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--color-bg)',
              }}
            >
              <Search size={18} color="rgba(0,0,0,0.45)" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by topic, act, or source"
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.98rem',
                }}
              />
            </div>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Legal Domain
            </span>
            <select
              value={selectedDomain}
              onChange={(event) => setSelectedDomain(event.target.value)}
              style={selectStyle}
            >
              {domainOptions.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Resource Type
            </span>
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              style={selectStyle}
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Sort By
            </span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              style={selectStyle}
            >
              <option value="featured">Featured</option>
              <option value="title">Title</option>
              <option value="domain">Legal Domain</option>
              <option value="type">Resource Type</option>
            </select>
          </label>
        </div>

        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: 'rgba(44,44,44,0.65)',
            fontSize: '0.95rem',
          }}
        >
          <Filter size={16} />
          {filteredResources.length} resource{filteredResources.length === 1 ? '' : 's'} available
        </div>
      </section>

      {filteredResources.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '22px',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 style={{ marginBottom: '0.75rem' }}>No resources match that filter</h2>
          <p style={{ color: 'rgba(44,44,44,0.7)', marginBottom: 0 }}>
            Try a different domain, resource type, or search term.
          </p>
        </div>
      ) : (
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredResources.map((resource, index) => {
            const ResourceIcon = iconForType[resource.type] || FileText;

            return (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className={`animate-fade-in-up delay-${((index % 3) + 1) * 100}`}
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderRadius: '22px',
                  padding: '1.4rem',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  color: 'inherit',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  minHeight: '290px',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = 'translateY(-6px)';
                  event.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = 'translateY(0)';
                  event.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(201, 168, 76, 0.12)',
                      color: 'var(--color-accent)',
                      flexShrink: 0,
                    }}
                  >
                    <ResourceIcon size={24} />
                  </div>

                  <ArrowUpRight size={20} color="rgba(15,31,61,0.55)" />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={pillStyle}>{resource.domain}</span>
                  <span style={secondaryPillStyle}>{resource.type}</span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.7rem' }}>{resource.title}</h3>
                  <p style={{ color: 'rgba(44,44,44,0.72)', lineHeight: 1.65, marginBottom: 0 }}>
                    {resource.description}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                  }}
                >
                  <div style={{ fontSize: '0.88rem', color: 'rgba(44,44,44,0.58)' }}>
                    Source: {resource.source}
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                    {resource.highlight}
                  </div>
                </div>
              </a>
            );
          })}
        </section>
      )}
    </div>
  );
}

const selectStyle = {
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: '14px',
  padding: '0.95rem 1rem',
  backgroundColor: 'var(--color-bg)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.97rem',
  color: 'var(--color-text)',
  outline: 'none',
};

const pillStyle = {
  padding: '0.38rem 0.7rem',
  borderRadius: '999px',
  backgroundColor: 'rgba(15,31,61,0.08)',
  color: 'var(--color-primary)',
  fontSize: '0.82rem',
  fontWeight: 600,
};

const secondaryPillStyle = {
  padding: '0.38rem 0.7rem',
  borderRadius: '999px',
  backgroundColor: 'rgba(201,168,76,0.14)',
  color: '#8b6a13',
  fontSize: '0.82rem',
  fontWeight: 600,
};
