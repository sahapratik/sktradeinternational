import Link from 'next/link';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';
import { getSolutions } from '@/db';

export const dynamic = 'force-dynamic';

const processSteps = [
  { t: 'Requirement Consultation', d: 'Understanding your material, machinery or technical need.' },
  { t: 'Product / Machinery Selection', d: 'Matching requirements to the right materials or equipment.' },
  { t: 'Technical Review', d: 'Checking specifications against your production requirements.' },
  { t: 'Commercial Quotation', d: 'A clear, itemised quotation for your review.' },
  { t: 'Documentation', d: 'Preparing the paperwork international procurement requires.' },
  { t: 'International Procurement', d: 'Placing and managing the order with our sourcing partners.' },
  { t: 'Logistics Coordination', d: 'Coordinating shipping and import from origin to Bangladesh.' },
  { t: 'Delivery & Installation', d: 'Supporting delivery and, where relevant, installation.' },
  { t: 'After-Sales Assistance', d: 'Staying available for support once you are up and running.' },
];

export default async function SolutionsPage() {
  const solutions = await getSolutions();

  return (
    <main>
      <section className="section" style={{ paddingBlockStart: 'clamp(3rem,6vw,5rem)' }}>
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Solutions</p>
            <h1 style={{ maxWidth: '18ch', marginBottom: '1rem' }}>Support that goes beyond the invoice</h1>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '54ch', fontSize: '1.05rem' }}>
              Sourcing the right material or machine is only the start. These are the services that
              keep a production line running once it arrives.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap grid g4">
          {solutions.map((s, i) => (
            <Reveal key={s.id} delay={i * 60}>
              <div className="card sol-card" style={{ height: '100%' }}>
                <div className="icon-box"><Icon name={s.icon} /></div>
                <div><h4>{s.title}</h4><p>{s.description}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">How we work</p>
            <h2 style={{ marginBottom: '2rem' }}>From first conversation to after-sales support</h2>
          </Reveal>
          <div className="process-track">
            {processSteps.map((s, i) => (
              <Reveal key={s.t} delay={i * 50}>
                <div className="process-step">
                  <div className="process-num">{i + 1}</div>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ textAlign: 'center' }}>
        <div className="wrap">
          <Reveal>
            <h2 style={{ marginBottom: '1rem' }}>Ready to start the first step?</h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: '44ch', margin: '0 auto 1.6rem' }}>
              A requirement consultation costs nothing and commits you to nothing.
            </p>
            <Link href="/contact" className="btn btn--primary">Request a Quote</Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
