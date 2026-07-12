import React from "react";
import { useSite } from "../context/SiteContext";

const Terms = () => {
  const { settings } = useSite();
  return (
    <main className="pt-32 pb-24 bg-[#f7f5f1] min-h-screen">
      <div className="container mx-auto max-w-4xl px-5">
        <p className="uppercase tracking-[5px] text-accent text-sm">
          Reservation policy
        </p>
        <h1 className="font-primary text-5xl lg:text-6xl mt-3 mb-8">
          Booking terms & conditions
        </h1>
        <div className="bg-white shadow-sm p-7 lg:p-12 space-y-10 leading-7 text-gray-600">
          <section>
            <h2 className="h3 text-primary">Payment and confirmation</h2>
            <p>
              A reservation is confirmed only after successful card payment and
              payment verification. The total shown at checkout is calculated
              from the room rate and number of nights. Your card details are
              collected and processed by Flutterwave; the hotel website does not
              store them.
            </p>
          </section>
          <section>
            <h2 className="h3 text-primary">Cancellation and refunds</h2>
            <p className="whitespace-pre-line">{settings.cancellationPolicy}</p>
          </section>
          <section>
            <h2 className="h3 text-primary">General stay terms</h2>
            <p className="whitespace-pre-line">{settings.bookingTerms}</p>
          </section>
          <section>
            <h2 className="h3 text-primary">
              Questions or cancellation requests
            </h2>
            <p>
              Contact the hotel at{" "}
              <a className="text-accent" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>{" "}
              or{" "}
              <a className="text-accent" href={`tel:${settings.primaryPhone}`}>
                {settings.primaryPhone}
              </a>
              . Deadlines use the hotel’s local time.
            </p>
          </section>
          <p className="text-sm border-t pt-6">
            These operational terms should be reviewed by the hotel and
            qualified local counsel before accepting live payments.
          </p>
        </div>
      </div>
    </main>
  );
};
export default Terms;
