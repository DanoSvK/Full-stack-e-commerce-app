import { createUpdateCustomerProperties } from "../services/apiCustomerProperties";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCreateCustomerProperty() {
  const queryClient = useQueryClient();
  const {
    mutate: createCustomerProperties,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: ({ action, key, value }) =>
      createUpdateCustomerProperties(action, key, value),
    onSuccess: () => {
      toast.success("Customer property successfully created");
      queryClient.invalidateQueries({ queryKey: ["customerProperty"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createCustomerProperties, error };
}
