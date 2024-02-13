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
  
    const apiEndpoint = 'https://peniel-api.onrender.com/api/sendMessage'; // Replace with your actual API endpoint
  
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        // Handle non-OK responses from the server
        return response.text().then(text => {
          throw new Error(text || 'Server responded with an error');
        });
      }
      // Attempt to parse JSON for OK responses, but handle non-JSON responses gracefully
      return response.text().then(text => {
        try {
          return JSON.parse(text); // Attempt to parse text as JSON
        } catch {
          // If the response is not JSON, check if it's a success message
          if (text.startsWith('Message sent successfully')) {
            return { message: text }; // Construct an object to handle it as a success
          }
          throw new Error(text || 'Received unexpected response format');
        }
      });
    })
    .then(data => {
      // Handle the successful submission
      console.log('Submission successful:', data.message || data);
      alert('Submission successful: ' + (data.message || 'Your message has been sent.'));
      // Clear the form fields by resetting formData state
      setFormData({
        email: '',
        subject: '',
        message: '',
      });
    })
    .catch(error => {
      // Properly handle and log errors
      console.error('Error submitting form:', error.message || error);
      alert('Error submitting form: ' + (error.message || error));
    });
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
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="heroSlider h-[600px] lg:h-[860px]"
      >
        <SwiperSlide className="relative">
        <img src={ContactImage} alt="Contact" className="object-cover w-full h-full" style={{ filter: 'brightness(0.1)' }} />
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="container mx-auto p-6 text-white flex flex-wrap justify-between">
              <div className="w-full lg:w-1/2 pr-8 mb-8 lg:mb-0">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4 relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <div className="relative flex items-center">
                    <BsEnvelope className="absolute left-3 text-lg text-gray-300" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      onChange={handleChange}
                      className="pl-10 w-full bg-black bg-opacity-50 text-white rounded border border-gray-700 py-2"
                      placeholder="Your Email"
                      style={{ backgroundColor: 'white', color: 'black' }}
                      required
                      pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" 
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                  <div className="relative flex items-center">
                  <BsEnvelope className="absolute left-3 text-lg text-gray-300" />
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    onChange={handleChange}
                    className="pl-10 w-full bg-black bg-opacity-50 text-white rounded border border-gray-700 py-2"
                    placeholder="Subject"
                    style={{ backgroundColor: 'white', color: 'black' }}
                    required
                  />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    onChange={handleChange}
                    className="w-full bg-black bg-opacity-50 text-white rounded border border-gray-700 py-2"
                    placeholder="Your Message"
                    style={{ backgroundColor: 'white', color: 'black' }}
                    required
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
              <div className='w-full lg:w-1/2'>
                <h2 className='text-2xl font-semibold mb-4'>Our Address</h2>
                <p className='text-gray-300'>
                  Plot 110-120 Circular Road Bugonga<br />
                  Opposite the old Airport, Entebbe<br />
                  Tel: +256772485887, +256752703147<br />
                  Mail: <a href="mailto:info@penielbeachotel.com" className="text-blue-500 hover:text-blue-700">info@penielbeachotel.com</a>
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
