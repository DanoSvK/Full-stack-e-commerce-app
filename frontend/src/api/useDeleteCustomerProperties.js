import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomerProperty as deleteCustomerPropertyApi } from "../services/apiCustomerProperties";
import toast from "react-hot-toast";

export function useDeleteCustomerProperty() {
  const queryClient = useQueryClient();
  const {
    mutate: deleteCustomerProperty,
    isPending,
    error,
  } = useMutation({
    mutationFn: (key) => deleteCustomerPropertyApi(key),
    onSuccess: () => {
      toast.success("Customer property successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["customerProperty"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { deleteCustomerProperty, isPending, error };
}
