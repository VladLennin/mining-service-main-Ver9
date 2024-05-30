import css from "./Logo.module.css";
import Title from "../../../../shared/ui/Title/Title";
import logo from "../../../../assets/logo.png";

const Logo = () => {
  return (
    <div className={css.container}>
      <img className={css.logo} src={logo} alt="" />
      <Title />
    </div>
  );
};

export default Logo;
