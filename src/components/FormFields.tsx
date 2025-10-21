type FormFieldsParams = {
  label: string;
  name: string;
  placeholder: string;
};

function FormFields({ label, name, placeholder }: FormFieldsParams) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        className="mt-4 h-full min-h-fit rounded bg-[#3B4877] p-2 placeholder:p-4 placeholder:text-[#05060C]"
        placeholder={placeholder}
        rows={name === "favourite-movie" ? 3 : undefined}
        required
      ></textarea>
    </div>
  );
}
export default FormFields;
