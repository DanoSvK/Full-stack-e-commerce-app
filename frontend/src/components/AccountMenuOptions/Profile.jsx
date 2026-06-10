import { QueryClient } from "@tanstack/react-query";
import { IdCard, Edit2, Plus } from "lucide-react";
import { useState } from "react";
import { useCustomerProperties } from "../../api/api";
import { useUpdateCustomerProperty } from "../../api/useEditCustomerProperties";

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
  const [newPropertyKey, setNewPropertyKey] = useState(null);
  const [newPropertyValue, setNewPropertyValue] = useState(null);

  const { customerProperties, isPending, error } = useCustomerProperties();
  const { isUpdating, updateCustomerProperties } = useUpdateCustomerProperty();

  function updateUserData(key, value, dataType) {
    setDetails((prev) => ({
      ...prev,
      [dataType]: { ...prev[dataType], [key]: value },
    }));
  }

  function handleAddProperty() {
    user.properties[newPropertyKey] = newPropertyValue;
    console.log(user);
    console.log(newPropertyKey, newPropertyValue);
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
            className="self-end flex items-center gap-2 text-accent text-sm font-bold hover:underline cursor-pointer"
            onClick={() => setIsEditingIds((prev) => !prev)}
          ></button>
        </header>

        {/* USER DETAILS */}
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(details.ids).map(([key, value]) => (
            <div className="glass-card p-6 rounded-2xl space-y-4" key={key}>
              <dt className="flex items-center text-[10px] gap-3">
                <IdCard size={16} aria-hidden="true" />{" "}
                <span className="text-[10px] uppercase font-bold tracking-widest">
                  {key.toUpperCase()}
                </span>
              </dt>
              <dd className="text-white font-bold">{value}</dd>
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
              className="flex items-center gap-2 text-accent text-xs font-bold hover:underline cursor-pointer"
              onClick={() => setIsEditingProps((prev) => !prev)}
            >
              <Edit2 size={16} />
              <span>
                {!isEditingProps ? "Edit Properties" : "Save Changes"}
              </span>
            </button>
            <button
              type="button"
              className="ml-auto flex items-center gap-2 text-accent text-xs font-bold hover:underline cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Property</span>
            </button>
          </div>
        </header>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {isEditingProps && (
            <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl flex flex-col text-[10px] justify-between group space-y-1">
              <dt className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                Add new property
              </dt>
              <input
                type="text"
                className="input-field w-full text-sm h-1"
                placeholder="Property name"
                onInput={(e) => {
                  setNewPropertyKey(e.target.value);
                }}
              />

              <input
                type="text"
                className="input-field w-full text-sm h-2"
                placeholder="Property value"
                onInput={(e) => {
                  setNewPropertyValue(e.target.value);
                }}
              />
              <button
                className="text-accent hover:underline cursor-pointer"
                type="submit"
                onClick={handleAddProperty}
              >
                + Add New
              </button>
            </div>
          )}
          {customerProperties?.map((property) => (
            <div
              className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl flex flex-col text-[10px] justify-between group"
              key={property.key}
            >
              <dt className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                {property.key.toUpperCase()}
              </dt>

              {!isEditingProps ? (
                <dd className="text-white text-sm font-bold">
                  {property.value}
                </dd>
              ) : (
                <input
                  type="text"
                  defaultValue={property.value}
                  className="input-field w-full text-sm"
                  onBlur={(e) => {
                    updateCustomerProperties({
                      action: "update",
                      key: property.key,
                      value: e.target.value,
                    });
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
