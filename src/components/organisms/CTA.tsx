import React from "react";
import { Button } from "../atoms";
import { Icon } from "@iconify/react";

const CTA = ({
  title = "Your Journey to Excellence Starts Now",
  content = "Revise smarter, support others through giveback, and unlock new opportunities with our affiliate program",
}: {
  title?: string;
  content?: string;
}) => {
  return (
    <section className="py-[6rem] max-w-[1300px] mx-auto md:w-[90%] w-[100%] px-[1rem]">
      <div
        className="bg-[url(/images/background-pattern-2.png)] bg-cover px-[1.25rem] md:px-0 rounded-[2rem] bg-center"
        data-aos="zoom-in"
        data-aos-duration="700"
      >
        <div className="py-[5.5rem] flex flex-col items-center mx-auto md:w-[80%] lg:w-[70%] text-white">
          <h3
            className="mb-[.5rem] leading-[3rem] text-center tracking-[-.8px] font-[600] text-[2.5rem]"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="100"
          >
            {title}
          </h3>
          <p
            className="mb-[2rem] leading-[1.75rem] text-center text-[1.125rem] font-[400]"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="200"
          >
            {content}
          </p>

          <Button>
            Join Now
            <Icon
              icon="hugeicons:arrow-right-02"
              height={"1.5rem"}
              width={"1.5rem"}
            />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { CTA };
