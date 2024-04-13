import { useAppContext } from "../contexts/AppContext";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useMutation } from "react-query";
import * as apiClient from '../api-client';


const AddHotel = () => {
    const { showToast } = useAppContext();

    const { mutate, isLoading } = useMutation((apiClient.addMyHotel), {
        onSuccess: () => {
            showToast({ message: "Hotel Saved!", type: "SUCCESS" });
        },
        onError: () => {
            showToast({ message: "An error has occurred.", type: "ERROR" });
        }
    })

    const handleSave = (HotelFormData: FormData) => {
        mutate(HotelFormData);
    }

    return (<ManageHotelForm onSave={handleSave} isLoading={isLoading} />);
}

export default AddHotel;