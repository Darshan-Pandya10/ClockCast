const Footer = () => {
  return (
    <div className="w-full flex items-center justify-center bg-black">
      <div className="flex flex-col">
        <div className="flex mt-4 gap-4 mx-auto flex-row flex-start item-center">
          <a className=" cursor-pointer text-gray-400 hover:text-white ">
            About
          </a>
          <a className=" cursor-pointer text-gray-400 hover:text-white ">
            Services
          </a>
        </div>
        <p className="w-full text-center my-6 text-gray-400">
          Copyright © 2025 ClockCast. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
