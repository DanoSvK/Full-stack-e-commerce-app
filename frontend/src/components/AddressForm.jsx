import FormField from "./FormField";

function AddressForm({ register, errors, prefix }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
      <FormField
        id={`${prefix}-full-name`}
        register={register}
        errors={errors}
        name={`${prefix}.fullName`}
        label="Full Name"
        rules={{
          required: "Full name is required",
          minLength: { value: 3, message: "Min length is 3" },
        }}
      />
      {prefix === "shipping" && (
        <FormField
          id={`${prefix}-email`}
          register={register}
          errors={errors}
          name={`${prefix}.email`}
          label="Email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Invalid email",
            },
          }}
        />
      )}

      <FormField
        id={`${prefix}-address`}
        register={register}
        errors={errors}
        name={`${prefix}.address`}
        label="Address"
        rules={{
          required: "Address is required",
          minLength: { value: 3, message: "Min length is 3" },
        }}
        className="col-span-2"
      />

      <FormField
        id={`${prefix}-city`}
        register={register}
        errors={errors}
        name={`${prefix}.city`}
        label="City"
        rules={{
          required: "City is required",
          minLength: { value: 1, message: "Min length is 1" },
        }}
      />

      <FormField
        id={`${prefix}-zip`}
        register={register}
        errors={errors}
        name={`${prefix}.zip`}
        label="Postal / Zip Code"
        rules={{
          required: "Postal / Zip code is required",
          minLength: { value: 3, message: "Min length is 3" },
        }}
      />

      <FormField
        id={`${prefix}-country`}
        register={register}
        errors={errors}
        name={`${prefix}.country`}
        label="Country"
        rules={{
          required: "Country is required",
          minLength: { value: 4, message: "Min length is 4" },
        }}
      />

      {prefix === "shipping" && (
        <FormField
          id={`${prefix}-phone`}
          register={register}
          errors={errors}
          name={`${prefix}.phone`}
          label="Phone"
          rules={{
            required: "Phone number is required",
            maxLength: { value: 15, message: "Max length is 15" },
            minLength: { value: 4, message: "Min length is 4" },
          }}
        />
      )}
    </div>
  );
}

export default AddressForm;
