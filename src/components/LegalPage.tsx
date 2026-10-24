import { useEffect, type ReactNode } from 'react';

const contact = 'workfusionapp@gmail.com';
const updated = 'October 24, 2026';
type PolicySection = { title: string; id?: string; content: ReactNode };

function Contact() {
  return <a className="text-amber-300 underline underline-offset-4 break-all" href={`mailto:${contact}`}>{contact}</a>;
}

const privacySections: PolicySection[] = [
  { title: 'Who we are', content: <>BoltIQ Markets is operated by WorkFusionApp, Inc. This policy covers this website and its evaluation waitlist. For privacy questions, contact <Contact />.</> },
  { title: 'Information we collect', content: <>When you join the waitlist, we store your name, email address, selected account tier, challenge type, privacy consent, signup time, and a registration ID. The waitlist does not ask for payment details, brokerage passwords, identity documents, or deposits. If you email us, we also receive the information you include in your message.</> },
  { title: 'How we use it', content: <>We use your signup information to manage the evaluation waitlist, send related invitations and updates, prevent duplicate registrations, and respond to support or privacy requests. Joining is optional. You can withdraw your consent to waitlist communications by emailing <Contact /> from your registered address; you can continue browsing the research tools without joining.</> },
  { title: 'Hosting, analytics, and other providers', content: <>We use Supabase to store waitlist records and Vercel to host the website and provide aggregate Web Analytics. Hosting providers process technical information, such as IP addresses and request details, to deliver and protect the service. Vercel Web Analytics measures page visits and device, browser, referrer, and approximate-location information without third-party analytics cookies. Our waitlist table does not store your IP address. Google provides the website fonts and our Gmail contact mailbox. These providers may process information in the United States and other countries. Learn more in <a className="text-amber-300 underline" href="https://vercel.com/docs/analytics/privacy-policy">Vercel's analytics privacy information</a>, <a className="text-amber-300 underline" href="https://supabase.com/privacy">Supabase's privacy policy</a>, and <a className="text-amber-300 underline" href="https://policies.google.com/privacy">Google's privacy policy</a>.</> },
  { title: '12-month waitlist retention', content: <>We retain active waitlist signup records for 12 months after signup. Records become eligible for deletion on their 12-month anniversary and are removed through daily maintenance. You may request earlier deletion at <Contact />. This schedule covers active waitlist records; support correspondence, provider backups, and infrastructure logs are managed separately for their support, recovery, or security purposes. Contact us for information about those records.</> },
  { title: 'Your choices and requests', content: <>Email <Contact /> to request access, correction, deletion, or to stop waitlist communications. Please use the address you registered with and specify your request. We may ask for information needed to verify that the record belongs to you. Additional rights, including the ability to complain to a data-protection authority, may apply depending on your location and applicable law.</> },
  { title: 'Security and updates', content: <>Waitlist records are accessed through our server; browser roles are not permitted to read or write the waitlist database directly. No online service can guarantee absolute security. We will update this page when our practices change and show the revision date above. Materially different uses of signup information will be explained before they are introduced.</> },
];

const termsSections: PolicySection[] = [
  { title: 'Service and contact', content: <>These terms cover the BoltIQ Markets website, research demonstrations, and evaluation waitlist operated by WorkFusionApp, Inc. Contact <Contact /> for support or questions. The <a className="text-amber-300 underline" href="/privacy">Privacy Policy</a> explains how signup information is handled.</> },
  { title: 'Research demonstrations', content: <>The website presents software concepts, simulated backtests, illustrative analytics, and proposed evaluation rules. Descriptions of Expert Advisors, prices, discounts, payouts, and challenge features are informational and may change. This website's waitlist does not purchase a product or open a brokerage or funded trading account. Any future paid service will require its own purchase information and applicable terms.</> },
  { title: 'Waitlist participation', content: <>Provide accurate information and only submit an email address you control. Signup records your interest and permits related evaluation invitations; it does not guarantee admission, a launch date, funding, a discount, or a payout. No evaluation fee or deposit is collected by the signup form. You may leave the waitlist by emailing <Contact />.</> },
  { title: 'Risk and simulated performance', id: 'risk', content: <>Trading foreign exchange, futures, and CFDs can cause substantial losses. Leverage can increase losses. Historical, hypothetical, and simulated performance does not predict future results; simulations cannot fully reproduce live execution, liquidity, fees, or market conditions. The research tools and demonstrations are not personalized investment advice. BoltIQ Markets and WorkFusionApp, Inc. do not provide brokerage execution or custody of customer funds through this website. Make your own assessment before using any trading software or strategy.</> },
  { title: 'Responsible use and intellectual property', content: <>Use the website lawfully. Do not impersonate another person, submit spam, attempt unauthorized access, or interfere with the service. Website branding, text, and software remain subject to their applicable ownership and license terms. Browsing a demonstration does not grant a license to redistribute proprietary software. MetaTrader 5 and MQL5 are trademarks of MetaQuotes Software Corp.; this site is independent of MetaQuotes.</> },
  { title: 'Availability and changes', content: <>Research tools and waitlist access may be updated, interrupted, or withdrawn. Verify information before relying on it, particularly performance assumptions and proposed challenge rules. These terms do not exclude rights or remedies that cannot be excluded under applicable law. Changes will be reflected on this page with an updated date.</> },
];

export default function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const title = kind === 'privacy' ? 'Privacy Policy' : 'Terms of Service';
  const sections = kind === 'privacy' ? privacySections : termsSections;

  useEffect(() => {
    document.title = `${title} | BoltIQ Markets`;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://boltiqmarkets.com/${kind}`);
    document.querySelector('meta[name="description"]')?.setAttribute('content', `${title} for BoltIQ Markets research tools and the evaluation waitlist. Contact ${contact}.`);
  }, [kind, title]);

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100">
      <header className="border-b border-slate-800 px-5 py-5">
        <nav aria-label="Policy navigation" className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 text-sm">
          <a href="/" className="font-bold text-amber-300">⚡ BoltIQ Markets</a>
          <div className="flex gap-5">
            <a href="/privacy" aria-current={kind === 'privacy' ? 'page' : undefined} className="underline underline-offset-4">Privacy</a>
            <a href="/terms" aria-current={kind === 'terms' ? 'page' : undefined} className="underline underline-offset-4">Terms</a>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <p className="mb-3 text-xs font-mono uppercase tracking-wider text-amber-300">WorkFusionApp, Inc.</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: {updated}</p>
        <div className="mt-10 space-y-9">
          {sections.map(section => (
            <section key={section.title} id={section.id} className="scroll-mt-8">
              <h2 className="mb-3 text-lg font-semibold">{section.title}</h2>
              <p className="text-sm sm:text-base leading-7 text-slate-300">{section.content}</p>
            </section>
          ))}
        </div>
        <footer className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-400">
          <a className="text-amber-300 underline underline-offset-4" href="/#prop-evaluation">Back to the evaluation waitlist</a>
        </footer>
      </main>
    </div>
  );
}
