import "./index.css";
import Header from "./components/Header";
import formFields from "./formFields";
import { useActionState } from "react";
import action from "./action";
import FormFields from "./components/FormFields";

export function App() {
  const [formState, formAction, isPending] = useActionState(action, null);

  const renderedFields = formFields.map((formData) => (
    <FormFields key={formData.name} {...formData} />
  ));

  if (formState?.error) {
    return <h1>{formState.error}</h1>;
  }

  if (isPending) {
    return <h1>Loading....</h1>;
  }

  if (formState?.data) {
    return (
      <>
        <Header />
        <div className="mt-8 flex max-w-sm flex-col">
          <h1 className="text-center text-4xl">{formState.data.movie}</h1>
          <p className="mt-4">{formState.data.description}</p>
          <button
            className="mt-10 rounded-lg bg-[#51E08A] py-4 text-3xl font-bold text-[#000C36]"
            onClick={() => formAction(null)}
          >
            Go Again
          </button>
        </div>
      </>
    );
  }

  return (
    <div>
      <Header />
      <form action={formAction} className="flex flex-col gap-8 pt-8">
        {renderedFields}
        <button
          className="rounded-lg bg-[#51E08A] py-4 text-3xl font-bold text-[#000C36]"
          type="submit"
        >
          Let's Go
        </button>
      </form>
    </div>
  );
}

export default App;
