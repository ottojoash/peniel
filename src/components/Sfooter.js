import React from 'react';
import { Helmet } from 'react-helmet';
import { useSite } from '../context/SiteContext';

const HotelInfoComponent = () => {
  const { settings } = useSite();
  const name = settings.hotelName || 'Peniel Beach Hotel';
  return <section className="container mx-auto px-4 py-16">
    <Helmet><title>{name} | Official site</title><meta name="description" content={settings.aboutText || `Discover ${name}.`} /></Helmet>
    <div className="grid lg:grid-cols-2 gap-12">
      <div><p className="uppercase tracking-[5px] text-accent text-sm">Welcome</p><h2 className="h2">About {name}</h2><p className="text-lg leading-8 text-gray-600">{settings.aboutText}</p></div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div><h2 className="text-2xl font-semibold mb-4">Our location</h2>{settings.mapEmbedUrl && <iframe title={`${name} location`} src={settings.mapEmbedUrl} className="w-full h-64 border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}</div>
        <div><h2 className="text-2xl font-semibold mb-4">Contact details</h2><div className="space-y-2 text-gray-600"><p>{settings.addressLine1}</p><p>{settings.addressLine2}</p><p>{settings.country}</p><p><a href={`tel:${settings.primaryPhone}`}>{settings.primaryPhone}</a></p>{settings.secondaryPhone && <p><a href={`tel:${settings.secondaryPhone}`}>{settings.secondaryPhone}</a></p>}<p><a className="text-accent" href={`mailto:${settings.email}`}>{settings.email}</a></p></div></div>
      </div>
    </div>
  </section>;
};
export default HotelInfoComponent;
