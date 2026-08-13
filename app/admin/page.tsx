import Link from "next/link";

const page = () => {
  const adminFunctions = [
    {
      name: "View Menu Orders",
      path: "orders",
    },
    {
      name: "View Catering Requests",
      path: "catering",
    },
    {
      name: "View Business Settings",
      path: "settings",
    },
  ];

  return (
    <div className="p-8">
      <h3 className="text-xl font-semibold mb-6">
        What would you like to do?
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminFunctions.map((item) => (
          <Link
            key={item.path}
            href={`/admin/${item.path}`}
            className="
              rounded-xl 
              bg-foreground 
              text-white
              p-6
              shadow-md
              transition
              hover:-translate-y-1
              hover:shadow-lg
              flex
              items-center
              justify-center
              text-center
              font-semibold
            "
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500 mt-2">
          COMING SOON
        </p>
      </div>
    </div>
  );
};

export default page;