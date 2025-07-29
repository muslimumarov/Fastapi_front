import * as yup from "yup";

const validationSchema = yup.object().shape({

    amount: yup
        .number()
        .typeError("Raqam kiriting")
        .transform((value, originalValue) =>
            String(originalValue).trim() === "" ? undefined : value
        )
        .required("Amount majburiy"),
    category: yup.string().required("Category is required"),
    description: yup.string().required("Description is required"),
    is_income: yup.boolean().required("Income status is required"),
    date: yup
        .date()
        .required("Date is required")
        .typeError("Invalid date format"),
});
export default validationSchema;