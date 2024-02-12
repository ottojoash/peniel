import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { EffectFade, Autoplay } from 'swiper';
import { Helmet } from 'react-helmet';
import ScrollToTop from '../components/ScrollToTop';
import ContactImage from '../assets/img/heroSlider/2.webp';
import { BsEnvelope } from 'react-icons/bs';

const Contact = () => {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const apiEndpoint = 'YOUR_API_ENDPOINT_URL'; // Replace with your API endpoint

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Submission successful', data);
        // Optionally reset form or provide further user feedback
      } else {
        console.error('Submission failed', await response.text());
        // Provide user feedback for failure
      }
    } catch (error) {
      console.error('Error submitting form', error);
      // Handle network errors or other exceptions
    }
  };

  return (
    <section>
      <ScrollToTop />
      <Helmet>
        <title>Contact Us | Your Site Name</title>
        <meta name="description" content="Reach out to us for inquiries, feedback, or reservations." />
      </Helmet>
      <Swiper
        modules={[EffectFade, Autoplay]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="heroSlider h-[600px] lg:h-[860px]"
      >
        <SwiperSlide className="relative">
          <img src={ContactImage} alt="Contact" className="object-cover w-full h-full" style={{ filter: 'brightness(0.1)' }} />
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="container mx-auto p-6 text-white flex">
              <div className="w-1/2 pr-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <form onSubmit={handleSubmit}>
                <div className="mb-4 relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <div className="relative flex items-center">
                    <BsEnvelope className="absolute left-3 text-lg text-gray-300" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      onChange={handleChange}
                      className="pl-10 w-full bg-gray-800 bg-opacity-50 text-white rounded border border-gray-700 py-2"
                      placeholder="Your Email"
                      style={{ backdropFilter: 'blur(5px)' }} // Optional: for a frosted glass effect
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 text-white rounded border border-gray-700 py-2"
                    placeholder="Subject"
                    style={{ backdropFilter: 'blur(5px)' }} // Optional: for a frosted glass effect
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 text-white rounded border border-gray-700 py-2"
                    placeholder="Your Message"
                    style={{ backdropFilter: 'blur(2px)' }} // Optional: for a frosted glass effect
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Send Message
                </button>
               </form>
              </div>
              <div className='w-1/2'>
                <h2 className='text-2xl font-semibold mb-4'>Our Address</h2>
                <p className='text-gray-300'>
                  Plot 110-120 Circular Road Bugonga<br />
                  Opposite the old Airport, Entebbe<br />
                  Tel: +256772485887, +256752703147<br />
                  Mail: <a href="mailto:info@penielbeachhotelentebbe.com" className="text-blue-500 hover:text-blue-700">info@penielbeachhotelentebbe.com</a>
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Contact;
