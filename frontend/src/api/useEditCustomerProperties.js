import { createUpdateCustomerProperties } from "../services/apiCustomerProperties";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateCustomerProperty() {
  const queryClient = useQueryClient();
  const { mutate: updateCustomerProperties, isPending: isUpdating } =
    useMutation({
      mutationFn: ({ action, key, value }) =>
        createUpdateCustomerProperties(action, key, value),
      onSuccess: () => {
        toast.success("Customer property successfully edited");
        queryClient.invalidateQueries({ queryKey: ["customerProperty"] });
      },
      onError: (err) => toast.error(err.message),
    });

  return { isUpdating, updateCustomerProperties };
}
