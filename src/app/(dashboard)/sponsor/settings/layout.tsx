import { ReactNode } from "react";

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <section className="flex xl:px-[2rem] px-[.875rem] py-[1.25rem]">
        {children}
      </section>
    </>
  );
};

export default SettingsLayout;
