import React from 'react';
import { Helmet } from 'react-helmet';
import { useSite } from '../context/SiteContext';

const HotelInfoComponent = () => {
  const { settings } = useSite();
  const name = settings.hotelName || 'Peniel Beach Hotel';
  return <section className="container mx-auto px-4 py-14 sm:px-6 sm:py-16 lg:px-[15px]">
    <Helmet><title>{name} | Official site</title><meta name="description" content={settings.aboutText || `Discover ${name}.`} /></Helmet>
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
      <div><p className="text-xs uppercase tracking-[4px] text-accent sm:text-sm sm:tracking-[5px]">Welcome</p><h2 className="h2">About {name}</h2><p className="text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">{settings.aboutText}</p></div>
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
        <div><h2 className="text-2xl font-semibold mb-4">Our location</h2>{settings.mapEmbedUrl && <iframe title={`${name} location`} src={settings.mapEmbedUrl} className="w-full h-64 border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}</div>
        <div><h2 className="text-2xl font-semibold mb-4">Contact details</h2><div className="space-y-2 break-words text-gray-600"><p>{settings.addressLine1}</p><p>{settings.addressLine2}</p><p>{settings.country}</p><p><a href={`tel:${settings.primaryPhone}`}>{settings.primaryPhone}</a></p>{settings.secondaryPhone && <p><a href={`tel:${settings.secondaryPhone}`}>{settings.secondaryPhone}</a></p>}<p><a className="text-accent" href={`mailto:${settings.email}`}>{settings.email}</a></p></div></div>
      </div>
    </div>
  </section>;
};
export default HotelInfoComponent;
