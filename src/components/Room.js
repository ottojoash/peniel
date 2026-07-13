import React from "react";
// link
import { Link } from "react-router-dom";
// icons
import { BsArrowsFullscreen, BsPeople } from "react-icons/bs";
import { useSite } from "../context/SiteContext";

const Room = ({ room }) => {
  const { settings } = useSite();
  // destructure room
  const { id, name, image, size, maxPerson, description, price } = room;
  return (
    <article className="group flex min-h-[480px] flex-col overflow-hidden bg-white shadow-xl sm:min-h-[500px]">
      {/* img */}
      <div className="relative h-[210px] w-full overflow-hidden sm:h-[230px] lg:h-[200px]">
        {/\.(mp4|webm|mov)(?:$|\?)/i.test(image) ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={image}
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <img
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
            src={image}
            alt=""
          />
        )}
      </div>
      {/* details */}
      <div className="mx-4 flex h-[60px] -translate-y-1/2 items-center justify-center bg-white font-tertiary text-sm font-semibold uppercase tracking-[1px] shadow-lg sm:mx-auto sm:w-[calc(100%-2rem)] sm:max-w-[300px] sm:text-base">
        <div className="flex w-[88%] justify-between gap-3 sm:w-[80%]">
          {/* size */}
          <div className="flex items-center gap-x-2">
            <div className="text-accent">
              <BsArrowsFullscreen className="text-[15px]" />
            </div>
            <div className="flex gap-x-1">
              <div>Size</div>
              <div>{size}m2</div>
            </div>
          </div>
          {/* room capacity */}
          <div className="flex items-center gap-x-2">
            <div className="text-accent">
              <BsPeople className="text-[18px]" />
            </div>
            <div className="flex gap-x-1">
              <div>Max People</div>
              <div>{maxPerson}</div>
            </div>
          </div>
        </div>
      </div>
      {/* name & description */}
      <div className="-mt-2 px-5 text-center">
        <Link to={`/room/${id}`}>
          <h3 className="h3">{name}</h3>
        </Link>
        <p className="mx-auto mb-5 max-w-[300px] text-gray-600 lg:mb-6">
          {description.slice(0, 56)}
        </p>
      </div>
      {/* btn */}
      <Link
        to={`/room/${id}`}
        className="btn btn-secondary btn-sm mb-7 mt-auto w-[calc(100%-2.5rem)] max-w-[260px] mx-auto px-4 text-center"
      >
        Book now from {settings.currencySymbol || "$"}
        {price}
      </Link>
    </article>
  );
};

export default Room;
