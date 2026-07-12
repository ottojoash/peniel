/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { BsArrowRepeat } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";

// Components
import AdultsDropdown from "../components/AdultsDropdown";
import KidsDropdown from "../components/KidsDropdown";
import CheckIn from "../components/CheckIn";
import CheckOut from "../components/CheckOut";
import EmailInput from "../components/Email";
import NotesInput from "../components/Message";
import NameInput from "../components/Name";
import ScrollToTop from "../components/ScrollToTop";

// Context
import { RoomContext } from "../context/RoomContext";
import { api } from "../api";
import { useSite } from "../context/SiteContext";

const isVideo = (url = "") => /\.(mp4|webm|mov)(?:$|\?)/i.test(url);

const RoomDetails = () => {
  const { rooms, loading } = useContext(RoomContext);
  const { settings } = useSite();
  const paymentEnabled = settings.paymentEnabled !== "false";
  const { id } = useParams();

  const [formData, setFormData] = useState({
    names: "",
    checkIn: "",
    checkOut: "",
    adults: 0,
    kids: 0,
    email: "",
    notes: "",
    termsAccepted: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // MySQL room identifiers are strings. Wait for the API before deciding it is missing.
  const room = rooms.find((item) => String(item.id) === String(id));
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BsArrowRepeat className="animate-spin text-4xl text-accent" />
      </div>
    );
  }
  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl text-red-500">Room not found!</h1>
      </div>
    );
  }

  // Destructure room properties
  const {
    name,
    description,
    facilities,
    imageLg,
    image,
    images = [],
    price,
  } = room;
  const roomImages = [...new Set([imageLg, image, ...images].filter(Boolean))];

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Form submission
  const handleFormSubmit = async () => {
    setIsLoading(true);

    // Validate inputs
    if (
      !formData.names ||
      !formData.email ||
      !formData.checkIn ||
      !formData.checkOut
    ) {
      alert("Please fill out all required fields.");
      setIsLoading(false);
      return;
    }

    if (
      !formData.email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    ) {
      alert("Please provide a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const booking = await api("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          roomId: room.id,
        }),
      });
      window.location.assign(
        booking.paymentRequired === false
          ? `/payment-result?status=pending&reference=${encodeURIComponent(booking.reservationCode)}`
          : booking.paymentLink,
      );
      // Reset form after successful submission
      setFormData({
        names: "",
        checkIn: "",
        checkOut: "",
        adults: 0,
        kids: 0,
        email: "",
        notes: "",
        termsAccepted: false,
      });
    } catch (error) {
      console.error("Error booking room:", error);
      alert(
        error.message || "Failed to start payment. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="room-name"
      itemScope
      itemType="http://pbh.com/room"
    >
      <ScrollToTop />
      {/* Banner */}
      <div className="bg-room bg-cover bg-center h-[560px] relative flex justify-center items-center">
        <div className="absolute w-full h-full bg-black/70"></div>
        <h1
          className="text-6xl text-white z-20 font-primary text-center"
          id="room-name"
          itemProp="name"
        >
          {name} Details
        </h1>
      </div>

      {/* Room Details */}
      <div className="container mx-auto py-24 flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="w-full lg:w-[60%] px-6">
          <h2 className="h2">{name}</h2>
          <p className="mb-8" itemProp="description">
            {description}
          </p>
          <div className="mb-10">
            <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
              {isVideo(roomImages[activeImage]) ? (
                <video
                  className="w-full h-full object-cover bg-black"
                  src={roomImages[activeImage]}
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  className="w-full h-full object-cover"
                  src={roomImages[activeImage]}
                  alt={`${name} view ${activeImage + 1}`}
                  itemProp="image"
                />
              )}
              {roomImages.length > 1 && (
                <span className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 text-sm">
                  {activeImage + 1} / {roomImages.length}
                </span>
              )}
            </div>
            {roomImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-3">
                {roomImages.map((src, index) => (
                  <button
                    key={src}
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-square overflow-hidden border-2 ${activeImage === index ? "border-accent" : "border-transparent"}`}
                    aria-label={`View room media ${index + 1}`}
                  >
                    {isVideo(src) ? (
                      <>
                        <video
                          src={src}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                        <span className="absolute inset-0 grid place-items-center text-white text-2xl bg-black/20">
                          ▶
                        </span>
                      </>
                    ) : (
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="h3 mb-3">Room Facilities</h3>
            <div className="grid grid-cols-3 gap-6 mb-12">
              {(facilities || []).map((item, index) => (
                <div className="flex items-center gap-x-3" key={index}>
                  {item.icon && (
                    <div className="text-3xl text-accent">{item.icon}</div>
                  )}
                  <div>{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-[40%]">
          <div className="py-8 px-6 bg-accent/20 mb-12">
            <h3>Your Reservation</h3>
            <div className="flex flex-col space-y-4 mb-4">
              <NameInput
                onChange={(value) => handleInputChange("names", value)}
              />
              <EmailInput
                onChange={(value) => handleInputChange("email", value)}
              />
              <CheckIn
                onChange={(value) => handleInputChange("checkIn", value)}
              />
              <CheckOut
                onChange={(value) => handleInputChange("checkOut", value)}
              />
              <AdultsDropdown
                onChange={(value) => handleInputChange("adults", value)}
              />
              <KidsDropdown
                onChange={(value) => handleInputChange("kids", value)}
              />
              <NotesInput
                onChange={(value) => handleInputChange("notes", value)}
              />
              <label className="flex items-start gap-3 text-sm leading-5">
                <input
                  type="checkbox"
                  className="mt-1 accent-[#a37d4c]"
                  checked={formData.termsAccepted}
                  onChange={(e) =>
                    handleInputChange("termsAccepted", e.target.checked)
                  }
                  required
                />
                <span>
                  I agree to the{" "}
                  <a
                    className="text-accent underline"
                    href="/terms"
                    target="_blank"
                    rel="noreferrer"
                  >
                    booking, cancellation, and hotel terms
                  </a>
                  .{" "}
                  {paymentEnabled
                    ? "Card payment is required to confirm this reservation."
                    : "The hotel will review and confirm this reservation request."}
                </span>
              </label>
            </div>
            <button
              className="btn btn-lg btn-primary w-full flex justify-center items-center"
              onClick={handleFormSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <BsArrowRepeat className="animate-spin mr-2" />
                  Booking...
                </div>
              ) : paymentEnabled ? (
                `Pay & reserve for ${settings.currencySymbol || "$"}${price}`
              ) : (
                "Request reservation"
              )}
            </button>
          </div>

          {/* Hotel Rules */}
          <div>
            <h3 className="h3">Hotel Rules</h3>
            <ul className="flex flex-col gap-y-4">
              <li className="flex items-center gap-x-4">
                <FaCheck className="text-accent" /> Check-in: Any Time
              </li>
              <li className="flex items-center gap-x-4">
                <FaCheck className="text-accent" /> Check-out: As Per Duration
              </li>
              <li className="flex items-center gap-x-4">
                <FaCheck className="text-accent" /> No Pets
              </li>
              <li className="flex items-center gap-x-4">
                <FaCheck className="text-accent" /> No Smoking
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
