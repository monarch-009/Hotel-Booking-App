import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const DetailsSection = () => {
    const { register, formState: { errors } } = useFormContext<HotelFormData>();
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-3">Add Hotel</h1>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Name
                <input
                    type="text"
                    className="border rounded w-full py-1 px-2 font-normal border-gray-300 p-2 "
                    {...register("name", { required: "This field is required." })}
                />
                {errors.name && (
                    <span className="text-red-500" >{errors.name.message}</span>
                )}
            </label>
            <div className="flex gap-4">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    City
                    <input
                        type="text"
                        className="border rounded w-full py-1 px-2 font-normal border-gray-300 p-2 "
                        {...register("city", { required: "This field is required." })}
                    />
                    {errors.city && (
                        <span className="text-red-500" >{errors.city.message}</span>
                    )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Country
                    <input
                        type="text"
                        className="border rounded w-full py-1 px-2 font-normal border-gray-300 p-2 "
                        {...register("country", { required: "This field is required." })}
                    />
                    {errors.country && (
                        <span className="text-red-500" >{errors.country.message}</span>
                    )}
                </label>
            </div>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Description
                <textarea
                    rows={8}
                    className="border rounded w-full py-1 px-2 font-normal border-gray-300 p-2 "
                    {...register("description", { required: "This field is required." })}
                />
                {errors.description && (
                    <span className="text-red-500" >{errors.description.message}</span>
                )}
            </label>
            <label className="text-gray-700 text-sm font-bold max-w-[50%]">
                Price per night
                <input
                    type="number"
                    min={1}
                    className="border rounded w-full py-1 px-2 font-normal border-gray-300 p-2 "
                    {...register("pricePerNight", { required: "This field is required." })}
                />
                {errors.pricePerNight && (
                    <span className="text-red-500" >{errors.pricePerNight.message}</span>
                )}
            </label>

            <label className="text-gray-700 text-sm font-bold max-w-[50%]">
                Star Rating
                <select
                    {...register("starRating", {
                        required: "This field is required."
                    })}
                    className="border rounded w-full p-2 font-normal text-gray-700  "
                    {...register("starRating", { required: "This field is required." })}
                >
                    <option value="">Select star rating</option>
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>{rating}</option>
                    ))}
                </select>
                {errors.starRating && (
                    <span className="text-red-500" >{errors.starRating.message}</span>
                )}
            </label>

        </div>
    );

};

export default DetailsSection;