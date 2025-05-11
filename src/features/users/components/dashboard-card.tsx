import React from "react";

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  data?: string;
};

export default function DashboardCard({ title, description, icon, data }: Props) {
  return (
    <div className=" shadow-md p-5 rounded-lg flex-1">
      <div className="flex w-full justify-between">
        <h1>{title}</h1>
        {icon}
      </div>
      <p className="text-sm text-gray-500">{description}</p>
      <h1 className=" text-xl my-4 font-semibold">{data}</h1>
    </div>
  );
}
