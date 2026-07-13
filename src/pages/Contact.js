import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import ContactImage from '../assets/img/heroSlider/2.webp';
import { BsArrowRepeat, BsCheckCircle, BsEnvelope, BsPerson, BsTelephone } from 'react-icons/bs';
import { useSite } from '../context/SiteContext';
import { api, imageUrl } from '../api';

const initialForm = { name: '', email: '', phone: '', subject: '', message: '', website: '' };

const Contact = () => {
  const { settings } = useSite();
  const [formData, setFormData] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setNotice({ type: '', text: '' });
    try {
      const result = await api('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
      setNotice({ type: 'success', text: result.message });
      setFormData(initialForm);
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const background = settings.contactBackgroundImage
    ? imageUrl(settings.contactBackgroundImage)
    : ContactImage;
  const title = settings.contactTitle || 'Contact us';
  const intro = settings.contactIntro || 'Send us a message and our hotel team will get back to you as soon as possible.';

  return (
    <main className="relative min-h-screen bg-primary bg-cover bg-center pt-28 text-white" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.78), rgba(0,0,0,.84)), url(${background})` }}>
      <Helmet>
        <title>Contact Us | {settings.hotelName || 'Peniel Beach Hotel'}</title>
        <meta name="description" content={intro} />
      </Helmet>
      <div className="container mx-auto grid gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_.75fr] lg:gap-16 lg:px-[15px] lg:py-20">
        <section>
          <p className="font-tertiary text-xs uppercase tracking-[4px] text-accent sm:text-sm sm:tracking-[6px]">We would love to hear from you</p>
          <h1 className="mt-2 font-primary text-4xl sm:text-6xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{intro}</p>

          <form onSubmit={handleSubmit} className="mt-9 grid gap-5 sm:grid-cols-2">
            <input className="hidden" tabIndex="-1" autoComplete="off" name="website" value={formData.website} onChange={handleChange} aria-hidden="true" />
            <ContactField icon={BsPerson} label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
            <ContactField icon={BsEnvelope} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
            <ContactField icon={BsTelephone} label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Your phone number" />
            <ContactField icon={BsEnvelope} label="Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help?" required />
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm text-white/70">Message</span>
              <textarea name="message" rows="6" maxLength="5000" value={formData.message} onChange={handleChange} className="w-full rounded-lg border border-white/20 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-accent" placeholder="Write your message here" required />
            </label>
            {notice.text && (
              <div className={`sm:col-span-2 flex items-start gap-3 rounded-lg border p-4 ${notice.type === 'success' ? 'border-green-400/40 bg-green-400/10 text-green-100' : 'border-red-400/40 bg-red-400/10 text-red-100'}`} role="status">
                {notice.type === 'success' && <BsCheckCircle className="mt-1 shrink-0" />}
                <span>{notice.text}</span>
              </div>
            )}
            <button type="submit" className="btn btn-lg btn-primary sm:col-span-2 sm:max-w-xs" disabled={isLoading}>
              {isLoading ? <><BsArrowRepeat className="mr-2 animate-spin" />Sending...</> : 'Send message'}
            </button>
          </form>
        </section>

        <aside className="h-fit rounded-xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm sm:p-8 lg:mt-20">
          <h2 className="font-primary text-3xl">Our contact details</h2>
          <div className="mt-6 space-y-5 leading-7 text-white/75">
            <div><strong className="block text-sm uppercase tracking-wider text-accent">Address</strong>{settings.addressLine1}<br />{settings.addressLine2}<br />{settings.country}</div>
            <div><strong className="block text-sm uppercase tracking-wider text-accent">Telephone</strong><a href={`tel:${settings.primaryPhone}`} className="hover:text-white">{settings.primaryPhone}</a>{settings.secondaryPhone && <><br /><a href={`tel:${settings.secondaryPhone}`} className="hover:text-white">{settings.secondaryPhone}</a></>}</div>
            <div className="break-words"><strong className="block text-sm uppercase tracking-wider text-accent">Email</strong><a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a></div>
          </div>
        </aside>
      </div>
    </main>
  );
};

const ContactField = ({ icon: Icon, label, ...props }) => (
  <label>
    <span className="mb-2 block text-sm text-white/70">{label}</span>
    <span className="relative block">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
      <input {...props} maxLength="220" className="w-full rounded-lg border border-white/20 bg-black/35 py-3 pl-11 pr-4 text-white outline-none placeholder:text-white/35 focus:border-accent" />
    </span>
  </label>
);

export default Contact;
