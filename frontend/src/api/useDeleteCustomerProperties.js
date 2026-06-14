import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomerProperty } from "../services/apiCustomerProperties";
import toast from "react-hot-toast";

export function useDeleteCustomerProperty() {
  const queryClient = useQueryClient();
  const {
    isPending: isDeleting,
    mutate: deleteCustomerProperties,
    error,
  } = useMutation({
    mutationFn: (key) => deleteCustomerProperty(key),
    onSuccess: () => {
      toast.success("Customer property successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["customerProperty"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteCustomerProperties, error };
}
