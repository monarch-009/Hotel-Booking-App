import { useMutation } from "react-query";
import * as apiClient from '../api-client'
import { useAppContext } from "../contexts/AppContext";
import { useQueryClient } from "react-query";

const SignOutButton = () => {
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();

    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async() => {
            await queryClient.invalidateQueries("validateToken");
            showToast({ message: "You have been signed out", type: "SUCCESS" });
        },
        onError: (/*error:Error*/) => {
            showToast({ message: "There was a problem signing out", type: "ERROR" });
        }
    })

    const handleClick = () => {
        mutation.mutate();
    }

    return (
        <button
            onClick={handleClick}
            className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100">
            Sign Out
        </button>
    );
}

export default SignOutButton;