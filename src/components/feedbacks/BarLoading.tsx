import { createPortal } from "react-dom";

const BarLoading = () => {
  return createPortal(
    <div className="bg-primary-500/60 fixed top-0 z-[99999999] flex h-[6px] w-full">
      <span className="animate-bar-loading bg-primary-500 h-full w-full"></span>
    </div>,
    document.getElementById("portal") as HTMLElement,
  );
};

export default BarLoading;
