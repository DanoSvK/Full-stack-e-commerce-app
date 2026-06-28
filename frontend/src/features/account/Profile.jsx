import { QueryClient } from "@tanstack/react-query";
import { IdCard, Edit2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useCustomerProperties } from "./useCustomerProperties";
import { useUpdateCustomerProperty } from "./useUpdateCustomerProperty";
import { useCreateCustomerProperty } from "./useCreateCustomerProperty";
import { useDeleteCustomerProperty } from "./useDeleteCustomerProperties";
import { useAuth } from "../../context/AuthContext";
import CustomerPropertySkeleton from "../../components/skeletons/CustomerPropertySkeleton";
import ProductListSkeleton from "../../components/skeletons/CustomerPropertyListSkeleton";

function Profile() {
  const [isEditingProps, setIsEditingProps] = useState(false);
  const [isCreatingProperty, setIsCreatingProperty] = useState(false);
  const [newPropertyKey, setNewPropertyKey] = useState("");
  const [newPropertyValue, setNewPropertyValue] = useState("");
  // Populated on update/delete, used to visualize update/delete error only on the specific property card
  const [propertyKey, setPropertyKey] = useState("");

  const { user } = useAuth();
  const {
    data: customerProperties,
    isPending: isFetchingCustomerProperties,
    error: customerPropertiesError,
  } = useCustomerProperties();
  const {
    updateCustomerProperty,
    isUpdatingCustomerProperty,
    updateCustomerPropertyError,
  } = useUpdateCustomerProperty();
  const {
    createCustomerProperty,
    isCreatingCustomerProperty,
    createCustomerPropertyError,
  } = useCreateCustomerProperty();
  const {
    deleteCustomerProperty,
    isDeletingCustomerProperty,
    deleteCustomerPropertyError,
  } = useDeleteCustomerProperty();

  function safeParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  function handleCreateProperty(action) {
    createCustomerProperty(
      {
        action,
        key: newPropertyKey,
        value: safeParse(newPropertyValue),
      },
      {
        onSuccess: () => {
          setNewPropertyKey("");
          setNewPropertyValue("");
          setIsCreatingProperty(false);
        },
      },
    );
  }

  return (
    <>
      {isCreatingProperty && (
        <div
          className={`absolute bg-black border p-4 rounded-xl flex flex-col text-[10px] justify-between group space-y-1 left-3/6 -translate-x-2/4 top-6/12 -translate-y-2/4  z-10 ${createCustomerPropertyError ? "border-red-500" : ""}`}
        >
          <button
            className="absolute top-2 right-2 cursor-pointer hover:text-red-600"
            type="button"
            aria-label="close"
            onClick={() => setIsCreatingProperty(false)}
          >
            <X size="16" />
          </button>
          <dt className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
            Add new property
          </dt>
          <input
            type="text"
            className="input-field w-full text-sm h-1"
            placeholder="Property name"
            value={newPropertyKey}
            onInput={(e) => {
              setNewPropertyKey(e.target.value);
            }}
          />

          <input
            type="text"
            className="input-field w-full text-sm h-2"
            placeholder="Property value"
            value={newPropertyValue}
            onInput={(e) => {
              setNewPropertyValue(e.target.value);
            }}
          />
          <button
            className="text-zinc-950 cursor-pointer bg-accent self-center py-1 px-3 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isCreatingCustomerProperty}
            onClick={() => {
              handleCreateProperty("create");
            }}
          >
            {!isCreatingCustomerProperty ? "Add New" : "Adding..."}
          </button>
        </div>
      )}
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
          ></button>
        </header>

        {/* USER DETAILS */}
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <dt className="flex items-center text-[10px] gap-3">
              <IdCard size={16} aria-hidden="true" />{" "}
              <span className="text-[10px] uppercase font-bold tracking-widest">
                REGISTERED
              </span>
            </dt>
            <dd className="text-white font-bold">{user.email}</dd>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4">
            <dt className="flex items-center text-[10px] gap-3">
              <IdCard size={16} aria-hidden="true" />{" "}
              <span className="text-[10px] uppercase font-bold tracking-widest">
                EMAIL_ID
              </span>
            </dt>
            <dd className="text-white font-bold">{user.email}</dd>
          </div>
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
                {!isEditingProps ? "Edit Properties" : "Finish Editing"}
              </span>
            </button>
            <button
              type="button"
              className="ml-auto flex items-center gap-2 text-accent text-xs font-bold hover:underline cursor-pointer"
              onClick={() => setIsCreatingProperty(true)}
            >
              <Plus size={16} />
              <span>Add Property</span>
            </button>
          </div>
        </header>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {customerPropertiesError ? (
            <p>Error</p>
          ) : isFetchingCustomerProperties ? (
            <ProductListSkeleton />
          ) : (
            customerProperties?.map((property) => (
              <div
                className={`bg-zinc-900/50 p-4 rounded-xl flex text-[10px] justify-between items-center group border ${
                  (deleteCustomerPropertyError ||
                    updateCustomerPropertyError) &&
                  property.key === propertyKey
                    ? "border-red-500"
                    : "border-white/5"
                }`}
                key={property.key}
              >
                <div>
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
                      disabled={isUpdatingCustomerProperty}
                      onBlur={(e) => {
                        updateCustomerProperty({
                          action: "update",
                          key: property.key,
                          value: e.target.value,
                        });
                        setPropertyKey(property.key);
                      }}
                    />
                  )}
                </div>

                {isDeletingCustomerProperty && property.key === propertyKey ? (
                  <img src="/loading.png" className="w-6 h-6 animate-spin" />
                ) : (
                  <button
                    className="hidden group-hover:block cursor-pointer hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isDeletingCustomerProperty}
                    onClick={() => {
                      deleteCustomerProperty(property.key);
                      setPropertyKey(property.key);
                    }}
                  >
                    <Trash2 size="20" />
                  </button>
                )}
              </div>
            ))
          )}
        </dl>
      </section>
    </>
  );
}

export default Profile;
