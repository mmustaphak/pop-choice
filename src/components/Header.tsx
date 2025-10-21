import logo from "../logo.svg";

export default function Header() {
  return (
    <div>
      <img className="mx-auto" src={logo} alt="Popcorn logo with eyes" />
      <p className="mt-2 text-center font-[Carter_One] text-5xl">PopChoice</p>
    </div>
  );
}
