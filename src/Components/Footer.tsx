const Footer = () => {
  return (
    <div className="w-full flex items-center justify-center bg-black">
      <div className="flex flex-col">
        <div className="flex mt-4 gap-4 mx-auto flex-row flex-start item-center">
          <a className="hidden md:block cursor-pointer text-gray-600 hover:text-white uppercase">
            About
          </a>
          <a className="hidden md:block cursor-pointer text-gray-600 hover:text-white uppercase">
            Services
          </a>
        </div>
        <p className="w-full text-center my-4 text-gray-600">
          Copyright © 2025 ClockCast. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
