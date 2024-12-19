import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { EffectFade, Autoplay } from 'swiper';
import { Helmet } from 'react-helmet';
import ScrollToTop from '../components/ScrollToTop';
import ContactImage from '../assets/img/heroSlider/2.webp';
import { BsEnvelope } from 'react-icons/bs';
import { BsArrowRepeat } from 'react-icons/bs';

const Contact = () => {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Email validation
    if (!formData.email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
      alert('Please provide a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://peniel-api.onrender.com/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Server responded with an error');
      }

      const result = await response.json();
      alert(result.message || 'Message sent successfully!');
      setFormData({ email: '', subject: '', message: '' });
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <ScrollToTop />
      <Helmet>
        <title>Contact Us | Peniel Beach Hotel</title>
        <meta name="description" content="Reach out to us for inquiries, feedback, or reservations." />
      </Helmet>
      <Swiper
        modules={[EffectFade, Autoplay]}
        effect="fade"
        loop
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="heroSlider h-[600px] lg:h-[860px]"
      >
        <SwiperSlide className="relative">
          <img
            src={ContactImage}
            alt="Contact Us"
            className="object-cover w-full h-full"
            style={{ filter: 'brightness(0.1)' }}
          />
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="container mx-auto p-6 text-white flex flex-wrap justify-between mt-[150px]">
              {/* Form Section */}
              <div className="w-full lg:w-1/2 pr-8 mb-8 lg:mb-0">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="relative flex items-center">
                      <BsEnvelope className="absolute left-3 text-lg text-gray-300" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                        className="pl-10 w-full bg-black bg-opacity-50 text-white rounded border border-gray-700 py-2"
                        placeholder="Your Email"
                        required
                      />
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                      Subject
                    </label>
                    <div className="relative flex items-center">
                      <BsEnvelope className="absolute left-3 text-lg text-gray-300" />
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        onChange={handleChange}
                        value={formData.subject}
                        className="pl-10 w-full bg-black bg-opacity-50 text-white rounded border border-gray-700 py-2"
                        placeholder="Subject"
                        required
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      onChange={handleChange}
                      value={formData.message}
                      className="w-full bg-black bg-opacity-50 text-white rounded border border-gray-700 py-2"
                      placeholder="Your Message"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary w-full flex justify-center items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <BsArrowRepeat className="animate-spin mr-2" />
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>

              {/* Address Section */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-2xl font-semibold mb-4">Our Address</h2>
                <p className="text-gray-300">
                  Plot 110-120 Circular Road Bugonga<br />
                  Opposite the old Airport, Entebbe<br />
                  Tel: +256772485887, +256752703147<br />
                  Email:{' '}
                  <a href="mailto:penielbeachhotel@gmail.com" className="text-blue-500 hover:text-blue-700">
                    penielbeachhotel@gmail.com
                  </a>
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
