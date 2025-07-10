import React from "react";
import { ClipLoader } from "react-spinners";

interface Props {
  isLoading: boolean | undefined;
}

const Spinner = ({ isLoading }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center col-span-1 md:col-span-2 xl:col-span-3 mt-20 h-full">
      <ClipLoader color="#123abc" loading={isLoading} size={50} />
    </div>
  );
};

export default Spinner;
