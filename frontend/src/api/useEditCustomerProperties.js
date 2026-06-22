import { createUpdateCustomerProperty } from "../services/apiCustomerProperties";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateCustomerProperty() {
  const queryClient = useQueryClient();
  const {
    mutate: updateCustomerProperties,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: ({ action, key, value }) =>
      createUpdateCustomerProperty(action, key, value),
    onSuccess: () => {
      toast.success("Customer property successfully edited");
      queryClient.invalidateQueries({ queryKey: ["customerProperty"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateCustomerProperties, error };
}
