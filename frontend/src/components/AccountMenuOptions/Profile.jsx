import { IdCard, Edit2, Plus } from "lucide-react";
import { useState } from "react";

const user = {
  ids: {
    registered: "daniel.kopac@gmail.com",
    email_id: "daniel.kopac@gmail.com",
  },
  properties: {
    fullName: "Daniel Kopáč",
    email: "daniel.kopac@bloomreach.com",
    phone: "+421948219418",
    address: "Tomášikova 9",
    postalCode: "05801",
    city: "Poprad",
  },
};

function Profile() {
  const [details, setDetails] = useState(user);
  const [isEditingIds, setIsEditingIds] = useState(false);
  const [isEditingProps, setIsEditingProps] = useState(false);

  function updateUserData(key, value, dataType) {
    setDetails((prev) => ({
      ...prev,
      [dataType]: { ...prev[dataType], [key]: value },
    }));
  }

  return (
    <>
      <section className="mb-16">
        <header className="flex justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase">
            Customer Profile
            <span className="block text-white mt-4 font-bold text-xl uppercase tracking-tight">
              IDs
            </span>
          </h2>

          <button
            type="button"
            className="self-end flex items-center gap-2 text-accent text-sm font-bold hover:underline"
            onClick={() => setIsEditingIds((prev) => !prev)}
          >
            <Edit2 size={16} aria-hidden="true" />
            <span>{!isEditingIds ? "Edit IDs" : "Save Changes"}</span>
          </button>
        </header>

        {/* USER DETAILS */}
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(details.ids).map(([key, value]) => (
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <dt className="flex items-center text-[10px] gap-3">
                <IdCard size={16} aria-hidden="true" />{" "}
                <span className="text-[10px] uppercase font-bold tracking-widest">
                  {key.toUpperCase()}
                </span>
              </dt>
              {!isEditingIds ? (
                <dd className="text-white font-bold">{value}</dd>
              ) : (
                <input
                  type="text"
                  defaultValue={value}
                  className="input-field w-full text-sm"
                  onChange={(e) => {
                    updateUserData(key, e.target.value, "ids");
                  }}
                />
              )}
            </div>
          ))}
        </dl>
      </section>

      {/* CUSTOMER PROPERTIES */}
      <section>
        <header className="flex justify-between mb-6">
          <h2 className="text-white font-bold text-xl uppercase tracking-tight">
            Customer Properties
          </h2>
          <div className="space-y-4">
            <button
              type="button"
              className="flex items-center gap-2 text-accent text-xs font-bold hover:underline"
              onClick={() => setIsEditingProps((prev) => !prev)}
            >
              <Edit2 size={16} />
              <span>
                {!isEditingProps ? "Edit Properties" : "Save Changes"}
              </span>
            </button>
            <button
              type="button"
              className="ml-auto flex items-center gap-2 text-accent text-xs font-bold hover:underline"
            >
              <Plus size={16} />
              <span>Add Property</span>
            </button>
          </div>
        </header>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(details.properties).map(([key, value]) => (
            <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl flex flex-col text-[10px] justify-between group">
              <dt className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                {key.toUpperCase()}
              </dt>

              {!isEditingProps ? (
                <dd className="text-white text-sm font-bold">{value}</dd>
              ) : (
                <input
                  type="text"
                  defaultValue={value}
                  className="input-field w-full text-sm"
                  onChange={(e) => {
                    updateUserData(key, e.target.value, "properties");
                  }}
                />
              )}
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

export default Profile;
